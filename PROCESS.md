# Process overview

## What I built

SLOP2096, Every Battle Is a Spreadsheet: a twelve-week course on how Japanese
RPGs decide who acts and what a turn costs.

## What I decided a good course is

I read the three sites the brief names before writing a rule. From Calling
Bullshit I took capability statements up front. From How to Make (Almost)
Anything I took the schedule as a dense list, and no filler anywhere. From CS
007 I took week titles that state a claim. The position that came out: a course is one claim held for a
semester, every week moves a named capability, and the assessment tests what the
weeks built.

## What went into the harness, and in what order

The harness went in before a word of content, and the checks were committed
red on purpose ([`be33ddd`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-harry1357/commit/be33ddd),
[`3215ac9`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-harry1357/commit/3215ac9); revised after reading
the reference courses in [`b85d087`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-harry1357/commit/b85d087) and
[`198e9f0`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-harry1357/commit/198e9f0)). They hold the course to its promises, and a
slop-lint with a self-test per banned phrase meant I knew it fired before
trusting a green. Red-first is how I knew the checks
measured the course rather than the placeholder: they went green as content
landed ([`681b37a`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-harry1357/commit/681b37a),
[`b5708c3`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-harry1357/commit/b5708c3),
[`d48e44d`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-harry1357/commit/d48e44d),
[`55fd956`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-harry1357/commit/55fd956)).

## What I changed after reading the output

I read week 2 as a prospective student. The register passed. The skeleton
didn't. Twelve
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
That is the breakthrough for the retro: a reading observation that ended
as a content-model change. The assessment pages were the next thing a read
caught, and the fix was a rule and a check rather than a rewrite
([`aba7ee4`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-harry1357/commit/aba7ee4)). A rule carried from crit 5 said site-wide CSS
belongs in the stylesheet PageLayout imports; a marker, a build and a grep of
dist proved it reaches no page, so the rule was false and had never been
tested, and I replaced it with one that names the check
([`b77963a`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-harry1357/commit/b77963a)).

## What I deliberately left out of the harness

Claim-titles are a rule and not a check, because "is this a claim"
needs a reader; a regex would pass "Speed Matters".
Structural variety is a rule for the same reason. Reading counts are a rule, and
"or none" is allowed: week 9 cites nothing because nothing real would have been
more than padding, and I accepted that over a list. I didn't take HTMAA's
one-machine-per-week, because the course isn't tool-based; Calling Bullshit's
reading lists, because an invented reading is a lie the build can't catch; or CS
007's deck-only weeks, because a marker reads prose. I kept the starter's two
lecture slots and made the sessions the course: a spreadsheet course needs a
lecture only to state the claim and derive the model once
([`a85f957`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-harry1357/commit/a85f957)).

## What the checks still can't see

Whether a stranger would want to take it. I read weeks 2 and 9 and the
assessment page for that. Nothing in spec/ can. Nor could axe see a suppressed
focus ring on the theme toggle; that one took a keyboard
([`b77963a`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-harry1357/commit/b77963a)).
