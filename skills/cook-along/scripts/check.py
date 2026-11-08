#!/usr/bin/env python3
"""Look at a built cook-along page the way a cook would.

    python3 check.py index.html [-o check/]

Writes:
  sheet.png      every step's key picture, in order, with its title (check the pictures make sense)
  phone.png      the top of the page on a 390 px phone
  phone-full.png the whole page on the phone
  phone-dark.png the same in dark mode
  desk.png       the top of the page on a 1280 px screen
Prints any script errors, sideways scroll on the phone, small tap targets and missing pictures.
Exit code 1 if there is a script error or sideways scroll.

Needs Playwright with Chromium (pip install playwright; playwright install chromium).
"""
import argparse
import sys
from pathlib import Path

from playwright.sync_api import sync_playwright

SHEET_JS = """
() => {
  const plan = JSON.parse(document.getElementById('plan').textContent);
  const C = plan._computed.steps;
  const steps = plan.steps.slice().sort((a, b) => C[a.id].start - C[b.id].start);
  const cols = 3, s = 0.5, w = PW * s, h = PH * s, capH = 40, pad = 8;
  const rows = Math.ceil(steps.length / cols);
  const cv = document.createElement('canvas');
  cv.width = cols * (w + pad) + pad; cv.height = rows * (h + capH + pad) + pad;
  const c = cv.getContext('2d');
  c.fillStyle = '#fff'; c.fillRect(0, 0, cv.width, cv.height);
  const fallbacks = [];
  steps.forEach((st, i) => {
    const x = pad + (i % cols) * (w + pad), y = pad + Math.floor(i / cols) * (h + capH + pad);
    const sc = sceneOf(st.scene, st.title);
    if (st.scene && (st.scene.use || st.scene.kind) && sc.fallback) fallbacks.push(st.id);
    c.save(); c.translate(x, y); c.scale(s, s); c.beginPath(); c.rect(0, 0, PW, PH); c.clip();
    try { sc.draw(c, sc.key != null ? sc.key : sc.loop * .78); } catch (e) { fallbacks.push(st.id + ' (error: ' + e.message + ')'); }
    c.restore();
    c.fillStyle = '#15171C'; c.font = '600 13px sans-serif';
    c.fillText(`${i} · ${st.id} · ${st.title}`.slice(0, 52), x, y + h + 16);
    c.fillStyle = '#7E838C'; c.font = '12px sans-serif';
    c.fillText(`${C[st.id].clock} · ${(st.line || '').slice(0, 50)}`, x, y + h + 32);
  });
  return {png: cv.toDataURL('image/png'), fallbacks};
}
"""

AUDIT_JS = """
() => {
  const out = {scroll: document.documentElement.scrollWidth > innerWidth + 1, wide: [], small: []};
  document.querySelectorAll('main *').forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.width && r.right > innerWidth + 1 && getComputedStyle(el).position !== 'fixed') out.wide.push((el.id || el.className || el.tagName) + ' ' + Math.round(r.right));
  });
  document.querySelectorAll('button, input, a, summary').forEach(el => {
    if ((el.labels && el.labels.length) || (el.tagName === 'A' && el.closest('p'))) return; /* labels and inline links are fine */
    const r = el.getBoundingClientRect();
    if (r.width && r.height && (r.height < 32 || r.width < 32)) out.small.push((el.textContent || el.id || el.tagName).trim().slice(0, 24) + ` ${Math.round(r.width)}x${Math.round(r.height)}`);
  });
  out.wide = out.wide.slice(0, 8); out.small = [...new Set(out.small)].slice(0, 12);
  return out;
}
"""


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("page")
    ap.add_argument("-o", "--out")
    ap.add_argument("--now", help="clock time to show on the 'now' board, HH:MM (default: 10 min after the plan starts)")
    a = ap.parse_args()
    page_path = Path(a.page).resolve()
    out = Path(a.out) if a.out else page_path.parent / "check"
    out.mkdir(parents=True, exist_ok=True)
    bad = 0
    now = a.now
    if not now:
        import json, re
        m = re.search(r'<script type="application/json" id="plan">(.*?)</script>', page_path.read_text(), re.S)
        c = json.loads(m.group(1).replace("<\\/", "</"))["_computed"]
        h, mi = map(int, c["start_at"].split(":"))
        t = (h * 60 + mi + 10) % 1440
        now = f"{t // 60:02d}:{t % 60:02d}"
    with sync_playwright() as p:
        b = p.chromium.launch()
        for name, vw, vh in (("phone", 390, 844), ("desk", 1280, 900)):
            ctx = b.new_context(viewport={"width": vw, "height": vh}, device_scale_factor=2 if vw < 500 else 1,
                                locale="en-GB", timezone_id="Europe/London")
            pg = ctx.new_page()
            errs = []
            pg.on("pageerror", lambda e: errs.append(str(e)))
            pg.on("console", lambda m: errs.append(m.text) if m.type == "error" and "fonts.g" not in m.text else None)
            pg.goto(page_path.as_uri() + "#now=" + now)
            pg.wait_for_timeout(1500)
            pg.screenshot(path=str(out / f"{name}.png"))
            if name == "phone":
                pg.add_style_tag(content="nav.bar{display:none!important}")
                pg.screenshot(path=str(out / "phone-full.png"), full_page=True)
                pg.add_style_tag(content="nav.bar{display:block!important}")
            audit = pg.evaluate(AUDIT_JS)
            if name == "phone":
                res = pg.evaluate(SHEET_JS)
                import base64
                (out / "sheet.png").write_bytes(base64.b64decode(res["png"].split(",", 1)[1]))
                if res["fallbacks"]:
                    print(f"  pictures that fell back to a plain card: {', '.join(res['fallbacks'])}")
                pg.click('#theme button[data-t="dark"]')
                pg.wait_for_timeout(300)
                pg.screenshot(path=str(out / "phone-dark.png"))
                pg.click('#theme button[data-t="light"]')
                # press a timer and a check, to be sure the buttons work
                t = pg.query_selector("[data-timer]")
                if t:
                    t.click()
                    pg.wait_for_timeout(1200)
                    if not pg.inner_text("#timers").strip():
                        print("  timer button did not start a timer"); bad += 1
                f = pg.query_selector(".step [data-fail]")
                if f:
                    f.click()
                    pg.wait_for_timeout(300)
                    if "late" not in pg.inner_text("#planbar"):
                        print("  'not yet' did not move dinner"); bad += 1
            print(f"{name} {vw}px: {len(errs)} script errors")
            for e in errs[:6]:
                print("   ", e)
            if audit["scroll"]:
                print(f"  sideways scroll: {audit['wide']}")
            if audit["small"]:
                print(f"  small tap targets: {audit['small']}")
            bad += len(errs) + (1 if audit["scroll"] else 0)
            ctx.close()
        b.close()
    print(f"Pictures in {out}/")
    sys.exit(1 if bad else 0)


if __name__ == "__main__":
    main()
