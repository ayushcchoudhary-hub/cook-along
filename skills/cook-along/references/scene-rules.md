# Pictures

Every step has one animated picture, drawn in a paper cut-out style on a 640 × 400 canvas. You choose it with the step's `scene`. You never write drawing code.

## Rules

1. **The picture carries the facts.** Amounts on tags, temperatures on the card, the time on the timer card. The step text is one line.
2. **Label every item in a picture, or none.** A layout of ingredients labels all of them.
3. **At most 4 tags.** Each under about 25 characters. Use `\n` for a second line.
4. **Show the right state.** Raw or cooked (`"state": {"cooked": true}`), whole or cut (`"cut": true`), coated, trimmed.
5. **Faces** appear only on some whole foods at rest (in the opening layout). Never on food being cut, mashed or eaten. The renderer handles this.
6. **Match the step.** If the step puts potatoes on a tray, the picture shows potatoes going onto a tray, cut side down if the step says so.
7. **Check it.** `scripts/check.py` draws every step's key frame into `check/sheet.png`. Look at it.

## Generic kinds

`"scene": {"kind": "<kind>", ...options}`. Parts are listed at the bottom. A group of parts is `{"part": "salmon", "n": 2, "slot": "mid", "state": {...}, "scale": 1.2}`.

| kind | Use for | Options |
|---|---|---|
| `flatlay` | "Get everything out". Up to 8 items, each labelled. | `items: [{part, label, state}]`. Put the amount in the label: `"500 g baby\npotatoes"`. |
| `oven` | Oven on, or a new temperature. | `temps: [conventional, fan]` (required), `inside: [{part, state}]`, `tags`. |
| `wait` | A passive wait: heating, roasting, resting, simmering. | `where: "oven" \| "hob" \| "counter"`, `time: "25 min"`, `timeLabel`, `inside: [{part, n, state}]`, `tags`. On the hob: `color` (the pot's contents, hex, instead of water), `lid: true`, `heat: "off"`. On the counter: `cover: false` for no foil. |
| `chop` | Cutting on a board. | `part`, `cut: "halve" \| "trim" \| "slice"`, `cuts` (slices, default 5), `scale`, `pile` (how many cut pieces to show), `pileOf`, `pileScale`, `n` (spears in a bunch), `state`, `tags`. |
| `bowl` | Mixing, marinating, rinsing. | `add: [{part}]` (dropped in), `list: ["1 tsp Dijon", ...]` (amounts as tags), `color` (a mixture: the food disappears into it), `stay: true` (food stays visible, with `color` as the liquid around it), `tags`. Without `color`, the food stays visible. |
| `board` | Work on one or two pieces: coat, season, press. | `part`, `n: 1 \| 2`, `action: "coat" \| "season" \| "press"`, `state`, `scale`, `tags`. |
| `tray` | A baking tray, on the counter or in the oven. | `have: [groups]` (already on), `add: [groups]` (dropped on), `push: "left" \| "right"` (slides `have` aside first), `oven: true` (inside a hot oven), `hot: true` (steam), `done: true` (sparkles), `temps`, `tags`. Slots: `all`, `left`, `mid`, `right`, `leftHalf`, `rightHalf`. |
| `pot` | Boiling or simmering in a saucepan. | `heat: "boil" \| "simmer" \| "off"`, `liquid: "water" \| "stock" \| "sauce" \| "none"`, `color` (hex, for a white sauce or a chilli), `lid: true`, `have`, `add`, `tags`. |
| `pan` | A frying pan on the hob. | `heat: "high" \| "medium" \| "low"`, `color` (a sauce in the pan, so eggs or meatballs sit in it), `have`, `add` (groups take `slot`), `flip: true` (turns the first piece), `tags`. |
| `probe` | A probe temperature check. | `on: "pan" \| "tray"`, `part`, `state`, `scale`, `temp` (°C), `hold` (seconds), `tags`. |
| `plate` | Serving. | `items: [{part, n, state, scale}]`, `tags`. Food is drawn cooked, except foods eaten raw (cheese, tofu and its aliases, avocado, herbs, tomato, cucumber, olives, yoghurt, citrus). Set `"state": {"cooked": false}` to change that. |
| `card` | Nothing else fits. A paper card with the step title. | `title`, `tool` (a part to show under it), `tags`. |

Tags are strings, or `{"text": "...", "at": [x, y]}` to place one yourself (x 0–640, y 0–400).

## Library scenes

Hand-made scenes from the example meals. Use one with `"scene": {"use": "<name>"}` only when it shows exactly your step. Its labels are fixed.

| name | shows |
|---|---|
| `prepL`, `prepB` | Ingredient layouts for the lamb and burger examples |
| `oven` | Heat the oven to 170/150°C, empty tray on its sheet |
| `wedges` | Onion cut into 8 thick wedges |
| `halfmoon` | Onion sliced into thin half-moons |
| `compare` | Thick wedges next to thin half-moons |
| `garlic` | Crush 3 garlic cloves, keep 3 whole, chop 2 rosemary sprigs |
| `rub` | Oil, garlic, rosemary rub onto a lamb shoulder |
| `assemble` | Lamb on onions in a foil tray, stock around it |
| `foil` | Two layers of foil crimped round a tray |
| `ovenIn`, `quiet` | Covered tray into the oven, long quiet roast |
| `fork` | Tenderness check with a fork through one foil corner |
| `brown` | Uncovered roast browning |
| `rest` | Meat resting under loose foil |
| `ahead` | Potatoes into cold water, beans trimmed |
| `potOn`, `simmer`, `drain`, `mash` | Potatoes from cold water to mash |
| `sauce` | Pan juices through a sieve, skimmed |
| `beans` | Green beans boiled and buttered |
| `serveL` | Pulled lamb, mash, beans, sauce |
| `onions` | Onions softening in a frying pan |
| `toBowl` | Onions into a bowl, keep the pan |
| `sauceMix` | Burger sauce in a small bowl |
| `slice` | Pickles and cheese sliced |
| `chips` | Oven chips |
| `patties` | Two burger patties in a pan |
| `probe` | Cheese on the patties, probe at 75°C |
| `buns` | Patties resting, buns toasting |
| `build` | Burger built in layers |

## Parts

74 foods and tools are drawn in the kit (`assets/generic.js`, `assets/kit_and_library.js`). They are hand-made canvas drawings, not images from the web.

- **Proteins**: `chicken`, `whole_chicken`, `mince`, `steak`, `sausage`, `bacon`, `lamb`, `salmon`, `prawn`, `tofu` (also paneer, feta, halloumi), `egg`, `patty`.
- **Veg and fruit**: `tomato`, `mushroom`, `onion`, `spring_onion`, `garlic`, `ginger`, `chilli`, `red_pepper`, `broccoli`, `carrot`, `peas`, `sweetcorn`, `aubergine`, `courgette`, `cucumber`, `avocado`, `asparagus`, `beans`, `pak_choi`, `lemongrass`, `potato`, `baby_potato`, `lemon`, `lime`, `banana`, `olive`.
- **Starch**: `rice`, `pasta` (penne and other shapes), `spaghetti`, `noodles`, `flatbread` (naan, tortilla, pitta), `bun`, `loaf`, `chips`, `mash`.
- **Pulses**: `chickpeas`, `lentils`, `black_beans`.
- **Dairy and the cupboard**: `butter`, `cheese`, `milk`, `yoghurt`, `flour` (also sugar), `tin` (chopped tomatoes, beans, coconut milk), `oil`, `stock`, `water`, `salt`, `pepper` (the black pepper mill), `mustard`, `dressing`, `pickle`.
- **Herbs**: `rosemary`, `parsley`, `herbs`.
- **Tools**: `tray`, `pot`, `pan`, `bowl`, `probe`, `foil`, `plate`.

Common other names work too (`prawns`, `naan`, `penne`, `bok choy`, `paneer`, `red lentils`, `chorizo`). The full list is in `assets/catalog.json`.

States: `cooked`, `cut`, `coated`, `trimmed` (asparagus), `ripe` (banana), `color` (pepper, chilli, tofu, olive, flatbread, pasta: a hex colour).

## A food that is not in the kit: look it up

The checker warns about every food with no drawing. For each one that matters (a main ingredient, or anything shown in more than one step):

1. **Find out what it looks like.** Many agents cannot see image-search results: the person sees the pictures, the agent sees only titles. So use what you can read:
   - If your tools show you an image (a fetched image, or a screenshot), look at it.
   - If not, search the web for a description ("okra" on Wikipedia gives "green, ridged pods, 7–15 cm long"), and use the colour table below.
   - Describe it as the cook sees it at that step: raw or cooked, whole or cut.
2. **Pick the shape and two colours.** Write them in the plan's top-level `parts`:

```json
"parts": {
  "okra":   {"shape": "long",  "color": "#4f8a2c", "color2": "#8fc46a"},
  "kimchi": {"shape": "mound", "color": "#c0392b", "color2": "#e8826e", "cooked": "#a8321f"},
  "nori":   {"shape": "flat",  "color": "#1f3324", "color2": "#3d5a40"}
}
```

| shape | for |
|---|---|
| `round` | most whole fruit and veg: figs, plums, turnips, dragon fruit |
| `oval` | eggs of other birds, dates, new potatoes, dumplings of other kinds |
| `long` | okra, leeks, celery, rhubarb, a fish fillet seen from the side |
| `flat` | sheets and discs: nori, pancakes, rice paper, lasagne |
| `cube` | blocks and cubes: paneer, cheese, cubed squash |
| `mound` | anything in a heap: kimchi, sauerkraut, grated cheese, minced pork |
| `pile` | many small round things: edamame, capers, pomegranate seeds, pine nuts |
| `strands` | thin and long: glass noodles, bean sprouts, grated carrot |
| `leafy` | leaves: spinach, lettuce, basil, kale |
| `bunch` | a stack of thin flat pieces: sliced meat, bacon of other kinds |
| `wedge` | wedges and triangles: cheese wedges, samosas, melon slices |
| `liquid` | sauces in a jar: fish sauce, gochujang, tahini |

`color` is the main colour, and `color2` the lighter one. `spots` adds speckles. `cooked` and `cooked2` are the colours when `"state": {"cooked": true}`. `"state": {"cut": true}` shows a round, oval, long, cube or wedge food as three pieces.

Colour table (hex), for when you cannot see an image:

| Colour | Foods |
|---|---|
| Deep red `#b8231b` / `#e8826e` | tomato sauce, kimchi, gochujang, red chilli, raw beef `#9c2f2f` |
| Orange `#e8822a` / `#f3a65c` | carrot, sweet potato, squash flesh, lentils, paprika `#c0502a` |
| Yellow `#e9c23a` / `#f6e08a` | sweetcorn, egg yolk `#f4b400`, turmeric `#d9a21b`, lemon |
| Bright green `#4f9a3c` / `#8fc46a` | peas, beans, okra, courgette, spring onion tops |
| Dark green `#2e5c22` / `#4f8a35` | spinach, kale, cucumber skin, broccoli, nori `#1f3324` |
| Pale green `#d6dca0` / `#eef2d0` | leek, celery, cabbage, pak choi stems, bean sprouts `#efe8cf` |
| Purple `#4a2a4a` / `#7a4a7e` | aubergine, red cabbage, beetroot `#7a1f3d` |
| Cream `#f2ead6` / `#fbf7ec` | rice, noodles, tofu, paneer, labneh, yoghurt, cauliflower |
| Tan `#d9b072` / `#f2d9a2` | chickpeas, bread, pastry, nuts, cooked dough |
| Brown `#8a5a32` / `#b8865a` | mushrooms, cooked beef `#6b3b22`, soy sauce `#3a1f12`, cumin |
| Pink `#e59a8a` / `#f6cfc4` | raw pork, raw chicken, prawns raw grey `#c9b8b0`, cooked prawns `#ff8a5c` |
| Black `#1f1a1e` / `#4a4048` | black beans, sesame (black), olives `#3d4a22` | `w` sets the width in pixels if the default looks wrong. Then use the name as a `part` like any other.

3. **Check the sheet.** If the food reads wrong in `check/sheet.png`, change the shape or colours.

A food you leave out still draws as a paper label with its name (`10 × dumplings` for a group), or a paper bag in the opening layout. Nothing breaks.
