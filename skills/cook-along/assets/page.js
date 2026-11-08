/* Cook-along page renderer. Reads the plan JSON (with _computed from plan.py) and builds the page.
   Every string from the plan is escaped before it reaches the DOM. */
(function(){
const PLAN=JSON.parse(document.getElementById('plan').textContent);
const C=PLAN._computed||{steps:{}};
const SAFE=PLAN._safety||{};
const app=document.getElementById('app');
if(typeof registerParts==='function')registerParts(PLAN.parts);
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const slugId=x=>String(x).toLowerCase().replace(/[^a-z0-9]+/g,'-');
const KEY='cook-along:'+(PLAN.slug||'recipe')+':';
const LS={get(k,d){try{const v=localStorage.getItem(KEY+k);return v==null?d:JSON.parse(v);}catch(e){return d;}},set(k,v){try{localStorage.setItem(KEY+k,JSON.stringify(v));}catch(e){}}};
const toMin=s=>{const p=String(s||'19:30').split(':').map(Number);return p[0]*60+(p[1]||0);};
const fmt=m=>{m=((Math.round(m)%1440)+1440)%1440;return String(Math.floor(m/60)).padStart(2,'0')+':'+String(m%60).padStart(2,'0');};
const fmtDur=m=>{m=Math.round(m);if(m<60)return m+' min';const h=Math.floor(m/60),r=m%60;return h+' h'+(r?' '+r+' min':'');};
const typ=s=>{const d=s.duration;return typeof d==='number'?d:(d&&(d.typ||d.min))||1;};
const durText=s=>{const d=s.duration;if(typeof d==='number'||!d)return fmtDur(typ(s));if(d.min&&d.max&&d.min!==d.max)return d.max<60?`${d.min}–${d.max} min`:`${fmtDur(d.min)} to ${fmtDur(d.max)}`;return fmtDur(d.typ||d.min);};
const hash=new URLSearchParams(location.hash.slice(1));
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- state ---------- */
let eat=hash.get('eat')?toMin(hash.get('eat')):LS.get('eat',toMin(C.eat_at||PLAN.eat_at));
let shifts=LS.get('shifts',[]);let oven=LS.get('oven',(PLAN.kitchen&&PLAN.kitchen.oven_type)||'fan');
let done=LS.get('done',{});let have=LS.get('have',{});let timers=LS.get('timers',{});
const STEPS=PLAN.steps.slice().sort((a,b)=>(C.steps[a.id]||{}).start-(C.steps[b.id]||{}).start);
const BYID=Object.fromEntries(PLAN.steps.map(s=>[s.id,s]));
const DISH=Object.fromEntries((PLAN.dishes||[]).map((d,i)=>[d.id,Object.assign({col:`var(--d${(i%6)+1})`},d)]));
const inDish=(s,d)=>s.dish===d||(s.also||[]).includes(d);
const dishOf=s=>DISH[s.dish]||{name:s.dish||'',col:'var(--ink-3)'};
const rel=id=>(C.steps[id]||{start:0,end:0});
const shiftAt=r=>shifts.reduce((a,sh)=>a+(r>=sh.at-0.01?sh.add:0),0);
const totalShift=()=>shifts.reduce((a,sh)=>a+sh.add,0);
const clockStart=id=>eat+rel(id).start+shiftAt(rel(id).start);
const clockEnd=id=>eat+rel(id).end+shiftAt(rel(id).start);
const eatNow=()=>eat+totalShift();
function nowMin(){if(hash.get('now'))return toMin(hash.get('now'))+(performance.now()-T0)/60000;const d=new Date();return d.getHours()*60+d.getMinutes()+d.getSeconds()/60;}
const T0=performance.now();
function nowRel(){let n=nowMin();const first=clockStart(STEPS[0].id);if(n<first-720)n+=1440;return n;}
const save=()=>{LS.set('eat',eat);LS.set('shifts',shifts);LS.set('oven',oven);LS.set('done',done);LS.set('have',have);LS.set('timers',timers);};

/* ---------- chips ---------- */
function chipHTML(c){const t=String(c);let cls='';if(/conventional/i.test(t))cls=' hot'+(oven==='fan'?' dim':'');else if(/\bfan\b/i.test(t))cls=' fan'+(oven==='conv'?' dim':'');return `<span class="chip${cls}">${esc(t)}</span>`;}
function holdHTML(s){const h=s.hold;if(!h)return'';if(h.max===0)return '<span class="hold now">Serve now</span>';
 if(s.ahead){const nx=PLAN.steps.filter(x=>(x.after||[]).includes(s.id)).map(x=>clockStart(x.id));const need=nx.length?Math.min(...nx):clockEnd(s.id);const ear=eat+((C.steps[s.id]||{}).earliest??-1e9);const from=Math.max(need-h.max-typ(s),ear);return from<clockStart(s.id)-4?`<span class="hold ok">Can do from ${fmt(from)}</span>`:'';}
 return `<span class="hold ok">Keeps ${esc(fmtDur(h.max))}${h.how?' ('+esc(h.how)+')':''}</span>`;}

/* ---------- sections ---------- */
function header(){const k=`Serves ${esc(PLAN.serves)} · ${fmtDur(C.total_min||0)} · ${fmtDur(C.hands_on_min||0)} hands‑on`;
 return `<div class="topbar"><div class="kick">${k}</div><div class="seg" id="theme" role="group" aria-label="Theme"><button type="button" data-t="light" aria-pressed="true">Light</button><button type="button" data-t="dark" aria-pressed="false">Dark</button></div></div>
 <h1>${esc(PLAN.title)}</h1><p class="dek">${esc(PLAN.summary||'')}</p><div class="planbar" id="planbar"></div>`;}
function planbar(){const first=clockStart(STEPS[0].id),sh=totalShift();const busy=C.busiest||{};
 return `<label for="eatat">Eat at</label><input type="time" id="eatat" value="${fmt(eatNow())}"><button class="btn" type="button" id="startnow">Start now</button>
 ${(C.oven||[]).length?`<div class="seg" role="group" aria-label="Oven type"><button type="button" data-oven="fan" aria-pressed="${oven==='fan'}">Fan oven</button><button type="button" data-oven="conv" aria-pressed="${oven==='conv'}">Conventional</button></div>`:''}
 <div class="sum">Start at <b>${fmt(first)}</b>. ${C.rings_used?`Uses <b>${esc(C.rings_used)}</b> of your <b>${esc((PLAN.kitchen||{}).hobs??4)}</b> rings${C.peak_pans&&C.peak_pans.count>1?`, <b>${esc(C.peak_pans.count)}</b> pans at once`:''}.`:(C.oven&&C.oven.length?'Oven only, no rings.':'')}${sh?` <b>Running ${sh} min late.</b> <button class="btn" type="button" id="resetshift">Reset</button>`:''}</div>`;}
function reel(){return `<section class="unit" id="reel"><div class="un">The whole dinner</div><h2>Every step in about ${Math.round(STEPS.length*4.5/10)*10} seconds</h2>
 <canvas class="sc" id="reelcv" role="img" aria-label="All steps played in order"></canvas><p class="reelcap" id="reelcap" aria-live="off"></p><div class="ctrls"><button class="btn" type="button" id="reelplay">Pause</button><button class="btn" type="button" id="reelgo">Open this step</button><span id="reelpos" aria-live="off"></span></div>
 <details open><summary>Every step at a glance</summary><div class="board" id="sboard">${STEPS.map((s,i)=>`<button type="button" data-go="${esc(s.id)}"><canvas width="10" height="10" aria-hidden="true"></canvas><span>${i} · ${esc(s.title)}</span></button>`).join('')}</div></details></section>`;}
function need(){const groups={};(PLAN.ingredients||[]).forEach(g=>{(groups[g.dish]=groups[g.dish]||[]).push(g);});
 const ing=Object.entries(groups).map(([d,list])=>{const D=DISH[d]||{name:d,col:'var(--ink-3)'};return `<div><h3><span class="dot" style="background:${D.col}"></span>${esc(D.name)}</h3><ul>${list.map(g=>{const id='have-'+slugId(g.key);return `<li><input type="checkbox" id="${id}" data-have="${esc(g.key)}" ${have[g.key]?'checked':''}><label for="${id}">${/^(\d|about|½|¼|¾)/i.test(g.qty||'')?`<b>${esc(g.qty)}</b> ${esc(g.item||g.key)}`:`${esc(g.item||g.key)}${g.qty?`, <b>${esc(g.qty)}</b>`:''}`}${g.label&&g.label!=='source'?`<span class="lbl">${esc(g.label)}</span>`:''}${g.note?` <span style="color:var(--ink-3)">${esc(g.note)}</span>`:''}</label></li>`;}).join('')}</ul></div>`;}).join('');
 const eq=(PLAN.equipment||[]).map(e=>`<li><input type="checkbox" id="eq-${slugId(e)}" data-have="eq:${esc(e)}" ${have['eq:'+e]?'checked':''}><label for="eq-${slugId(e)}">${esc(e)}</label></li>`).join('');
 const rings={};STEPS.forEach(s=>{const r=(C.steps[s.id]||{}).ring;if(r)(rings[r]=rings[r]||[]).push(s);});
 const ringTxt=Object.keys(rings).sort().map(r=>`<div><b>Ring ${esc(r)}</b>: ${rings[r].map(s=>`${esc(s.title)} <span style="color:var(--ink-3)">${fmt(clockStart(s.id))}</span>`).join(' → ')}</div>`).join('');
 const ov=(C.oven||[]).reduce((a,o)=>{if(!a.length||a[a.length-1].setting!==o.setting)a.push(o);return a;},[]).map(o=>`<div><b>Oven ${esc(ovenText(o.setting))}</b> from ${fmt(eat+o.from+shiftAt(o.from))}</div>`).join('');
 return `<section class="unit" id="need"><div class="un">Before you start</div><h2>What you need</h2><div class="need">${ing}<div><h3>Equipment</h3><ul>${eq}</ul></div></div>
 <div class="kitchen"><h3 class="un" style="margin:.4rem 0">Your kitchen plan</h3>${ov}${ringTxt}${C.peak_pans&&C.peak_pans.count>1?`<div>At the busiest moment: <b>${esc(C.peak_pans.count)} pans</b> on the go (${esc((C.peak_pans.which||[]).join(', '))}).</div>`:''}</div></section>`;}
function ovenText(s){const m=String(s).match(/(\d+)(fan|conv)?/);if(!m)return s;const n=+m[1];const fan=m[2]!=='conv';const conv=fan?n+20:n,f=fan?n:n-20;return oven==='fan'?`${f}°C fan (${conv}°C conventional)`:`${conv}°C conventional (${f}°C fan)`;}
function timeline(){const dishes=(PLAN.dishes||[]).map(d=>d.id);const first=Math.min(...STEPS.map(s=>rel(s.id).start)),last=0;
 const act=STEPS.filter(s=>(s.hands||'active')==='active').map(s=>[rel(s.id).start,rel(s.id).end]).sort((a,b)=>a[0]-b[0]);
 const segs=[];let cur=first;act.forEach(([a,b])=>{if(a-cur>40){segs.push([cur,a,true]);}cur=Math.max(cur,b);});if(last-cur>40)segs.push([cur,last,true]);
 const span=(last-first)-segs.reduce((x,[a,b])=>x+(b-a-18),0);const W=372,X0=92;
 const X=t=>{let off=0;for(const[a,b]of segs){if(t>=b)off+=(b-a-18);else if(t>a){off+=(t-a)*(1-18/(b-a));break;}}return X0+((t-first)-off)/span*W;};
 const lh=40,H=dishes.length*lh+44;let svg=`<svg viewBox="0 0 470 ${H}" role="img" aria-label="Timeline by dish in clock time"><defs>${dishes.map((d,i)=>`<pattern id="h${i}" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="3" height="6" style="fill:${DISH[d].col}" opacity=".55"/></pattern>`).join('')}</defs>`;
 dishes.forEach((d,i)=>{const y=10+i*lh;svg+=`<text x="0" y="${y+20}" class="ln">${esc(DISH[d].name.length>11?DISH[d].name.slice(0,10)+"…":DISH[d].name)}</text><line x1="${X0}" x2="${X0+W}" y1="${y+28}" y2="${y+28}" style="stroke:var(--rule)"/>`;
  STEPS.filter(s=>inDish(s,d)).forEach(s=>{const r=rel(s.id);const x0=X(r.start),x1=Math.max(X(r.end),x0+3);const a=(s.hands||'active')==='active';svg+=`<rect x="${x0.toFixed(1)}" y="${y+6}" width="${(x1-x0).toFixed(1)}" height="22" rx="3" style="fill:${a?DISH[d].col:`url(#h${i})`};stroke:${DISH[d].col}"><title>${esc(s.title)} ${fmt(clockStart(s.id))}</title></rect>`;if(s.check)svg+=`<path d="M${x1.toFixed(1)} ${y+3} l6 12 l-6 12 l-6 -12z" style="fill:var(--paper);stroke:var(--c-risk);stroke-width:2"/>`;});});
 segs.forEach(([a,b])=>{const x=(X(a)+X(b))/2;svg+=`<text x="${x}" y="${H-24}" class="tick" text-anchor="middle">≈ ${esc(fmtDur(b-a))}</text>`;});
 const q15=[];for(let t=Math.ceil((eat+first)/15)*15-eat;t<last;t+=15)q15.push(t);const tk=[first,...q15,...segs.flatMap(([a,b])=>[a,b])].sort((a,b)=>a-b);const keep=[];tk.forEach(t=>{if(!keep.length||X(t)-X(keep[keep.length-1])>=54)keep.push(t);});while(keep.length&&X(last)-X(keep[keep.length-1])<54)keep.pop();keep.push(last);keep.forEach(t=>{const x=X(t);svg+=`<text x="${x.toFixed(1)}" y="${H-6}" class="tick" text-anchor="${x>X0+W-24?'end':x<X0+24?'start':'middle'}">${fmt(eat+t+shiftAt(t))}</text>`;});
 svg+='</svg>';return `<section class="unit tl" id="plan"><div class="un">The plan</div><h2>Who is doing what, and when</h2>${svg}<p class="foot" style="margin-top:.4rem">Solid bars: hands-on. Striped: waiting. Red diamond: a check you decide. Long waits are squeezed to fit.</p></section>`;}
function stepHTML(s,i){const D=dishOf(s);const t=typ(s);const passive=(s.hands||'active')!=='active';
 const aria=[s.scene&&s.scene.cap,(s.scene&&s.scene.tags||[]).map(x=>typeof x==='string'?x:x.text).join('. '),s.done].filter(Boolean).join('. ');
 const timer=(passive&&t>=2)||s.timer?`<button class="btn tbtn" type="button" data-timer="${esc(s.id)}">▶ ${esc(fmtDur(t))} timer</button>`:'';
 const chk=s.check?`<button class="btn good" type="button" data-pass="${esc(s.id)}">✓ ${esc(s.check.pass||'Passed')}</button><button class="btn bad" type="button" data-fail="${esc(s.id)}">${esc(s.check.fail||'Not yet')}: +${esc(s.check.fallback||5)} min</button>`:'';
 return `<article class="step" id="s-${esc(s.id)}" data-id="${esc(s.id)}"><div class="head"><span class="n">${i}</span><span class="dtag" style="background:${D.col}">${esc(D.name)}</span><h3>${esc(s.title)}</h3><span class="when" data-when="${esc(s.id)}">${fmt(clockStart(s.id))} · ${esc(durText(s))}</span></div>
 <canvas class="sc" data-step="${esc(s.id)}" role="img" aria-label="${esc(aria||s.title)}"></canvas>
 <p class="line">${esc(s.line||'')}</p><div class="chips">${(s.chips||[]).map(chipHTML).join('')}${holdHTML(s)}${s.optional?'<span class="chip">Optional</span>':''}</div>
 ${s.check&&s.check.cue?`<p class="cue">${s.check.probe?'Probe: ':'Check: '}${esc(s.check.cue)}</p>`:''}${timer||chk?`<div class="acts">${timer}${chk}</div>`:''}
 ${(s.full&&s.full.length)||s.done?`<details class="full"><summary>${s.full&&s.full.length?'Full steps':'Done when'}</summary>${s.full&&s.full.length?`<ol>${s.full.map(f=>`<li>${esc(f)}</li>`).join('')}</ol>`:''}${s.done?`<p class="foot">Done when: ${esc(s.done)}</p>`:''}</details>`:''}</article>`;}
function foot(){const safe=[...new Set((C.safety||[]).map(k=>SAFE[k]).filter(Boolean))];
 return `<section class="unit" id="about"><div class="un">About this page</div>
 ${PLAN.changes&&PLAN.changes.length?`<details><summary>What the planner changed from the source (${PLAN.changes.length})</summary><ul class="foot">${PLAN.changes.map(c=>`<li><b>${esc(c.what)}.</b> ${esc(c.why)}</li>`).join('')}</ul></details>`:''}
 <div class="foot"><p><b>Sources.</b> ${(PLAN.sources||[]).map(s=>s.url?`<a href="${esc(s.url)}" rel="noopener noreferrer">${esc(s.name)}</a>${s.use?' ('+esc(s.use)+')':''}`:`${esc(s.name)}${s.use?' ('+esc(s.use)+')':''}`).join('. ')}</p>
 ${safe.length?`<p><b>Food safety.</b> ${safe.map(x=>esc(/[.!]$/.test(x)?x:x+'.')).join(' ')} See the <a href="https://www.food.gov.uk/safety-hygiene/cooking-your-food" rel="noopener noreferrer">Food Standards Agency guidance</a>.</p>`:''}
 <p>Home recipe, not professionally tested. Times are estimates. The checks decide, not the clock. Amounts marked "suggested" were added by the planner.</p><p>Made with the cook-along skill.</p></div></section>`;}
function nowBoard(){const n=nowRel();const first=clockStart(STEPS[0].id);let head,body='';
 const pending=STEPS.filter(s=>!done[s.id]);
 if(n<first-0.5){head=`Starts at ${fmt(first)}`;}else if(n>eatNow()+5){head='Time to eat. Enjoy.';}else head=`Now ${fmt(n)}`;
 const rows=(PLAN.dishes||[]).map(d=>{const ds=STEPS.filter(s=>inDish(s,d.id));const running=ds.find(s=>!done[s.id]&&clockStart(s.id)<=n&&n<clockEnd(s.id));const next=ds.find(s=>!done[s.id]&&clockStart(s.id)>n);const D=DISH[d.id];
  let st,tm='';if(running){st=running.dish===d.id?esc(running.title):'Cooking with the '+esc((DISH[running.dish]||{name:''}).name.toLowerCase());tm=Math.max(0,Math.ceil(clockEnd(running.id)-n))+' min left';}else if(next){st='Next: '+esc(next.title);tm=fmt(clockStart(next.id));}else{const lastS=ds[ds.length-1];st=lastS&&lastS.hold&&lastS.hold.max&&!lastS.ahead?`Ready. Keeps to ${fmt(clockEnd(lastS.id)+lastS.hold.max)}`:(lastS&&lastS.ahead?'Prepped, waiting':'Done');}
  return `<div class="row" data-go="${esc((running||next||ds[ds.length-1]||{}).id||'')}"><span class="dot" style="background:${D.col}"></span><span><b>${esc(D.name)}</b> <span class="st">${st}</span></span><span class="tm">${tm}</span></div>`;}).join('');
 const q=pending.filter(s=>(s.hands||'active')==='active'&&clockEnd(s.id)>n).slice(0,3);
 body=`<div class="q">${q.map((s,i)=>`<div><span class="t">${i?'~':''}${fmt(clockStart(s.id))}</span><span class="a">${esc(s.title)}</span>${s.check&&i===0?`<button class="btn good" type="button" data-pass="${esc(s.id)}">✓</button><button class="btn bad" type="button" data-fail="${esc(s.id)}">+${esc(s.check.fallback||5)}</button>`:`<button class="btn" type="button" data-done="${esc(s.id)}">Done</button>`}</div>`).join('')||'<div>Nothing left to do.</div>'}</div>`;
 const late=totalShift()?`<div class="banner">Running ${totalShift()} min late. Food now ready at about ${fmt(eatNow())}.</div>`:'';
 return `<div class="clock">${head}</div>${late}${rows}${body}`;}

/* ---------- build ---------- */
app.innerHTML=header()+reel()+need()+timeline()+`<section class="unit" id="now"><div class="un">Cooking now</div><h2>Where every dish is</h2><div class="now" id="nowbox" aria-live="polite"></div></section><section id="steps" aria-label="Steps">${STEPS.map(stepHTML).join('')}</section>`+foot();
function refresh(){document.getElementById('planbar').innerHTML=planbar();document.getElementById('nowbox').innerHTML=nowBoard();document.querySelectorAll('[data-when]').forEach(el=>{const s=BYID[el.dataset.when];el.textContent=`${fmt(clockStart(s.id))} · ${durText(s)}`;});document.querySelectorAll('.chips').forEach((el,i)=>{const s=STEPS[i];if(s)el.innerHTML=(s.chips||[]).map(chipHTML).join('')+holdHTML(s)+(s.optional?'<span class="chip">Optional</span>':'');});}
refresh();

/* ---------- scenes ---------- */
const dpr=Math.min(2,window.devicePixelRatio||1);
function prep(cv,w,h,scale){cv.width=w*dpr*scale;cv.height=h*dpr*scale;const c=cv.getContext('2d');c.setTransform(dpr*scale,0,0,dpr*scale,0,0);c.lineJoin='round';c.lineCap='round';return c;}
function safeDraw(c,sc,t){c.save();try{c.clearRect(0,0,PW,PH);sc.draw(c,t);}catch(e){c.restore();c.save();c.clearRect(0,0,PW,PH);KINDS.card.draw(c,1,{title:'Picture unavailable'});console.warn('scene failed',e);}c.restore();}
const keyT=sc=>sc.key!=null?sc.key:sc.loop*.78;
const units=[...document.querySelectorAll('canvas.sc[data-step]')].map(cv=>{const s=BYID[cv.dataset.step];return {cv,c:prep(cv,PW,PH,1),sc:sceneOf(s.scene,s.title),vis:0,start:0,loops:0};});
const io=new IntersectionObserver(es=>es.forEach(e=>{const u=units.find(x=>x.cv===e.target);if(!u)return;u.vis=e.isIntersecting?e.intersectionRatio:0;if(e.isIntersecting&&!u.on){u.on=true;u.start=performance.now();u.loops=0;}if(!e.isIntersecting)u.on=false;}),{threshold:[0,.3,.6,1]});
units.forEach(u=>{io.observe(u.cv);safeDraw(u.c,u.sc,keyT(u.sc));u.cv.addEventListener('click',()=>{u.start=performance.now();u.loops=0;u.on=true;});});
const thumbs=[...document.querySelectorAll('#sboard canvas')].map((cv,i)=>({c:prep(cv,PW,PH,.5),sc:sceneOf(STEPS[i].scene,STEPS[i].title)}));
function drawThumbs(){thumbs.forEach(t=>safeDraw(t.c,t.sc,keyT(t.sc)));units.forEach(u=>{if(!u.on||reduce)safeDraw(u.c,u.sc,keyT(u.sc));});}
const reelcv=document.getElementById('reelcv'),rc=prep(reelcv,PW,PH,1);let reelOn=!reduce,reelT=0,last=performance.now(),lastDraw=0;const SEG=4.5,TOTAL=STEPS.length*SEG;
const reelScenes=STEPS.map(s=>sceneOf(s.scene,s.title));let reelIdx=-1;
function drawReel(){const i=Math.min(STEPS.length-1,Math.floor(reelT/SEG)),f=(reelT-i*SEG)/SEG;const sc=reelScenes[i];safeDraw(rc,sc,reduce?keyT(sc):Math.min(sc.loop-.5,f*(sc.loop-.5)));
 rc.save();rc.fillStyle='#C4291F';rc.fillRect(0,PH-4,PW*(reelT/TOTAL),4);rc.restore();
 if(reelIdx!==i){reelIdx=i;document.getElementById('reelcap').textContent=`${i} · ${STEPS[i].title}`;document.getElementById('reelpos').textContent=`Picture ${i+1} of ${STEPS.length}`;}document.querySelectorAll('#sboard button').forEach((b,k)=>b.classList.toggle('on',k===i));}
document.getElementById('reelplay').onclick=e=>{reelOn=!reelOn;e.target.textContent=reelOn?'Pause':'Play';};
document.getElementById('reelgo').onclick=()=>go(STEPS[Math.min(STEPS.length-1,Math.floor(reelT/SEG))].id);
function frame(now){const dt=Math.min(.1,(now-last)/1000);last=now;FACES=true;
 if(now-lastDraw>=33){lastDraw=now;
  const r=reelcv.getBoundingClientRect();if(r.bottom>0&&r.top<innerHeight)drawReel();
  if(!reduce){const mid=innerHeight/2;const live=units.filter(u=>u.on&&u.loops<3).sort((a,b)=>Math.abs(a.cv.getBoundingClientRect().top+a.cv.clientHeight/2-mid)-Math.abs(b.cv.getBoundingClientRect().top+b.cv.clientHeight/2-mid)).slice(0,2);
   live.forEach(u=>{const tt=(now-u.start)/1000;u.loops=Math.floor(tt/u.sc.loop);if(u.loops>=3){safeDraw(u.c,u.sc,keyT(u.sc));return;}safeDraw(u.c,u.sc,tt%u.sc.loop);});}}
 requestAnimationFrame(frame);}
let reelLast=performance.now();
setInterval(()=>{const now=performance.now();if(reelOn)reelT=(reelT+(now-reelLast)/1000)%TOTAL;reelLast=now;},100);
requestAnimationFrame(frame);
if(reduce){reelOn=false;document.getElementById('reelplay').textContent='Play';}

/* ---------- navigation ---------- */
let cur=-1;
function go(id){const el=document.getElementById('s-'+id);if(el)el.scrollIntoView({behavior:reduce?'auto':'smooth',block:'start'});}
const sio=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){cur=STEPS.findIndex(s=>s.id===e.target.dataset.id);document.getElementById('where').textContent=`${cur} · ${STEPS[cur].title}`;}}),{rootMargin:'-30% 0px -60% 0px'});
document.querySelectorAll('.step').forEach(el=>sio.observe(el));
document.getElementById('next').onclick=()=>go(STEPS[Math.min(STEPS.length-1,cur+1)].id);
document.getElementById('prev').onclick=()=>{if(cur<=0)document.getElementById('need').scrollIntoView({behavior:'smooth'});else go(STEPS[cur-1].id);};
document.getElementById('nowbtn').onclick=()=>document.getElementById('now').scrollIntoView({behavior:reduce?'auto':'smooth'});

/* ---------- timers: end time stored, so a refresh or a locked phone keeps them right ---------- */
let AC=null,lock=null;
function unlock(){try{if(!AC)AC=new (window.AudioContext||window.webkitAudioContext)();if(AC.state==='suspended')AC.resume();}catch(e){}
 if('wakeLock' in navigator&&!lock){navigator.wakeLock.request('screen').then(l=>{lock=l;l.addEventListener('release',()=>{lock=null;});}).catch(()=>{});}}
document.addEventListener('pointerdown',unlock);document.addEventListener('visibilitychange',()=>{if(!document.hidden&&!lock&&AC)unlock();});
function beep(){if(!AC)return;try{const t0=AC.currentTime;[0,.35,.7,1.4,1.75,2.1].forEach(o=>{const os=AC.createOscillator(),g=AC.createGain();os.frequency.value=880;g.gain.setValueAtTime(0,t0+o);g.gain.linearRampToValueAtTime(.3,t0+o+.02);g.gain.linearRampToValueAtTime(0,t0+o+.25);os.connect(g);g.connect(AC.destination);os.start(t0+o);os.stop(t0+o+.3);});}catch(e){}}
function toast(html,goId){const el=document.getElementById('toast');el.innerHTML=html+(goId?` <button type="button" data-go="${esc(goId)}">Go to step</button>`:'')+` <button type="button" data-close>OK</button>`;el.hidden=false;}
function nextAfter(id){const i=STEPS.findIndex(s=>s.id===id);return STEPS.slice(i+1).find(s=>(s.hands||'active')==='active');}
function drawTimers(){const el=document.getElementById('timers');const now=Date.now();el.innerHTML=Object.entries(timers).map(([k,v])=>{const left=v.end-now;const s=Math.max(0,Math.ceil(left/1000));const txt=left<=0?'done':(s>=3600?Math.floor(s/3600)+':':'')+String(Math.floor(s%3600/60)).padStart(s>=3600?2:1,'0')+':'+String(s%60).padStart(2,'0');const lb=v.label.length>16?v.label.slice(0,15)+'…':v.label;return `<span class="tgrp"><button class="tchip${left<=0?' done':''}" type="button" data-go="${esc(v.step)}">${esc(lb)} ${txt}</button><button class="tchip x" type="button" data-clear="${esc(k)}" aria-label="Clear timer">×</button></span>`;}).join('');
 Object.entries(timers).forEach(([k,v])=>{if(v.end<=now&&!v.alerted){v.alerted=true;save();beep();try{navigator.vibrate&&navigator.vibrate([300,150,300]);}catch(e){}const nx=nextAfter(v.step);toast(`⏰ ${esc(v.label)} is done.${nx?' Next: '+esc(nx.title)+'.':''}`,v.step);}});}
setInterval(drawTimers,1000);drawTimers();setInterval(()=>{document.getElementById('nowbox').innerHTML=nowBoard();},15000);

/* ---------- actions ---------- */
document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const d=b.dataset;
 if(d.go){go(d.go);document.getElementById('toast').hidden=true;}
 else if(d.close!==undefined)document.getElementById('toast').hidden=true;
 else if(d.timer){const s=BYID[d.timer];timers[s.id]={label:s.title,step:s.id,end:Date.now()+typ(s)*60000};save();drawTimers();}
 else if(d.clear){delete timers[d.clear];save();drawTimers();}
 else if(d.pass){done[d.pass]=true;save();refresh();toast(`Passed. Carry on: ${esc((nextAfter(d.pass)||{}).title||'serve')}.`,(nextAfter(d.pass)||{}).id);}
 else if(d.fail){const s=BYID[d.fail];const add=s.check.fallback||5;shifts.push({at:rel(s.id).end,add});timers[s.id+'-fb']={label:s.title+' (again)',step:s.id,end:Date.now()+add*60000};save();refresh();drawTimers();
  const hold=(C.check_impacts||[]).find(x=>x.step===s.id);toast(`Food now ready at about ${fmt(eatNow())}.${hold&&hold.hold_starts.length?' Hold off on: '+hold.hold_starts.map(j=>esc(BYID[j].title)).join(', ')+'.':' Nothing else has to wait.'}`);}
 else if(d.done){done[d.done]=true;save();refresh();}
 else if(d.oven){oven=d.oven;save();refresh();document.getElementById('need').outerHTML;}
 else if(b.id==='startnow'){const first=rel(STEPS[0].id).start;eat=Math.round(nowMin()-first);shifts=[];save();refresh();}
 else if(b.id==='resetshift'){shifts=[];save();refresh();}
 else if(d.t){applyTheme(d.t);try{localStorage.setItem('cook-along:mode',d.t);}catch(err){}}});
document.addEventListener('change',e=>{const el=e.target;if(el.id==='eatat'&&el.value){eat=toMin(el.value)-totalShift();save();refresh();}if(el.dataset.have){have[el.dataset.have]=el.checked;save();}});
function applyTheme(t){document.documentElement.setAttribute('data-mode',t);DARK=t==='dark';document.querySelectorAll('#theme button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.t===t)));drawThumbs();}
let saved='light';try{saved=localStorage.getItem('cook-along:mode')||'light';}catch(e){}applyTheme(saved==='dark'?'dark':'light');
if(document.fonts)document.fonts.ready.then(drawThumbs);
if(hash.get('step'))setTimeout(()=>go(hash.get('step')),300);
if(hash.get('to'))setTimeout(()=>{const el=document.getElementById(hash.get('to'));if(el)el.scrollIntoView();},300);
})();
