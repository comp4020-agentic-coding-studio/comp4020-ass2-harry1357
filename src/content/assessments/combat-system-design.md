---
title: Combat system design
description:
  A combat system specified in numbers plus a spreadsheet prototype, marked by
  whether a stranger can implement it without asking you a question
week: 12
due: 2027-05-28T17:00:00+10:00
weight: 40
capability:
  After this week you can specify a combat system in numbers a stranger could
  implement without asking you a question.
marking:
  mode: holistic
  description:
    Judged as one artefact against a single question — could a competent
    stranger implement this fight from the document alone? Every question they
    would have to ask is a defect, and the count and severity of those defects
    is the mark.
spec:
  - a design document specifying the system entirely in numbers
  - a spreadsheet prototype that evaluates one complete fight
  - one worked example fight, with the arithmetic shown at every step
related:
  - sessions/12-the-document
---

The semester's last piece, and the one the other three were rehearsals for.

## The brief

> Design the combat system for a JRPG that does not exist, and specify it
> tightly enough that a stranger can implement one fight from your document
> without asking you anything.

Scope is deliberately small: one fight, one party of four, one enemy group, one
enemy script. A system that would need a team and a year is not a better answer
than one that fits on ten pages and works. Every interesting decision in this
course has been a small one.

## What you hand in

**The document,** in numbers. The turn rule, answering week 1's four questions.
The damage formula, every term defined and every stat given a range. Each random
element with its distribution and the job it does — blur a threshold, fatten a
tail, delete a turn. Each status effect with the rule it rewrites. What a turn
costs, in whatever currency you chose. One enemy script as a decision tree.

**The prototype.** A spreadsheet that evaluates one complete fight, first
command to last.

**The worked example.** That same fight written out, with the arithmetic shown
at every step. This is the part people skip and the part that catches the most
defects: you cannot write one without discovering which rules you never actually
decided.

## The capability it tests

Week 12's: specifying a combat system in numbers a stranger could implement
without asking you a question.

Week 12's session is the rehearsal. You hand your draft to a classmate, they
implement it, and they hand back a log of every question they had to ask. That
log is the same instrument the marker uses, which is why nothing here should be
a surprise.

## Marking bands

The whole mark hangs on one question: could a competent stranger implement this
fight from the document alone? Each question they would have to ask is a defect,
and defects are weighted by what they stop.

**Strong.** A stranger implemented it without asking a question. The numbers are
all there, the worked example matches what the prototype computes, and the scope
is small enough to be finished. A tight system fully specified beats an
ambitious one with holes, every time — this course's whole position is that the
numbers are the design, and a document that holds is the proof.

**Adequate.** A stranger got there after a handful of questions, and the
questions were about edge cases rather than about the core — a tie-break that
isn't stated, a status whose duration is implied. The formula is defined, the
prototype runs, the worked example has a step it skips.

**Weak.** The numbers are missing and the prose is doing the work. Damage is
"scaled by Strength" rather than given as a formula; a status "makes enemies
more dangerous"; the crit chance "feels right". A stranger can read the whole
thing, understand what you intended, and be unable to implement a single turn of
it. Prose describing a system is not a specification of one, and this band is
where that distinction gets its teeth.

## When it's due, and what happens before

The deadline is at the top of this page, on the last day of the teaching period.

A draft goes to your week 12 partner in the session, and their question log
comes back to you the same afternoon. The gap between that session and the
deadline is deliberately short: the log tells you what to fix, and fixing it is
mostly writing down numbers you already chose.

There's no submission after that and no viva. The document either survives
somebody else building from it or it doesn't.
