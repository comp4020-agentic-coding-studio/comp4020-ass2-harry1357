---
title: The Animation Is Not the Attack
description:
  The damage equation — reading a formula's shape off its curve, and why a cubic
  and a quadratic in the same game make two different economies
week: 3
date: 2027-03-08
serves:
  This is the week the costume comes off — the number floating up the screen is
  the output of an equation you can write down.
object: the damage equation
capability:
  After this week you can reverse-engineer a damage formula from ten logged
  hits.
teachers:
  - marisol-quaye
spec:
  - your week 2 counter model runs and roughly agrees with the recording
  - you can plot a column of numbers as a scatter chart
  - you have ten logged hits from the same attacker and target
related:
  - 02-the-counter
links:
  - label: "Bulbapedia: Damage"
    url: https://bulbapedia.bulbagarden.net/wiki/Damage
  - label: "Final Fantasy X Stat Mechanics FAQ (SinirothX, GameFAQs)"
    url: https://gamefaqs.gamespot.com/ps2/197344-final-fantasy-x/faqs/31381
---

## A formula is a shape before it's a number

Damage formulas look intimidating written out and are mostly three parts: a base
term built from the attacker's stat, a reduction built from the defender's, and
a chain of multipliers applied afterwards. What matters is the *shape* of the
first part, because that's what decides whether +10 to a stat is a shrug or a
build.

Pokémon's documented formula starts with

```
base = (((2 × Level / 5 + 2) × Power × Attack / Defence) / 50) + 2
```

and then multiplies: critical hit, a random factor, same-type attack bonus, type
effectiveness, burn, and a queue of other modifiers. Attack sits in a ratio
against Defence, which is linear-ish and forgiving. Doubling your Attack roughly
doubles your damage, and the game stays legible to a twelve-year-old.

Final Fantasy X's physical damage starts somewhere else entirely:

```
damage = ((Strength³ / 32) + 32) × DamageConstant / 16
```

Cubic. Strength 50 to Strength 60 isn't a 20% increase, it's about 73%. This is
why an ability that reads as "+10% Strength" is worth far more than one reading
"+10% damage", and why Strength nodes on the Sphere Grid are the whole
mid-game economy. The design didn't say any of that out loud. The exponent did.

Now put FFX's magic formula next to it — quadratic in the stat rather than
cubic — and you have an explanation for something every player notices and few
can name: spells start strong and quietly fall behind. Two formulas in one game,
two different curves, and the entire late-game feel of the magic users falls out
of the difference between a square and a cube.

## Reading a formula off its data

You will not usually be handed the equation. You get to watch numbers appear.
The method is the same one you'd use on any black box:

1. Hold everything constant except one input.
2. Log the output ten times, so the random factor averages out.
3. Plot input against output and look at the curve, not the values.
4. Guess the shape — linear, quadratic, cubic, capped — and fit it.
5. Predict a value you haven't seen, then go and get it.

Step 5 is the only one that counts. A fit that explains the data you already had
is a description. A fit that predicts the eleventh hit is a model.

## Exercise: log ten hits, fit the formula, predict the eleventh

Pick one attacker and one target in the provided save. Attack ten times, logging
every damage number. Raise the attacker's offensive stat by a known amount, log
ten more. In the spreadsheet, fit a curve, then write down — before you press
the button — what the next hit will be, and how far off you're willing to be.

Bring the predicted number and the actual number. Both of them, including the
times you were badly wrong; a wrong prediction with a stated tolerance is worth
more here than a right one with none.

## Where these numbers came from

Bulbapedia's Damage page is the fully worked Pokémon formula, modifier by
modifier, with the generational differences marked. SinirothX's Stat Mechanics
FAQ on GameFAQs is where the FFX formulas above come from — it's twenty years
old, written by someone who logged a very large number of hits, and it is a
decent model of what this week is asking you to do at small scale.
