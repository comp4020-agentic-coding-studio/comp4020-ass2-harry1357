import { spawn } from "node:child_process";
import { createServer } from "node:http";
import { mkdtempSync, readdirSync, readFileSync, rmSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { extname, join, relative, resolve } from "node:path";
import { setTimeout as sleep } from "node:timers/promises";
import { gitOrigin, resolveDeployment } from "./pages-base.ts";

// Does the built site work at the two viewports it is marked at?
//
// Deliberately NOT in `pnpm check`: it needs Chrome, and a roster that can go
// red because a browser did not launch teaches you to ignore it. Run it before
// you ship, and after any layout work.
//
//   pnpm build && pnpm check:viewports
//
// What it asserts is narrow and load-bearing: the page body never scrolls
// horizontally. Wide content is allowed to scroll inside its own
// `overflow-x: auto` container --- that is the fix, not the failure --- so the
// claim is about `documentElement.scrollWidth`, and the per-element list is
// only there to name what pushed it out.
//
// Why CDP rather than a screenshot: headless Chrome enforces a ~500px minimum
// window, so `--window-size=390,844` lays the page out at 500 and then crops
// the picture to 390. That looks exactly like overflow that isn't there.
// `Emulation.setDeviceMetricsOverride` gives a true 390px viewport instead. A
// number beats a screenshot.

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const DIST = resolve("dist");

/** The two viewports the site is marked in, per the course assessment page. */
const VIEWPORTS = [
  { name: "phone", width: 390, height: 844, mobile: true },
  { name: "desktop", width: 1920, height: 1080, mobile: false },
] as const;

const MIME: Record<string, string> = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".mjs": "text/javascript",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".avif": "image/avif",
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".txt": "text/plain",
  ".xml": "application/xml",
};

/** A synthetic page that definitely overflows, served alongside the real ones.
 *  A probe that silently stopped seeing anything --- a selector that changed, a
 *  navigation that never landed, an evaluate that returned undefined --- reads
 *  exactly like a clean site. So the run starts by proving it can still fail.
 *
 *  It earned its keep on the first run: the route was built without a leading
 *  slash, so it 404'd and the probe measured the error page instead. It also
 *  carries a viewport meta, because a page without one gets Chrome's 980px
 *  default layout viewport under mobile emulation rather than the 390 you
 *  asked for --- which is how the 404 gave itself away. */
const SELF_TEST = "/__overflow-self-test/";
const SELF_TEST_PAGE = `<!doctype html><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1"><title>self test</title>
<body style="margin:0"><div style="width:3000px;height:20px">deliberately too wide</div>`;

interface Offender {
  tag: string;
  id: string;
  cls: string;
  right: number;
  text: string;
}
interface Probe {
  scrollWidth: number;
  innerWidth: number;
  offenders: Offender[];
}

/** Every built page, as a site-root-relative URL path. */
function pages(): string[] {
  const walk = (dir: string): string[] =>
    readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
      const path = join(dir, entry.name);
      return entry.isDirectory() ? walk(path) : path.endsWith(".html") ? [path] : [];
    });
  return walk(DIST)
    .map((path) => `/${relative(DIST, path).replaceAll("\\", "/")}`)
    .map((path) => path.replace(/index\.html$/, ""))
    .sort();
}

/** Serve `dist/` under the same base path the deploy uses, so every
 *  root-absolute link and asset resolves exactly as it will live. */
function serve(base: string): Promise<{ origin: string; close: () => void }> {
  const prefix = base.endsWith("/") ? base : `${base}/`;
  const server = createServer((req, res) => {
    const url = new URL(req.url ?? "/", "http://localhost");
    if (!url.pathname.startsWith(prefix)) {
      res.writeHead(404).end(`outside the base path ${prefix}`);
      return;
    }
    if (url.pathname === `${base}${SELF_TEST}`) {
      res.writeHead(200, { "content-type": "text/html" });
      res.end(SELF_TEST_PAGE);
      return;
    }
    let file = join(DIST, decodeURIComponent(url.pathname.slice(prefix.length)));
    if (existsSync(file) && !extname(file)) file = join(file, "index.html");
    if (!existsSync(file)) {
      res.writeHead(404).end("not found");
      return;
    }
    res.writeHead(200, { "content-type": MIME[extname(file)] ?? "application/octet-stream" });
    res.end(readFileSync(file));
  });
  return new Promise((done) => {
    server.listen(0, "127.0.0.1", () => {
      const port = (server.address() as { port: number }).port;
      done({ origin: `http://127.0.0.1:${port}`, close: () => server.close() });
    });
  });
}

