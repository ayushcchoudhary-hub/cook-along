#!/usr/bin/env python3
"""Schedule and check a cook-along plan.

Reads a plan.json (see references/plan-schema.md), schedules every step
backwards from the eating time, checks the plan against the cooking rules,
and prints the timed plan. With -o it also writes the plan with a "_computed"
block (build.py does this for you).

    python3 plan.py plan.json [--eat 19:30] [--hobs 4] [-o out.json]

Exit code 1 if there is any error. Warnings do not fail the run.
No third-party packages.
"""
import argparse
import json
import re
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
SAFETY = json.loads((HERE.parent / "references" / "safety.json").read_text())["rules"]
CATALOG = json.loads((HERE.parent / "assets" / "catalog.json").read_text())

SHAPES = ["round", "oval", "long", "flat", "cube", "mound", "pile", "strands", "leafy", "bunch", "wedge", "liquid"]

BAD_UNITS = re.compile(
    r"(°\s*F\b|\bfahrenheit\b|(\d+(/\d+)?|½|¼|¾|⅓|⅔|\bhalf an?|\bone|\btwo|\bthree)\s*cups?\b|\bcups? of (flour|sugar|milk|water|rice|cheese|butter|oil|stock|cream)\b|\boz\b|\blbs?\b|\bounces?\b|\bpounds?\b|(\b\d+(/\d+)?|½|\bhalf an?|\bone|\btwo)\s+sticks?\b|\bsticks? of butter\b|\bquarts?\b|\bpints?\b"
    r"|\binch(es)?\b|\d+\s*[x×]\s*\d+\s*(in\b|\")|\b9\s*[x×]\s*13\b|\bskillet\b|\bbroil|\bstovetop\b|\bzucchini\b|\bcilantro\b|\bscallions?\b|\beggplant\b|\barugula\b"
    r"|\ball-purpose\b|\bkosher salt\b|\bheavy cream\b|\bhalf-and-half\b|\bconfectioners\b|\bbaking soda\b|\bground beef\b|\bpackage directions\b|\bsharp cheddar\b)", re.I)


def clock(eat_min, rel):
    """Clock string for a time `rel` minutes relative to eating (negative = before)."""
    t = (eat_min + rel) % (24 * 60)
    return f"{int(t // 60):02d}:{int(round(t % 60)) % 60:02d}"


def parse_hhmm(s):
    h, m = s.split(":")
    return int(h) * 60 + int(m)


