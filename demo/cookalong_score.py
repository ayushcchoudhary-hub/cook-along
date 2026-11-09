"""cook-along score. Clip 24.71 s at 136 BPM: every shot starts on a bar line (0, 3, 5, 8, 10, 12).
Palette: warm electric keys, upright-style bass, brushed snare, shaker, and a kitchen-timer ding.
Key: G major. Mood: an easy evening in the kitchen, then the plan clicks. Payoff: the end card at bar 12.
Run: python3 cookalong_score.py out.wav"""
import sys, os, numpy as np
sys.path.insert(0, os.environ.get('SOUND_LIB', os.path.expanduser('~/personal-site/.claude/skills/portfolio-demo-music/scripts')))
from sound import *
BPM = 136; B = 60 / BPM; BAR = 4 * B
DUR = 24.733; 
SH = {'chat': 0, 'term': 3 * BAR, 'page': 5 * BAR, 'now': 8 * BAR, 'check': 10 * BAR, 'end': 12 * BAR}
EV = dict(user=.5, typing=1.3, reply=2.0, key=4.0, ringA=SH['term'] + 1.4, ringB=SH['term'] + 2.7, reelring=SH['page'] + 2.2,
          reelstep=SH['page'] + 4.35, nowring=SH['now'] + 1.4, tap=SH['check'] + 1.1, toastring=SH['check'] + 1.6, foot=SH['end'] + 0.92)
drums, music, fx = track(DUR), track(DUR), track(DUR)
CH = {'G': [55, 59, 62, 66], 'Em': [52, 55, 59, 62], 'C': [48, 52, 55, 59], 'D': [50, 54, 57, 60]}
PROG = ['G', 'Em', 'C', 'D']

def brush():
    n = int(0.28 * SR); return lp(hp(rng.standard_normal(n), 900), 5000) * env(n, 0.012, 0.09)
def upright(f, d):
    n = int(d * SR); x = t(n)
    s = np.sin(2 * np.pi * f * x) + 0.3 * np.sin(2 * np.pi * 2 * f * x) * np.exp(-x / 0.15)
    return lp(s, 700) * env(n, 0.006, 0.45)
def ding(f=hz(88), d=1.3):      # kitchen timer
    n = int(d * SR); x = t(n)
    return (np.sin(2 * np.pi * f * x) + 0.25 * np.sin(2 * np.pi * 2.01 * f * x)) * np.exp(-x / 0.35) * np.minimum(1, x / 0.001)

def groove(start, end, level):   # level 1 light, 2 with keys and backbeat, 3 full
    at = start; beat = 0
    while at < end - 1e-6:
        bar = int(round(at / BAR)); ch = CH[PROG[bar % 4]]; pos = beat % 4
        if pos in (0, 2) or level == 3: add(drums, kick(soft=True), at, 0.55 if level < 3 else 0.75)
        if level >= 2 and pos in (1, 3): add(drums, brush(), at, 0.35 if level == 2 else 0.45)
        add(drums, shaker(), at + B / 2, 0.10 if level == 1 else 0.14)
        if level == 3: add(drums, hat(), at + B / 4, 0.05); add(drums, hat(), at + 3 * B / 4, 0.05)
        root = ch[0] - 12
        add(music, upright(hz(root if pos != 2 else root + 7), B * 0.95), at, 0.32 if level < 3 else 0.4)
        if level >= 2 and pos in (0, 2):                     # keys comp on 1 and 3
            for k, m in enumerate(ch): add(music, keys(hz(m + 12), B * 1.6), at + k * 0.012, 0.07 if level == 2 else 0.09)
        if pos == 0: add(music, pad([hz(m + 12) for m in ch[:3]], BAR), at, 0.035)
        at += B; beat += 1

# intro: motif + pad
MOTIF = [67, 71, 74, 78]
for k, m in enumerate(MOTIF): add(music, keys(hz(m + 12), 0.9), 0.25 + k * B / 2, 0.14)
add(music, pad([hz(m + 12) for m in CH['G'][:3]], SH['term'] - 0.2), 0.2, 0.06)
b = BAR
while b < SH['term'] - 1e-6: add(drums, shaker(), b + B / 2, 0.08); b += B
# chat cues
add(fx, pop(True), EV['user'], 0.30)
at = EV['typing']
while at < EV['reply'] - 0.05: add(fx, tick(), at, 0.22); at += 0.11
add(fx, pop(True), EV['reply'], 0.34); add(music, keys(hz(83), 0.6), EV['reply'] + 0.03, 0.06)
add(music, bell(hz(86), 1.2), EV['key'], 0.16)
# grooves
groove(SH['term'], SH['page'], 1)
groove(SH['page'], SH['now'], 2)
groove(SH['now'], SH['check'], 3)
groove(SH['end'], DUR - 1.2, 3)
# cuts
for s in ('term', 'page', 'now', 'check'): add(fx, whoosh(0.6), SH[s] - 0.6, 0.18)
# terminal rings
add(music, bell(hz(83), 1.0), EV['ringA'], 0.14)
add(fx, sparkle(83, (0, 4, 7, 12)), EV['ringB'], 0.16)
# page
add(music, bell(hz(86), 1.0), EV['reelring'], 0.14)
add(fx, pop(True), EV['reelstep'], 0.2)
# now board: ring, then one rising note per dish row
add(music, bell(hz(86), 1.0), EV['nowring'], 0.14)
for k, m in enumerate([79, 83, 86]): add(music, keys(hz(m), 0.5), EV['nowring'] + 0.18 + k * 0.12, 0.10)
# check: drums out, bass pulse only, then the build
at = SH['check']
while at < EV['tap'] - 1e-6: add(music, upright(hz(43), B * 0.9), at, 0.28); at += B
add(music, pad([hz(m + 12) for m in CH['C'][:3]], SH['end'] - SH['check']), SH['check'], 0.05)
add(fx, pop(True), EV['tap'], 0.36)
add(fx, ding(), EV['tap'] + 0.06, 0.20); add(fx, ding(hz(84)), EV['tap'] + 0.24, 0.14)
add(music, bell(hz(86), 1.0), EV['toastring'], 0.12)
build0 = EV['toastring'] + 0.15; hit = SH['end']; gap = 0.12
add(fx, riser(hit - gap - build0), build0, 0.22)
at = build0; k = 0
while at < hit - gap - 0.02:
    p = (at - build0) / (hit - gap - build0)
    add(drums, snap(), at, 0.15 + 0.35 * p); at += B / 2 if p < 0.5 else B / 4
# payoff
add(fx, impact(), hit, 0.55)
for k, m in enumerate(MOTIF): add(music, keys(hz(m + 12), 1.0), hit + k * B / 2, 0.16)
add(fx, sparkle(86, (0, 4, 7, 12)), EV['foot'], 0.14)
# outro: final chord
end_at = DUR - 1.2
for k, m in enumerate(CH['G'] + [74]): add(music, keys(hz(m + 12), 1.4), end_at + k * 0.03, 0.10)
add(music, upright(hz(43), 1.2), end_at, 0.35)
write(master(drums + music + fx, fade_out=0.8), sys.argv[1]); print('ok', DUR)
