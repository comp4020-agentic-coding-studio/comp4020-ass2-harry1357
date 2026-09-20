import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { claim } from "../src/course-config.ts";

// The course-design position from CLAUDE.md, as checks.
//
// These are claims about the *course*, not about the build: a course is one
// claim held for a semester, every week moves a named capability forward, the
// assessment tests what the weeks built, and the prose reads as a person's.
// `spec/assignment-2.test.ts` holds the published spec's shape --- twelve
// dated weeks, weights at 100, a real deck. This file holds the promises I
// made on top of it, and they were committed red on purpose: nothing below is
// true until the course is written.
//
// Everything reads the generated API rather than `src/content/**`, so these
// survive refiling the content. Bodies come from the per-entry JSON, which is
// the one place the raw markdown ships.
//
// The lines that no check here can hold are named at the bottom of the file.

interface ApiNode {
  id: string;
  type: string;
  title: string;
  description?: string;
  meta?: Record<string, unknown>;
}

interface CourseApi {
  course: { title: string; description: string; tags: string[] };
  nodes: ApiNode[];
}

const api = JSON.parse(readFileSync(resolve("dist/api/index.json"), "utf8")) as CourseApi;
const nodes = (type: string): ApiNode[] => api.nodes.filter((node) => node.type === type);
const built = (path: string): string => readFileSync(resolve("dist", path), "utf8");

/** The raw markdown body of a node, from the per-entry JSON the build emits. */
function bodyOf(node: ApiNode): string {
  const entry = JSON.parse(readFileSync(resolve("dist/api", `${node.id}.json`), "utf8")) as {
    body?: string;
  };
  return entry.body ?? "";
}

/** A frontmatter value as a trimmed string. Absent reads as empty, not as
 *  "undefined" --- the failure message should name the missing key, not print
 *  a stringified nothing. */
function meta(node: ApiNode, key: string): string {
  const value = node.meta?.[key];
  return typeof value === "string" ? value.trim() : "";
}

/** Two sentences that differ only in case, spacing or a trailing stop are the
 *  same sentence for the purpose of "no two weeks share a capability". */
const normalise = (text: string): string =>
  text.trim().toLowerCase().replace(/\s+/g, " ").replace(/[.]$/, "");

/** Missing and duplicated are different failures. A collision on the empty
 *  string is two weeks that never declared the key at all, and the message
 *  should say so rather than print two empty quotes. */
const quoted = (value: string): string => (value === "" ? "(nothing --- the key is missing)" : `"${value}"`);

/** The one node count this file hardcodes: the starter shipped nine published
 *  nodes, and the course only grows from there. It exists so a slop-lint that
 *  silently reads nothing fails instead of passing --- a green sweep over zero
 *  bodies looks exactly like a clean one. */
const BODIES_FLOOR = 9;

// ---------------------------------------------------------------------------
// "every week exists to move a named capability forward"
// ---------------------------------------------------------------------------

/** The form a capability is written in, so a week states what a student can do
 *  afterwards rather than what the week covers. */
const CAPABILITY_FORM = /^After this week you can .+\.$/;

