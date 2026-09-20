---
title: A Boss Is a Puzzle With a Health Bar
description:
  The boss script as a decision tree — state, telegraphs and thresholds, read
  off one Final Fantasy X fight and its two solutions
week: 11
date: 2027-05-03
serves:
  A boss is where every week so far gets pointed at one encounter, and the
  script is the document doing the aiming.
object: the boss script
capability:
  After this week you can write a boss's script as a decision tree and identify
  the intended solution and the unintended one.
teachers:
  - marisol-quaye
spec:
  - your week 10 plot exists and its spike is marked
  - one boss chosen, with a recording long enough to see the pattern twice
related:
  - 10-the-curve
links:
  - label: "Final Fantasy Wiki: Evrae"
    url: https://finalfantasy.fandom.com/wiki/Evrae
  - label: "StrategyWiki: Final Fantasy X, Airship"
    url: https://strategywiki.org/wiki/Final_Fantasy_X/Airship
---

```
if hp <= 10000 and not hasted:  cast Haste
if last_action == Inhale:       Poison Breath
if distance == close:           Claw, Claw, then Inhale
if distance == far:             Photon Spray or Swooping Scythe
if target casts Slow:           counter with Haste
```

That's most of Evrae, the airship boss in Final Fantasy X, as a script. 32,000
HP, halves every element, and one state variable that the player controls:
distance.

## Reading the tree

Cid appears in the turn list like anyone else. Tidus or Rikku can queue a
command telling him to close in or pull back, and that single variable selects
which half of the script runs.

Close, Evrae claws for around 1200 to one character, petrifies, and every third
turn inhales — and the turn after an Inhale it breathes poison for about 1500 to
everybody. Far, it throws Photon Spray for a scatter of small hits, or Swooping
Scythe for 700 to 800 across the party, which drags it back into close range by
itself.

Three things are doing all the work here, and they're the three things in every
boss script worth studying:

- **State** the player can change — distance, and nothing else.
- **A telegraph** — the Inhale, which announces the one attack big enough to
  matter a full turn before it lands.
- **Thresholds** — 10,000 HP, where it hastes itself and the fight speeds up.

## The intended solution and the other one

Intended: watch for the Inhale, pull back, eat the smaller ranged attack
instead, come back in. The fight is teaching you to treat position as a
resource, and it telegraphs loudly enough that a first-time player can learn it
inside one attempt.

Unintended: Wakka's attacks reach at any distance, so a party built around him
can sit at range for most of the fight and never engage the mechanic the
encounter was built to teach. And the Slow counter is a line meant to punish
a debuff that instead advertises it — a boss that reacts to Slow is a boss
telling you Slow is worth casting.

Neither of those is a bug. They're both paths the tree permits and the designer
didn't price. That's what an exploit is: not a broken rule, an unpriced one.

## Write the tree

Take one boss and write its script as a decision tree — state variables at the
top, telegraphs marked, thresholds as branches. Watch the fight at least twice;
one pass gets you the attacks and the second gets you the order.

Mark two paths through your tree. The intended solution is the one the
telegraphs point at. The unintended one is the path that wins without ever
reading a telegraph. Every boss has one; if you can't find it, you haven't
watched long enough.
