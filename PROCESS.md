# Process overview

## What I built

SLOP2096, Every Battle Is a Spreadsheet: a twelve-week course on how Japanese
RPGs decide who acts and what a turn costs.

## What I decided a good course is

I read the three sites the brief names before writing a rule. From Calling
Bullshit I took capability statements up front: the home page says what you can
do after the course, not what it covers. From How to Make (Almost) Anything I
took the schedule as a dense list where the course is the sum of the lines, and
no filler anywhere. From CS 007 I took week titles that state a claim, because a
title you could disagree with is the cheapest way to make twelve weeks sound
like one person. The position that came out: a course is one claim held for a
semester, every week moves a named capability, and the assessment tests what the
weeks built.

## What went into the harness, and in what order

The harness went in before a word of content, and the checks were committed red
on purpose
([`be33ddd`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-harry1357/commit/be33ddd),
[`3215ac9`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-harry1357/commit/3215ac9);
revised after the reference reading in
[`b85d087`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-harry1357/commit/b85d087)
and
[`198e9f0`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-harry1357/commit/198e9f0)).
Every week carries object: and capability:; a check fails if two weeks share
either, if the home page doesn't render every capability from the collection, if
an assessment names a capability no week builds, or if the weights don't sum to
100. A slop-lint bans fourteen phrases and carries a self-test per phrase, so I
knew it fired before I trusted a green. Red-first is the only way to know the
checks measure the course rather than the placeholder: they went green one by
one as content landed
([`681b37a`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-harry1357/commit/681b37a),
[`b5708c3`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-harry1357/commit/b5708c3),
[`d48e44d`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-harry1357/commit/d48e44d),
[`55fd956`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-harry1357/commit/55fd956)).

## What I changed after reading the output

I read week 2 as a prospective student. The register passed. The skeleton
didn't: two ways, the arithmetic, where it breaks, activity, reading. Twelve
weeks on that frame would fail "twelve weeks that repeat" at the level of
structure, whatever the words said. The obvious fix was a note to the agent.
Instead I added a rule that weeks share a register, not a skeleton
([`84eb989`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-harry1357/commit/84eb989)),
and it immediately collided with an older one: every body opened "Serves the
claim:", so no body could open differently. Two rules that can't both hold is a
model problem, not a prose problem, so the claim line became a serves:
frontmatter field rendered by the template — still one line on every page, still
checked — and the bodies were freed
([`42b4cfa`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-harry1357/commit/42b4cfa)).
Week 9 now opens on the activity; week 8 opens on a wrong claim and knocks it
down. That is the breakthrough for the retro: a reading observation that ended
as a content-model change.

## What I deliberately left out of the harness

Claim-titles are a rule in CLAUDE.md and not a check, because "is this a claim"
needs a reader; a regex would pass "Speed Matters" and miss the point.
Structural variety is a rule for the same reason. Reading counts are a rule, and
"or none" is allowed: week 9 cites nothing because nothing real would have been
more than padding, and I accepted that over a list. I didn't take HTMAA's
one-machine-per-week, because the course isn't tool-based; Calling Bullshit's
reading lists, because an invented reading is a lie the build can't catch; or CS
007's deck-only weeks, because a marker reads prose.

## What the checks still can't see

Whether a stranger would want to take it. I read weeks 2 and 9 and the
assessment page for that. Nothing in spec/ can.
