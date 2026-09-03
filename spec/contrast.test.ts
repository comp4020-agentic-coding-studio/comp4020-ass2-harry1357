import { readFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { describe, expect, it } from "vitest";

// A sensor, not a contract test: it carries forward, whatever the deliverable
// asks. Carried from comp4020-crit5-harry1357 and re-pointed at this site's
// palette.
//
// The build runs axe over all 16 pages, and a clean axe pass says nothing at
// all about contrast --- axe needs layout and computed colour to judge it, so
// `color-contrast` is "incomplete" for every node under any headless check.
// That left the palette checked by eye, which is how --ink-faint shipped in
// crit 5 at 3.01:1 and looked perfectly fine to me in a screenshot.
//
// So: read the tokens back out of the CSS the build actually emitted, and do
// the arithmetic. Reading the built file rather than the source means a value
// that gets minified, overridden or dropped fails here too, and renaming a
// token fails loudly instead of quietly skipping.

const DIST = resolve("dist");

function builtCss(): string {
  const walk = (dir: string): string[] =>
    readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
      const path = join(dir, entry.name);
      return entry.isDirectory() ? walk(path) : [path];
    });
  return walk(DIST)
    .filter((path) => path.endsWith(".css"))
    .map((path) => readFileSync(path, "utf8"))
    .join("\n");
}

const css = builtCss();

/** The value of a custom property as the build emitted it. */
function token(name: string): string {
  const found = css.match(new RegExp(`--${name}\\s*:\\s*(#[0-9a-fA-F]{3,8})`));
  expect(found, `--${name} is not in the built CSS under that name`).toBeTruthy();
  return (found as RegExpMatchArray)[1];
}

function channel(value: number): number {
  const ratio = value / 255;
  return ratio <= 0.03928 ? ratio / 12.92 : ((ratio + 0.055) / 1.055) ** 2.4;
}

function luminance(hex: string): number {
  const full =
    hex.length === 4 ? `#${[1, 2, 3].map((i) => hex[i].repeat(2)).join("")}` : hex;
  const [r, g, b] = [1, 3, 5].map((i) => Number.parseInt(full.slice(i, i + 2), 16));
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

export function contrast(foreground: string, background: string): number {
  const [lighter, darker] = [luminance(foreground), luminance(background)].sort(
    (a, b) => b - a,
  );
  return (lighter + 0.05) / (darker + 0.05);
}

// Each row is a claim the stylesheet makes: this ink is used for this kind of
// thing on this ground. WCAG AA is 4.5:1 for body text, and 3:1 for large text
// and for the graphics a control's meaning depends on (1.4.11).
//
// Slop's identity is three accents plus black, white and two greys, and it
// stays as it arrived --- so these rows start as the floor rather than the
// whole story. Every ink this course adds of its own goes in here, against the
// ground it's actually used on.
const CLAIMS: ReadonlyArray<readonly [string, string, string, number]> = [
  ["body text on the page", "at-black", "at-white", 4.5],
  ["body text on the inverted ground", "at-white", "at-black", 4.5],
  ["the primary accent as text on the page", "at-primary", "at-white", 4.5],
  ["the secondary accent as text on the page", "at-secondary", "at-white", 4.5],
  ["the tertiary accent as text on the page", "at-tertiary", "at-white", 4.5],
  // On every ground that isn't white these three are graphics-only inks. The
  // floor is deliberately 3, not 4.5 --- see the note below, which is the
  // thing to remember rather than these numbers.
  ["the primary accent as a mark on a shaded panel", "at-primary", "at-light-grey", 3],
  ["the secondary accent as a mark on a shaded panel", "at-secondary", "at-light-grey", 3],
  ["the tertiary accent as a mark on a shaded panel", "at-tertiary", "at-light-grey", 3],
  ["the primary accent as a mark on the dark ground", "at-primary", "at-dark-grey", 3],
  ["the secondary accent as a mark on the dark ground", "at-secondary", "at-dark-grey", 3],
  ["the tertiary accent as a mark on the dark ground", "at-tertiary", "at-dark-grey", 3],
];

describe("the palette, since axe can't", () => {
  it("found the built stylesheet to read", () => {
    // Without this, a run that silently loaded nothing looks exactly like a
    // run that found no problems.
    expect(css.length, "no CSS in dist/ --- run the build first").toBeGreaterThan(500);
  });

  for (const [what, foreground, background, floor] of CLAIMS) {
    it(`${what} clears ${floor}:1`, () => {
      const ratio = contrast(token(foreground), token(background));
      expect(
        Number(ratio.toFixed(2)),
        `--${foreground} (${token(foreground)}) on --${background} (${token(background)}) is ${ratio.toFixed(2)}:1`,
      ).toBeGreaterThanOrEqual(floor);
    });
  }

  // Which accent may carry a *paragraph* on which ground. Not a floor --- a
  // map, held in place, because it is the thing I will otherwise get wrong
  // from memory. An accent used for body text on a ground marked false here is
  // a contrast failure that no row above would name, since those rows assert
  // the graphics floor for exactly these pairs.
  //
  // I wrote this test asserting "white only" and it failed on the first run:
  // --at-tertiary clears 5.04:1 on the shaded panel and is perfectly legible
  // there. That is the sensor working --- the generalisation was mine, not the
  // palette's.
  const BODY_TEXT_SAFE: ReadonlyArray<readonly [string, string, boolean]> = [
    ["at-primary", "at-white", true],
    ["at-secondary", "at-white", true],
    ["at-tertiary", "at-white", true],
    ["at-primary", "at-light-grey", false],
    ["at-secondary", "at-light-grey", false],
    ["at-tertiary", "at-light-grey", true],
    ["at-primary", "at-dark-grey", false],
    ["at-secondary", "at-dark-grey", false],
    ["at-tertiary", "at-dark-grey", false],
  ];

  for (const [accent, ground, safe] of BODY_TEXT_SAFE) {
    it(`--${accent} on --${ground} is ${safe ? "" : "not "}body-text legible`, () => {
      const ratio = contrast(token(accent), token(ground));
      const message = safe
        ? `--${accent} no longer carries body text on --${ground} (${ratio.toFixed(2)}:1) --- anywhere it does needs changing`
        : `--${accent} now clears 4.5:1 on --${ground} (${ratio.toFixed(2)}:1) --- it is body-text legible there, so say so here`;
      if (safe) expect(ratio, message).toBeGreaterThanOrEqual(4.5);
      else expect(ratio, message).toBeLessThan(4.5);
    });
  }

  it("keeps the three accents distinct from one another", () => {
    // Two tokens can both clear their floor against the page and still have
    // collapsed into each other, losing a distinction the design depends on.
    // Nothing else in the suite would notice.
    const accents = ["at-primary", "at-secondary", "at-tertiary"].map(token);
    expect(new Set(accents).size, `the accents have collapsed: ${accents.join(", ")}`).toBe(3);
  });
});