describe("every week is about one thing and builds one capability", () => {
  it("names an object and a capability on every week", () => {
    const weeks = nodes("sessions");
    expect(weeks.length, "there are no teaching weeks to check").toBeGreaterThan(0);
    for (const week of weeks) {
      expect(meta(week, "object"), `${week.id} has no object: --- what does it study?`).not.toBe(
        "",
      );
      expect(
        meta(week, "capability"),
        `${week.id} has no capability: --- what can a student do afterwards?`,
      ).not.toBe("");
    }
  });

  it("writes every capability as something the student can do", () => {
    // "After this week you can ___" is the whole discipline of the key: it is
    // hard to write a week's worth of coverage into it and easy to write a
    // verb, which is the point.
    for (const week of nodes("sessions")) {
      expect(
        meta(week, "capability"),
        `${week.id}'s capability is not of the form "After this week you can ___."`,
      ).toMatch(CAPABILITY_FORM);
    }
  });

  it("gives no two weeks the same object", () => {
    // Collect per value rather than keying by week: two weeks sharing an
    // object is exactly the case a Map keyed the other way would hide.
    const byObject = new Map<string, string[]>();
    for (const week of nodes("sessions")) {
      const key = normalise(meta(week, "object"));
      byObject.set(key, [...(byObject.get(key) ?? []), week.id]);
    }
    const shared = [...byObject.entries()].filter(([, ids]) => ids.length > 1);
    expect(
      shared.map(([object, ids]) => `${ids.join(" and ")} both study ${quoted(object)}`),
      "two weeks study the same thing, so one of them has no reason to exist",
    ).toEqual([]);
  });

  it("gives no two weeks the same capability", () => {
    const byCapability = new Map<string, string[]>();
    for (const week of nodes("sessions")) {
      const key = normalise(meta(week, "capability"));
      byCapability.set(key, [...(byCapability.get(key) ?? []), week.id]);
    }
    const shared = [...byCapability.entries()].filter(([, ids]) => ids.length > 1);
    expect(
      shared.map(([capability, ids]) => `${ids.join(" and ")} both claim ${quoted(capability)}`),
      "two weeks leave the student able to do the same thing",
    ).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// "every week has at least one concrete activity a student does"
// ---------------------------------------------------------------------------

/** The vocabulary an activity heading has to use. Narrow on purpose: a heading
 *  that means "do this" but says none of these words fails, and the fix is to
 *  say one or to widen this list deliberately. */
const ACTIVITY_WORDS = [
  "activity",
  "activities",
  "exercise",
  "exercises",
  "task",
  "tasks",
  "workshop",
  "lab",
  "studio",
  "make",
  "build",
  "write",
  "try",
];
const ACTIVITY_HEADING = new RegExp(`^#{2,4}\\s+.*\\b(?:${ACTIVITY_WORDS.join("|")})\\b`, "im");
const TASK_LIST = /^\s*[-*]\s+\[[ xX]\]\s+\S/m;

describe("every week asks the student to do something", () => {
  it("carries an activity heading or a task list in every week's body", () => {
    // A week that is only reading is a reading list entry wearing a week
    // number. This is the machine-readable floor under that.
    const passive = nodes("sessions")
      .filter((week) => {
        const body = bodyOf(week);
        return !ACTIVITY_HEADING.test(body) && !TASK_LIST.test(body);
      })
      .map((week) => week.id);
    expect(
      passive,
      `these weeks have no activity heading (${ACTIVITY_WORDS.join(", ")}) and no task list`,
    ).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// "the assessment tests what the weeks built, not recall"
//
// The weights are held at exactly 100 by spec/assignment-2.test.ts ("assessment
// adds up to 100%"), which also checks each internal marking model adds up.
// Extending that rather than restating it here: one broken sum should fail in
// one place with one message, not light up two files and leave me wondering
// whether they disagree.
// ---------------------------------------------------------------------------

describe("assessment tests what the weeks built", () => {
  it("names, on every item, a capability a week actually builds", () => {
    // "Exactly" here means exactly up to case, spacing and a trailing stop ---
    // a sentence that differs by a full stop is the same promise, and failing
    // on it would teach me to copy-paste more carefully rather than to think.
    const taught = new Map<string, string>();
    for (const week of nodes("sessions")) {
      const capability = meta(week, "capability");
      if (capability !== "") taught.set(normalise(capability), week.id);
    }

    const items = nodes("assessments");
    expect(items.length, "a course with no assessment tests nothing").toBeGreaterThan(0);
    const unfounded: string[] = [];
    for (const item of items) {
      const capability = meta(item, "capability");
      if (capability === "") {
        unfounded.push(`${item.id} has no capability: --- which week's capability does it test?`);
      } else if (!taught.has(normalise(capability))) {
        unfounded.push(`${item.id} tests "${capability}", which no week builds`);
      }
    }
    expect(
      unfounded,
      "the course is marking something it never taught",
    ).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// "plain, direct, no filler" --- the slop-lint
// ---------------------------------------------------------------------------

interface Banned {
  phrase: string;
  pattern: RegExp;
  /** A line this pattern must flag. The lint proving it can fail is the only
   *  reason to believe a clean sweep. */
  example: string;
}

const BANNED: Banned[] = [
  { phrase: "delve", pattern: /\bdelv(?:e|es|ed|ing)\b/i, example: "We delve deeper each week." },
  {
    phrase: "dive into",
    pattern: /\bdiv(?:e|es|ing)\s+into\b/i,
    example: "Then we dive into the data.",
  },
  {
    phrase: "unpack",
    pattern: /\bunpack(?:s|ed|ing)?\b/i,
    example: "We unpack the argument together.",
  },
  { phrase: "journey", pattern: /\bjourneys?\b/i, example: "Your journey through the semester." },
  {
    phrase: "tapestry",
    pattern: /\btapestr(?:y|ies)\b/i,
    example: "A rich tapestry of approaches.",
  },
  {
    phrase: "cutting-edge",
    pattern: /\bcutting[-\s]edge\b/i,
    example: "Cutting-edge methods from the field.",
  },
  {
    phrase: "robust",
    pattern: /\brobust(?:ly|ness)?\b/i,
    example: "You will build a robust pipeline.",
  },
  {
    phrase: "comprehensive",
    pattern: /\bcomprehensive(?:ly)?\b/i,
    example: "A comprehensive survey of the area.",
  },
  {
    // The ban is on the metaphor. Literal senses are exempt, so a course that
    // is actually about orientation or photography can say the word.
    phrase: "landscape (figurative)",
    pattern:
      /\blandscapes?\b(?!\s+(?:orientation|mode|format|photograph|photography|painting|architecture|gardening|design))/i,
    example: "The landscape of the discipline has shifted.",
  },
  {
    phrase: "it's important to note",
    pattern: /\bit(?:'s|’s|\s+is)\s+important\s+to\s+note\b/i,
    example: "It is important to note the deadline.",
  },
  {
    phrase: "in today's",
    pattern: /\bin\s+today(?:'|’)s\b/i,
    example: "In today's industry, tooling moves fast.",
  },
  {
    phrase: "in this week we will",
    pattern: /\bin\s+this\s+week\s+we\s+will\b/i,
    example: "In this week we will look at three cases.",
  },
  { phrase: "at its core", pattern: /\bat\s+its\s+core\b/i, example: "At its core, the method is simple." },
  {
    phrase: "not just X but Y",
    pattern: /\bnot\s+(?:just|only)\b[^.!?;]{0,80}?\bbut\b/i,
    example: "This is not just a technique but a stance.",
  },
];

interface Offence {
  phrase: string;
  excerpt: string;
}

/** Every banned phrase in one piece of prose, with enough surrounding text that
 *  the failure message points at the sentence to rewrite. */
function slopIn(text: string): Offence[] {
  const found: Offence[] = [];
  for (const { phrase, pattern } of BANNED) {
    const hit = pattern.exec(text);
    if (!hit) continue;
    const start = Math.max(0, hit.index - 30);
    const excerpt = text.slice(start, hit.index + hit[0].length + 30).replace(/\s+/g, " ");
    found.push({ phrase, excerpt: excerpt.trim() });
  }
  return found;
}

describe("the prose register", () => {
  it("catches every phrase it says it catches", () => {
    // A slop-lint that matches nothing reads exactly like clean prose. This is
    // the probe proving it can fail, one line per banned phrase.
    for (const { phrase, example } of BANNED) {
      expect(
        slopIn(example).map((offence) => offence.phrase),
        `the "${phrase}" pattern does not flag its own example: ${example}`,
      ).toContain(phrase);
    }
  });

  it("leaves the literal senses of a banned word alone", () => {
    expect(slopIn("The photograph is in landscape orientation.")).toEqual([]);
  });

  it("finds none of them in anything the course publishes", () => {
    const prose: { where: string; text: string }[] = [
      { where: "the course record", text: `${api.course.title} ${api.course.description}` },
      { where: "the claim", text: claim },
      ...api.nodes.map((node) => ({
        where: node.id,
        text: `${node.title}\n${node.description ?? ""}\n${bodyOf(node)}`,
      })),
    ];
    expect(
      prose.length,
      "the slop-lint read almost nothing --- it has stopped seeing the content",
    ).toBeGreaterThanOrEqual(BODIES_FLOOR);

    const offences = prose.flatMap(({ where, text }) =>
      slopIn(text).map((offence) => `${where}: "${offence.excerpt}" (${offence.phrase})`),
    );
    expect(offences, "rewrite these in plain words").toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// "a course is one claim held for a semester"
// ---------------------------------------------------------------------------

/** The built HTML as a reader sees it: no markup, no entities, one space
 *  between words. Comparing raw HTML against a sentence with an apostrophe in
 *  it fails on `&#39;` and tells you nothing useful. */
function plainText(html: string): string {
  return html
    .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCodePoint(Number(code)))
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/[‘’]/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

describe("the home page states the course's central claim", () => {
  it("has a claim of the course's own", () => {
    expect(
      claim,
      "the claim in src/course-config.ts is still the starter's placeholder",
    ).not.toMatch(/one sentence stating/i);
  });

  it("lists every week's capability as an objective, verbatim", () => {
    // Read from the collection, never from a list typed into the page: this
    // fails the moment a week exists that the home page doesn't name, which is
    // exactly what a hand-written list of objectives stops being able to do.
    const page = plainText(built("index.html"));
    const missing = nodes("sessions")
      .filter((week) => {
        const capability = meta(week, "capability");
        return capability === "" || !page.includes(plainText(capability));
      })
      .map((week) => week.id);
    expect(
      missing,
      "these weeks' capabilities are not on the home page --- a week with no capability: has nothing to list",
    ).toEqual([]);
  });

  it("prints that sentence, word for word, on the home page", () => {
    // One source, two readers: the page renders this constant and this test
    // looks for it in the built HTML, so a rewritten claim cannot leave a
    // stale sentence on the page.
    const wanted = plainText(claim);
    expect(
      plainText(built("index.html")),
      "the home page does not carry the claim --- a reader has to guess what the course argues",
    ).toContain(wanted);
  });
});

// ---------------------------------------------------------------------------
// What nothing here can hold, and the crit will:
//
//   - whether a week's title is a claim or a topic. A regex tells a sentence
//     from a noun phrase and cannot tell a claim from an assertion, so the
//     check would pass the weak titles and I would start writing for it.
//   - whether the claim is worth holding for a semester, or just a sentence.
//   - whether each week's one line about how it serves the claim is true, or
//     an assertion pasted onto a week that does something else.
//   - whether the twelve capabilities compound, or are twelve unrelated
//     skills that each happen to be unique.
//   - whether a reading, paper or author cited anywhere actually exists. No
//     check offline can tell a real citation from a plausible one, and this is
//     the failure I would least like to ship.
//   - whether the prose reads as a voice once the banned phrases are gone.
//     A clean slop-lint is a floor, not a register.
// ---------------------------------------------------------------------------
