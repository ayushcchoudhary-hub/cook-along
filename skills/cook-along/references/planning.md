# Planning a meal

A recipe is written one dish at a time. A cook works on several at once, with one pair of hands, a few rings and one oven. Your job is to turn the first into the second.

## The method

1. **Work backwards from eating time.** What must be hot at the table? What can wait, and for how long? The scheduler places every step as late as it can, then slides steps earlier when the hands or a tool are busy.
2. **Split long steps into the hands-on part and the waiting part.** "Roast 25 minutes" is 2 active minutes to get the tray in, then 23 passive. "Simmer the potatoes" is passive. "Cook the patties" is active: you turn them.
3. **Fill the waits.** Prep that keeps (`ahead` with a `hold`) moves into the long waits: peel potatoes while the lamb roasts, mix the dressing while the tray heats.
4. **Keep the last 20 minutes calm.** Nothing should be peeled or chopped then. If the scheduler warns about the end, move prep earlier.
5. **One thing finishes last.** Usually the thing that holds least well: green veg, fish, buns, a pan sauce. Everything else must keep until then: mash with a lid, meat resting under foil.
6. **Say how to know it is done.** The clock is a guess. Give a done cue for every step, and a `check` with a fallback where it matters.

## The ledger: catching missing steps

Write each step's `needs` and `produces`. Then read down the list:
- "Warm milk" needed, but no step warms milk? Add one. Use a pan that is already dirty or already hot.
- The rested meat's juices make the sauce? The sauce comes after the meat leaves the tray.
- Beans need boiling water? Boil the kettle when the sauce starts, so it is ready.
- A tool used twice (one frying pan for onions, then patties, then buns)? The steps must run in turn, and the plan must say "keep the pan".

## Common mistakes to look for

| Mistake | Fix |
|---|---|
| An ingredient appears first in a late step with no amount. | Show the amount at the first step that touches it. |
| Buns or toast made first, eaten cold. | Do them last, while the meat rests. |
| A part finishes 20 minutes early and goes cold. | Rewarm it (onions on the cheese under the lid), give it a hold with "how", or start it later. |
| The oven needs two temperatures at once. | Change the order, or cook one item first and keep it warm. |
| Three pans and two rings at the end. | Use a pan that is free (the frying pan for the sauce), or move one dish earlier with a hold. |
| A step says "season to taste" with no salt in the shopping list. | Add salt and pepper to the ingredients. |
| "Cook until done". | Say what done looks, feels or measures like. |
| Source temperature below UK guidance. | Use the guidance. Explain it in `changes`. |

## Batches and shared tools

One steamer, one frying pan, one tray: cook in batches, one after another.
- Give each batch its own steps: load (active), cook (passive), lift out (active). List the shared tool in every step's `resource`, so two batches never overlap.
- Put the `hold` on the lift-out step: how long that batch keeps warm, and how ("covered, in a low oven").
- Put the safety `check` on the first batch. Later batches repeat the same timing.
- Keep food warm at 63°C or above, for 2 hours at most. A low oven (about 80°C fan) under foil works.

## Writing `hold.how`

Write a short place or state: "in the fridge", "under foil", "lid on, off the heat", "on the lowest heat". The page shows it as "Keeps 20 min (lid on, off the heat)". If `how` mentions heat or a lid, the ring or pan stays booked while the food keeps.

## Time ranges and checks

- Use `{"min", "typ", "max"}` for anything that varies: browning, simmering, resting.
- A `check` has a `fallback` in minutes. If the cook taps "Not yet", the page shifts dinner by that much and tells them what not to start.
- A passive step with a range (resting 20–30 min) can absorb small delays, so its predecessor does not need a hold.

## Kitchen defaults

4 rings, 1 oven, fan. Change `kitchen` if the person says otherwise. Fan is 20°C lower than conventional.

## Food safety (UK)

Use `references/safety.json`. In short:
- Mince, burgers, sausages, poultry, pork, rolled joints: 75°C for 30 seconds or 70°C for 2 minutes at the centre. Use a probe check.
- Whole cuts of beef and lamb: to preference once all the outside is cooked.
- Fish: until opaque and it flakes.
- Leftovers: in the fridge within 2 hours, eat within 2 days, reheat once until steaming hot.
- Rice: serve hot. Cool leftovers within 1 hour, eat within 1 day.
- Food kept warm: 63°C or above, eaten within 2 hours.
- Raw batter or dough: do not taste it.

The checker fails a plan that cooks mince, poultry or pork without a probe check on it.

The page adds the matching safety notes and the FSA link by itself.
