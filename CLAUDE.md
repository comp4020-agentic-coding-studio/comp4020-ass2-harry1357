# Harness

Carried forward from `comp4020-crit5-harry1357` and edited for this repo. These
are rules I decided on, mostly the hard way; each one is here because something
went wrong once and I'd rather not find it again.

**The platform is in `README.md` and it is fixed** — the Slop identity, the four
content collections, the build pipeline, the generated API. Don't restate it
here and don't try to change it. This file is the part that's mine: conventions
to hold to, sensors that keep catching me out, and facts about the stack the
agent keeps getting wrong.

What's being built this week is on the course website
(`assessments/assignment-2/`): one niche course at Slop University, twenty-odd
pages that have to agree with each other. The site is the curriculum — there is
no separate document, so every course decision lands in content.

## How to work in here

- Keep the dev server running (`pnpm dev`) so you see changes as you make them.
  It serves under the base path: `http://localhost:4321/comp4020-ass2-harry1357/`.
  The bare `http://localhost:4321` Astro prints is a 404, and mistaking that for
  a broken build wastes a loop.
- Before you push, run `pnpm check` — typecheck, build, lint, spec. The build is
  itself several sensors (below), so this is most of CI in a few seconds.
- To see what the page actually looks like rather than what you assume it looks
  like, drive a real browser (CDP, below). The rendered page is the truth; your
  mental model of it isn't.
- When a check fails, read its output before changing anything. The failure
  message is the instruction: it names the file, the line, or the contract.
  Treat a red check as authoritative — the page is wrong until the check is
  green, not until you decide it should be.
- Commit when the checks pass. Never commit a red state — **with one exception,
  and it matters this week**: a `spec/` test that is red because the course
  isn't written yet is a *target*, not a regression. Those were committed red on
  purpose and going red-to-green is the record of the work. Never weaken one to
  get a green roster; if a spec test is wrong, say why and change it
  deliberately in its own commit. A test that goes red because something I just
  changed broke it is the ordinary case, and that still doesn't get committed.

## The checks (your sensors)

CI runs `check` and `deploy` on every push once the repo is public; while it's
private both stay skipped and `pnpm check` is the same roster, faster. They
aren't hoops — each is a different way of finding out something true about the
site that you can't reliably see by looking at it.

- **typecheck** — `astro check` runs first, so a type error stops the roster
  before the build starts. A red here is the compiler telling you a claim in the
  code is false.
- **build** — `pnpm build` carries five sensors of its own, and they are the
  ones that matter most on a twenty-page site: it runs **axe** over every
  rendered page, verifies every internal link **respects the base path**, fails
  on a **dangling content ref** in `related:`, compiles the **decks**, and emits
  the **course API**. A dangling ref is caught before it ships rather than after,
  which is the whole point of putting links in frontmatter.
- **lint** — `stylelint` for CSS, `oxlint` for TypeScript. Carried forward; the
  template doesn't ship them. Read the rule it names.
- **spec** — `spec/data-integrity.test.ts` ships with the template and checks
  the one cross-page fact the schemas can't: dated material stays inside the
  teaching period. My own tests run alongside it (any `spec/*.test.ts`).
- **check:evidence** — `pnpm check:evidence` is the submission gate: `PROCESS.md`
  citations resolve to real commits, every tracked `STARTER_CONTENT` fragment is
  gone, and the starter imagery has been replaced. **Remove a fragment's
  `STARTER_CONTENT` comment when you replace that fragment** — leaving the marker
  on rewritten content fails the gate, and stripping the marker without
  rewriting the content is lying to it.
- **viewports** (`pnpm check:viewports`) — a CDP probe that loads every built
  page at 390×844 and 1920×1080 and asserts the body never scrolls sideways.
  **Deliberately not in the `check` roster**: it needs Chrome, and a roster that
  can go red because a browser didn't launch teaches you to ignore it. Run it
  **before shipping and after any layout work** — `pnpm build && pnpm
  check:viewports`. It starts by loading a synthetic 3000px page and failing if
  it *doesn't* detect that, so a green run means the probe was looking.
- **secrets** — `.githooks/pre-commit` blocks any commit containing something
  shaped like an API key. By the time CI sees a key it's already pushed, so the
  hook is the sensor that matters.

Nothing here measures **performance**, and axe is a floor rather than a ceiling
on accessibility. When you do read a green performance result, read it honestly:
it's a lab estimate from one CI machine, not proof the site is fast for anyone.

