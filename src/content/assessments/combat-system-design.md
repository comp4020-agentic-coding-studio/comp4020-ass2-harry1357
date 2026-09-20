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
Design a combat system, specify it so somebody else can build it, and prove it
runs.

## The brief

> Design the combat system for a JRPG that does not exist, and specify it
> tightly enough that a stranger can implement one fight from your document
> without asking you anything.

Scope is deliberately small: one fight, one party of four, one enemy group, one
enemy script. A system that would need a team and a year is not a better answer
than one that fits on ten pages and works. The interesting decisions in this
course have all been small ones.

## What you submit

The document, in numbers: the turn rule, the damage formula with every term
defined and every stat given a range, the random elements with their
distributions and the job each does, the status effects with the rule each
rewrites, what a turn costs, and one enemy script as a decision tree.

The prototype: a spreadsheet that evaluates one complete fight from the first
command to the last.

The worked example: that same fight written out, arithmetic shown at every step.

## How it's marked

By the question test. A marker reads the document, builds the fight, and writes
down every question they had to ask to get there. Each question is a defect.

Not all defects weigh the same. A missing tie-break rule is small. A damage
formula with an undefined term is large, because it stops the implementation
dead. A system that is internally consistent, modest in scope and fully
specified beats an ambitious one with three holes in it, every time.

You will have practised this in week 12's session, on a classmate's document,
with the question log handed back. Nothing in the marking will be a surprise.
