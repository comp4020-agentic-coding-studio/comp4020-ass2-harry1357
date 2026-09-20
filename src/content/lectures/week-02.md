---
title: Counters, ticks and the cost of an action
description:
  The second and last lecture — Final Fantasy X's counter model worked through
  on the board, because it's the one piece of arithmetic worth doing together
week: 2
date: 2027-03-01
slides: /decks/week-02/
teachers:
  - idris-fenn
related:
  - sessions/02-the-counter
  - assessments/turn-order-simulator
---

The course's other lecture, and the only one that does arithmetic on the board.

Final Fantasy X's initiative counter is the clearest system in the genre for
this, because its three inputs are documented and its output is printed on the
HUD, so a model can be checked rather than believed. We build it here and you
finish it in the session.

## On the board

- Two ways to be fast: a bar that fills, against a counter that resets.
- `counter = tickSpeed × rank × hasteMultiplier`, one term at a time.
- Why the rank table makes Defend a real move.
- Haste, and what "halves the reset" does that "halves the rate" doesn't.
- Reading the game's own five-turn prediction, and finding its assumption.

[Open the slides](/decks/week-02/) for the same material in the order it's
delivered.

After this the lectures stop. Weeks 3 to 12 are sessions, on the grounds that
watching somebody else model a system is the second-best way to learn it.