## The stack is fixed here

Unlike the static template, there is no stack choice in this repo: Astro, the
Slop theme, the four collections, the API. Adding is always allowed — a
collection of my own, a page outside the collections, a component the theme
doesn't have — but the platform stays as it arrived.

## Astro on *this* template

The base-path rule from crit 2 is **inverted here, so don't carry the old
instinct**. That template used relative URLs and no `base`; this one derives
`base` at config time from `GITHUB_REPOSITORY` or the git origin, in
`scripts/pages-base.ts`.

- **Never hardcode the base, and never write a root-absolute link in an
  `.astro` file.** `href="/sessions/"` skips Astro's base handling, works
  perfectly on localhost, and 404s on the live site. Markdown links and the
  theme's components are rewritten for you; the build's link checker catches the
  rest — trust it rather than eyeballing.
- `astro check` is the typecheck script, not `tsc --noEmit`.
- **The integration's `courseMetaSchema` is a `strictObject` and it parses
  `courseMeta` at config time**, so an invented key in that record fails the
  build rather than passing through to the API — unlike a *content* node's
  frontmatter, which is `.loose()` and does pass through. That asymmetry is why
  the course's `claim` is a sibling export in `src/course-config.ts` rather than
  a field of `courseMeta`.
- The image pipeline needs `sharp`, and `allowBuilds: { sharp: true }` in
  `pnpm-workspace.yaml` or install warns.
- The link-preview card is **`socialImage:` in `src/site-config.ts`**, not a
  file in `public/`. A page with its own artwork overrides it with a
  `socialImage:` frontmatter key. Both ship as placeholders and
  `pnpm check:evidence` will not pass them.
- **Vite leaves `url(#fragment)` alone.** In-document SVG filter references
  (`filter: url("#ink-bleed")`) survive the build; only real asset URLs get
  rewritten. Grep `dist/` for the fragment once to confirm rather than assuming.

## The content model has one address per node

The collection key *is* the address: `sessions/getting-started` is the file, the
page, the JSON, and the ref other pages link by. Those four agree by
construction, so renaming one means renaming all four.

- **A `related:` edge renders on both pages**, so declare it on whichever side
  is convenient — but decide a convention and hold it, or the graph becomes
  impossible to read in source.
- **Don't key a relationship by the thing it's about.** In crit 5 a `Map` keyed
  by line index silently overwrote the first of two relationships one line was
  in, and the report showed a pair with no partner — the exact opposite of the
  feature. Same shape applies to a content graph: one node is legitimately in
  several relationships, so collect into an array and render one edge per
  relationship.
- `published: false` removes an entry from the production build entirely but
  leaves it visible in `pnpm dev` — that's the staging lever, not `draft: true`,
  which keeps the page visible and only marks it unfinished.
- `src/course-config.ts` is the single source for the course record. Don't
  restate the code, title, dates or teaching period in page content; read them
  from there, or the two will disagree by week 9.

## Course coherence

This is the assignment: twenty-odd pages that agree with each other, one idea
carried a whole semester, prose that reads as a voice rather than as content-
shaped chunks. An agent will happily produce twelve weeks that are the same week
with different nouns.

**The rules that go here are course-design decisions, and they're mine to make
and write down as I make them.** This section starts near-empty on purpose;
filling it — and turning the decisions that can be checked into `spec/` tests —
is the work `PROCESS.md` has to narrate; the section below it is the first pass
at that. Two traps carry from crit 5:

- **A rotating set of lines indexed off a counter that only goes up will
  collide.** Picking by `n % set.length` looks evenly distributed and isn't. The
  web version: a per-week template with a rotating opener produces two weeks
  that read identically, and it reads as a loop rather than as structure.
- **Check the register, not just the facts.** Content that is individually
  correct and collectively flat is the failure mode here, and no check will
  catch it. Read a week you didn't just write.

## What a good course looks like

The position, stated once so the rest of this file can point at it: **a course
is one claim held for a semester.** Every week exists to move a named capability
forward. The register is plain and the audience is narrow — a course that tries
not to exclude anyone has no one in mind. The assessment tests what the weeks
built, not what a student can recall. Twelve weeks that each introduce a
different interesting thing is a reading list, not a course.

These are course-design decisions, not platform facts: `README.md` neither knows
nor cares about any of them. Each rule below either has a check in
`spec/course-design.test.ts` or is named at the bottom of that file as a line
only a person can judge.

