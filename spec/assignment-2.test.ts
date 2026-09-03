import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { gitOrigin, resolveDeployment } from "../scripts/pages-base.ts";

/** The deployed base path, derived the same way the build derives it. Never
 *  hardcode the repo name: it is wrong the moment the repo is renamed, and
 *  hardcoding it is the exact mistake this template's config exists to avoid. */
const { base } = resolveDeployment(process.env, gitOrigin);

// Assignment 2's published spec, as tests.
//
// These read `dist/api/index.json` --- the contract the SlopU programs and
// courses page will consume --- and the built HTML where the claim is about a
// page rather than about the data. Testing the API rather than
// `src/content/**` means these survive restructuring the content files, which
// is the point: they are claims about the course, not about how it is filed.
//
// The lines of the spec that no test can hold are named at the bottom of this
// file. They are still on the hook at the crit.

interface ApiNode {
  id: string;
  type: string;
  title: string;
  description?: string;
  tags?: string[];
  related?: string[];
  meta?: Record<string, unknown>;
}

interface CourseApi {
  course: {
    code: string;
    title: string;
    level: number;
    description: string;
    tags: string[];
    startDate: string;
    endDate: string;
  };
  nodes: ApiNode[];
}

const api = JSON.parse(readFileSync(resolve("dist/api/index.json"), "utf8")) as CourseApi;
const nodes = (type: string): ApiNode[] => api.nodes.filter((node) => node.type === type);
const built = (path: string): string => readFileSync(resolve("dist", path), "utf8");

/** The three digits this repo was allocated, from the commit that set them. */
const ALLOCATED_DIGITS = "096";

/** ANU course levels: 1--4 undergraduate, 6 or 8 postgraduate. */
const LEVELS = [1, 2, 3, 4, 6, 8];

/** Twelve dated teaching weeks --- the spec says twelve, so twelve. */
const TEACHING_WEEKS = 12;

/** A deck with fewer slides than this is the four-slide placeholder wearing a
 *  new title. My line, not the spec's --- move it if a lecture earns it. */
const REAL_DECK_SLIDES = 10;

// ---------------------------------------------------------------------------
// "one niche course at Slop University, under a SLOPxxxx code that keeps the
//  three digits your repo arrived with"
// ---------------------------------------------------------------------------

