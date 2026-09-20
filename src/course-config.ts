import type { CourseMetaInput } from "astro-course-university";
import { z } from "astro/zod";

// The level digits ANU uses: 1000--4000 undergraduate, 6000 and 8000
// postgraduate. Both the code pattern and the level field derive from this.
const LEVELS = [1, 2, 3, 4, 6, 8] as const;
const allowedCode = new RegExp(`^SLOP[${LEVELS.join("")}]\\d{3}$`);

/**
 * The course's central claim: the one sentence the whole semester argues for.
 * One sentence, long enough to be a claim rather than a slogan, short enough to
 * sit in a hero.
 */
const claimSchema = z
  .string()
  .trim()
  .min(40, { message: "shorter than this is a slogan, not a claim" })
  .max(200, { message: "one sentence, not a paragraph" })
  .refine((sentence) => sentence.endsWith("."), {
    message: "state it as a finished sentence, ending in a full stop",
  })
  .refine((sentence) => !/[.!?]\s+\S/.test(sentence), {
    message: "the claim is one sentence --- this one runs to several",
  });

export const slopCourseMetaSchema = z
  .strictObject({
    code: z.string().regex(allowedCode, {
      message: "use SLOP plus a 1000–4000, 6000 or 8000 level code",
    }),
    title: z.string().trim().min(1).max(100),
    session: z.string().trim().min(1).max(40),
    year: z.number().int().min(2026).max(2200),
    level: z.literal(LEVELS),
    startDate: z.iso.date(),
    endDate: z.iso.date(),
    description: z.string().trim().min(80).max(300),
    tags: z.array(z.string().trim().min(2).max(24)).min(1).max(3),
  })
  .superRefine((course, ctx) => {
    const codeLevel = Number(course.code.at(4));
    if (course.level !== codeLevel) {
      ctx.addIssue({
        code: "custom",
        path: ["level"],
        message: `must match ${course.code}'s first digit (${codeLevel})`,
      });
    }
    if (course.startDate > course.endDate) {
      ctx.addIssue({
        code: "custom",
        path: ["startDate"],
        message: "must not be after endDate",
      });
    }
  });

// The single source of truth for the course record. The generated homepage,
// navigation label and /api/index.json all read this object.
// Replace every placeholder value, but keep the shape: the catalogue ingests
// this API contract when the course is published.
//
// 096 was allocated to this repo and no other course in the cohort has it. The
// leading 2 is the level: second-year, because it asks for arithmetic and
// patience rather than any prior coursework.
export const courseMeta = slopCourseMetaSchema.parse({
  code: "SLOP2096",
  title: "Every Battle Is a Spreadsheet",
  session: "Semester 1",
  year: 2027,
  level: 2,
  startDate: "2027-02-22",
  endDate: "2027-05-28",
  description:
    "A semester spent reading the arithmetic under Japanese RPG combat: turn " +
    "order, initiative counters, damage formulas and the rolls around them. " +
    "You measure real fights, rebuild their systems in a spreadsheet, and " +
    "design one of your own.",
  // The schema allows three. "combat" lost to "systems", which carries it.
  tags: ["game design", "systems", "JRPG"],
}) satisfies CourseMetaInput;

/** The line under the title. Not a field of `courseMeta` for the same reason
 *  `claim` isn't: that record's schema is strict and parsed at config time. */
export const subtitle = "Systems Design in Japanese RPGs";

// The claim is a sibling of `courseMeta` rather than a field of it because the
// integration's `courseMetaSchema` is strict and parses the record at config
// time: an extra key there fails the build. It is still the single source ---
// the home page prints this constant and `spec/course-design.test.ts` reads it
// back out of the built HTML, so the two cannot drift apart.
export const claim = claimSchema.parse(
  "Every JRPG battle is a small deterministic system wearing a costume, and " +
    "once you can read the numbers you can read the design.",
);