/** A minimal CDP client: send a command, await its reply by id. */
class Cdp {
  #socket: WebSocket;
  #next = 0;
  #pending = new Map<number, { ok: (v: unknown) => void; no: (e: Error) => void }>();
  #listeners: ((method: string, params: unknown) => void)[] = [];

  private constructor(socket: WebSocket) {
    this.#socket = socket;
    socket.addEventListener("message", (event) => {
      const message = JSON.parse(String((event as MessageEvent).data));
      if (message.id !== undefined) {
        const waiting = this.#pending.get(message.id);
        this.#pending.delete(message.id);
        if (message.error) waiting?.no(new Error(message.error.message));
        else waiting?.ok(message.result);
      } else {
        for (const listen of this.#listeners) listen(message.method, message.params);
      }
    });
  }

  static async connect(url: string): Promise<Cdp> {
    const socket = new WebSocket(url);
    await new Promise((ok, no) => {
      socket.addEventListener("open", ok, { once: true });
      socket.addEventListener("error", () => no(new Error(`cannot reach ${url}`)), { once: true });
    });
    return new Cdp(socket);
  }

  send(method: string, params: object = {}, sessionId?: string): Promise<Record<string, never>> {
    const id = ++this.#next;
    this.#socket.send(JSON.stringify({ id, method, params, sessionId }));
    return new Promise((ok, no) => this.#pending.set(id, { ok: ok as (v: unknown) => void, no }));
  }

  /** Resolve on the next occurrence of `method`, or reject after `ms`. */
  once(method: string, ms = 15000): Promise<void> {
    return new Promise((ok, no) => {
      const timer = setTimeout(() => no(new Error(`timed out waiting for ${method}`)), ms);
      const listen = (seen: string) => {
        if (seen !== method) return;
        clearTimeout(timer);
        this.#listeners = this.#listeners.filter((l) => l !== listen);
        ok();
      };
      this.#listeners.push(listen);
    });
  }

  close(): void {
    this.#socket.close();
  }
}

/** Launch headless Chrome and return its browser-level WebSocket URL.
 *  `stop` waits for the process to actually exit --- killing it and deleting
 *  the profile in the same tick races Chrome's own shutdown writes and throws
 *  ENOTEMPTY after a run that otherwise passed. */
async function launch(profile: string): Promise<{ ws: string; stop: () => Promise<void> }> {
  const chrome = spawn(
    CHROME,
    [
      "--headless=new",
      "--remote-debugging-port=0",
      `--user-data-dir=${profile}`,
      "--no-first-run",
      "--no-default-browser-check",
      "--disable-gpu",
      "--hide-scrollbars", // or the scrollbar itself eats 15px of the viewport
      "about:blank",
    ],
    { stdio: "ignore" },
  );
  const stop = async (): Promise<void> => {
    if (chrome.exitCode !== null || chrome.signalCode !== null) return;
    const exited = new Promise<void>((done) => chrome.once("exit", () => done()));
    chrome.kill();
    await Promise.race([exited, sleep(5000)]);
  };

  const portFile = join(profile, "DevToolsActivePort");
  for (let attempt = 0; attempt < 100; attempt++) {
    if (existsSync(portFile)) {
      const [port, path] = readFileSync(portFile, "utf8").split("\n");
      if (port && path) return { ws: `ws://127.0.0.1:${port}${path}`, stop };
    }
    await sleep(100);
  }
  await stop();
  throw new Error("Chrome did not report a debugging port");
}

const PROBE = `(() => {
  const width = window.innerWidth;
  const offenders = [];
  for (const el of document.body.querySelectorAll("*")) {
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) continue;
    if (rect.right <= width + 1 && rect.left >= -1) continue;
    // An element inside its own horizontal scroller is doing the right thing.
    let scroller = false;
    for (let node = el.parentElement; node; node = node.parentElement) {
      const overflow = getComputedStyle(node).overflowX;
      if (overflow === "auto" || overflow === "scroll" || overflow === "hidden") { scroller = true; break; }
    }
    if (scroller) continue;
    offenders.push({
      tag: el.tagName.toLowerCase(),
      id: el.id || "",
      cls: typeof el.className === "string" ? el.className.slice(0, 60) : "",
      right: Math.round(rect.right),
      text: (el.textContent || "").trim().slice(0, 40),
    });
  }
  return {
    scrollWidth: document.documentElement.scrollWidth,
    innerWidth: width,
    offenders: offenders.slice(0, 5),
  };
})()`;

async function main(): Promise<void> {
  if (!existsSync(DIST)) {
    console.error("no dist/ --- run `pnpm build` first");
    process.exit(1);
  }
  if (!existsSync(CHROME)) {
    console.error(`no Chrome at ${CHROME} --- this probe needs the real browser`);
    process.exit(1);
  }

  const { base } = resolveDeployment(process.env, gitOrigin);
  const routes = pages();
  if (routes.length === 0) {
    console.error("dist/ has no pages --- did the build finish?");
    process.exit(1);
  }

  const server = await serve(base);
  const profile = mkdtempSync(join(tmpdir(), "viewports-"));
  const chrome = await launch(profile);
  const cdp = await Cdp.connect(chrome.ws);

  const failures: string[] = [];
  try {
    const target = (await cdp.send("Target.createTarget", { url: "about:blank" })) as unknown as {
      targetId: string;
    };
    const attached = (await cdp.send("Target.attachToTarget", {
      targetId: target.targetId,
      flatten: true,
    })) as unknown as { sessionId: string };
    const session = attached.sessionId;
    await cdp.send("Page.enable", {}, session);

    const measure = async (route: string): Promise<Probe> => {
      const loaded = cdp.once("Page.loadEventFired");
      await cdp.send("Page.navigate", { url: `${server.origin}${base}${route}` }, session);
      await loaded;
      await sleep(120); // let fonts and lazy images settle the layout
      const { result } = (await cdp.send(
        "Runtime.evaluate",
        { expression: PROBE, returnByValue: true },
        session,
      )) as unknown as { result: { value: Probe } };
      return result.value;
    };

    // Prove the probe can still fail before trusting it when it doesn't.
    await cdp.send(
      "Emulation.setDeviceMetricsOverride",
      { width: 390, height: 844, deviceScaleFactor: 1, mobile: true },
      session,
    );
    const canary = await measure(SELF_TEST);
    if (canary.scrollWidth <= canary.innerWidth + 1 || canary.offenders.length === 0) {
      console.error(
        `the self-test page is 3000px wide and the probe called it clean (${canary.scrollWidth}px in ${canary.innerWidth}px, ${canary.offenders.length} offenders).\n` +
          "the probe is not measuring anything — fix it before believing a green run.",
      );
      process.exitCode = 1;
      return;
    }
    console.log("✓ self-test: the probe still detects a page that overflows");

    for (const viewport of VIEWPORTS) {
      await cdp.send(
        "Emulation.setDeviceMetricsOverride",
        {
          width: viewport.width,
          height: viewport.height,
          deviceScaleFactor: 1,
          mobile: viewport.mobile,
        },
        session,
      );
      console.log(`\n${viewport.name} — ${viewport.width}x${viewport.height}`);

      for (const route of routes) {
        const probe = await measure(route);

        // The claim: the page body does not scroll sideways. 1px of slack,
        // because sub-pixel layout rounds.
        if (probe.scrollWidth > probe.innerWidth + 1) {
          const blame = probe.offenders
            .map((o) => `      ${o.tag}${o.id && `#${o.id}`}${o.cls && `.${o.cls.split(" ")[0]}`} → right ${o.right}px ${o.text && `("${o.text}")`}`)
            .join("\n");
          failures.push(
            `  ${viewport.name} ${route} — scrolls to ${probe.scrollWidth}px in a ${probe.innerWidth}px viewport\n${blame || "      (no single element to blame — check a container's min-width)"}`,
          );
          console.log(`  ✗ ${route} — ${probe.scrollWidth}px wide`);
        } else {
          console.log(`  ✓ ${route}`);
        }
      }
    }
  } finally {
    cdp.close();
    await chrome.stop();
    server.close();
    // Cleanup must never turn a passing run into a failing one.
    try {
      rmSync(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
    } catch {
      /* a leftover temp profile is the OS's problem, not the site's */
    }
  }

  console.log("");
  if (failures.length > 0) {
    console.error(`${failures.length} page/viewport pair(s) scroll horizontally:\n`);
    console.error(failures.join("\n"));
    process.exit(1);
  }
  console.log(
    `✓ ${routes.length} pages × ${VIEWPORTS.length} viewports — no page scrolls horizontally`,
  );
}

await main();
