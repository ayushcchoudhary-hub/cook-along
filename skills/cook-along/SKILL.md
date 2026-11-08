---
name: cook-along
description: Turn a recipe into a planned, picture-first cook-along page for the phone. Use when someone wants to cook something now or tonight - "you decide", "what should I make", "how do I cook this", a recipe link, PDF, video transcript or a dish agreed in chat. Plans the order, parallel work, rings and oven, rest and prep time, then builds one HTML page with animated steps, timers and a live "now" board.
---

# Cook-along

You turn a recipe into a **plan**, then into a **page**. The plan is the hard part. The page is built by a fixed renderer, so you never write canvas or HTML.

```
recipe (chat, link, PDF, transcript)
  → plan.json            you write this (references/plan-schema.md)
  → scripts/plan.py      schedules it backwards from eating time and checks it
  → scripts/build.py     one self-contained index.html
  → scripts/check.py     pictures of every step, phone and desktop screenshots
```

## When to use it

- The person asks what to cook, or says "you decide". Pick a dish, say why in one line, and then plan it.
- They give a recipe (link, PDF, pasted text, video transcript) and want to cook it.
- They agreed a dish in chat and now say "ok, how do I make this", or "I want to eat at 8".

Do not use it for a recipe question with a short answer ("can I freeze this?"). Answer that in chat.

## Workflow

### 1. Get the recipe
- Link: fetch it. Video: use the transcript. PDF: read it. Chat: use what was agreed.
- Keep the source URL and name for `sources`. Never copy the source's text. Rewrite every step in your own short words.

### 2. Ask at most 5 questions, only if the answer changes the plan
Good questions: when do you want to eat, how many people, fan or conventional oven, how many rings (default 4), do you have a probe thermometer. If the person is not there, assume: eat in 90 minutes or at 19:30, serves 2, fan oven, 4 rings, one oven. Say what you assumed.

### 3. Plan it (read references/planning.md first)
Work like a head chef with one pair of hands:
1. **List every ingredient with its amount**, and every tool. Mark amounts you made up as `"label": "suggested"`.
2. **Write the steps as a ledger.** Each step says what it `needs` (and which step made it) and what it `produces`. If a step needs "warm milk", some step must warm the milk. This is how you catch missing steps.
3. **Mark hands and resources.** `hands: active` means the cook is busy. `passive` means waiting (roasting, simmering, resting). Resources: `hob`, `oven@180fan`, and named tools (`frying pan`, `kettle`, `colander`).
4. **Give every step a duration range, a done cue, and a hold time if its result keeps.** Prep that can be done early gets `"ahead": true` and a hold.
5. **Add checks where the clock cannot decide**: tenderness, browning, a probe temperature. Each check has a fallback ("+5 min").
6. **Safety**: follow references/safety.json (UK FSA). Never plan below it. If the source goes below it, change the step and say so in `changes`.

### 4. Run the scheduler until it is clean
```
python3 scripts/plan.py plan.json --eat 19:30
```
It prints the timed plan, rings, the busiest 15 minutes and every problem. Fix every `ERROR`. Read every `WARN` and fix it, or be sure it is fine. Typical fixes: add a missing step, add a hold, mark prep `ahead`, split a step into its hands-on part and its waiting part.

Then read the printed order **as the cook**. Ask: is anything on the heat before I am ready for it? Does anything sit and go cold? Do I need a tool that is still dirty? Is the busiest stretch near the end? Fix and run again.

### 5. Choose pictures (references/scene-rules.md)
Every step gets one picture. Use a generic `kind` (tray, pan, pot, chop, board, bowl, oven, wait, probe, plate, flatlay) with the right `part`s. The facts go in the picture: amounts on tags, temperatures on the card. Text stays to one line plus chips.

If the checker says a food has no drawing, look it up: find what it looks like (an image if your tools show you one, or a written description and the colour table), then give it a shape and two colours in the plan's `parts`. Do this for every main ingredient. The details are in references/scene-rules.md.

### 6. Show the person the plan before you build
In chat: the start time, the order in one short list, and the `changes` you made to the source. Ask only if a change is a real judgement call. If they are not there, build.

### 7. Build, then look at it
```
python3 scripts/build.py plan.json -o index.html
python3 scripts/check.py index.html
```
Open `check/sheet.png`. Every picture must match its step: the right food, the right state (raw or cooked, whole or cut), amounts that match the chips, no clipped labels. Fix the plan and rebuild until it is right. A step that shows a plain paper card means the picture fell back. That is safe, but use a better kind or part if one fits.

### 8. Deliver
Publish or send `index.html`. Say in one or two lines what changed from the source and when to start.

## Rules that matter most

- **Label every item in a picture, or none.** Never label one thing and leave the rest.
- **The amount appears at the first step that touches the food.**
- **One line per step.** The picture, the chips and the timer carry the rest. Longer detail goes in `full` (closed by default).
- **Metric and UK words**: g, ml, °C, hob, frying pan, courgette. Every oven step shows conventional and fan.
- **Faces only on whole food at rest.** Never on food being cut, mashed or eaten.
- **Be honest about sources.** Name them. Say what you changed and why.
- **Home recipe**: the page says it is not professionally tested and that the checks decide, not the clock.

## Files

- `references/plan-schema.md`: every field of plan.json.
- `references/planning.md`: how to plan a meal, with the common mistakes.
- `references/scene-rules.md`: the picture kinds, their options and the parts list.
- `references/safety.json`: UK food safety rules the checker uses.
- `examples/`: three finished plans (salmon traybake, lamb dinner, burgers) with their pages.
