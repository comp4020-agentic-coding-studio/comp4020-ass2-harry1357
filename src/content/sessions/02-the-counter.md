---
title: Speed Is a Reset, Not a Rate
description:
  The initiative counter — why Final Fantasy X's Agility doesn't make anybody
  faster, and what that buys a designer that an ATB gauge can't
week: 2
date: 2027-03-01
object: the initiative counter
capability:
  After this week you can predict the next five turns from a speed table and say
  exactly where the prediction breaks.
teachers:
  - idris-fenn
spec:
  - week 1's turn table is finished, even if parts of it are guesses
  - your spreadsheet can do a lookup and a floor
  - you can say, in one sentence, what surprised you about turn order last week
related:
  - 01-the-round
links:
  - label: "Final Fantasy Wiki: Final Fantasy X battle system"
    url: https://finalfantasy.fandom.com/wiki/Final_Fantasy_X_battle_system
  - label: "Final Fantasy Wiki: Rank (Final Fantasy X)"
    url: "https://finalfantasy.fandom.com/wiki/Rank_(Final_Fantasy_X)"
---

Serves the claim: this is the clearest case in the course of a number doing
something other than what its name says it does.

## Two ways to be fast

Final Fantasy IV shipped the Active Time Battle gauge: a bar that fills
continuously, and when it's full you act. The model that hands you is a rate.
Faster characters fill faster. Speed is throughput.

Final Fantasy X threw that out. Every combatant carries a counter. All counters
tick down at the same rate, for everyone. When yours reaches zero you act, and
then it's set back up to a new value. Agility doesn't change how fast your
counter falls. It changes how big the number is when it gets reset.

Say it again, because it's the week: in FFX, Agility doesn't make you faster. It
makes your next turn arrive sooner by making the gap smaller. Same clock for
everybody.

## The arithmetic

Three things set the reset value.

- **Tick speed**, derived from Agility through a lookup table. Higher Agility,
  smaller tick speed.
- **Rank**, a property of the action you just took. Ranks run 1 to 8. Attack and
  most abilities are rank 3, using an item or defending is rank 2, and changing
  equipment or running is rank 1.
- **Haste or Slow**, which halve or double the result.

```
counter = tickSpeed × rank × hasteMultiplier
```

Everything interesting falls out of that shape. A rank 1 action costs a third of
a rank 3 action, so a character can take three cheap turns in the time another
takes one expensive one — which is why Defend and item use are real tactical
choices in FFX and filler almost everywhere else. Rounding is downward at each
step, so at very high Agility with Haste, two rank 1 actions can cost fewer
ticks than one rank 2. That's the arithmetic, not a bug.

Haste is the part people get wrong. Casting it halves the target's current
counter immediately, then halves every reset afterwards. Dispelling it doesn't
put the current counter back — that one keeps descending to whatever it was set
to. So Haste is worth most cast early, and its value is measured in resets
avoided, not speed gained.

## Where the prediction breaks

Given everyone's tick speed and everyone's rank, you can write down the next
five turns before they happen. FFX shows you the same list on the HUD, which
makes this the rare system where you can check your model against the game's.

The list is a prediction, and it assumes every combatant will use a rank 3
action. Anyone who defends, uses an item, gets hasted or gets slowed invalidates
it from that point on. Ties break in a fixed character order rather than by a
roll — party first, Cid last — so even a tie is predictable. A system that asks
you to plan five turns ahead can't then flip a coin.

## Activity: build the counter

In a spreadsheet: one row per combatant, one column per tick. Implement
`counter = tickSpeed × rank × hasteMultiplier`, applying the reset when a
counter hits zero. Feed it the Agility values from the recorded fight, step it
forward, and compare your turn order against the one on screen.

Then cast Haste in your model — once at tick 0, once at tick 40 — and look at
what changes. If you've implemented it as a change to the rate instead of the
reset, your model drifts slowly and stays plausible for about a dozen ticks.
That's the failure worth meeting in a spreadsheet rather than in a fight.

## Reading

The Final Fantasy Wiki's FFX battle system page has the counter model; its Rank
page has the table of action ranks. Read them for the numbers.
