# cook-along demo: plan

128 BPM. 1 bar = 1.875 s. 13 bars = 24.4 s. 1600 × 1100, 30 fps, silent (music later).

| # | Time | Bars | Idea | On screen | Caption | Proof the camera lands on | Source |
|---|---|---|---|---|---|---|---|
| 1 | 0.0–3.75 | 2 | The ask | Beat card | "You decide. We eat at 19:30." | 19:30 in accent | The trigger in SKILL.md |
| 2 | 3.75–7.5 | 2 | How it works | Real plan.py output for the salmon plan | It plans **backwards** from dinner | Ring on "start 18:18 eat 19:30", then "0 errors, 0 warnings" | `python3 scripts/plan.py examples/salmon-traybake/plan.json --eat 19:30` |
| 3 | 7.5–13.1 | 3 | What it is | The built page, reel playing at step 9 | Every step is a **picture** | Ring on the reel caption "9 · Push potatoes aside..." | examples/salmon-traybake/index.html |
| 4 | 13.1–16.9 | 2 | Live plan | "Now" board at 19:14 | Every dish, by the **clock** | Ring on "Salmon ... 13 min left" | same page, `#now=19:14` |
| 5 | 16.9–20.6 | 2 | Judgement | Tap "Still glassy: +3 min" on the salmon check | Not ready? It **re-plans** | Ring on the toast "Dinner moves to about 19:33" | same page, `#now=19:26` |
| 6 | 20.6–24.4 | 2 | Mirror ending | Beat card | "You decide." It plans. You cook. + repo | Repo link | — |

Real UI and real output only. The page clock is set with the page's own `#now=` hash, which the page supports for demos. Two beat cards.