- **The home page states the central claim in one sentence**, read from `claim`
  in `src/course-config.ts` so the page and the check can't drift apart. Every
  week's page says in one line how that week serves the claim.
- **Every week's frontmatter carries `object:` and `capability:`.** `object:` is
  the one thing studied that week; `capability:` is one sentence in the form
  "After this week you can ___". **No two weeks may share an object or a
  capability** — if two do, one of those weeks has no reason to exist.
- **Every week has at least one concrete activity a student does**, not just
  reading: a heading naming the doing (activity, exercise, task, workshop, lab,
  studio, make, build, write, try) or a markdown task list. The check holds that
  vocabulary, so a heading that means it but says none of those words fails —
  add the word or widen the list deliberately.
- **Assessment items test a named capability from a named week, and the weights
  sum to exactly 100.** An item declares `assesses:`, each entry either a ref to
  the week (`sessions/<slug>`, or a bare slug) or that week's capability
  sentence verbatim. **Prefer the ref**: one address per node, and the
  capability is then read rather than restated. Weights are already held at 100
  by `spec/assignment-2.test.ts`; don't assert that twice.
- **No invented readings, papers, authors or URLs.** Reference only real,
  verifiable sources or clearly in-course materials. A plausible-looking
  citation to a paper that doesn't exist is the worst thing this site could
  ship, and nothing here can catch it — the build's link checker only sees
  internal links.
- **Prose register: plain, direct, contractions allowed, no filler.** A
  slop-lint in `spec/course-design.test.ts` bans these outright, case-
  insensitively, across every body the API publishes plus the course record and
  the claim: "delve", "dive into", "unpack", "journey", "tapestry",
  "cutting-edge", "robust", "comprehensive", figurative "landscape", "it's
  important to note", "in today's", "in this week we will", "at its core", and
  "not just X but Y" constructions. Literal "landscape" (orientation, mode,
  format, photography, painting) is exempt, because the ban is on the metaphor.
- **No content page may be interchangeable with another.** If two weeks could
  swap positions and nobody would notice, one of them is wrong. The checkable
  corner of that is unique descriptions, objects and capabilities; the rest is
  read, not measured.

## Verifying the rendered page

The rendered page is ground truth — but only if you've checked you're rendering
the right page at the right size. Both failed in one session.

- **The shell's working directory resets between commands.** `serve dist`
  without an explicit path silently served *last week's repo*. Always pass an
  absolute path: `python3 -m http.server 8099 --directory "$PWD/dist"`. On this
  template, remember `dist/` is served at the **base path** — the page you want
  is under `/comp4020-ass2-harry1357/`.
- **Chrome's headless mode enforces a ~500px minimum window.**
  `--window-size=390,844` lays the page out at 500px and then *crops* the
  screenshot to 390, which looks exactly like horizontal overflow that isn't
  there. Don't fix a bug you've only seen in a picture.
- **To measure a real phone viewport**, use CDP's
  `Emulation.setDeviceMetricsOverride` (below). Failing that, a **same-origin**
  iframe (`<iframe src="./index.html" style="width:390px">`) gets its own
  viewport *and* its own media-query context; read
  `document.documentElement.scrollWidth` and flag any element whose
  `getBoundingClientRect().right` exceeds the width. A number beats a
  screenshot. Cross-origin (a different port) yields a null `contentDocument`
  and a probe that silently reports nothing.
- **The shell here is zsh, which does not word-split unquoted variables.**
  `set -- $spec` with `spec="390 520"` gives *one* argument, not two, so a loop
  that is correct in bash quietly passes `--window-size=,900`. Chrome ignores
  the malformed flag, lays out at its own default width, and the probe reports
  confident numbers for a viewport you never tested. Split explicitly
  (`${=spec}`) or use separate variables.

## Driving the real browser over CDP

`agent-browser` isn't installed here. Chrome's DevTools Protocol needs no
dependencies at all — Node has a global `WebSocket` — and it is strictly better
than screenshotting for anything you need a number from.

- Launch with `--headless=new --remote-debugging-port=9222 --user-data-dir=<tmp>`,
  read `webSocketDebuggerUrl` from `http://localhost:9222/json/version`, then
  `Target.createTarget` → `Target.attachToTarget {flatten: true}` and send
  session-scoped commands.
- **`Emulation.setDeviceMetricsOverride` gives a true 390px viewport** and
  sidesteps the headless ~500px minimum window entirely — no iframe needed, and
  no cropped screenshot pretending to be overflow. Add
  `Emulation.setTouchEmulationEnabled` for touch.