describe("the course record", () => {
  it("carries a SLOPxxxx code that keeps its allocated three digits", () => {
    expect(api.course.code).toMatch(/^SLOP\d{4}$/);
    expect(
      api.course.code.slice(-3),
      `the last three digits are allocated to this repo alone --- ${api.course.code} changed them`,
    ).toBe(ALLOCATED_DIGITS);
  });

  it("sets a level that is a real ANU level, and agrees with the code", () => {
    expect(LEVELS, `level ${api.course.level} is not an ANU course level`).toContain(
      api.course.level,
    );
    expect(
      Number(api.course.code[4]),
      "the first digit of the code is the level, so the two have to say the same thing",
    ).toBe(api.course.level);
  });

  it("is a course of mine rather than the starter's placeholder", () => {
    // The site is the curriculum: if the record still says "Course Title Goes
    // Here" then nothing downstream of it --- home page, nav, API, the
    // canonical SlopU URL --- is describing a course at all.
    expect(api.course.title).not.toMatch(/course title goes here/i);
    expect(api.course.description).not.toMatch(/one concise paragraph explaining/i);
    expect(api.course.tags, "the starter's placeholder tag is still there").not.toContain(
      "replace me",
    );
    expect(api.course.tags.length, "the schema allows one to three tags").toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// "running across twelve dated teaching weeks"
// ---------------------------------------------------------------------------

describe("twelve dated teaching weeks", () => {
  it(`runs ${TEACHING_WEEKS} teaching sessions`, () => {
    expect(nodes("sessions").length).toBe(TEACHING_WEEKS);
  });

  it("numbers them 1 to 12, once each", () => {
    const weeks = nodes("sessions").map((node) => node.meta?.week);
    for (const [index, week] of weeks.entries()) {
      expect(week, `${nodes("sessions")[index].id} has no week number`).toBeTypeOf("number");
    }
    expect([...weeks].sort((a, b) => Number(a) - Number(b))).toEqual(
      Array.from({ length: TEACHING_WEEKS }, (_, i) => i + 1),
    );
  });

  it("dates them in the order they are numbered", () => {
    // data-integrity.test.ts already holds every date inside the teaching
    // period. This is the other half: week 7 must not fall before week 6.
    const dated = nodes("sessions")
      .map((node) => ({ id: node.id, week: Number(node.meta?.week), date: String(node.meta?.date) }))
      .sort((a, b) => a.week - b.week);
    for (const [index, session] of dated.entries()) {
      expect(session.date, `${session.id} has no date`).toMatch(/^\d{4}-\d{2}-\d{2}/);
      if (index > 0) {
        expect(
          session.date > dated[index - 1].date,
          `${session.id} (week ${session.week}) is not after ${dated[index - 1].id}`,
        ).toBe(true);
      }
    }
  });

  it("gives every week a description that is its own", () => {
    // Twelve weeks that repeat one another is the failure mode the brief names
    // outright. Identical descriptions are the machine-readable corner of it.
    const descriptions = nodes("sessions").map((node) => (node.description ?? "").trim());
    expect(descriptions.filter((text) => text.length === 0)).toEqual([]);
    expect(new Set(descriptions).size, "two teaching weeks share a description").toBe(
      descriptions.length,
    );
  });
});

// ---------------------------------------------------------------------------
// "assessment that adds up to 100%"
// ---------------------------------------------------------------------------

describe("assessment", () => {
  it("adds up to 100%", () => {
    const weights = nodes("assessments").map((node) => Number(node.meta?.weight));
    expect(weights.length, "a course with no assessment has nothing to add up").toBeGreaterThan(0);
    for (const weight of weights) expect(weight).toBeTypeOf("number");
    expect(weights.reduce((total, weight) => total + weight, 0)).toBe(100);
  });

  it("gives every internal marking model that adds up too", () => {
    // A weighted criteria block that sums to 90 is a page that lies to a
    // student about how their mark is made, and nothing else would notice.
    for (const node of nodes("assessments")) {
      const marking = node.meta?.marking as
        | { mode?: string; criteria?: { name: string; weight: number }[] }
        | undefined;
      if (marking?.mode !== "weighted" || !marking.criteria) continue;
      const total = marking.criteria.reduce((sum, criterion) => sum + criterion.weight, 0);
      expect(total, `${node.id}'s criteria add up to ${total}, not 100`).toBe(100);
    }
  });
});

// ---------------------------------------------------------------------------
// "at least one lecture carries a real deck, linked from its page"
// ---------------------------------------------------------------------------

describe("the deck", () => {
  const withSlides = () => nodes("lectures").filter((node) => node.meta?.slides);

  it("is carried by at least one lecture", () => {
    expect(withSlides().length, "no lecture names a deck in its frontmatter").toBeGreaterThan(0);
  });

  it("built, and is a real deck rather than the placeholder", () => {
    let realDecks = 0;
    for (const lecture of withSlides()) {
      const route = String(lecture.meta?.slides).replace(/^\/|\/$/g, "");
      const page = `${route}/index.html`;
      expect(existsSync(resolve("dist", page)), `${lecture.id} names ${route}, which did not build`).toBe(
        true,
      );
      const slides = (built(page).match(/<section/g) ?? []).length;
      if (slides >= REAL_DECK_SLIDES) realDecks += 1;
    }
    expect(
      realDecks,
      `no deck reaches ${REAL_DECK_SLIDES} slides --- the starter's placeholder has four`,
    ).toBeGreaterThan(0);
  });

  it("is linked from the lecture page a reader lands on", () => {
    // Named in frontmatter is not the same as reachable by clicking. The link
    // has to carry the base path too, or it 404s on the deployed site only.
    for (const lecture of withSlides()) {
      const html = built(`${lecture.id}/index.html`);
      const route = String(lecture.meta?.slides);
      const deployed = `${base.replace(/\/$/, "")}${route}`;
      expect(
        html.includes(`href="${deployed}`) || html.includes(`href="${route}`),
        `${lecture.id} names a deck but its page has no link to ${deployed}`,
      ).toBe(true);
    }
  });
});

// ---------------------------------------------------------------------------
// The site a reader actually gets
// ---------------------------------------------------------------------------

describe("every node the API publishes is a page you can reach", () => {
  it("built a page for each one", () => {
    // `published: false` removes an entry from the production build but leaves
    // it in `pnpm dev`. That is the staging lever, and it is also the way a
    // week silently disappears from the shipped site while still looking right
    // locally.
    for (const node of api.nodes) {
      const page = node.id.endsWith("/index") ? `${node.id}.html` : `${node.id}/index.html`;
      expect(existsSync(resolve("dist", page)), `${node.id} is in the API with no page`).toBe(true);
    }
  });

  it("connects the graph rather than leaving weeks stranded", () => {
    // A course is one idea explored across a semester. A teaching week with no
    // edge to a lecture, an assessment or another week is a page that belongs
    // to nothing.
    const stranded = nodes("sessions").filter((node) => {
      const outbound = node.related?.length ?? 0;
      const inbound = api.nodes.filter((other) => other.related?.includes(node.id)).length;
      return outbound + inbound === 0;
    });
    expect(stranded.map((node) => node.id), "these weeks are in no relationship at all").toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// What no test here can hold, and the crit will:
//
//   - "niche": narrow enough that no real university would run it, deep enough
//     to teach for a semester.
//   - coherence: whether twelve weeks are one idea explored, or twelve weeks.
//   - voice: whether the prose reads as a person's or as content-shaped chunks.
//   - "would someone want to take it".
//   - the look, at 1920x1080 and 390x844, read the way a prospective student
//     reads it, for about ten minutes.
// ---------------------------------------------------------------------------
