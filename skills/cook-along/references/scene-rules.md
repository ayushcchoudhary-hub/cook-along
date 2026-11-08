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
| `bowl` | Mixing a dressing, sauce or batter. | `add: [{part}]` (dropped in), `list: ["1 tsp Dijon", ...]` (amounts as tags), `color` (the mixture, hex), `tags`. |
| `board` | Work on one or two pieces: coat, season, press. | `part`, `n: 1 \| 2`, `action: "coat" \| "season" \| "press"`, `state`, `scale`, `tags`. |
| `tray` | A baking tray, on the counter or in the oven. | `have: [groups]` (already on), `add: [groups]` (dropped on), `push: "left" \| "right"` (slides `have` aside first), `oven: true` (inside a hot oven), `hot: true` (steam), `done: true` (sparkles), `temps`, `tags`. Slots: `all`, `left`, `mid`, `right`, `leftHalf`, `rightHalf`. |
| `pot` | Boiling or simmering in a saucepan. | `heat: "boil" \| "simmer" \| "off"`, `liquid: "water" \| "stock" \| "sauce" \| "none"`, `color` (hex, for a white sauce or a chilli), `lid: true`, `have`, `add`, `tags`. |
| `pan` | A frying pan on the hob. | `heat: "high" \| "medium" \| "low"`, `have`, `add` (groups take `slot`), `flip: true` (turns the first piece), `tags`. |
| `probe` | A probe temperature check. | `on: "pan" \| "tray"`, `part`, `state`, `scale`, `temp` (°C), `hold` (seconds), `tags`. |
| `plate` | Serving. | `items: [{part, n, state, scale}]`, `tags`. |
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

Drawn parts: `chicken`, `mince`, `rice`, `red_pepper`, `broccoli`, `dumpling`, `egg`, `banana`, `tin`, `cucumber`, `spring_onion`, `loaf`, `lamb`, `salmon`, `asparagus`, `baby_potato`, `potato`, `onion`, `garlic`, `lemon`, `rosemary`, `parsley`, `herbs`, `butter`, `milk`, `stock`, `water`, `oil`, `salt`, `pepper`, `mustard`, `dressing`, `beans`, `patty`, `bun`, `cheese`, `pickle`, `chips`, `mash`, `tray`, `pot`, `pan`, `bowl`, `probe`, `foil`.

Also accepted: `chicken breast(s)`, `chicken thighs`, `beef mince`, `pork mince`, `red pepper(s)`, `bell pepper`, `peppers`, `dumplings`, `eggs`, `bananas`, `chopped tomatoes`, `kidney beans` (as tins), `spring onion(s)`, `banana bread`, `bread`, `baby potatoes`, `new potatoes`, `potatoes`, `salmon fillet(s)`, `green beans`, `dijon`, `olive oil`, `spring onion`, `shallot`, `chicken stock`, `cheddar`, `buns`, `patties`, `pickles`.

States: `cooked`, `cut`, `coated`, `trimmed` (asparagus), `face` (flatlay only).

`pepper` is the black pepper mill. Use `red_pepper` for the vegetable (`"state": {"color": "#e8a628"}` for a yellow one).

Any other part name still works. It is drawn as a paper label with the name on it (`10 × dumplings` for a group), or a plain paper bag in the opening layout, so a new recipe never breaks. Prefer a real part when one is close enough (`herbs` for coriander, `onion` for a shallot), and use the label for the exact name.
