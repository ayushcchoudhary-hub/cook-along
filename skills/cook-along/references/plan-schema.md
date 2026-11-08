# plan.json

One JSON file per meal. `scripts/plan.py` adds a `_computed` block. Do not write `_computed` yourself.
See `examples/salmon-traybake/plan.json` for a short, complete plan.

## Top level

| Field | Type | Notes |
|---|---|---|
| `schema` | 1 | |
| `title` | string | The meal, plainly. "Salmon, potato and asparagus traybake". |
| `slug` | string | Lowercase with dashes. Used to keep each page's saved state apart. |
| `serves` | number or string | `2`, or `"2–3"`. |
| `summary` | string | One or two sentences on how the meal is organised. |
| `eat_at` | "HH:MM" | Default eating time. The cook can change it on the page. |
| `kitchen` | object | `{"hobs": 4, "ovens": 1, "oven_type": "fan"}`. `oven_type` is `fan` or `conv`. |
| `dishes` | list | `[{"id": "salmon", "name": "Salmon"}]`. Up to 6. Each gets a colour, a lane on the timeline and a row on the "now" board. |
| `ingredients` | list | See below. |
| `equipment` | list of strings | Every tool the cook needs to find. |
| `steps` | list | See below. Any order. The scheduler sets the times. |
| `sources` | list | `[{"name", "url"?, "use"?}]`. Name every source honestly. `use` says what you took from it. |
| `changes` | list | `[{"what", "why"}]`. Every change from the source: added steps, new order, new amounts, safety fixes, unit changes. |

### ingredients[]

```json
{"key": "baby potatoes", "dish": "pot", "item": "baby potatoes", "qty": "500 g", "label": "suggested", "note": "optional extra"}
```
- `key` matches `needs[].item` in the steps. The checker uses it to find where the food is first touched.
- `label`: leave it out when the amount comes from the source. `"suggested"` when you chose it.

## steps[]

```json
{
 "id": "S4", "dish": "salmon",
 "title": "Roast until the salmon flakes",
 "line": "Press the thickest part with a fork. It should be opaque and flake.",
 "chips": ["12–18 min"],
 "scene": {"kind": "tray", "oven": true, "have": [...], "tags": ["Opaque", "Flakes easily"]},
 "needs": [{"item": "coated salmon", "state": "coated", "from": "S2"}],
 "produces": ["cooked salmon"],
 "resource": ["oven@180fan", "tray"],
 "hands": "passive",
 "duration": {"min": 12, "typ": 15, "max": 18},
 "after": ["S3"],
 "hold": {"max": 0},
 "check": {"cue": "...", "fallback": 3, "pass": "Flakes", "fail": "Still glassy"},
 "ahead": false,
 "optional": false,
 "done": "Salmon opaque and flaking.",
 "full": ["Longer detail, closed by default."]
}
```

| Field | Notes |
|---|---|
| `id` | Short and unique. A letter per dish helps: `S4`, `P2`. |
| `dish` | A `dishes[].id`. |
| `also` | Other dish ids this step carries, when dishes cook together (salmon and potatoes on one tray). The step then shows in each dish's lane and "now" row. |
| `title` | An instruction, under about 45 characters. |
| `line` | One or two short sentences. No amounts that are already on chips. |
| `chips` | Short facts: amounts, temperatures, times. Write oven temperatures as `"200°C conventional"` and `"180°C fan"`: the page dims the one the cook does not use. |
| `scene` | The picture. See scene-rules.md. |
| `needs` | What the step uses. `{item, qty}` for food taken from the shopping list, `{item, state, from}` for food another step made. Without `from`, a `state` means "someone must make this": the checker fails if no step does, unless you add `"bought": true`. |
| `produces` | Names of what it makes. For the reader and for you. |
| `resource` | `hob` (one ring each time it is listed), `oven@<temp><fan|conv>` (the oven at one setting), and tool names. Two steps cannot use the same tool at the same time. The oven cannot be at two settings at once. |
| `hands` | `active`: the cook is busy. `passive`: the food is cooking, resting or heating on its own. Two active steps never overlap. |
| `duration` | Minutes: `{"min", "typ", "max"}` or a number. The plan uses `typ`. |
| `after` | Step ids that must finish first. |
| `hold` | How long the result keeps before the next step: `{"max": 30, "how": "in the fridge"}`. `{"max": 0}` means serve at once. No `hold` means "flows straight into the next step": the scheduler keeps them together and warns if it cannot. If `how` mentions heat or a lid, the pan or ring stays in use while it keeps. |
| `ahead` | `true` for prep that keeps. The scheduler may move it earlier, inside its hold, to keep the end calm. Needs a `hold`. |
| `check` | A decision the cook makes. `cue` is what they look for. `fallback` is the extra minutes if it is not ready. `probe: [°C, seconds]` and `food` for a temperature check. `pass` and `fail` are the button labels. |
| `optional` | Shown with an "Optional" chip. Still scheduled. |
| `done` | How the cook knows the step is finished. Required for steps of 3 minutes or more, unless there is a `check`. |
| `full` | Extra detail, shown in a closed "Full steps" box. |
| `timer` | `true` to add a timer button to an active step. Passive steps of 2 minutes or more get one anyway. |

## What the checker catches

- A step needs something no earlier step makes.
- An ingredient's first appearance has no amount.
- US units or words anywhere a cook reads them, including the ingredients and equipment lists: °F, cups, oz, lb, sticks, inches, 9x13, skillet, broil, all-purpose, kosher salt, zucchini, cilantro, scallion and more. Every match is listed.
- An oven above 260°C (probably °F), or an oven `kind` scene without both temperatures.
- Mince, poultry or pork cooked with no probe check, or a probe target below UK guidance.
- A step of 3+ minutes with no done cue. One step of 30+ minutes hands-on.
- A picture kind or part that does not exist (the page draws a labelled card instead).
- Food that waits longer than its hold, measured to the step that uses it (`needs.from`).
- A step with no hold that does not flow into the next one, or a hot pan or oven left waiting between two steps.
- The kitchen over-booked: too many rings, two oven settings, one tool in two places, two hands-on steps at once.
- More than 13 of any 15 minutes hands-on in the last hour, unless it is all stove work.