class Plan:
    def __init__(self, data, hobs=None, eat=None):
        self.d = data
        self.k = dict(data.get("kitchen", {}))
        if hobs is not None:
            self.k["hobs"] = hobs
        self.k.setdefault("hobs", 4)
        self.k.setdefault("ovens", 1)
        self.eat = parse_hhmm(eat or data.get("eat_at", "19:30"))
        self.steps = {s["id"]: s for s in data["steps"]}
        self.order = [s["id"] for s in data["steps"]]
        self.issues = []

    # ------------------------------------------------------------------ helpers
    def issue(self, level, step, msg):
        it = {"level": level, "step": step, "msg": msg}
        if it not in self.issues:
            self.issues.append(it)

    def dur(self, s, which="typ"):
        d = s.get("duration", {})
        if isinstance(d, (int, float)):
            return float(d)
        return float(d.get(which, d.get("typ", 1)))

    def res(self, s):
        return list(s.get("resource", []))

    def active(self, s):
        return s.get("hands", "active") == "active"

    def succ(self):
        out = {i: [] for i in self.steps}
        for s in self.steps.values():
            for a in list(dict.fromkeys(s.get("after", []) + [n["from"] for n in s.get("needs", []) if n.get("from") in self.steps])):
                if a not in self.steps:
                    self.issue("error", s["id"], f"'after' names an unknown step: {a}")
                    continue
                if s["id"] not in out[a]:
                    out[a].append(s["id"])
        return out

    # ------------------------------------------------------------- scheduling
    def fits(self, s, start, placed):
        end = start + self.dur(s)
        need_hands = self.active(s)
        mine = self.res(s)
        hobs_here = sum(1 for r in mine if r.startswith("hob"))
        oven_t = [r for r in mine if r.startswith("oven@")]
        tools = [r for r in mine if not r.startswith("hob") and not r.startswith("oven")]
        # count overlapping hob use at the worst minute
        for other_id, (os, oe) in placed.items():
            if os >= end or oe <= start:
                continue
            o = self.steps[other_id]
            if need_hands and self.active(o):
                return False
            ores = self.res(o)
            for tl in tools:
                if tl in ores:
                    return False
            o_oven = [r for r in ores if r.startswith("oven@")]
            if oven_t and o_oven and oven_t[0] != o_oven[0] and self.k["ovens"] < 2:
                return False
        if hobs_here:
            # sample each minute for ring count
            m = start
            while m < end:
                used = hobs_here
                for other_id, (os, oe) in placed.items():
                    if os <= m < oe:
                        used += sum(1 for r in self.res(self.steps[other_id]) if r.startswith("hob"))
                if used > self.k["hobs"]:
                    return False
                m += 1
        return True

    def schedule(self):
        succ = self.succ()
        placed = {}
        remaining = set(self.steps)
        guard = 0
        while remaining and guard < 10000:
            guard += 1
            ready = [i for i in remaining if all(x in placed for x in succ[i])]
            if not ready:
                self.issue("error", None, "The 'after' links contain a loop. Check them.")
                break
            # latest finish allowed by successors
            def lf(i):
                ss = succ[i]
                return min(placed[x][0] for x in ss) if ss else 0.0
            # Fixed steps before flexible prep. Among equals, the step that keeps
            # least well goes last in time (closest to the step that needs it).
            def keeps(i):
                h = self.steps[i].get("hold", {}).get("max")
                return 0 if h is None else h
            ready.sort(key=lambda i: (bool(self.steps[i].get("ahead")), -lf(i), keeps(i), self.order.index(i)))
            i = ready[0]
            s = self.steps[i]
            latest_end = lf(i)
            d = self.dur(s)
            hold = s.get("hold", {}).get("max")
            # As late as possible. If the hands or a tool are busy, slide earlier.
            start = self._search_down(s, latest_end - d, placed)
            # Prep that keeps ("ahead") moves earlier, inside its hold time,
            # when that keeps the cook from being rushed near the end.
            if s.get("ahead") and self.active(s) and succ[i]:
                lo = latest_end - d - (hold if hold is not None else 60)
                # score: hands-on load around it, plus a penalty for the last 20 minutes
                score = lambda tt: self._load(tt, d, placed) + (20 if tt + d > -20 else 0)
                best, t = (score(start), start), start
                while best[0] > self.CALM and t > lo:
                    t -= 1
                    if self.fits(s, t, placed):
                        sc = score(t)
                        if sc < best[0] - 0.01:
                            best = (sc, t)
                start = best[1]
            # A step that does not keep (no hold) should flow straight into the next one.
            # If the hands are busy at that moment, pull the next step earlier too,
            # as long as the next step's own result keeps long enough.
            if hold is None and len(succ[i]) == 1 and start + d < latest_end - 0.5:
                moved = self._pull_pair(i, succ[i][0], d, latest_end, start, placed, succ)
                if moved is not None:
                    start = moved
            placed[i] = (start, start + d)
            remaining.discard(i)
        self.placed = placed
        self._close_gaps(succ)
        for i in self.steps:
            if not succ[i]:
                continue
            end = placed[i][1]
            hold = self.steps[i].get("hold", {}).get("max")
            # who actually uses what this step makes? (needs.from), else every next step
            users = [j for j in self.steps if any(n.get("from") == i for n in self.steps[j].get("needs", []))] or succ[i]
            if hold is not None:
                wait = max(placed[j][0] for j in users) - end
                if wait > hold + 0.5:
                    who = max(users, key=lambda j: placed[j][0])
                    self.issue("error", i, f"Its result waits {wait:.0f} min for {who} but keeps only {hold} min. It will go cold, dry or soggy.")
                continue
            absorb = max((self.dur(self.steps[x], "max") - self.dur(self.steps[x]) for x in succ[i]
                          if not self.active(self.steps[x])), default=0)
            wait = min(placed[x][0] for x in succ[i]) - end
            if wait > 0.5 and wait > absorb + 0.01:
                self.issue("warn", i, f"Its result waits {wait:.0f} min before the next step. Add a hold time, or check it can wait.")
                continue
            has_preds = any(i in succ[j] for j in self.steps)
            for x in (succ[i] if has_preds else []):
                if i not in self.steps[x].get("after", []):
                    continue
                w = placed[x][0] - end
                slack = self.dur(self.steps[x], "max") - self.dur(self.steps[x])
                if not self.active(self.steps[x]) and w > 2 and w > slack + 0.01:
                    self.issue("warn", i, f"{x} ({self.steps[x].get('title', '')}) should follow straight on, but starts {w:.0f} min later. Add a hold time, or give {x} a longer time range.")
            mine = set(self.res(self.steps[i])) - {"hob"}
            hot = lambda st: any(r.startswith(("hob", "oven")) for r in self.res(st))
            for x in succ[i]:
                w = placed[x][0] - end
                if w > 2 and hot(self.steps[i]) and hot(self.steps[x]) and mine & set(self.res(self.steps[x])):
                    self.issue("warn", i, f"{x} uses the same {', '.join(sorted(mine & set(self.res(self.steps[x]))))} but starts {w:.0f} min later. Add a hold time, or check nothing cools or burns.")
        return placed

    def _valid(self, P, succ):
        for a, ss in succ.items():
            for b in ss:
                if P[a][1] > P[b][0] + 0.01:
                    return False
        ids = list(P)
        for x in range(len(ids)):
            i = ids[x]
            rest = {k: P[k] for k in ids[:x]}
            if not self.fits(self.steps[i], P[i][0], rest):
                return False
        return True

    def _close_gaps(self, succ):
        """Repair pass: a step with no hold time should flow into the next step.
        Move the next step up to meet it, and push whatever was in the way later."""
        P = self.placed
        for _ in range(3):
            changed = False
            for x in sorted(P, key=lambda k: P[k][0]):
                s = self.steps[x]
                if s.get("hold") is not None or len(succ[x]) != 1:
                    continue
                y = succ[x][0]
                gap = P[y][0] - P[x][1]
                if gap < 0.5:
                    continue
                ny0 = P[x][1]
                dy = P[y][1] - P[y][0]
                trial = dict(P)
                trial[y] = (ny0, ny0 + dy)
                # steps now clashing with y get pushed to just after it, if they still fit
                clash = [k for k in trial if k != y and trial[k][0] < ny0 + dy and trial[k][1] > ny0
                         and self.active(self.steps[k]) and self.active(self.steps[y])]
                ok = True
                for k in sorted(clash, key=lambda k: trial[k][0]):
                    dk = trial[k][1] - trial[k][0]
                    lf = min((trial[z][0] for z in succ[k]), default=0.0)
                    t = max(trial[k][0], ny0 + dy)
                    placed_k = False
                    while t + dk <= lf + 0.01:
                        others = {q: v for q, v in trial.items() if q != k}
                        if self.fits(self.steps[k], t, others):
                            trial[k] = (t, t + dk)
                            placed_k = True
                            break
                        t += 1
                    if not placed_k:
                        ok = False
                        break
                if not ok or not self._valid(trial, succ):
                    continue
                # holds still respected?
                bad = False
                for k in trial:
                    h = self.steps[k].get("hold", {}).get("max")
                    if succ[k] and h is not None:
                        w = min(trial[z][0] for z in succ[k]) - trial[k][1]
                        if w > h + 0.5:
                            bad = True
                if bad:
                    continue
                P.clear(); P.update(trial); changed = True
            if not changed:
                break

    def _pull_pair(self, i, j, d, latest_end, slid_start, placed, succ):
        js, je = placed[j]
        dj = je - js
        jhold = self.steps[j].get("hold", {}).get("max")
        j_lf = min((placed[x][0] for x in succ[j]), default=0.0)
        others_before_j = [a for a in self.steps[j].get("after", []) if a != i and a in placed]
        del placed[j]
        try:
            t = latest_end - d - 1
            while t > slid_start:
                nj = t + d
                wait_j = j_lf - (nj + dj)
                ok_hold = (jhold is not None and wait_j <= jhold + 0.01) or (not succ[j] and wait_j <= 0.01)
                ok_preds = all(placed[a][1] <= nj + 0.01 for a in others_before_j)
                if ok_hold and ok_preds and self.fits(self.steps[i], t, placed):
                    placed[i] = (t, t + d)
                    fit_j = self.fits(self.steps[j], nj, placed)
                    del placed[i]
                    if fit_j:
                        placed[j] = (nj, nj + dj)
                        return t
                t -= 1
        finally:
            placed.setdefault(j, (js, je))
        return None

    CALM = 10  # most hands-on minutes in any 15 that still feels calm

    def _load(self, t, d, placed):
        """Worst hands-on minutes in any 15-minute window that touches [t, t+d], counting this step."""
        act = [(a, b) for j, (a, b) in placed.items() if self.active(self.steps[j])] + [(t, t + d)]
        worst = 0
        w = t + d - 15
        while w <= t:
            busy = sum(min(b, w + 15) - max(a, w) for a, b in act if a < w + 15 and b > w)
            worst = max(worst, busy)
            w += 1
        return worst

    def _search_down(self, s, start, placed):
        t = start
        for _ in range(24 * 60):
            if self.fits(s, t, placed):
                return t
            t -= 1
        self.issue("error", s["id"], "Could not fit this step anywhere. The kitchen is over-booked.")
        return start

    # ------------------------------------------------------------- validation
    def validate(self):
        P = self.placed
        ingredients = self.d.get("ingredients", [])
        # 1. needs come from an earlier step, or are bought
        for i, s in self.steps.items():
            for n in s.get("needs", []):
                src = n.get("from")
                if src:
                    if src not in self.steps:
                        self.issue("error", i, f"Needs '{n.get('item')}' from {src}, but there is no step {src}.")
                    elif P[src][1] > P[i][0] + 0.01:
                        self.issue("error", i, f"Needs '{n.get('item')}' from {src}, but {src} ends after this step starts.")
                elif n.get("state") and not n.get("bought"):
                    self.issue("error", i, f"Needs '{n.get('state')} {n.get('item')}' but no step makes it. Add a step, or mark it bought.")
        # 2. quantity shown where each ingredient is first handled
        by_start = sorted(self.steps, key=lambda i: P[i][0])
        for ing in ingredients:
            key = ing["key"].lower()
            first = None
            for i in by_start:
                for n in self.steps[i].get("needs", []):
                    if n.get("item", "").lower() == key and not n.get("from"):
                        first = (i, n)
                        break
                if first:
                    break
            if not first:
                self.issue("warn", None, f"Ingredient '{ing['key']}' is listed but no step uses it.")
            elif not first[1].get("qty"):
                self.issue("error", first[0], f"First step to handle '{ing['key']}' does not show the amount.")
        # 3. units and words, in every piece of text the cook will read
        def strings(x):
            if isinstance(x, str):
                yield x
            elif isinstance(x, dict):
                for k, v in x.items():
                    if k not in ("id", "after", "from", "resource", "part", "kind", "use"):
                        yield from strings(v)
            elif isinstance(x, list):
                for v in x:
                    yield from strings(v)
        def bad_words(texts):
            return sorted({m.group(0).strip() for t in texts for m in BAD_UNITS.finditer(t)}, key=str.lower)
        for i, s in self.steps.items():
            found = bad_words(strings(s))
            if found:
                self.issue("error", i, f"Uses {', '.join(repr(w) for w in found)}. Use metric units, °C and UK words.")
            temps = [t for t in (s.get("scene", {}).get("temps") or []) if isinstance(t, (int, float))]
            temps += [int(m) for r in self.res(s) for m in re.findall(r"oven@(\d+)", r)]
            if any(t > 260 for t in temps):
                self.issue("error", i, f"Oven at {max(temps)}°C is too hot for a home oven. Is it in °F? 350°F is 180°C conventional, 160°C fan.")
            for r in self.res(s):
                if r.startswith("oven@"):
                    temps2 = s.get("scene", {}).get("temps")
                    if (not temps2 or len(temps2) != 2) and (s.get("scene", {}).get("kind") == "oven" or s.get("show_temps")):
                        self.issue("error", i, "Oven step must show both conventional and fan temperatures.")
        for label, texts in (("ingredients", strings(self.d.get("ingredients", []))), ("equipment", strings(self.d.get("equipment", [])))):
            found = bad_words(texts)
            if found:
                self.issue("error", None, f"The {label} list uses {', '.join(repr(w) for w in found)}. Use metric units and UK words.")
        # long hands-on steps
        for i, s in self.steps.items():
            if self.active(s) and self.dur(s) >= 30:
                self.issue("warn", i, f"{self.dur(s):.0f} min of hands-on work in one step. Split it into parts the cook can pause between, each with a done cue.")
        # 4. done cues
        for i, s in self.steps.items():
            if self.dur(s) >= 3 and not (s.get("done") or s.get("check")):
                self.issue("warn", i, "No 'done when' cue. Say how the cook knows it is finished.")
        # 5. scenes exist
        custom = {k.lower().strip(): v for k, v in self.d.get("parts", {}).items()}
        missing = {}
        for i, s in self.steps.items():
            sc = s.get("scene", {})
            if "use" in sc and sc["use"] not in CATALOG["library"]:
                self.issue("warn", i, f"Scene '{sc['use']}' is not in the library. The page will draw a fallback card.")
            if "kind" in sc and sc["kind"] not in CATALOG["kinds"]:
                self.issue("warn", i, f"Scene kind '{sc['kind']}' is unknown. The page will draw a fallback card.")
            for part in self._parts(sc):
                if str(part).lower() not in CATALOG["parts"] and str(part).lower() not in custom:
                    missing.setdefault(str(part), []).append(i)
        for part, where in missing.items():
            self.issue("warn", None, f"No drawing for '{part}' ({', '.join(dict.fromkeys(where))}). Look it up (an image search for \"{part}\") "
                       f"and add it to \"parts\" with a shape and colours. See scene-rules.md. Otherwise it shows as a labelled card.")
        for name, sp in custom.items():
            if sp.get("shape") not in SHAPES:
                self.issue("error", None, f"Part '{name}': shape must be one of {', '.join(SHAPES)}.")
            for k in ("color", "color2", "spots", "cooked", "cooked2"):
                if k in sp and not re.fullmatch(r"#[0-9a-fA-F]{6}", str(sp[k])):
                    self.issue("error", None, f"Part '{name}': {k} must be a colour like #c9a774.")
        # 6. safety
        alltext = " ".join(json.dumps(s).lower() for s in self.steps.values()) + " " + self.d.get("title", "").lower()
        cats = [k for k, r in SAFETY.items() if any(re.search(r"\b" + re.escape(f) + r"s?\b", alltext) for f in r["foods"])]
        if "mince" in cats and "whole_red" in cats and not re.search(r"\b(steak|joint|shoulder|leg|rack|roast|brisket|chop|loin|fillet)s?\b", alltext):
            cats.remove("whole_red")  # "beef mince" is mince, not a whole cut
        self.safety = cats
        for i, s in self.steps.items():
            ck = s.get("check", {})
            if ck.get("probe"):
                temp, secs = ck["probe"]
                food = (ck.get("food") or s.get("title", "")).lower()
                for k in ("mince", "poultry", "pork", "rolled"):
                    if any(f in food for f in SAFETY[k]["foods"]):
                        ok = any(temp >= t and secs >= sec for t, sec in SAFETY[k]["probe"]) or temp >= 75
                        if not ok:
                            self.issue("error", i, f"Probe target {temp}°C for {secs} s is below FSA guidance ({SAFETY[k]['text']}).")
        for k in ("mince", "poultry", "pork"):
            if k not in cats:
                continue
            words = SAFETY[k]["foods"]
            checked = any(any(re.search(r"\b" + re.escape(f) + r"s?\b", (s.get("check", {}).get("food", "") + " " + s.get("title", "")).lower()) for f in words)
                          and s.get("check", {}).get("probe") for s in self.steps.values())
            if not checked:
                self.issue("error", None, f"The plan cooks {k} but no step checks it is cooked through. Add a check with \"probe\": [75, 30] and \"food\" ({SAFETY[k]['text']}).")
        succ_all = self.succ()
        # 7. hands-on load
        end = max(e for _, e in P.values())
        start = min(s for s, _ in P.values())
        worst = (0, None)
        t = start
        while t < end:
            busy = sum(min(e, t + 15) - max(s, t) for i, (s, e) in P.items() if self.active(self.steps[i]) and s < t + 15 and e > t)
            if busy > worst[0]:
                worst = (busy, t)
            t += 1
        self.busiest = worst
        if worst[0] > 13:
            in_win = [i for i, (a, b) in P.items() if self.active(self.steps[i]) and a < worst[1] + 15 and b > worst[1]]
            at_stove = all(any(r.startswith(("hob", "oven")) for r in self.res(self.steps[i])) or self.dur(self.steps[i]) <= 5 and not self.steps[i].get("ahead") and not succ_all[i]
                           for i in in_win)
            early = worst[1] is not None and worst[1] <= -60
            near_end = not early and not at_stove
            self.issue("warn" if near_end else "info", None,
                       f"From {clock(self.eat, worst[1])} you are hands-on for {worst[0]:.0f} of 15 min."
                       + (" Move prep earlier, or mark it 'ahead' with a hold time." if near_end else (" That is all stove work, so nothing can move." if at_stove else " That is early prep, before the rush.")))

    def _parts(self, sc):
        out = []
        for key in ("items", "have", "add", "inside"):
            for it in sc.get(key, []):
                if isinstance(it, dict) and it.get("part"):
                    out.append(it["part"])
        for key in ("part", "tool", "pileOf"):
            if sc.get(key):
                out.append(sc[key])
        return out

    # ------------------------------------------------------------- what if a check fails
    def check_impacts(self):
        out = []
        succ = self.succ()
        for i, s in self.steps.items():
            ck = s.get("check", {})
            fb = ck.get("fallback")
            if not fb:
                continue
            # steps downstream of this check
            down, stack = set(), [i]
            while stack:
                x = stack.pop()
                for y in succ[x]:
                    if y not in down:
                        down.add(y)
                        stack.append(y)
            others = [j for j in self.steps if j not in down and j != i and self.placed[j][0] >= self.placed[i][1] - 0.01]
            def absorbs(j, seen=()):
                # Can j start on time anyway? Only if something on its way to the table keeps >= fb minutes.
                h = self.steps[j].get("hold", {}).get("max")
                if h is not None and h >= fb:
                    return True
                nxt = succ[j]
                if not nxt or any(x in down for x in nxt):
                    return False
                return all(absorbs(x, seen + (j,)) for x in nxt if x not in seen)
            wait_ok, wait_bad = [], []
            for j in others:
                (wait_ok if absorbs(j) else wait_bad).append(j)
            out.append({"step": i, "fallback": fb, "dinner_moves": fb,
                        "hold_starts": [j for j in wait_bad],
                        "note": f"If {s.get('title', i)} fails: +{fb} min. " + (f"Do not start {', '.join(self.steps[j]['title'] for j in wait_bad)} until it passes." if wait_bad else "Nothing else has to wait.")})
        return out

    # ------------------------------------------------------------- resources plan
    def ring_plan(self):
        hob_steps = sorted([i for i in self.steps if any(r.startswith("hob") for r in self.res(self.steps[i]))], key=lambda i: self.placed[i][0])
        rings = []  # list of end times
        assign = {}
        succ = self.succ()
        for i in hob_steps:
            s, e = self.placed[i]
            h = self.steps[i].get("hold", {})
            if succ[i] and "heat" in str(h.get("how", "")).lower():
                e = max(e, max(self.placed[x][0] for x in succ[i]))  # kept warm on the ring until it is used
            # keep a step on the same ring as the step it follows on the same tool
            prev_tool = None
            for a in self.steps[i].get("after", []):
                if a in assign and set(self.res(self.steps[a])) & set(self.res(self.steps[i])) - {"hob"}:
                    prev_tool = assign[a]
            if prev_tool is not None and rings[prev_tool] <= s + 0.01:
                assign[i] = prev_tool
                rings[prev_tool] = e
                continue
            for r, free_at in enumerate(rings):
                if free_at <= s + 0.01:
                    assign[i] = r
                    rings[r] = e
                    break
            else:
                assign[i] = len(rings)
                rings.append(e)
        return {i: r + 1 for i, r in assign.items()}, len(rings)

    def peak_tools(self):
        tools_by_step = {i: [r for r in self.res(s) if not r.startswith("hob") and not r.startswith("oven")] for i, s in self.steps.items()}
        succ = self.succ()
        span = {}
        for j, (a, b) in self.placed.items():
            how = str(self.steps[j].get("hold", {}).get("how", "")).lower()
            if succ[j] and any(w in how for w in ("heat", "lid")):
                b = max(b, max(self.placed[x][0] for x in succ[j]))  # pan still in use while it keeps
            span[j] = (a, b)
        best = (0, [])
        for i, (s, _) in self.placed.items():
            live = [j for j, (a, b) in span.items() if a <= s < b]
            ts = sorted({t for j in live for t in tools_by_step[j]})
            pans = [t for t in ts if re.search(r"\b(pan|saucepan|pot|wok|tin|tray|casserole|dish|steamer|skillet)\b", t)]
            if len(pans) > best[0]:
                best = (len(pans), pans)
        return best

    # ------------------------------------------------------------- output
    def run(self):
        self.schedule()
        self.validate()
        rings, ring_count = self.ring_plan()
        peak = self.peak_tools()
        P = self.placed
        first = min(s for s, _ in P.values())
        hands_on = sum(e - s for i, (s, e) in P.items() if self.active(self.steps[i]))
        oven = []
        for i in sorted(self.steps, key=lambda i: P[i][0]):
            for r in self.res(self.steps[i]):
                if r.startswith("oven@"):
                    oven.append({"step": i, "setting": r[5:], "from": round(P[i][0], 1), "to": round(P[i][1], 1)})
        comp = {
            "eat_at": clock(self.eat, 0),
            "start_at": clock(self.eat, first),
            "total_min": round(-first),
            "hands_on_min": round(hands_on),
            "busiest": {"from": clock(self.eat, self.busiest[1] or 0), "rel": round(self.busiest[1] or 0, 1), "hands_on_of_15": round(self.busiest[0])},
            "rings_used": ring_count,
            "peak_pans": {"count": peak[0], "which": peak[1]},
            "oven": oven,
            "safety": self.safety,
            "check_impacts": self.check_impacts(),
            "steps": {i: {"start": round(P[i][0], 1), "end": round(P[i][1], 1), "clock": clock(self.eat, P[i][0]), "ring": rings.get(i),
                          "earliest": round(max([P[a][1] for a in self.steps[i].get("after", []) + [n["from"] for n in self.steps[i].get("needs", []) if n.get("from")] if a in P] or [first]), 1)}
                      for i in self.steps},
            "issues": self.issues,
        }
        out = dict(self.d)
        out["_computed"] = comp
        out["_safety"] = {k: SAFETY[k]["text"] for k in self.safety}
        return out


