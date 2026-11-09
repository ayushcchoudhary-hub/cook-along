"""Film the cook-along demo from the real salmon example page.
Steps a clock, screenshots at 30 fps, encodes one file per shot, joins them.

    python3 demo/record.py [--only s3] [--stills]

Writes demo/out/cook-along.mp4 (1600 x 1100, silent). Needs Playwright and ffmpeg."""
import argparse, http.server, os, shutil, subprocess, sys, threading, functools
from pathlib import Path
from playwright.sync_api import sync_playwright

HERE = Path(__file__).resolve().parent
FPS = 30
CHECK = "S4"
CLOCK = r"""
(()=>{ if(!location.pathname.endsWith('salmon.html')) return;
 let t=0; const base=new Date('2026-11-08T19:00:00').getTime();
 performance.now=()=>t; Date.now=()=>base+t;
 let q=[]; window.requestAnimationFrame=f=>{q.push(f);return q.length;};
 const iv=[], to=[];
 window.setInterval=(f,ms)=>{iv.push({f,ms,next:t+ms});return iv.length;};
 window.setTimeout=(f,ms)=>{to.push({f,at:t+(ms||0),done:false});return to.length;};
 window.__adv=ms=>{const end=t+ms; while(t<end){t=Math.min(end,t+33.34);
   iv.forEach(x=>{while(x.next<=t){x.next+=x.ms;try{x.f();}catch(e){}}});
   to.forEach(x=>{if(!x.done&&x.at<=t){x.done=true;try{x.f();}catch(e){}}});
   const c=q;q=[];c.forEach(f=>{try{f(t);}catch(e){}});}};
 try{localStorage.clear();}catch(e){}
})();
"""


def serve():
    h = functools.partial(http.server.SimpleHTTPRequestHandler, directory=str(HERE))
    h.log_message = lambda *a: None
    srv = http.server.ThreadingHTTPServer(("127.0.0.1", 8765), h)
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    return srv


SETUP = {
    # iframe id: (hash, scroll target selector, offset css px, pre-advance ms)
    "f3": ("now=18:00", "#reelcv", 38, 9 * 4500 + 150),
    "f4": ("now=19:14", "#now h2", 34, 400),
    "f5": ("now=19:26", "#s-S4 .line", 70, 400),
}


def prepare():
    """Fill the stage from a real run: the person's message, the agent's reply, the plan.py printout and the page."""
    import html, json, re
    cfg = json.loads((HERE / "config.json").read_text())
    shutil.copy(Path(cfg["page"]).expanduser(), HERE / "salmon.html")
    out = Path(cfg["plan_output"]).read_text().rstrip("\n").split("\n")
    lines = ['<span class="dim">$ python3 scripts/plan.py plan.json --eat 19:30</span>']
    for l in out:
        e = html.escape(l)
        if l.strip().startswith("start "):
            m = re.match(r"(\s*)(start \S+  eat \S+)(.*)", e)
            e = f'{m.group(1)}<span class="hi" id="tStart">{m.group(2)}</span>{m.group(3)}'
        elif "errors," in l:
            e = f'<span class="ok" id="tOk">{e}</span>'
        else:
            e = re.sub(r"(\s)wait(\s|$)", r'\1<span class="dim">wait</span>\2', e)
        lines.append(e)
    reply = html.escape(Path(cfg["reply"]).read_text().strip())
    key = html.escape(cfg["key_phrase"])
    assert key in reply, "key_phrase must appear in the reply"
    reply = reply.replace(key, f'<span id="key">{key}</span>', 1)
    reply = "".join(f"<p>{para.strip()}</p>" for para in reply.split("\n\n") if para.strip()).replace("\n", "<br>")
    st = (HERE / "stage.html").read_text()
    st = st.replace("{{TERM}}", "\n".join(lines).replace("`", "\\`")).replace("{{USER}}", html.escape(cfg["user"])).replace("{{REPLY}}", reply)
    (HERE / "stage-run.html").write_text(st)
    SETUP["f3"] = ("now=18:00", "#reelcv", 38, cfg["reel_index"] * 4500 + 150)
    SETUP["f4"] = ("now=" + cfg["now_board"], "#now h2", 34, 400)
    SETUP["f5"] = ("now=" + cfg["now_check"], f"#s-{cfg['check_step']} .line", 70, 400)
    return cfg


