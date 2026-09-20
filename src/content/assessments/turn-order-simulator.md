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

Week 2 built a counter model in a spreadsheet. This is that model, finished
enough that somebody else can run it on a fight you've never seen.

## What you hand in

A spreadsheet or a small program that takes a speed table — a combatant per row,
with agility and the action each is about to take — and outputs the next five
turns in order. Plus one page saying where it breaks.

Haste has to be implemented as a change to the reset rather than a change to the
rate. That single line is most of what this item tests, and a model that gets it
backwards produces plausible output for about a dozen ticks, which is exactly
why it's worth marking.

## How it's marked

Half on correctness. You'll be handed a fight the week before the deadline, with
a speed table and no recording. Your model predicts five turns; we compare
against the recording afterwards.

Half on the page about where it breaks. A model that predicts five turns
correctly and can't say why the sixth is unreliable has learned the arithmetic
and not the system. Naming the assumption that fails — every combatant taking a
rank 3 action, a status landing mid-list, a tie you resolved the wrong way — is
worth as much as the prediction.