def report(out):
    c = out["_computed"]
    h24 = (out.get("kitchen") or {}).get("clock") == "24h"
    def hm(t):
        """Clock time the way the page shows it: 6:18pm (or 18:18 with kitchen.clock = 24h)."""
        if h24 or not t:
            return t
        h, m = map(int, t.split(":"))
        return f"{h % 12 or 12}:{m:02d}{'am' if h < 12 else 'pm'}"
    print(f"{out.get('title')}  serves {out.get('serves')}")
    print(f"  start {hm(c['start_at'])}  eat {hm(c['eat_at'])}  total {c['total_min']} min  hands-on {c['hands_on_min']} min")
    if c["rings_used"]:
        print(f"  rings used {c['rings_used']}  most pans at once {c['peak_pans']['count']} ({', '.join(c['peak_pans']['which'])})")
    else:
        print("  no rings used")
    print(f"  busiest: from {hm(c['busiest']['from'])}, {c['busiest']['hands_on_of_15']} of 15 min hands-on")
    for ci in c["check_impacts"]:
        print(f"  check: {ci['note']}")
    order = sorted(out["steps"], key=lambda s: c["steps"][s["id"]]["start"])
    for s in order:
        cs = c["steps"][s["id"]]
        ring = f" ring {cs['ring']}" if cs.get("ring") else ""
        print(f"  {hm(cs['clock']):>7}  {s['id']:<5} {s.get('dish', ''):<8} {'hands' if s.get('hands', 'active') == 'active' else 'wait ':<5} {s['title']}{ring}")
    lv = {"error": 0, "warn": 0, "info": 0}
    for it in c["issues"]:
        lv[it["level"]] += 1
        print(f"  [{it['level'].upper()}] {it['step'] or '-'}: {it['msg']}")
    print(f"  {lv['error']} errors, {lv['warn']} warnings, {lv['info']} notes")
    return lv["error"]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("plan")
    ap.add_argument("--eat")
    ap.add_argument("--hobs", type=int)
    ap.add_argument("-o", "--out")
    ap.add_argument("-q", "--quiet", action="store_true")
    a = ap.parse_args()
    data = json.loads(Path(a.plan).read_text())
    out = Plan(data, hobs=a.hobs, eat=a.eat).run()
    errors = report(out) if not a.quiet else sum(1 for i in out["_computed"]["issues"] if i["level"] == "error")
    if a.out:
        Path(a.out).write_text(json.dumps(out, indent=1, ensure_ascii=False))
    sys.exit(1 if errors else 0)


if __name__ == "__main__":
    main()
