---
title: Turn-order simulator
description:
  A spreadsheet or small program that predicts the next five turns from a speed
  table, marked against a recorded fight it has never seen
week: 2
due: 2027-04-02T17:00:00+10:00
weight: 20
capability:
  After this week you can predict the next five turns from a speed table and say
  exactly where the prediction breaks.
marking:
  mode: weighted
  criteria:
    - name: Correctness against the held-back fight
      weight: 50
    - name: Where you say the prediction breaks
      weight: 50
spec:
  - it takes a speed table as input and outputs the next five turns
  - it runs against a fight it has not been tuned on
  - you have written down where it breaks before anyone tells you
related:
  - sessions/02-the-counter
---

Week 2's counter model, finished to the point where somebody else can run it on
a fight you have never seen.

## What you hand in

A spreadsheet or a small program that takes a speed table — one combatant per
row, with agility and the action each is about to take — and outputs the next
five turns in order.

Plus one page, no longer than that, saying where the prediction breaks.

Haste has to be implemented as a change to the reset rather than to the rate.
That one line is most of what this item tests, and a model that gets it
backwards produces plausible output for about a dozen ticks before it drifts,
which is exactly why it's worth marking rather than eyeballing.

## The capability it tests

Week 2's: predicting the next five turns from a speed table, and saying exactly
where the prediction breaks.

Both halves count. A model that predicts correctly and can't say why the sixth
turn is unreliable has learned the arithmetic and not the system, and the marks
are split evenly to say so.

## Marking bands

**Strong.** Five correct turns on a fight the model has never seen, and a page
that named the failure in advance — the rank 3 assumption, a status landing
mid-list, a tie you resolved the wrong way — with the tick at which it would
first show. Haste halves the reset, and the page says why that isn't the same
as halving the rate.

**Adequate.** The model is right on the fight it was built against and mostly
right on the held-back one, with the page describing the limits in general
terms rather than naming the tick where they bite.

**Weak.** Haste implemented as a rate, or the five turns produced by hand and
typed in rather than computed. A page that says the model is "an approximation"
without saying of what, or one written after the results came back.

## When it's due, and what happens before

The deadline is at the top of this page, in the second half of the teaching
period — late enough that weeks 3 and 4 have made you suspicious of your own
numbers.

You get the held-back fight one week before the deadline: a speed table, no
recording. You submit your five predicted turns with the model. The recording
is released afterwards, which is the only way this item can test prediction
rather than description.

Between now and then, week 2's session is where the model gets built and weeks
3 and 4 are where you find out what else it needs.
