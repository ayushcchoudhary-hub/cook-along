# cook-along demo: plan

136 BPM. 1 bar = 1.76 s. 14 bars = 24.7 s. 1600 × 1100, 30 fps, silent (music later).

| # | Time | Bars | On screen | Caption | Proof |
|---|---|---|---|---|---|
| 1 | 0.0–5.3 | 3 | A recorded run: the person's message, then the agent's real reply | Ask your agent about **dinner** | Highlight on "I cook it until it's opaque and flakes, per UK guidance." |
| 2 | 5.3–8.8 | 2 | The real plan.py printout for that run | It plans **backwards** from dinner | Ring on "start 6:18pm eat 7:30pm", then "0 errors, 0 warnings" |
| 3 | 8.8–14.1 | 3 | The page the run built, reel at the salmon step | Every step is a **picture** | Ring on the reel caption |
| 4 | 14.1–17.6 | 2 | "Now" board at 7:14 pm | Every dish, by the **clock** | Ring on "Salmon ... 13 min left" |
| 5 | 17.6–21.2 | 2 | Tap "Still glassy: +3 min" | Not ready? It **re-plans** | Ring on "Food now ready at about 7:33 pm" |
| 6 | 21.2–24.7 | 2 | End card | Ask your agent about dinner. It plans. You cook. + repo | — |

The run: a fresh agent with only the skill got the message in shot 1 and the video transcript. Its reply, plan and page are used as they came out. `config.json` (not committed) points `record.py` at that run.
