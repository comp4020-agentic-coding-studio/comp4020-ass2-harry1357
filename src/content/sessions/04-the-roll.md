---
title: Most Randomness Is There to Be Removed
description:
  The roll — variance, critical hits and hit chance, and how to tell a random
  element that is doing work from one that is only adding noise
week: 4
date: 2027-03-15
serves:
  Once the formula is written down, the rolls around it stop being atmosphere
  and become a design choice you can price.
object: the roll
capability:
  After this week you can say which random elements a fight needs, which it
  should remove, and defend it with expected values.
teachers:
  - idris-fenn
spec:
  - your week 3 fit predicts a hit you had not logged, within a stated tolerance
  - you can compute a weighted average in a spreadsheet
  - you have picked one boss fight to work on
related:
  - 03-the-formula
links:
  - label: "Bulbapedia: Critical hit"
    url: https://bulbapedia.bulbagarden.net/wiki/Critical_hit
---

## Three rolls that do different jobs

**Damage variance.** Pokémon multiplies final damage by a uniformly random
integer from 85 to 100, floor-divided by 100. Sixteen outcomes, 6.25% each,
expected multiplier 0.925. It spans about 15% and it decides almost nothing on
its own — but it's what makes a two-hit knockout sometimes take three, which is
what makes the difference between a 99% and a 105% damage roll worth planning
around. This roll exists to make thresholds fuzzy.

**Critical hits.** From Generation VI a crit multiplies by 1.5, and from
Generation VII the base rate is 1/24. So the expected contribution is
`1 + (1/24 × 0.5) = 1.021` — about two percent. Two percent. If crits were there
to raise damage, they'd be indefensible; you could delete them and re-balance
with a 2% bump nobody would feel. They're there for the tail, and the tail is
the point: the fight you nearly lost and didn't.

**Hit chance.** A miss doesn't scale damage, it deletes a turn. In a system
where turns are the currency — and after week 2 you know exactly what a turn
costs — a 90% accurate move is a 10% chance of paying full price for nothing.
That's a much heavier tax than the number looks, and it's why accuracy-lowering
effects feel worse than damage-raising ones of the same size.

Three rolls, three jobs: blur a threshold, fatten a tail, destroy a turn. When
you're asked whether a fight needs its randomness, that's the question — which
job, and does the fight want it done?

## Expected value is the honest way to argue

Arguments about randomness go nowhere on vibes. Expected value at least makes
people disagree about something specific.

Take a move that does 100 damage with a 1/24 crit at 1.5×. Expected damage is
102.1. Now give the same move a flat 102 and no crit. Same average, different
game: the first one occasionally ends a fight a turn early, the second never
does. If you can't say which you want and why, you haven't finished designing
the fight.

The same arithmetic tells you when a roll is pure noise. If removing a random
element changes the expected value by under a percent *and* doesn't change the
shape of the distribution anywhere that matters, it isn't doing a job. Cut it.
Most JRPG randomness is like this, inherited from tabletop where the dice were
doing a job the computer now does invisibly.

## Task: price one boss's crit chance

Pick a boss from the provided saves. Using your week 3 formula, compute the
expected damage per turn of its main attack with its crit chance, and again
with crits removed and the average held constant. Then compute the chance it
kills a full-health party member in one turn, under both.

Write one paragraph: does this fight need its crits? Defend it with the two
numbers, and name what you'd have to change elsewhere to remove them. There's no
right answer here and there are several wrong ones, all of which start with "it
feels better".

## One page worth reading

Bulbapedia's Critical hit page has the rates and multipliers by generation,
which is more interesting than it sounds — the multiplier dropped from 2× to
1.5× and the base rate from 1/16 to 1/24 within a few years, and both changes
are the designers deciding the tail was too fat.
