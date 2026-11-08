#!/usr/bin/env python3
"""Build a one-file cook-along page from a plan.

    python3 build.py plan.json [-o index.html] [--eat 19:30] [--hobs 4]

Runs the scheduler and checks first (plan.py). Stops if the plan has errors,
unless you pass --force. The output is one self-contained HTML file.
No third-party packages.
"""
import argparse
import json
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
ASSETS = HERE.parent / "assets"
sys.path.insert(0, str(HERE))
from plan import Plan, report  # noqa: E402


def script_safe(text):
    """Text that is safe inside a <script> element."""
    return text.replace("</", "<\\/").replace("<!--", "<\\!--")


FONT_FAMILIES = {
    "libre-caslon-display": "Libre Caslon Display",
    "source-serif-4": "Source Serif 4",
    "ibm-plex-sans-condensed": "IBM Plex Sans Condensed",
    "ibm-plex-mono": "IBM Plex Mono",
    "atkinson-hyperlegible": "Atkinson Hyperlegible",
    "bricolage-grotesque": "Bricolage Grotesque",
}


def font_css():
    """The fonts live in assets/fonts (SIL Open Font License). They go into the page as data,
    so it works offline and makes no request to a font service."""
    import base64
    import re
    rules = []
    for f in sorted((ASSETS / "fonts").glob("*.woff2")):
        m = re.match(r"(.+)-latin-(\d+)-(normal|italic)\.woff2$", f.name)
        if not m or m.group(1) not in FONT_FAMILIES:
            continue
        data = base64.b64encode(f.read_bytes()).decode()
        rules.append(f"@font-face{{font-family:'{FONT_FAMILIES[m.group(1)]}';font-style:{m.group(3)};font-weight:{m.group(2)};"
                     f"font-display:swap;src:url(data:font/woff2;base64,{data}) format('woff2')}}")
    return "<style>/* Fonts: SIL Open Font License 1.1, see assets/fonts */\n" + "\n".join(rules) + "</style>"


def build(plan_data, eat=None, hobs=None):
    out = Plan(plan_data, hobs=hobs, eat=eat).run()
    tpl = (ASSETS / "template.html").read_text()
    engine = (ASSETS / "kit_and_library.js").read_text() + "\n" + (ASSETS / "generic.js").read_text()
    page = (ASSETS / "page.js").read_text()
    title = (out.get("title") or "Cook-along").replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
    plan_json = script_safe(json.dumps(out, ensure_ascii=False, separators=(",", ":")))
    # replace placeholders one at a time, so text inside the plan can never be read as a placeholder
    head, rest = tpl.split("{{PLAN_JSON}}", 1)
    head = head.replace("{{TITLE}}", title).replace("{{FONTS}}", font_css())
    for name, js in (("engine", engine), ("page", page)):
        if "</script" in js.lower():
            raise SystemExit(f"The {name} script contains '</script'. Split that string.")
    rest = rest.replace("{{ENGINE}}", engine, 1)
    rest = rest.replace("{{PAGE}}", page, 1)
    return head + plan_json + rest, out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("plan")
    ap.add_argument("-o", "--out")
    ap.add_argument("--eat")
    ap.add_argument("--hobs", type=int)
    ap.add_argument("--force", action="store_true", help="build even if the plan has errors")
    a = ap.parse_args()
    src = Path(a.plan)
    html, out = build(json.loads(src.read_text()), eat=a.eat, hobs=a.hobs)
    errors = report(out)
    if errors and not a.force:
        print("Not built: fix the errors above, or pass --force.")
        sys.exit(1)
    dest = Path(a.out) if a.out else src.with_name("index.html")
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_text(html)
    print(f"Built {dest} ({len(html) // 1024} KB)")


if __name__ == "__main__":
    main()
