---
title: A Round Is a Decision the Game Made For You
description:
  The round as a container — what a battle loop has to decide before it can ask
  you anything, and how Pokémon and Dragon Quest answer it differently
week: 1
date: 2027-02-22
serves:
  Before you can read a single number, you have to know when the game stops and
  asks you something.
object: the round
capability:
  After this week you can diagram who acts, in what order, in a round-based
  battle, and name what the game had to decide to make that happen.
teachers:
  - marisol-quaye
spec:
  - you have a spreadsheet open and can enter a formula into it
  - you have watched the recorded fight all the way through once
  - you can name one battle system you find annoying, and why
links:
  - label: "Bulbapedia: Priority"
    url: https://bulbapedia.bulbagarden.net/wiki/Priority
  - label: "Dragon Quest Wiki: Agility"
    url: https://dragonquest-wiki.com/Agility
---

## What a round actually is

A round is a container. Somewhere there's a loop that collects intentions,
puts them in an order, resolves them one at a time, checks whether anyone died,
and starts again. Everything you think of as the battle system is a set of
answers to the questions that loop has to ask.

There are four, and a round-based game answers all of them whether or not
anybody wrote the answers down:

1. When are commands collected — all at the top of the round, or one at a time
   as each combatant's turn arrives?
2. What orders the round?
3. What happens to a command whose target died before it resolved?
4. What resets between rounds, and what carries over?

## Two games, four answers

Pokémon collects every command at the top of the round and then sorts. The sort
has two levels. First a priority bracket: documented values run from +5 down to
−7, and nearly every move sits at 0. Then the Speed stat inside the bracket.
Then, if Speed ties, a coin flip, re-rolled every turn. Quick Attack at +1 beats
a faster Pokémon's Tackle at 0 every single time, which means speed is a problem
you can answer with move choice instead of stats. That's a design decision with
teeth.

Dragon Quest collects commands at the top too, then rolls. From VIII onward the
order comes from `(Agility + 20) × (N / 100)` with N random between 50 and 100,
sorted high to low. So your effective agility is a band, not a number. A
character with twice the Agility of another will usually go first and sometimes
won't, and you can't make that never happen. Same container, one different
answer to question two, and the two games feel nothing alike: a Dragon Quest
round is a bet, a Pokémon round is a calculation.

Final Fantasy X doesn't have rounds at all. That's next week.

## What the answers cost

None of those choices is free. Collecting commands at the top means the game has
to decide what a command does when its target is already gone — Pokémon
retargets or fizzles depending on the move, and that rule is doing real work in
a double battle. Collecting them one at a time means players see the state
change before they choose, which is more information and slower play. Rolling
the order means a boss can act at the end of one round and the start of the
next, which reads as the game cheating and isn't.

Neither answer is better. They're priced differently, and this course is about
reading the price.

## Activity: rebuild a fight as a turn table

You'll get a recorded battle, about ninety seconds. Reconstruct it as a table:
one row per action, with the actor, the command, the target and the round it
landed in. Then mark every row where the order surprised you, and for each one
name which of the four questions explains it.

Bring the table. We'll put several reconstructions of the same fight side by
side, and the rows people disagree about are the ones worth the hour.

## Before next week

Bulbapedia's Priority page has the bracket values and the tie rule. The Dragon
Quest Wiki's Agility page has the turn-order formulas by era, including the
older ones — worth a look, because the shape of the randomness changed twice and
the games changed with it.
