---
title: Every Turn Has a Price Tag
description:
  The cost of a turn, worked through a PP budget — why the price of an action
  shows up two fights later, and where a boss gets solved by spending
week: 6
date: 2027-03-29
serves:
  Reading the numbers is half of it; the other half is what each one costs to
  produce, and the answer is always turns.
object: the cost of a turn
capability:
  After this week you can model a fight as a budget and find where it's solved
  by spending.
teachers:
  - idris-fenn
spec:
  - week 5's twelve effects are sorted, misfit included
  - one boss fight chosen, with a recording or a save you can replay
related:
  - 05-the-status
links:
  - label: "Bulbapedia: PP"
    url: https://bulbapedia.bulbagarden.net/wiki/PP
---

A Pokémon move carries a PP value between 1 and 40, and using it costs exactly
1. Most attacking moves sit between 5 and 15. So a Pokémon with moves at 10, 15,
15 and 35 PP can act 75 times before it drops to Struggle, which hurts it.

That's the budget. Now price a turn against it.

A battle won in six turns spends 6 of 75 — nothing. A battle won in thirty
spends 40%, and the next three battles are constrained by a decision you made in
this one, in a currency the fight you were in never mentioned. The cost of a
turn isn't visible in the turn. It arrives two fights later, as a choice you no
longer get to make.

Every turn economy in the genre has that shape. What varies is the currency and
how visible it is.

## Three currencies, three failure modes

**MP** is the classic, and it usually breaks the same way: pools are tight for
the first ten hours and enormous for the last twenty. The spell that was a
decision becomes a default. Nothing changed about the spell.

**Items** are a turn spent not attacking, which is the honest price, and most
games undercharge for them. Final Fantasy X is unusual in charging explicitly:
an item is a rank 2 action and an attack is rank 3, so drinking a Potion costs
you less counter than swinging does. Week 2's formula already priced that, and
it's why item use in FFX is a real tactic and item use in most of the genre is
a tax.

**Turns themselves** are the third currency, and the systems that treat them as
one are week 7.

## Where a fight gets solved by spending

There's a point in most long fights where the outcome stops depending on your
choices and starts depending on whether you brought enough. Find it and you've
found the designer's intent, whether or not they meant it.

If that point is turn three, the fight is a resource check wearing a boss
costume — it tested your shopping. If it's turn thirty and only on a bad run,
the budget is doing what a budget should: constraining without deciding. If
there's no such point at all, the fight has no attrition in it, and every turn
is independent, which is a different and perfectly good design as long as you
know you chose it.

## Build the budget

Model one boss fight as a spreadsheet. Columns for each resource you hold —
MP, items, PP, HP, whatever the game uses — and a row per turn. Damage out on
the right. Run it to the end of the fight.

Then find the turn where the outcome was decided by the budget rather than by a
choice, and mark it. Write two sentences: what you'd change to move that turn
later, and what that change would cost somewhere else. Something always pays.
