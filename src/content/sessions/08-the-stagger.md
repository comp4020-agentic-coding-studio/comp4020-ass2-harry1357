---
title: A Stagger Bar Is a Second Fight Hidden in the First
description:
  The pressure gauge — why the stagger threshold rather than the multiplier is
  the design, and what moving it by fifty points does to a fight
week: 8
date: 2027-04-12
serves:
  A break gauge is a threshold, and a threshold is the cheapest way to put two
  fights inside one, which makes it the easiest thing here to tune badly.
object: the pressure gauge
capability:
  After this week you can tune a stagger threshold so a fight has a second
  phase, and show the tuning in numbers.
teachers:
  - idris-fenn
spec:
  - your one-page Press Turn rules are written
  - a break system picked, with its numbers findable
related:
  - 07-the-extra-turn
links:
  - label: "Final Fantasy Wiki: Stagger (Final Fantasy XIII)"
    url: "https://finalfantasy.fandom.com/wiki/Stagger_(Final_Fantasy_XIII)"
---

"A stagger bar is a damage multiplier." That's how it usually gets described,
and it's wrong in a way worth being exact about.

Final Fantasy XIII's chain gauge does start at 100% and run to 999.9%, and it
is a straight multiplier: a 1000-damage attack at 250% chain deals 2500. So far
the description holds. But the multiplier isn't where the design lives.

The design is the **stagger point** — a per-enemy threshold, printed next to the
gauge, that you have to push past. An enemy at 300% starts at 100%, so you owe
200 points. Crossing adds a flat 100% bonus, drops the enemy's chain resistance
to zero, and makes it interruptible and launchable. And the gauge decays: fail
to cross fast enough and you're back at 100% with nothing to show.

## Two fights, one health bar

Before the threshold you're playing a race against decay, and the right party is
whatever builds chain fastest. After it you're playing a fixed damage window,
and the right party is whatever converts a multiplier into damage. Those are
different parties, different pacing, different tension — and the enemy's health
bar never moved.

That's the whole trick. Two fights, one encounter, and the only thing separating
them is a number.

## The dials, and what each one costs

- **The threshold.** Raise it and the race lengthens while the window shrinks;
  the fight becomes about setup. Lower it and the race disappears; the fight
  becomes one long window, which is the same thing as having no break system.
- **The decay rate.** This decides whether the race is a race. Slow decay means
  the threshold is a total, not a rate, and a patient party always crosses it.
  Fast decay means the threshold is a sustained output requirement, and the
  fight starts testing whether you can hold a rhythm.
- **The stagger duration.** This decides whether the second fight is a fight or
  a cutscene. Too long and the encounter ends the moment you cross.

Three dials, and they interact: doubling the decay while halving the threshold
leaves the crossing time about the same and changes who can cross it entirely.

## Where it goes wrong

The common failure is tuning the threshold against a player's damage rather than
against the fight's length. Do that and the break system works perfectly for the
party you tested with and becomes either trivial or impossible for anyone who
levelled differently — which is week 10's problem arriving early.

## Workshop: move one threshold

Take a break system, find its threshold and its decay rate, and model the fight
in your week 6 spreadsheet. Then change the threshold by ±50% and report three
numbers for each version: turns to first break, breaks per fight, and total
fight length.

Bring a sentence saying which version you'd ship and what it costs. The
interesting answer is usually not the middle one.
