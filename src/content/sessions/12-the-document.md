---
title: If a Stranger Can Implement It, You Designed It
description:
  The design document tested by handing it to somebody else and watching them
  build it — where every question they ask you is a defect you wrote
week: 12
date: 2027-05-10
serves:
  The semester was reading other people's systems off their numbers; the last
  week is writing one that can be read the same way.
object: the design document
capability:
  After this week you can specify a combat system in numbers a stranger could
  implement without asking you a question.
teachers:
  - idris-fenn
  - marisol-quaye
spec:
  - a draft design document, however rough, that somebody else can open
  - your week 11 decision tree, since one enemy script goes in the document
related:
  - 11-the-boss
---

In this session you hand your design document to somebody you didn't write it
with, and you implement theirs. Every question you have to ask them is a defect
in their document. Every question they ask you is a defect in yours.

That's the only honest test of a design document I know, and it's the whole
session. There's no way to talk your way through it, which is the point: for
twelve weeks you've been reading systems written by people who weren't in the
room, off nothing but their numbers. Now somebody does that to you.

## What has to be in it

A document that survives the swap has all of this, in numbers:

- The turn rule. Rounds or counters, what orders them, what happens to a command
  whose target died. Week 1's four questions, answered.
- The damage formula, written out, with every term defined and a stated range
  for every stat that appears in it.
- Every random element, with its distribution and one sentence on which job it
  does — blur a threshold, fatten a tail, delete a turn.
- Every status effect, with the rule it rewrites.
- What a turn costs, in whatever currency you chose.
- At least one enemy script, as a decision tree.
- One worked example: a fight from the first command to the last, with the
  arithmetic shown at every step.

The worked example is the part people skip and the part that catches the most
defects. You can't write one without discovering which of your rules you never
actually decided.

## What a defect looks like

"How much damage does a critical do?" is a defect: the answer exists in your
head and not on the page.

"What happens if two combatants tie on speed?" is a defect, and a common one,
because ties feel like an edge case until somebody has to write the code.

"Should critical hits feel good?" isn't a defect. It's a design conversation,
and you can have it afterwards, at the pub.

## A note on the spreadsheet

Everything you build this week is still a spreadsheet. The promise on the front
page of this site was no programming until week 12 and not much then, and this
is the "not much": if your system needs a real program to evaluate one fight,
it's either more complicated than a semester can justify or you haven't reduced
it yet. Twelve weeks of evidence says a JRPG battle fits in a spreadsheet.

## Task: swap documents and implement

Bring the document and the prototype. Swap with someone, implement their system
for one fight in your own spreadsheet, and keep a log of every question you had
to ask.

Hand the question log back with the implementation. That log is the most useful
feedback anybody gives you this semester, and it's the same artefact the final
assessment is marked on — so the version you get back in week 12 is a rehearsal
for the one a marker writes.
