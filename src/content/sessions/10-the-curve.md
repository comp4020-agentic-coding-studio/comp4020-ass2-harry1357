---
title: The Grind Is a Curve Someone Drew
description:
  The level curve against the encounter table — six experience groups, the ratio
  that defines grind, and the level where fights-per-level doubles
week: 10
date: 2027-04-26
serves:
  Difficulty in a JRPG is mostly a question of when you fight something, and
  when is set by two curves the game never shows you.
object: the level curve against the encounter table
capability:
  After this week you can plot an experience curve against an encounter table
  and find where the grind starts.
teachers:
  - idris-fenn
spec:
  - your week 9 party is defined in four sentences
  - a game chosen whose experience table and encounter yields are published
related:
  - 09-the-role
links:
  - label: "Bulbapedia: Experience"
    url: https://bulbapedia.bulbagarden.net/wiki/Experience
---

Six numbers. Each is the total experience a Pokémon needs to reach level 100,
depending on which of the six growth groups its species was assigned.

| Growth group | Experience to level 100 |
| ------------ | ----------------------- |
| Erratic      | 600,000                 |
| Fast         | 800,000                 |
| Medium Fast  | 1,000,000               |
| Medium Slow  | 1,059,860               |
| Slow         | 1,250,000               |
| Fluctuating  | 1,640,000               |

The extremes differ by a factor of 2.7. Every species sits in exactly one group.
Nothing in the game tells you which, and two Pokémon levelling side by side in
the same party will drift apart for a reason that is never shown to the player.

## The curve is half of it

An experience curve on its own says nothing about grind. What produces grind is
the curve divided by what the world pays you:

```
fights per level = (experience to next level) / (experience per fight available here)
```

Both terms move. The numerator climbs — cubic, for four of those six groups.
The denominator climbs too, as the encounter table in each new region pays more.
Grind is what happens when the numerator pulls ahead: the world stopped getting
richer as fast as you got expensive.

Plot that ratio against level and you don't get a slope, you get a sawtooth. It
spikes at the end of each region and drops when you reach the next one. The
spikes are where players go and fight the same enemies twenty times, and the
height of each spike is a design decision somebody made — usually by accident,
by placing a region boundary one level too late.

## Two ways a designer moves it

They can change the curve, or they can change the table. Changing the curve
moves every spike at once, which is why it's rarely the right tool. Changing the
encounter table moves one spike, which is why almost every fix ships as a
revised enemy list.

The Generation III additions are worth a look here: Erratic and Fluctuating are
piecewise — the equation changes partway up. That's a designer saying "the shape
should be different after this level", in the most direct form available. Four
smooth cubics and two functions with joints in them, in one game.

## Exercise: the curve against the table

Pick a game with published experience tables and encounter yields. Plot
fights-per-level against level, using the best enemy available at each point.
Find the level where fights-per-level doubles against the level before it.

Then answer one question in writing: is that spike a wall or a pause? A wall is
a spike that the next region immediately relieves, so the player grinds for
twenty minutes and moves on. A pause is a spike the game expects you to solve
some other way — with the party from week 9, or the break system from week 8.
Games that don't know which one they built ship both and call it difficulty.