def main():
    cfg = prepare()
    global CHECK
    CHECK = cfg["check_step"]
    ap = argparse.ArgumentParser()
    ap.add_argument("--only")
    ap.add_argument("--stills", action="store_true")
    a = ap.parse_args()
    srv = serve()
    out = HERE / "out"; out.mkdir(exist_ok=True)
    with sync_playwright() as p:
        b = p.chromium.launch()
        ctx = b.new_context(viewport={"width": 1600, "height": 1100}, device_scale_factor=1)
        ctx.add_init_script(CLOCK)
        pg = ctx.new_page()
        pg.goto("http://127.0.0.1:8765/stage-run.html")
        for fid, (hsh, sel, off, pre) in SETUP.items():
            pg.evaluate(f"""async()=>{{const f=document.getElementById('{fid}');f.style.height='381px';
              f.src='salmon.html#{hsh}';await new Promise(r=>f.onload=r);}}""")
            fr = pg.frame_locator(f"#{fid}")
            pg.wait_for_timeout(600)
            pg.evaluate(f"""()=>{{const w=document.getElementById('{fid}').contentWindow;w.__adv({pre});
              const el=w.document.querySelector('{sel}');w.scrollTo(0,el.getBoundingClientRect().top+w.scrollY-{off});w.__adv(100);}}""")
        tl = pg.evaluate("TL")
        shots = tl["shots"]
        bar = 4 * 60 / tl["bpm"]
        if a.stills:
            for sh in shots:
                for k, frac in enumerate((0.35, 0.9)):
                    t = sh["from"] + sh["bars"] * bar * frac
                    drive(pg, sh, t, bar, jump=True)
                    pg.screenshot(path=str(out / f"still-{sh['id']}-{k}.jpg"), type="jpeg", quality=92)
            b.close(); srv.shutdown(); return
        parts = []
        for sh in shots:
            if a.only and sh["id"] != a.only:
                parts.append(out / f"{sh['id']}.mp4"); continue
            n = round(sh["bars"] * bar * FPS)
            tmp = out / f"{sh['id']}.tmp.mp4"
            enc = subprocess.Popen(["ffmpeg", "-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", str(FPS), "-c:v", "mjpeg", "-i", "-",
                                    "-c:v", "libx264", "-preset", "veryfast", "-crf", "20", "-pix_fmt", "yuv420p", "-r", str(FPS), str(tmp)], stdin=subprocess.PIPE)
            for i in range(n):
                t = sh["from"] + i / FPS
                drive(pg, sh, t, bar)
                enc.stdin.write(pg.screenshot(type="jpeg", quality=92))
            enc.stdin.close()
            if enc.wait() != 0:
                sys.exit("encode failed")
            tmp.rename(out / f"{sh['id']}.mp4")
            parts.append(out / f"{sh['id']}.mp4")
            print("shot", sh["id"], n, "frames")
        b.close(); srv.shutdown()
    lst = out / "list.txt"
    lst.write_text("".join(f"file '{x.name}'\n" for x in parts))
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", str(lst), "-c", "copy", str(out / "cook-along.tmp.mp4")], check=True)
    (out / "cook-along.tmp.mp4").rename(out / "cook-along.mp4")
    print("done", out / "cook-along.mp4")


def drive(pg, sh, t, bar, jump=False):
    fid = {"s3": "f3", "s4": "f4", "s5": "f5"}.get(sh["id"])
    if fid and not jump:
        pg.evaluate(f"document.getElementById('{fid}').contentWindow.__adv({1000 / FPS})")
    if sh["id"] == "s5":
        ev = sh["events"]
        pg.evaluate(f"""()=>{{const t={t};const f=document.getElementById('f5');const w=f.contentWindow;const d=w.document;
          const btn=d.querySelector('.step [data-fail="{CHECK}"]');const tap=document.getElementById('tap5');
          const r=btn.getBoundingClientRect(),fr=f.parentElement.getBoundingClientRect(),S=2.2564;
          tap.style.left=(fr.left+(r.left+r.width/2)*S)+'px';tap.style.top=(fr.top+(r.top+r.height/2)*S)+'px';
          const p=Math.max(0,Math.min(1,(t-{ev['tap']}+.25)/.25)),q=Math.max(0,Math.min(1,(t-{ev['tap']})/.35));
          tap.style.opacity=t<{ev['tap']}?p:1-q;tap.style.transform=`scale(${{t<{ev['tap']}?1:1-.3*q}})`;
          if(t>={ev['tap']}&&!w.__clicked){{w.__clicked=true;btn.click();}}}}""")
    pg.evaluate(f"frameAt({t})")
    if fid:
        ev = sh.get("events", {})
        sel = {"f3": "#reelcap", "f4": "#nowbox .row", "f5": "#toast"}[fid]
        pg.evaluate(f"""()=>{{const t={t};const r=rectFrame('{fid}','{sel}',14);const el=document.getElementById('r{sh['id'][1]}');
          if(!r||getComputedStyle(document.getElementById('{fid}').contentDocument.querySelector('{sel}')).display==='none'){{el.style.opacity=0;return;}}
          const a=Math.max(0,Math.min(1,(t-{ev.get('ring', 0)})/.3));ringAt(el,r,a);}}""")


if __name__ == "__main__":
    main()