- **`Input.dispatchMouseEvent` / `dispatchKeyEvent` are trusted events.**
  `navigator.userActivation.hasBeenActive` flips to true after one; a
  `dispatchEvent` from page script does not.
- `Emulation.setEmulatedMedia` sets `prefers-reduced-motion: reduce` (and
  `prefers-color-scheme`) without relaunching. Chrome also has
  `--force-prefers-reduced-motion` as a launch flag. Verify the reduced-motion
  path *renders what you think it does* rather than trusting the media query by
  inspection.
- **Check your click is on screen.** Headless defaults to a small window; a
  probe that clicks at y=500 in a 469px-tall viewport reports "nothing happened"
  and looks exactly like a broken handler. Compute coordinates from
  `getBoundingClientRect()`, never from assumption.
- **Wait for a *new* node, not for *a* node.** A list that fades out for 110ms
  before it's replaced still matches the old selector the instant after a click,
  so the probe drives the dying node and the run stalls one step behind while
  every assertion still reads plausibly. Tag the current node
  (`el.dataset.stale = "1"`), then wait for one without the tag.
- **"Always visible" is a claim about a scrolled page.** A header carrying
  navigation passes every check at load and silently fails two screens down.
  Assert it from a scrolled state (`getBoundingClientRect().top >= 0 && .bottom
  <= innerHeight` after scrolling), or make it `position: sticky` and prove it
  there.

## Contrast is checkable arithmetic, so check it

`spec/contrast.test.ts` reads the custom properties back out of the CSS the
build emitted and does the WCAG maths on the pairs the stylesheet actually
claims. It exists because `--ink-faint` shipped at 3.01:1 in crit 5 and looked
perfectly fine in a screenshot.

- Read the **built** CSS, not the source. A token that gets renamed, minified
  away or overridden then fails loudly instead of quietly passing.
- Assert the *gap* between two inks, not only each one's floor. Two tokens can
  both clear 4.5:1 and still have collapsed into each other, losing a
  distinction the design depends on.
- **axe cannot judge contrast** without layout and computed colour, so a green
  axe run says nothing about the palette. That's the gap this test fills; don't
  read the build's clean axe pass as covering it.
- **Slop's three accents are not interchangeable across grounds.** On white all
  three carry body text. On the shaded panel (`--at-light-grey`) only
  `--at-tertiary` does — `--at-primary` is 4.39:1 and `--at-secondary` 4.15:1,
  both below AA. On the dark ground none of the three do. The test holds that
  map in place; check it before using an accent for a paragraph rather than
  guessing from how it looks.

## Accessibility

The build runs axe over all 16 pages, so structural problems (landmarks, labels,
heading order, duplicate ids) fail the build rather than needing a test of my
own. What axe can't see is still mine:

- **Check the sensor is actually looking.** A green run and a run that silently
  loaded nothing look identical from the output. When you wire a sensor, assert
  it saw something — a pass count above a floor — so it fails loudly if it ever
  stops seeing the page.
- A control's accessible name has to distinguish it from its siblings. Three
  controls all named "Week" are three identical announcements; append a visually
  hidden qualifier so the name is "Week 3 reading".
- Don't reach for `<output>` as a read-only value display. Its implicit role is
  `status`, so it's a live region and it double-announces every value the
  control it mirrors already reports. A plain `<span>` is correct.
- Every `<h1>` must sit inside a landmark. A full-bleed hero placed between
  `<header>` and `<main>` trips axe's `region` rule — put it inside `<main>`.
- A colour token that's legible on one background is not legible on all of them.
  When a class is used on both a dark hero and the light page, scope the bright
  variant to the hero and make the *dark* value the default.
- A control fixed to the viewport sits on a different ground at each viewport.
  One ink, two grounds: pick it to clear 3:1 (WCAG 1.4.11 — a graphic, not
  text) against both, and hold it there with a test.

## CSS conventions

stylelint is wired back into `check`, so these are enforced, not advisory. It
lints `**/*.css`, and **it cannot see an inline `<style>` block in an `.astro`
file** — so site-wide styling goes in a `.css` file that `PageLayout.astro`
imports, not in a `<style is:global>` block. That's the whole reason the
convention exists: styles the linter can't read are styles nothing checks.

- Don't use the `padding` / `margin` shorthand on a class that shares an element
  with a layout class — `padding: 2.5rem 0 4rem` on `.page` silently reset
  `.wrap`'s horizontal padding to `0`. Use `padding-block` / `padding-inline`.
- **Same trap, different property: don't put `max-inline-size` on an element
  that already carries a centring wrapper.** It centres the narrow column and
  silently breaks the left edge every other section shares. Nest a child
  (`<div class="wrap"><div class="prose">`) instead.
- Declare lower-specificity selectors before higher ones or
  `no-descending-specificity` fails. This bites across *sections* too: a
  `.mechanism .haste-factor` in the prose block still has to precede
  `.channel[data-hasted="true"] .haste-factor` in the components block.
- **stylelint-config-standard rejects BEM.** `selector-class-pattern` is
  kebab-case only, so `week__title` and `week--current` both fail. Use
  `week-title`, and state classes like `.is-current` or a `data-` attribute.
- **Media queries must use range notation** (`media-feature-range-notation:
  context`): `@media (width <= 46rem)`, never `(max-width: 46rem)`.
- **Alpha notation splits by where the value sits.** Inside a colour function it
  must be a percentage (`rgb(0 0 0 / 50%)`); as the `opacity` *property* it must
  be a bare number (`opacity: 0`, not `0%`). `alpha-value-notation` exempts
  `opacity`, so the one rule contradicts itself across the two places and only
  the linter will tell you which is which. A blank line between two declarations
  inside one rule fails `declaration-empty-line-before`.
- **A comment between two declarations fails `comment-empty-line-before`,** and
  adding the blank line it asks for then risks the declaration rule above. Put
  the comment above the whole rule instead of inside it.
- **stylelint forces the `text-decoration` shorthand** when you write the line,
  style, colour and thickness longhands together, but `text-underline-offset`
  and `text-decoration-skip-ink` are not part of the shorthand and stay
  separate. `value-keyword-case` also wants `optimizelegibility`, not the spec's
  camelCase.

## Typography

- **IBM Plex Mono squashes U+00BD (`½`) into a single monospace cell** and it
  renders as an illegible smudge next to a `×`. Write `1/2` — three cells,
  legible, and it matches how source documentation writes it.
- Reserve the mono face for values the page actually computes. Once it's also
  used for eyebrows and labels it stops meaning "this is a measured number".

## TypeScript on this template

`tsconfig.json` extends `astro/tsconfigs/strict`.

- **Flow narrowing does not reach hoisted `function` declarations.**
  `const root = doc.querySelector(…); if (!root) return;` still leaves `root`
  possibly-null inside a `function foo()` declared further down, because the
  compiler can't prove the function isn't called before the guard. Re-bind with
  an explicit annotation (`const root: HTMLElement = found;`) rather than
  reaching for `!`.
- **`@types/node` is installed, so a bare `setInterval` is Node's**, which
  returns a `Timeout`. `window.setInterval` returns a `number`. Type the handle
  `number | null` when you call it through `document.defaultView`.
- `verbatimModuleSyntax` is on, so type-only imports must say `import type`.

## Your process is part of the mark

Process is the **largest criterion** on this assignment (45%), and the checks
can't see any of it — a person reads it directly. Building legibly is part of
building well.

- **Commit as you go.** Small, frequent commits are the record of how the work
  came together, and that record is read, not just the final state. A trail that
  grew alongside the code is the strongest evidence; a single dump the night
  before is the weakest.
- **`PROCESS.md` is 400–600 words and is the written account** — there is no
  separate reflection for an assignment repo, and `reflections/` stays empty
  (`check:evidence` says so explicitly). The week-7 retro crit presents the
  breakthrough from this same file.
- Write it as **one narrative with a spine**: what I decided a good university
  course looks like, which of those decisions I encoded in the harness — as a
  rule in this file or a check in `spec/` — and which I deliberately left out.
  Not a run of fixes with a commit hash apiece.
- **Cite commits as you go** — link text is the abbreviated SHA or a
  `sha...sha` range, target the commit or compare URL. An uncited claim isn't
  evidence, `check:evidence` fails a `PROCESS.md` with no citations, and markers
  follow citations rather than trawling the repo.
- **The `spec/` checks are read as the record of what I decided had to stay
  true about the course.** Write them as claims about the course, not about the
  build.

## This file is yours

This is a starting point, not a fixed rulebook. When a convention has to be
held, a sensor keeps catching me out, or the agent keeps getting a stack fact
wrong — write it down here. Growing this file is the work of harness
engineering, and the gap between the empty file this repo shipped with and this
one is part of what the prototype says about the developer I'm becoming.
