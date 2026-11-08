/* ===================== paper engine ===================== */
const PW=640,PH=400;
const cl=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
const seg=(t,a,b)=>cl((t-a)/(b-a));
const eo=x=>1-Math.pow(1-x,3);
const eio=x=>x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2;
const back=x=>{const c1=1.6,c3=c1+1;return 1+c3*Math.pow(x-1,3)+c1*Math.pow(x-1,2);};
const bump=(t,a,b)=>Math.sin(seg(t,a,b)*Math.PI);
function rng(seed){return function(){seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
const hx=h=>{h=h.replace('#','');return[0,2,4].map(i=>parseInt(h.substr(i,2),16));};
function mix(a,b,t){t=cl(t);const A=hx(a),B=hx(b);return 'rgb('+A.map((v,i)=>Math.round(v+(B[i]-v)*t)).join(',')+')';}
function mix3(a,b,c2,t){return t<.5?mix(a,b,t*2):mix(b,c2,(t-.5)*2);}
function LG(c,x0,y0,x1,y1,st){const g=c.createLinearGradient(x0,y0,x1,y1);st.forEach(s=>g.addColorStop(s[0],s[1]));return g;}
function RG(c,x,y,r0,r1,st){const g=c.createRadialGradient(x,y,r0,x,y,r1);st.forEach(s=>g.addColorStop(s[0],s[1]));return g;}
function rrp(c,x,y,w,h,r){c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath();}
const SH=c=>{c.shadowColor='rgba(55,32,12,.34)';c.shadowOffsetX=3;c.shadowOffsetY=4;c.shadowBlur=3;};
const NS=c=>{c.shadowColor='rgba(0,0,0,0)';c.shadowBlur=0;c.shadowOffsetX=0;c.shadowOffsetY=0;};
function P(c,fn,x,y,rot,sx,sy,flat){c.save();c.translate(x||0,y||0);if(rot)c.rotate(rot);if(sx!=null)c.scale(sx,sy==null?sx:sy);if(flat)NS(c);else SH(c);fn();c.restore();}
let FACES=true;
function face(c,x,y,s,mood){if(!FACES)return;c.save();NS(c);c.translate(x,y);c.scale(s,s);c.fillStyle='#3a2416';c.strokeStyle='#3a2416';c.lineWidth=2.4;c.lineCap='round';
 if(mood==='sleep'){c.beginPath();c.arc(-9,0,4,Math.PI*1.15,Math.PI*1.85);c.stroke();c.beginPath();c.arc(9,0,4,Math.PI*1.15,Math.PI*1.85);c.stroke();}
 else if(mood==='sweat'){c.beginPath();c.arc(-9,0,2.4,0,7);c.arc(9,0,2.4,0,7);c.fill();c.beginPath();c.moveTo(-4,7);c.lineTo(4,7);c.stroke();c.fillStyle='#bfe3ff';c.beginPath();c.moveTo(20,-12);c.quadraticCurveTo(26,-3,20,1);c.quadraticCurveTo(14,-3,20,-12);c.fill();}
 else{c.beginPath();c.arc(-9,0,2.4,0,7);c.arc(9,0,2.4,0,7);c.fill();c.beginPath();c.arc(0,3,4,.25,Math.PI-.25);c.stroke();}
 c.fillStyle='rgba(240,110,130,.45)';c.beginPath();c.ellipse(-15,5,4,2.6,0,0,7);c.ellipse(15,5,4,2.6,0,0,7);c.fill();c.restore();}
function sparkles(c,cx,cy,rx,ry,t,a){if(a<=0)return;for(let k=0;k<6;k++){const ang=k/6*Math.PI*2+t*1.4;c.save();c.globalAlpha=Math.min(1,a);P(c,()=>{c.fillStyle='#ffd34d';c.beginPath();for(let q=0;q<8;q++){const r=q%2?3.5:9;c.lineTo(Math.cos(q*Math.PI/4)*r,Math.sin(q*Math.PI/4)*r);}c.closePath();c.fill();},cx+Math.cos(ang)*rx,cy+Math.sin(ang)*ry,t);c.restore();}}
function tag(c,x,y,text,a,rot){if(a<=0)return;const lines=String(text).split('\n');c.save();c.globalAlpha=Math.min(1,a);c.font='700 21px "Atkinson Hyperlegible", sans-serif';let mw=0;lines.forEach(l=>{mw=Math.max(mw,c.measureText(l).width);});const w=mw+28,h=lines.length*26+16;x=cl(x,w/2+8,PW-w/2-8);y=cl(y,h/2+12,PH-h/2-6);P(c,()=>{c.fillStyle='#fffaf0';c.fillRect(-w/2,-h/2,w,h);NS(c);c.fillStyle='rgba(255,226,140,.85)';c.fillRect(-16,-h/2-6,32,12);c.fillStyle='#2b2017';c.font='700 21px "Atkinson Hyperlegible", sans-serif';c.textAlign='center';c.textBaseline='middle';lines.forEach((l,i)=>c.fillText(l,0,-h/2+8+13+i*26+1));},x,y,rot||0);c.restore();}
function dotted(c,x0,y0,qx,qy,x1,y1,a){if(a<=0)return;c.save();c.globalAlpha=Math.min(1,a);c.strokeStyle='#3a2a1a';c.lineWidth=3;c.lineCap='round';c.setLineDash([1,7]);c.beginPath();c.moveTo(x0,y0);c.quadraticCurveTo(qx,qy,x1,y1);c.stroke();c.restore();}
/* display card for exact numbers: rows of [big, small] */
function dcard(c,x,y,rows,a,ok,ring){if(a<=0)return;c.save();c.globalAlpha=Math.min(1,a);P(c,()=>{c.font='800 34px "Bricolage Grotesque", sans-serif';let mw=0;rows.forEach(r=>{mw=Math.max(mw,c.measureText(r[0]).width);});c.font='700 15px "Atkinson Hyperlegible", sans-serif';rows.forEach(r=>{mw=Math.max(mw,c.measureText(r[1]).width);});const w=Math.max(140,mw+48),rh=66,h=rows.length*rh+20;c.fillStyle='#e9533f';rrp(c,-w/2,-h/2,w,h,10);c.fill();NS(c);c.fillStyle='#1d2433';rrp(c,-w/2+10,-h/2+10,w-20,h-20,6);c.fill();rows.forEach((r,i)=>{const yy=-h/2+10+i*rh;if(i){c.fillStyle='rgba(255,255,255,.25)';c.fillRect(-w/2+18,yy,w-36,1.5);}c.textAlign='left';c.textBaseline='middle';c.fillStyle=ok?'#9ff0c0':'#e6f6ff';c.font='800 34px "Bricolage Grotesque", sans-serif';c.fillText(r[0],-w/2+22,yy+25);c.fillStyle='#ffffff';c.font='700 15px "Atkinson Hyperlegible", sans-serif';c.fillText(r[1],-w/2+22,yy+51);});
 if(ring!=null){c.strokeStyle='#9ff0c0';c.lineWidth=5;rrp(c,-w/2-6,-h/2-6,w+12,h+12,14);c.setLineDash([(w+h)*2*ring+0.01,9999]);c.stroke();c.setLineDash([]);}},x,y,0);c.restore();}
/* paper grain */
const GRAIN=(()=>{const cv=document.createElement('canvas');cv.width=cv.height=160;const g=cv.getContext('2d');const R=rng(11);for(let i=0;i<2400;i++){g.fillStyle=R()>.5?`rgba(255,255,255,${R()*.5})`:`rgba(70,45,20,${R()*.32})`;g.fillRect(R()*160,R()*160,R()*2+.5,R()*2+.5);}for(let i=0;i<50;i++){g.strokeStyle=`rgba(90,60,30,${R()*.22})`;g.lineWidth=.6;g.beginPath();const x=R()*160,y=R()*160;g.moveTo(x,y);g.lineTo(x+R()*14-7,y+R()*14-7);g.stroke();}return cv;})();
function grain(c){if(!c._pat)c._pat=c.createPattern(GRAIN,'repeat');c.save();c.globalCompositeOperation='multiply';c.globalAlpha=bg().g;c.fillStyle=c._pat;c.fillRect(0,0,PW,PH);c.restore();}
const WALL='#e2cdaa';
let BGV='tile',DARK=false;
const BGS={kraft:{w0:'#e2cdaa',w1:'#d3b98f',c0:'#a8805a',c1:'#86603f',g:.35,grainLines:true},
 paper:{w0:'#FCFCFA',w1:'#F2F2EE',c0:'#E6E2D8',c1:'#DAD5C8',g:.14,grainLines:false},
 tile:{w0:'#F4F6F7',w1:'#ECEFF1',c0:'#D9D4CA',c1:'#CBC5B8',g:.12,grainLines:false,tiles:true}};
const BGD={kraft:{w0:'#3a3127',w1:'#2e271f',c0:'#5a4330',c1:'#46331f',g:.3},paper:{w0:'#191C21',w1:'#14161A',c0:'#2B2F36',c1:'#23262c',g:.12},tile:{w0:'#1b1f24',w1:'#161a1e',c0:'#2e3238',c1:'#25282d',g:.1,tiles:true}};
function bg(){const b=BGS[BGV];return DARK?Object.assign({},b,BGD[BGV]):b;}
function room(c,wall){const b=bg();c.fillStyle=LG(c,0,0,0,330,[[0,b.w0],[1,b.w1]]);c.fillRect(0,0,PW,PH);
 if(b.tiles){c.strokeStyle=DARK?'rgba(255,255,255,.05)':'rgba(40,60,80,.08)';c.lineWidth=1;for(let x=0;x<PW;x+=40){c.beginPath();c.moveTo(x,0);c.lineTo(x,330);c.stroke();}for(let y=0;y<330;y+=40){c.beginPath();c.moveTo(0,y);c.lineTo(PW,y);c.stroke();}}
 P(c,()=>{c.fillStyle=LG(c,0,0,0,80,[[0,b.c0],[1,b.c1]]);c.fillRect(-10,0,PW+20,80);NS(c);c.fillStyle='rgba(255,255,255,.25)';c.fillRect(-10,0,PW+20,2);if(b.grainLines){c.strokeStyle='rgba(60,38,16,.22)';c.lineWidth=1.2;for(let k=0;k<11;k++){c.beginPath();c.moveTo(-10,10+k*6+(k*37)%5);c.bezierCurveTo(200,6+k*6,420,14+k*6,PW+10,9+k*6);c.stroke();}}},0,330);}
function endFade(c,t,loop,wall){const f=seg(t,loop-.45,loop);if(f>0){c.save();c.globalAlpha=f;c.fillStyle=wall||bg().w0;c.fillRect(0,0,PW,PH);c.restore();}}
function steam(c,x,y,t,ph,h){const p=((t*.6+ph)%1);c.save();c.globalAlpha=Math.sin(p*Math.PI)*.75;c.strokeStyle='#ffffff';c.lineWidth=5;c.lineCap='round';c.beginPath();const yy=y-p*(h||36);c.moveTo(x,yy);c.bezierCurveTo(x-9,yy-10,x+9,yy-18,x,yy-30);c.stroke();c.restore();}

/* ===================== food ===================== */
function lamb(c,cook,o){o=o||{};
 const mt=mix3('#e0767a','#c98257','#9c4a1f',cook),mb=mix3('#a63d47','#8f4d2c','#5a240c',cook);
 // bone
 c.fillStyle=LG(c,0,-12,0,10,[[0,'#fffaf0'],[1,'#d8c6a4']]);rrp(c,112,-12,46,18,9);c.fill();c.beginPath();c.arc(158,-3,12,0,7);c.fill();
 NS(c);if(cook>.6){c.fillStyle='rgba(120,70,30,.35)';c.beginPath();c.arc(158,-3,12,0,7);c.fill();}
 SH(c);
 c.beginPath();c.moveTo(-130,36);c.bezierCurveTo(-152,-6,-96,-44,-10,-46);c.bezierCurveTo(80,-48,140,-20,132,30);c.bezierCurveTo(128,46,-124,48,-130,36);c.closePath();
 c.fillStyle=LG(c,0,-46,0,46,[[0,mt],[1,mb]]);c.fill();NS(c);
 c.save();c.clip();
 if(cook<.9){c.globalAlpha=.5*(1-cook);c.strokeStyle='#fff1e8';c.lineWidth=2.2;[[-96,12,-50,-2,-6,18],[-30,26,24,12,74,24],[10,-6,56,2,104,-2]].forEach(m=>{c.beginPath();c.moveTo(m[0],m[1]);c.quadraticCurveTo(m[2],m[3],m[4],m[5]);c.stroke();});c.globalAlpha=1;}
 if(cook>.35){c.globalAlpha=.22*cook;c.strokeStyle='#2c1206';c.lineWidth=1.6;for(let k=-120;k<130;k+=13){c.beginPath();c.moveTo(k,-6);c.quadraticCurveTo(k+7,18,k+2,44);c.stroke();}c.globalAlpha=1;}
 if(cook>.7){c.fillStyle=LG(c,0,-10,0,46,[[0,'rgba(255,190,110,.35)'],[1,'rgba(0,0,0,0)']]);c.fillRect(-150,-10,300,40);}
 c.restore();
 // fat cap
 const ca=mix3('#fff6e6','#f6dfb4','#f0b257',cook),cb=mix3('#efd2a5','#d9ab6c','#a8561b',cook);
 SH(c);c.beginPath();c.moveTo(-124,2);c.bezierCurveTo(-106,-52,94,-58,128,-4);c.bezierCurveTo(100,-28,-94,-26,-124,2);c.closePath();c.fillStyle=LG(c,0,-56,0,-6,[[0,ca],[1,cb]]);c.fill();NS(c);
 c.save();c.clip();
 c.strokeStyle=cook>.7?'rgba(255,226,165,.85)':'rgba(180,140,90,.35)';c.lineWidth=cook>.7?2:1.4;for(let k=-150;k<160;k+=17){c.beginPath();c.moveTo(k,-62);c.lineTo(k+30,0);c.stroke();c.beginPath();c.moveTo(k+30,-62);c.lineTo(k,0);c.stroke();}
 if(cook>.7){const R=rng(5);c.fillStyle='rgba(90,40,10,.55)';for(let i=0;i<26;i++){c.beginPath();c.arc(-110+R()*230,-40+R()*30,1+R()*1.6,0,7);c.fill();}c.strokeStyle='rgba(255,255,255,.55)';c.lineWidth=3.2;c.beginPath();c.moveTo(-74,-36);c.quadraticCurveTo(-6,-52,56,-40);c.stroke();c.lineWidth=2;c.beginPath();c.moveTo(70,-34);c.lineTo(92,-28);c.stroke();}
 c.restore();
 // rub
 const rub=o.rub==null?(cook<.2?1:0):o.rub;if(rub>0){const R=rng(9);for(let i=0;i<Math.floor(30*rub);i++){const x=-108+R()*220,y=-44+R()*24+Math.abs(x)*.09;c.fillStyle=R()>.3?'#3f6d39':'#f6edd6';c.beginPath();c.ellipse(x,y,R()>.3?3.6:2,1.4,R()*3,0,7);c.fill();}}
 if(cook>.7){ // crisp rosemary bits
  const R=rng(21);c.fillStyle='#2f4f28';for(let i=0;i<14;i++){c.beginPath();c.ellipse(-100+R()*200,-40+R()*20,4,1.2,R()*3,0,7);c.fill();}}
 if(o.face)face(c,-14,16,1.35,o.face);
}
function lambChunk(c,w,h,seed){const R=rng(seed);const pts=[];const n=8;for(let i=0;i<n;i++){const a=i/n*Math.PI*2;const rr=.8+R()*.35;pts.push([Math.cos(a)*w/2*rr,Math.sin(a)*h/2*rr]);}
 c.beginPath();for(let i=0;i<n;i++){const p=pts[i],q=pts[(i+1)%n];const mx=(p[0]+q[0])/2,my=(p[1]+q[1])/2;if(!i)c.moveTo(mx,my);else c.quadraticCurveTo(p[0],p[1],mx,my);}c.quadraticCurveTo(pts[0][0],pts[0][1],(pts[0][0]+pts[1][0])/2,(pts[0][1]+pts[1][1])/2);c.closePath();
 c.fillStyle=LG(c,0,-h/2,0,h/2,[[0,'#b8662e'],[1,'#7a3712']]);c.fill();NS(c);c.save();c.clip();
 c.fillStyle=LG(c,-w/2,0,w/2,0,[[0,'#e2a883'],[1,'#c4805a']]);c.beginPath();c.moveTo(-w*.6,h*.05);c.lineTo(w*.6,-h*.25);c.lineTo(w*.6,h*.7);c.lineTo(-w*.6,h*.7);c.closePath();c.fill();
 c.strokeStyle='rgba(160,90,55,.3)';c.lineWidth=1.1;for(let i=-w;i<w;i+=7){c.beginPath();c.moveTo(i,h*.55);c.quadraticCurveTo(i+20,h*.25,i+44,h*.05);c.stroke();}
 c.fillStyle='rgba(240,180,90,.85)';for(let i=0;i<4;i++){c.beginPath();c.ellipse(-w*.3+R()*w*.5,-h*.3+R()*h*.1,4+R()*4,2,R(),0,7);c.fill();}
 c.strokeStyle='rgba(255,240,210,.6)';c.lineWidth=2;c.beginPath();c.moveTo(-w*.3,-h*.32);c.quadraticCurveTo(0,-h*.42,w*.25,-h*.34);c.stroke();c.restore();}
function onionD(c,r,cooked,mood){c.beginPath();c.moveTo(-r,0);c.arc(0,0,r,Math.PI,0);c.closePath();c.fillStyle=cooked?LG(c,0,-r,0,0,[[0,'#e4a35a'],[1,'#b8692c']]):LG(c,0,-r,0,0,[[0,'#fffaf0'],[1,'#f1e5c3']]);c.fill();NS(c);
 c.strokeStyle=cooked?'rgba(255,225,170,.55)':'#e6d6a7';c.lineWidth=2;[.7,.42].forEach(q=>{c.beginPath();c.arc(0,0,r*q,Math.PI+.15,-.15);c.stroke();});c.strokeStyle=cooked?'#8f4c1c':'#dcc777';c.lineWidth=3;c.beginPath();c.arc(0,0,r-1.6,Math.PI+.05,-.05);c.stroke();
 if(cooked){c.strokeStyle='rgba(255,255,255,.45)';c.lineWidth=2;c.beginPath();c.arc(0,0,r*.84,Math.PI+.5,Math.PI+1.1);c.stroke();}
 if(mood)face(c,0,-r*.42,r/52,mood);}
function onionDisc(c,r,a1,a2){c.beginPath();if(a2-a1<6.2)c.moveTo(0,0);c.arc(0,0,r,a1,a2);c.closePath();c.fillStyle=RG(c,0,0,2,r,[[0,'#fffaf0'],[.8,'#f6edd2'],[1,'#e9d79a']]);c.fill();NS(c);c.strokeStyle='#e6d6a7';c.lineWidth=2.2;[.75,.52,.3].forEach(q=>{c.beginPath();c.arc(0,0,r*q,a1+.03,a2-.03);c.stroke();});c.strokeStyle='#d9bf6a';c.lineWidth=4;c.beginPath();c.arc(0,0,r-2,a1+.01,a2-.01);c.stroke();}
function strand(c,r,cook){const g=mix3('#f6eed8','#e9b86a','#b5652a',cook);c.strokeStyle=g;c.lineWidth=6.5;c.lineCap='round';c.beginPath();c.arc(0,0,r,Math.PI+.25,-.25);c.stroke();NS(c);if(cook>.3){c.strokeStyle='rgba(255,236,190,.55)';c.lineWidth=1.6;c.beginPath();c.arc(0,0,r-1.4,Math.PI+.5,Math.PI+1.4);c.stroke();}}
function onionLayer(c,w,h){c.beginPath();c.moveTo(-w/2,0);c.bezierCurveTo(-w/2+6,-h*1.1,w/2-6,-h*1.1,w/2,0);c.bezierCurveTo(w/4,h*.25,-w/4,h*.25,-w/2,0);c.closePath();c.fillStyle=LG(c,0,-h,0,h*.2,[[0,'#e4a659'],[1,'#94501f']]);c.fill();NS(c);c.save();c.clip();const R=rng(Math.round(w*7+h));for(let i=0;i<w*h/30;i++){const x=(R()*2-1)*w/2,y=-R()*h;c.strokeStyle=R()>.45?'rgba(250,210,140,.8)':'rgba(110,50,15,.45)';c.lineWidth=2.2;c.beginPath();c.arc(x,y,4+R()*6,R()*7,R()*7+1.6);c.stroke();}c.strokeStyle='rgba(255,255,255,.45)';c.lineWidth=2;c.beginPath();c.moveTo(-w*.3,-h*.75);c.quadraticCurveTo(0,-h*.95,w*.25,-h*.8);c.stroke();c.restore();}
function garlic(c,s,mood){c.save();c.scale(s,s);c.beginPath();c.moveTo(0,12);c.bezierCurveTo(-14,6,-10,-14,0,-16);c.bezierCurveTo(10,-14,14,6,0,12);c.fillStyle=LG(c,-8,-14,8,12,[[0,'#fffdf6'],[1,'#ead9bb']]);c.fill();NS(c);c.strokeStyle='rgba(170,120,150,.35)';c.lineWidth=1;c.beginPath();c.moveTo(-3,-12);c.quadraticCurveTo(-6,0,-2,10);c.stroke();c.restore();if(mood)face(c,0,-1,.34*s,mood);}
function rosemary(c,len,leaf){leaf=leaf==null?1:leaf;c.strokeStyle='#6b4a2a';c.lineWidth=3;c.beginPath();c.moveTo(-len/2,0);c.lineTo(len/2,0);c.stroke();NS(c);const n=Math.floor(len/7);for(let i=0;i<n;i++){if(i/n<1-leaf)continue;const x=-len/2+4+i*7;[[-1,'#3e6b3a'],[1,'#557f4a']].forEach(([sd,col])=>{c.fillStyle=col;c.beginPath();c.ellipse(x+3,sd*7,8,2.2,sd*-.6,0,7);c.fill();});}}
function potato(c,w,h){c.fillStyle=LG(c,0,-h/2,0,h/2,[[0,'#fbefc0'],[1,'#e6c46c']]);rrp(c,-w/2,-h/2,w,h,Math.min(w,h)*.3);c.fill();NS(c);c.fillStyle='rgba(255,255,255,.4)';rrp(c,-w/2+3,-h/2+2,w-6,h*.3,3);c.fill();}
function steelPot(c,w,h,surface){ // origin = rim center
 c.fillStyle=LG(c,-w/2,0,w/2,0,[[0,'#7d8894'],[.25,'#e8edf1'],[.5,'#b5bec7'],[.8,'#dde3e8'],[1,'#77828e']]);
 rrp(c,-w/2-16,12,22,10,4);c.fill();rrp(c,w/2-6,12,22,10,4);c.fill();
 c.beginPath();c.moveTo(-w/2,0);c.lineTo(-w/2,h-14);c.quadraticCurveTo(-w/2,h,-w/2+14,h);c.lineTo(w/2-14,h);c.quadraticCurveTo(w/2,h,w/2,h-14);c.lineTo(w/2,0);c.closePath();c.fill();NS(c);
 c.fillStyle='#4f5964';c.beginPath();c.ellipse(0,0,w/2,15,0,0,7);c.fill();c.strokeStyle='#e9eef2';c.lineWidth=3;c.beginPath();c.ellipse(0,0,w/2,15,0,0,7);c.stroke();
 if(surface){c.save();c.beginPath();c.ellipse(0,1,w/2-5,12,0,0,7);c.clip();surface();c.restore();}}
function water(c,w){c.fillStyle=LG(c,0,-12,0,12,[[0,'rgba(190,225,245,.95)'],[1,'rgba(120,175,210,.95)']]);c.fillRect(-w/2,-14,w,30);}
function hob(c,w){c.fillStyle=LG(c,0,0,0,10,[[0,'#30353d'],[1,'#1c2026']]);rrp(c,-w/2,-6,w,12,4);c.fill();}
function flame1(c,x,y,s,t,ph){const f=1+Math.sin(t*14+ph)*.12;c.save();c.translate(x,y);c.scale(s,s*f);c.fillStyle='#3d8bff';c.beginPath();c.moveTo(0,0);c.bezierCurveTo(-7,-6,-5,-14,0,-20);c.bezierCurveTo(5,-14,7,-6,0,0);c.fill();c.fillStyle='#bfe0ff';c.beginPath();c.moveTo(0,0);c.bezierCurveTo(-3,-4,-2,-8,0,-11);c.bezierCurveTo(2,-8,3,-4,0,0);c.fill();c.restore();}
function flames(c,cx,y,n,s,spread,t,a){if(a<=0)return;c.save();c.globalAlpha=a;NS(c);for(let i=0;i<n;i++){const x=n===1?cx:cx-spread/2+i*spread/(n-1);flame1(c,x,y,s,t,i*1.7);}c.restore();}
function bubbles(c,cx,cy,rx,ry,t,n,spd,a){if(a<=0)return;const R=rng(77);c.save();NS(c);for(let i=0;i<n;i++){const x=cx+(R()*2-1)*rx,y=cy+(R()*2-1)*ry,ph=R();const p=(t*spd+ph)%1;c.globalAlpha=a*Math.sin(p*Math.PI);c.strokeStyle='#ffffff';c.lineWidth=2;c.beginPath();c.ellipse(x,y,2+p*5,1.2+p*2.5,0,0,7);c.stroke();}c.restore();}
function nsPan(c,rx,inner){ // origin rim center, side 3/4
 c.fillStyle=LG(c,0,0,0,40,[[0,'#3d424c'],[1,'#1e2127']]);rrp(c,rx-6,-8,96,16,8);c.fill();c.fillStyle='#5a3a24';rrp(c,rx+40,-7,50,14,7);c.fill();
 c.fillStyle=LG(c,0,0,0,40,[[0,'#434852'],[1,'#22252b']]);c.beginPath();c.moveTo(-rx,0);c.lineTo(-rx+8,24);c.bezierCurveTo(-rx+30,44,rx-30,44,rx-8,24);c.lineTo(rx,0);c.closePath();c.fill();NS(c);
 c.fillStyle=RG(c,-rx*.2,-4,4,rx,[[0,'#4a505b'],[1,'#2a2e35']]);c.beginPath();c.ellipse(0,0,rx,rx*.22,0,0,7);c.fill();c.strokeStyle='#6c727c';c.lineWidth=2;c.stroke();if(inner)inner();}
function sheetPan(c,w){c.fillStyle=LG(c,0,-6,0,6,[[0,'#b9c2cb'],[1,'#7f8a95']]);rrp(c,-w/2,-6,w,12,3);c.fill();}
function foilTray(c,w,h,inner){ // origin top center, side cross-section
 const top=w/2,bot=w/2-24;c.fillStyle=LG(c,-top,0,top,0,[[0,'#9aa5b0'],[.3,'#e4e9ed'],[.6,'#b9c2cb'],[1,'#8e99a4']]);c.beginPath();c.moveTo(-top-8,-2);c.lineTo(top+8,-2);c.lineTo(top+8,4);c.lineTo(top,4);c.lineTo(bot,h);c.lineTo(-bot,h);c.lineTo(-top,4);c.lineTo(-top-8,4);c.closePath();c.fill();NS(c);
 c.fillStyle=LG(c,0,6,0,h,[[0,'#eef2f5'],[1,'#cfd6dc']]);c.beginPath();c.moveTo(-top+10,6);c.lineTo(top-10,6);c.lineTo(bot-6,h-6);c.lineTo(-bot+6,h-6);c.closePath();c.fill();
 c.strokeStyle='rgba(255,255,255,.7)';c.lineWidth=1.4;const R=rng(3);for(let i=0;i<14;i++){const x=(R()*2-1)*(top-30),y=12+R()*(h-26);c.beginPath();c.moveTo(x,y);c.lineTo(x+R()*16-8,y+R()*10-5);c.stroke();}
 if(inner)inner(top,bot,h);}
function foilSheet(c,w,h,lift){c.fillStyle=LG(c,-w/2,-h,w/2,0,[[0,'#f3f6f8'],[.5,'#c9d1d8'],[1,'#e8edf0']]);c.beginPath();c.moveTo(-w/2,0);c.bezierCurveTo(-w/2+20,-h,w/2-20,-h,w/2,0);c.lineTo(w/2,8);c.lineTo(-w/2,8);c.closePath();c.fill();NS(c);c.strokeStyle='rgba(255,255,255,.8)';c.lineWidth=1.6;const R=rng(14);for(let i=0;i<10;i++){const x=(R()*2-1)*w*.35,y=-R()*h*.6;c.beginPath();c.moveTo(x,y);c.lineTo(x+14,y+6);c.stroke();}}
function jug(c,level,col){c.fillStyle='rgba(225,240,250,.72)';c.beginPath();c.moveTo(-26,-44);c.lineTo(26,-44);c.lineTo(23,44);c.lineTo(-23,44);c.closePath();c.fill();NS(c);const top=44-82*level;c.fillStyle=col||LG(c,0,top,0,44,[[0,'#dca75a'],[1,'#a86d26']]);c.beginPath();c.moveTo(-23+(44-top)/88*3*0-1,top);c.lineTo(24,top);c.lineTo(22,43);c.lineTo(-22,43);c.closePath();c.fill();c.fillStyle='rgba(255,255,255,.55)';c.fillRect(-18,-36,4,70);c.strokeStyle='rgba(225,240,250,.95)';c.lineWidth=7;c.beginPath();c.moveTo(26,-30);c.bezierCurveTo(50,-24,50,16,24,20);c.stroke();c.fillStyle='rgba(225,240,250,.9)';c.beginPath();c.moveTo(-26,-44);c.lineTo(-40,-52);c.lineTo(-24,-32);c.closePath();c.fill();}
function knife(c){c.fillStyle=LG(c,-9,0,9,0,[[0,'#c7cfd6'],[.5,'#f4f7f9'],[1,'#aab4bd']]);c.beginPath();c.moveTo(-9,0);c.lineTo(9,0);c.lineTo(9,92);c.lineTo(0,108);c.lineTo(-9,92);c.closePath();c.fill();NS(c);c.fillStyle=LG(c,-11,0,11,0,[[0,'#4a2e1d'],[1,'#7a4c2e']]);rrp(c,-11,-48,22,50,5);c.fill();c.fillStyle='#e7e0d2';[-36,-16].forEach(y=>{c.beginPath();c.arc(0,y,3,0,7);c.fill();});}
function fork(c){c.fillStyle=LG(c,-5,0,5,0,[[0,'#aab4bd'],[.5,'#f2f5f7'],[1,'#9aa4ad']]);rrp(c,-5,-96,10,72,5);c.fill();NS(c);c.fillRect(-13,-26,26,8);[-11,-4,3,10].forEach(x=>c.fillRect(x,-20,3.5,34));}
function spoon(c){c.fillStyle=LG(c,0,-8,0,8,[[0,'#f2f5f7'],[1,'#9aa4ad']]);c.beginPath();c.ellipse(0,0,17,9,0,0,7);c.fill();NS(c);c.fillStyle='#8f9aa4';c.save();c.rotate(-.5);rrp(c,14,-3,70,6,3);c.fill();c.restore();c.fillStyle='rgba(255,255,255,.6)';c.beginPath();c.ellipse(-4,-3,7,2.4,0,0,7);c.fill();}
function woodSpoon(c){c.fillStyle=LG(c,0,-9,0,9,[[0,'#e2b77d'],[1,'#b9854a']]);c.beginPath();c.ellipse(0,0,16,10,0,0,7);c.fill();NS(c);c.save();c.rotate(-.6);c.fillStyle='#c69356';rrp(c,14,-4,78,8,4);c.fill();c.restore();}
function mug(c,fill,col){c.strokeStyle='#f4f1ea';c.lineWidth=7;c.beginPath();c.arc(24,4,11,-1.2,1.2);c.stroke();c.fillStyle=LG(c,-22,0,22,0,[[0,'#e9e4da'],[.4,'#ffffff'],[1,'#d8d2c6']]);rrp(c,-22,-24,46,52,8);c.fill();NS(c);if(fill){c.fillStyle=col||'#fffdf8';c.beginPath();c.ellipse(1,-20,19,4.5,0,0,7);c.fill();}}
function plate(c,rx,ry){c.fillStyle=RG(c,0,0,rx*.4,rx,[[0,'#ffffff'],[.75,'#f3efe8'],[1,'#ddd5c8']]);c.beginPath();c.ellipse(0,0,rx,ry,0,0,7);c.fill();NS(c);c.strokeStyle='rgba(200,190,175,.6)';c.lineWidth=2;c.beginPath();c.ellipse(0,-1,rx*.72,ry*.66,0,0,7);c.stroke();}
function bowlSide(c,w,col){c.fillStyle=LG(c,-w/2,0,w/2,0,[[0,col?mix(col,'#000000',.15):'#e6e0d6'],[.4,col||'#ffffff'],[1,col?mix(col,'#000000',.2):'#d6cfc2']]);c.beginPath();c.moveTo(-w/2,0);c.bezierCurveTo(-w/2,w*.42,w/2,w*.42,w/2,0);c.closePath();c.fill();NS(c);c.fillStyle='rgba(0,0,0,.08)';c.beginPath();c.ellipse(0,0,w/2,7,0,0,7);c.fill();}
function mash(c,w,h){c.fillStyle=LG(c,0,-h,0,0,[[0,'#fff6db'],[1,'#ecd69c']]);c.beginPath();c.moveTo(-w/2,0);c.bezierCurveTo(-w/2,-h*.8,-w*.25,-h*1.05,-w*.05,-h*.92);c.bezierCurveTo(w*.12,-h*1.08,w*.42,-h*.85,w/2,0);c.closePath();c.fill();NS(c);c.strokeStyle='rgba(205,175,110,.6)';c.lineWidth=2;c.beginPath();c.moveTo(-w*.32,-h*.45);c.quadraticCurveTo(-w*.05,-h*.82,w*.26,-h*.42);c.stroke();c.fillStyle=RG(c,w*.04,-h*.78,1,w*.16,[[0,'#fff3a8'],[1,'#f2c84b']]);c.beginPath();c.ellipse(w*.04,-h*.74,w*.16,h*.1,0,0,7);c.fill();c.fillStyle='rgba(255,255,255,.7)';c.beginPath();c.ellipse(w*.0,-h*.77,w*.06,h*.03,0,0,7);c.fill();const R=rng(4);c.fillStyle='rgba(50,40,30,.6)';for(let i=0;i<10;i++)c.fillRect(-w*.3+R()*w*.6,-h*.2-R()*h*.6,1.6,1.6);}
function butter(c,w,h){c.fillStyle=LG(c,0,-h/2,0,h/2,[[0,'#fff1a6'],[1,'#f2cf55']]);rrp(c,-w/2,-h/2,w,h,3);c.fill();NS(c);c.fillStyle='rgba(255,255,255,.6)';c.fillRect(-w/2+2,-h/2+2,w-4,2);}
function bean(c,len,col){c.fillStyle=LG(c,0,-4,0,4,[[0,col||'#6cc463'],[1,'#2f8a36']]);c.beginPath();c.moveTo(-len/2,0);c.bezierCurveTo(-len/2,-5,len/2,-6,len/2,0);c.bezierCurveTo(len/2,4,-len/2,5,-len/2,0);c.fill();NS(c);c.strokeStyle='rgba(255,255,255,.55)';c.lineWidth=1.2;c.beginPath();c.moveTo(-len/2+5,-2);c.lineTo(len/2-6,-2.5);c.stroke();c.fillStyle='rgba(20,80,25,.35)';[-.25,0,.25].forEach(q=>{c.beginPath();c.arc(len*q,0,1.6,0,7);c.fill();});}
function lemon(c,r){c.fillStyle=RG(c,-r*.3,-r*.3,2,r*1.2,[[0,'#fff27a'],[1,'#e8b81c']]);c.beginPath();c.ellipse(0,0,r*1.25,r,0,0,7);c.fill();c.beginPath();c.ellipse(r*1.28,0,4,3,0,0,7);c.fill();NS(c);const R=rng(8);c.fillStyle='rgba(200,150,10,.35)';for(let i=0;i<30;i++){const a=R()*7,q=R()*.9;c.fillRect(Math.cos(a)*r*1.2*q,Math.sin(a)*r*q,1.4,1.4);}c.fillStyle='rgba(255,255,255,.55)';c.beginPath();c.ellipse(-r*.4,-r*.45,r*.35,r*.15,-.3,0,7);c.fill();}
function patty(c,w,h,cook){const top=mix3('#df6f68','#b07052','#7c4226',cook),mid=mix3('#c9575c','#a2603f','#93512f',cook),bot=mix3('#a8423e','#73402a','#45200f',cook);
 c.beginPath();c.moveTo(-w/2,0);c.bezierCurveTo(-w/2,-h*.78,w/2,-h*.78,w/2,0);c.bezierCurveTo(w/2,h*.55,-w/2,h*.55,-w/2,0);c.closePath();c.fillStyle=LG(c,0,-h*.6,0,h*.45,[[0,top],[.55,mid],[1,bot]]);c.fill();NS(c);c.save();c.clip();
 const R=rng(31);if(cook<.4){for(let i=0;i<50;i++){c.fillStyle=R()>.5?'rgba(255,220,220,.55)':'rgba(140,40,40,.3)';c.beginPath();c.arc((R()*2-1)*w*.46,(R()*2-1)*h*.4,1+R()*1.4,0,7);c.fill();}c.fillStyle='rgba(255,250,240,.8)';for(let i=0;i<9;i++){c.beginPath();c.ellipse((R()*2-1)*w*.4,(R()*2-1)*h*.3,2.8,1.4,R()*3,0,7);c.fill();}}
 else{c.fillStyle=LG(c,0,-h*.6,0,-h*.1,[[0,'rgba(60,25,8,.45)'],[1,'rgba(60,25,8,0)']]);c.fillRect(-w/2,-h,w,h);for(let i=0;i<60;i++){c.fillStyle=R()>.5?'rgba(214,150,90,.55)':'rgba(80,35,12,.35)';c.beginPath();c.ellipse((R()*2-1)*w*.46,(R()*2-1)*h*.42,1.4+R()*2,1+R()*1.2,R()*3,0,7);c.fill();}
  c.strokeStyle='rgba(170,95,55,.6)';c.lineWidth=3;c.beginPath();c.moveTo(-w*.46,h*.08);c.quadraticCurveTo(0,h*.2,w*.46,h*.08);c.stroke();}
 c.strokeStyle=cook>.5?'rgba(255,215,160,.65)':'rgba(255,255,255,.5)';c.lineWidth=2.4;c.beginPath();c.moveTo(-w*.32,-h*.38);c.quadraticCurveTo(0,-h*.5,w*.3,-h*.38);c.stroke();c.fillStyle='rgba(255,255,255,.55)';c.beginPath();c.ellipse(w*.18,-h*.3,5,1.6,-.1,0,7);c.fill();c.restore();}
function cheese(c,w,melt){c.fillStyle=LG(c,0,-6,0,8+melt*18,[[0,'#ffd35c'],[1,'#f0a114']]);c.beginPath();c.moveTo(-w/2,-4);c.lineTo(w/2,-4);c.lineTo(w/2,4+melt*6);const drips=[[.42,14],[.12,22],[-.2,10],[-.4,18]];c.lineTo(w*.46,4);drips.forEach(([q,d])=>{c.lineTo(w*q+6,4);c.quadraticCurveTo(w*q+6,4+melt*d,w*q,4+melt*d);c.quadraticCurveTo(w*q-6,4+melt*d,w*q-6,4);});c.lineTo(-w/2,4+melt*4);c.closePath();c.fill();NS(c);c.fillStyle='rgba(255,255,255,.55)';rrp(c,-w*.38,-2.5,w*.5,2.2,1);c.fill();}
function bunTop(c,w,h,toast){c.fillStyle=LG(c,0,-h,0,0,[[0,'#a95a1c'],[.45,'#dc8f3c'],[1,'#f3c27b']]);c.beginPath();c.moveTo(-w/2,0);c.bezierCurveTo(-w/2,-h*1.25,w/2,-h*1.25,w/2,0);c.closePath();c.fill();NS(c);c.fillStyle=toast?LG(c,0,0,0,7,[[0,'#d9934a'],[1,'#b9712e']]):'#f7dcae';c.fillRect(-w/2+3,-4,w-6,6);c.fillStyle='rgba(255,255,255,.4)';c.beginPath();c.ellipse(-w*.16,-h*.72,w*.2,h*.12,-.25,0,7);c.fill();}
function bunBottom(c,w,h,toast){c.fillStyle=LG(c,0,0,0,h,[[0,'#f0bc72'],[1,'#c97a30']]);c.beginPath();c.moveTo(-w/2,0);c.lineTo(w/2,0);c.bezierCurveTo(w/2,h*1.1,-w/2,h*1.1,-w/2,0);c.fill();NS(c);c.fillStyle=toast?'#d18a40':'#f7dcae';c.fillRect(-w/2+3,0,w-6,5);}
function pickle(c,r){c.fillStyle=RG(c,0,0,1,r,[[0,'#d3e8a0'],[.6,'#9cc65c'],[1,'#5f8e2f']]);c.beginPath();c.ellipse(0,0,r,r*.34,0,0,7);c.fill();NS(c);c.fillStyle='rgba(255,255,230,.8)';[-.3,0,.3].forEach(q=>{c.beginPath();c.ellipse(r*q,0,1.6,1,0,0,7);c.fill();});}
function fry(c,l){c.fillStyle=LG(c,-4,0,4,0,[[0,'#f9dc84'],[1,'#e2a637']]);rrp(c,-4,-l/2,8,l,2.5);c.fill();NS(c);c.fillStyle='rgba(170,100,20,.5)';c.fillRect(-4,-l/2,8,3);}
function cheddarBlock(c,w,h){c.fillStyle=LG(c,0,-h,0,0,[[0,'#ffcf5a'],[1,'#f0a52a']]);c.beginPath();c.moveTo(-w/2,0);c.lineTo(w/2,0);c.lineTo(w/2+18,-h*.4);c.lineTo(w/2+18,-h);c.lineTo(-w/2+18,-h);c.lineTo(-w/2,-h*.6);c.closePath();c.fill();NS(c);c.fillStyle='rgba(255,255,255,.35)';c.beginPath();c.moveTo(-w/2,-h*.6);c.lineTo(-w/2+18,-h);c.lineTo(w/2+18,-h);c.lineTo(w/2,-h*.6);c.closePath();c.fill();}
function ovenFront(c,w,h,glow,open){ // origin top-left
 c.fillStyle=LG(c,0,0,w,0,[[0,'#b9c1c9'],[.5,'#eef2f5'],[1,'#aeb7c0']]);rrp(c,0,0,w,h,14);c.fill();NS(c);c.fillStyle='#2b2f36';rrp(c,0,0,w,40,14);c.fill();c.fillRect(0,26,w,14);
 c.fillStyle='#dfe4e9';[[30,20],[64,20]].forEach(([x,y])=>{c.beginPath();c.arc(x,y,10,0,7);c.fill();});c.fillStyle='#ff8a3d';c.globalAlpha=.4+glow*.6;c.beginPath();c.arc(w-22,20,5,0,7);c.fill();c.globalAlpha=1;
 if(!open){c.fillStyle='#1f232a';rrp(c,20,64,w-40,h-110,10);c.fill();c.fillStyle=RG(c,w/2,64+(h-110)/2,10,w*.6,[[0,`rgba(255,160,70,${.25+glow*.55})`],[1,'rgba(255,120,40,0)']]);rrp(c,24,68,w-48,h-118,8);c.fill();c.fillStyle=LG(c,0,46,0,54,[[0,'#d9dee3'],[1,'#9aa4ae']]);rrp(c,30,48,w-60,9,4);c.fill();}
 else{c.fillStyle='#1f232a';rrp(c,16,52,w-32,h-70,8);c.fill();c.fillStyle=RG(c,w/2,h/2,10,w*.6,[[0,`rgba(255,160,70,${.2+glow*.5})`],[1,'rgba(255,120,40,0)']]);rrp(c,16,52,w-32,h-70,8);c.fill();c.strokeStyle='#8a94a0';c.lineWidth=3;[h*.62].forEach(y=>{c.beginPath();c.moveTo(24,y);c.lineTo(w-24,y);c.stroke();});}}
function colander(c,w){c.fillStyle=LG(c,-w/2,0,w/2,0,[[0,'#8d98a3'],[.4,'#eef2f5'],[1,'#8d98a3']]);c.beginPath();c.moveTo(-w/2,0);c.bezierCurveTo(-w/2,w*.45,w/2,w*.45,w/2,0);c.closePath();c.fill();NS(c);c.fillStyle='#5d6873';for(let i=0;i<8;i++){c.beginPath();c.arc(-w*.33+i*w*.095,w*.14+(i%2)*8,2.4,0,7);c.fill();}c.fillStyle='#8d98a3';rrp(c,-w*.2,w*.31,w*.4,8,3);c.fill();}
function probeTool(c){c.fillStyle=LG(c,0,-9,0,9,[[0,'#ff7a63'],[1,'#c93a26']]);rrp(c,-70,-10,70,20,8);c.fill();NS(c);c.fillStyle='#1d2433';rrp(c,-56,-6,26,12,3);c.fill();c.fillStyle=LG(c,0,-3,0,3,[[0,'#f0f3f6'],[1,'#9aa4ad']]);c.fillRect(0,-3,120,6);c.beginPath();c.moveTo(120,-3);c.lineTo(128,0);c.lineTo(120,3);c.fill();}
function pinch(c){c.fillStyle='#f0c4a0';c.beginPath();c.arc(0,0,10,0,7);c.arc(14,10,10,0,7);c.fill();}
function handDown(c){c.fillStyle=LG(c,-16,0,16,0,[[0,'#e4a982'],[.5,'#f6cfac'],[1,'#e0a37b']]);rrp(c,-15,-170,30,160,14);c.fill();c.beginPath();c.moveTo(-24,-20);c.bezierCurveTo(-30,16,-14,32,4,30);c.bezierCurveTo(26,28,30,4,24,-20);c.closePath();c.fill();c.beginPath();c.ellipse(-25,-6,8,13,.4,0,7);c.fill();NS(c);c.strokeStyle='rgba(170,110,80,.5)';c.lineWidth=1.6;[-10,0,10].forEach(x=>{c.beginPath();c.moveTo(x,8);c.lineTo(x,26);c.stroke();});}
function mitten(c){c.fillStyle=LG(c,0,-30,0,20,[[0,'#f6cfac'],[1,'#e4a982']]);c.beginPath();c.moveTo(-24,16);c.bezierCurveTo(-30,-20,-14,-34,4,-32);c.bezierCurveTo(26,-30,30,-6,24,16);c.closePath();c.fill();c.beginPath();c.ellipse(-26,2,9,14,-.4,0,7);c.fill();NS(c);c.fillStyle='#5f86c9';c.fillRect(-26,14,52,26);}

/* ===================== scenes ===================== */
function board(c,w,h){c.fillStyle=LG(c,0,0,0,h,[[0,'#ecd2a6'],[1,'#d4ad74']]);rrp(c,-w/2,0,w,h,10);c.fill();NS(c);c.strokeStyle='rgba(150,100,50,.18)';c.lineWidth=1.2;for(let k=6;k<h;k+=7){c.beginPath();c.moveTo(-w/2+8,k);c.bezierCurveTo(-w/6,k-2,w/6,k+3,w/2-8,k);c.stroke();}}
function dropIn(c,t,s0,dur,fn,x,y,h){const p=seg(t,s0,s0+dur);if(p<=0)return false;const yy=y-(1-back(p))*(h||160);const q=Math.sin(seg(p,.62,1)*Math.PI)*.1;P(c,fn,x,yy,0,1+q,1-q);return true;}
function wholeOnion(c,r){c.fillStyle=RG(c,-r*.3,-r*.3,2,r*1.2,[[0,'#f0c27a'],[1,'#b8762f']]);c.beginPath();c.moveTo(0,-r*1.25);c.bezierCurveTo(r*1.2,-r*.6,r*1.1,r,0,r);c.bezierCurveTo(-r*1.1,r,-r*1.2,-r*.6,0,-r*1.25);c.fill();NS(c);c.strokeStyle='rgba(120,70,20,.35)';c.lineWidth=1.4;[-.5,0,.5].forEach(q=>{c.beginPath();c.moveTo(0,-r*1.2);c.quadraticCurveTo(r*q*1.6,0,r*q*.6,r*.95);c.stroke();});}
function garlicBulb(c,r){c.fillStyle=RG(c,-r*.3,-r*.3,2,r*1.2,[[0,'#ffffff'],[1,'#e2d5c0']]);c.beginPath();c.moveTo(0,-r*1.1);c.bezierCurveTo(r*1.3,-r*.4,r*1.1,r,0,r);c.bezierCurveTo(-r*1.1,r,-r*1.3,-r*.4,0,-r*1.1);c.fill();NS(c);c.strokeStyle='rgba(160,120,140,.4)';c.lineWidth=1.2;[-.4,0,.4].forEach(q=>{c.beginPath();c.moveTo(0,-r);c.quadraticCurveTo(r*q*1.8,0,r*q*.5,r*.95);c.stroke();});}
function trayAt(c,x,y,w,h,inner,sheetW){P(c,()=>sheetPan(c,sheetW||w+40),x,y+h+6);P(c,()=>foilTray(c,w,h,inner),x,y);}
function stockPool(c,x,y,w,h,lv,t){if(lv<=0)return;const top=w/2-10,bot=w/2-24-6,fy=y+h-6;c.save();c.beginPath();c.moveTo(x-top,y+6);c.lineTo(x+top,y+6);c.lineTo(x+bot,fy);c.lineTo(x-bot,fy);c.closePath();c.clip();const ty=fy-lv;c.fillStyle=LG(c,0,ty,0,fy,[[0,'rgba(222,160,80,.92)'],[1,'rgba(170,100,35,.95)']]);c.beginPath();c.moveTo(x-w/2,fy+2);c.lineTo(x-w/2,ty);for(let k=x-w/2;k<=x+w/2;k+=14){c.quadraticCurveTo(k+3.5,ty-2.5+Math.sin(t*3+k)*.8,k+7,ty);c.quadraticCurveTo(k+10.5,ty+2.5,k+14,ty);}c.lineTo(x+w/2,fy+2);c.closePath();c.fill();c.fillStyle='rgba(255,240,200,.55)';c.fillRect(x-w/2,ty,w,1.6);c.restore();}

function itemTag(c,x,y,text,a){if(a<=0)return;const L=text.split('\n');c.save();c.globalAlpha=Math.min(1,a);c.font='700 17px "Atkinson Hyperlegible", sans-serif';let w=0;L.forEach(l=>{w=Math.max(w,c.measureText(l).width);});w+=20;const h=L.length*21+8;P(c,()=>{c.fillStyle='#fffaf0';rrp(c,-w/2,-14,w,h,6);c.fill();NS(c);c.fillStyle='#2b2017';c.textAlign='center';c.textBaseline='middle';L.forEach((l,i)=>c.fillText(l,0,i*21+1));},x,y,0);c.restore();}
function flatlay(c,t,items){items.forEach(([label,fn],i)=>{const col=i%4,row=i/4|0,x=80+col*160,y=row?296:140;const p=seg(t,.2+i*.18,.65+i*.18);if(p<=0)return;const yy=y-(1-back(p))*60;const q=Math.sin(seg(p,.62,1)*Math.PI)*.08;P(c,fn,x,yy,0,1+q,1-q);itemTag(c,x,y+(row?44:42),label,seg(t,.45+i*.18,.75+i*.18));});}
const SC={
prepL:{loop:6.5,cap:'Everything you need, laid out and labelled',draw(c,t){room(c);
 flatlay(c,t,[
  ['Tray on its sheet',()=>{sheetPan(c,120);P(c,()=>foilTray(c,100,30),0,-36,0,1,1,true);}],
  ['Foil, 2 sheets',()=>{c.fillStyle=LG(c,0,-24,0,0,[[0,'#f2f5f8'],[.5,'#c4ccd4'],[1,'#e4e9ed']]);rrp(c,-46,-26,92,26,8);c.fill();NS(c);c.fillStyle='#d9dfe5';c.beginPath();c.ellipse(-46,-13,6,13,0,0,7);c.fill();}],
  ['300 ml stock',()=>P(c,()=>jug(c,.55),0,-40,0,.8,.8,true)],
  ['1.2–1.5 kg lamb',()=>P(c,()=>lamb(c,0,{face:'sleep',rub:0}),-8,-20,0,.4,.4,true)],
  ['1 large onion',()=>P(c,()=>wholeOnion(c,26),0,-26,0,1,1,true)],
  ['6 garlic cloves',()=>{P(c,()=>garlicBulb(c,16),-18,-18,0,1,1,true);[0,1].forEach(i=>P(c,()=>garlic(c,.9),18+i*16,-12,.3,1,1,true));}],
  ['3 rosemary sprigs',()=>[0,1,2].forEach(i=>P(c,()=>rosemary(c,96),0,-30+i*12,-.08+i*.08,1,1,true))],
  ['Oil, salt, pepper',()=>{c.fillStyle=LG(c,-12,0,12,0,[[0,'#6c7a2c'],[.5,'#a9b54a'],[1,'#5f6b24']]);rrp(c,-40,-64,26,64,8);c.fill();c.fillRect(-32,-76,10,14);NS(c);c.fillStyle='#ffffff';rrp(c,0,-40,18,40,6);c.fill();c.fillStyle='#2b2f36';rrp(c,26,-46,18,46,6);c.fill();}]
 ]);
 grain(c);endFade(c,t,6.5);}},
oven:{loop:6,cap:'Heat the oven. Put the empty tray on its baking sheet.',draw(c,t){room(c);
 const g=seg(t,.3,2.6);P(c,()=>ovenFront(c,230,290,g,false),30,40);
 c.save();c.translate(60,60);c.rotate(-2+eo(seg(t,.2,1.2))*2.6);c.fillStyle='#2b2f36';c.fillRect(-1.5,-9,3,9);c.restore();
 dcard(c,440,110,[['170°C','conventional'],['150°C','fan']],seg(t,.6,1));
 P(c,()=>sheetPan(c,220),450,324);
 const p=seg(t,1.6,2.3);if(p>0)P(c,()=>foilTray(c,170,48),450,270-(1-back(p))*150);
 tag(c,450,232,'Tray on the sheet first',seg(t,2.4,2.7),.02);
 grain(c);endFade(c,t,6);}},
wedges:{loop:7.6,cap:'Halve root to tip. Cut each half into 4 thick wedges.',draw(c,t){room(c);
 P(c,()=>{c.fillStyle=LG(c,0,-125,0,125,[[0,'#ecd2a6'],[1,'#d6b07a']]);rrp(c,-200,-125,400,250,14);c.fill();NS(c);c.strokeStyle='rgba(150,100,50,.16)';c.lineWidth=1.2;for(let k=-110;k<120;k+=14){c.beginPath();c.moveTo(-190,k);c.bezierCurveTo(-60,k-4,60,k+5,190,k);c.stroke();}},300,205);
 const cx=300,cy=200,r=84,half=eo(seg(t,1.25,1.6))*16,spread=eo(seg(t,4.2,4.7))*12;
 const cuts=[[1.9,Math.PI*.75,-1],[2.3,Math.PI,-1],[2.7,Math.PI*1.25,-1],[3.1,-Math.PI*.25,1],[3.5,0,1],[3.9,Math.PI*.25,1]];
 if(t<4.2){[[-1,Math.PI/2,Math.PI*1.5],[1,-Math.PI/2,Math.PI/2]].forEach(([sd,a1,a2])=>P(c,()=>{onionDisc(c,r,a1,a2);if(t<1.25&&sd===1){c.strokeStyle='rgba(110,80,40,.5)';c.lineWidth=2;c.setLineDash([5,5]);c.beginPath();c.moveTo(0,-r);c.lineTo(0,r);c.stroke();c.setLineDash([]);}cuts.forEach(ct=>{if(ct[2]===sd&&t>=ct[0]){c.strokeStyle='#9a7a4d';c.lineWidth=2.5;c.beginPath();c.moveTo(0,0);c.lineTo(Math.cos(ct[1])*r,Math.sin(ct[1])*r);c.stroke();}});},cx+sd*half,cy));}
 else{for(let i=0;i<8;i++){const a1=-Math.PI/2+i*Math.PI/4,a2=a1+Math.PI/4,m=(a1+a2)/2,sd=Math.cos(m)<0?-1:1;P(c,()=>onionDisc(c,r,a1,a2),cx+sd*16+Math.cos(m)*spread,cy+Math.sin(m)*spread);}}
 let kx=560,ky=70,kr=.25;const chops=[[1.0,0,0]].concat(cuts);
 chops.forEach((ch,i)=>{const p=seg(t,ch[0]-.32,ch[0]),q=seg(t,ch[0],ch[0]+.18);if(p>0&&q<1){if(i===0){kx=cx;ky=cy-150+eo(p)*50-eo(q)*36;kr=0;}else{const a=ch[1];kx=cx+ch[2]*half+Math.cos(a)*44;ky=cy+Math.sin(a)*44-110+eo(p)*50-eo(q)*36;kr=a-Math.PI/2;if(Math.abs(kr)>Math.PI/2)kr+=Math.PI;}}});
 if(t<4.1)P(c,()=>knife(c),kx,ky,kr);
 const a=seg(t,4.7,4.9);sparkles(c,300,200,130,110,t,a);tag(c,300,352,'8 thick wedges',a,-.02);
 const b=seg(t,5.2,5.4);if(b>0){c.save();c.globalAlpha=b;P(c,()=>{c.fillStyle='#fffaf0';c.fillRect(-72,-58,144,116);NS(c);for(let k=0;k<6;k++)P(c,()=>strand(c,9,.05),-38+k*15,10,0,1,1,true);c.strokeStyle='#c0392b';c.lineWidth=5;c.beginPath();c.moveTo(-48,-30);c.lineTo(48,30);c.moveTo(48,-30);c.lineTo(-48,30);c.stroke();c.fillStyle='#2f2217';c.font='700 13px "Atkinson Hyperlegible", sans-serif';c.textAlign='center';c.fillText('Not thin slices',0,46);},560,250,.05);c.restore();}
 tag(c,175,58,'Halve, root to tip',seg(t,1.3,1.5)*(1-seg(t,1.75,1.85)),-.03);
 tag(c,175,58,'3 cuts per half = 4 wedges',seg(t,1.9,2.1)*(1-seg(t,4.1,4.3)),-.03);
 grain(c);endFade(c,t,7.6);}},
garlic:{loop:6,cap:'Crush 3 garlic cloves, keep 3 whole. Strip and chop 2 rosemary sprigs.',draw(c,t){room(c);
 P(c,()=>board(c,600,22),320,308);
 const pp=(t%1.6)/1.6,sq=Math.sin(seg(pp,.3,.75)*Math.PI);
 P(c,()=>garlic(c,2.2),160,276,0,1+sq*.3,1-sq*.42);
 P(c,()=>{c.fillStyle=LG(c,0,-7,0,7,[[0,'#f3f6f8'],[1,'#aab4bd']]);rrp(c,-90,-7,180,14,4);c.fill();NS(c);c.fillStyle='#5a3a24';rrp(c,90,-6,60,12,5);c.fill();P(c,()=>handDown(c),-4,-26,0,.85,.85,true);},160,236+sq*16);
 [0,1,2].forEach(i=>P(c,()=>garlic(c,1,'happy'),50+i*30,300+((i%2)*-3)));
 const lp=seg(t,.8,4.2),len=180,ang=2.55,cx=500,cy=210;P(c,()=>rosemary(c,len,1-lp),cx,cy,ang);
 if(lp>0&&lp<1){const d=-len/2+lp*len;P(c,()=>pinch(c),cx+Math.cos(ang)*d,cy+Math.sin(ang)*d-8);}
 const R=rng(6),n=Math.floor(lp*26);for(let i=0;i<n;i++)P(c,()=>{c.fillStyle=i%2?'#3e6b3a':'#557f4a';c.fillRect(-3,-1,6,2.4);},430+R()*90,300-R()*10,R()*3,1,1,true);
 tag(c,160,64,'Crush 3\nkeep 3 whole',seg(t,.4,.7),-.02);tag(c,480,64,'Strip, then\nchop 2 sprigs',seg(t,.9,1.2),.02);
 grain(c);endFade(c,t,6);}},
rub:{loop:6,cap:'Mix oil, garlic, rosemary, salt and pepper. Rub it all over.',draw(c,t){room(c);
 P(c,()=>board(c,460,20),330,314);
 P(c,()=>{bowlSide(c,96);NS(c);c.fillStyle=LG(c,0,-4,0,6,[[0,'#d9c66a'],[1,'#a99a3e']]);c.beginPath();c.ellipse(0,0,42,6,0,0,7);c.fill();c.fillStyle='#3f6d39';for(let i=0;i<8;i++)c.fillRect(-30+i*8,-2+(i%2)*2,3,1.6);},84,286);
 P(c,()=>lamb(c,0,{rub:seg(t,.4,4),face:'happy'}),318,270,0,.95);
 const ra=seg(t,.3,.6)*(1-seg(t,4.1,4.5));if(ra>0){c.save();c.globalAlpha=ra;P(c,()=>handDown(c),318+Math.cos(t*4)*80,196+Math.sin(t*4)*12,.15);c.restore();}
 tag(c,110,200,'1 tbsp oil\n1 tsp salt, pepper',seg(t,.2,.5),-.03);tag(c,330,64,'Rub it all over',seg(t,4.2,4.5),-.02);
 grain(c);endFade(c,t,6);}},
assemble:{loop:7.6,cap:'Onions, garlic and rosemary in. Lamb on top, fat side up. Stock around it.',draw(c,t){room(c);
 const tx=320,ty=212,tw=420,th=104;const lv=eo(seg(t,4.35,5.3))*22;
 trayAt(c,tx,ty,tw,th,null,460);stockPool(c,tx,ty,tw,th,lv,t);
 const ox=[188,226,264,302,340,378,416,454];ox.forEach((x,i)=>dropIn(c,t,.5+i*.17,.45,()=>onionD(c,22,false,i%2?null:'happy'),x,310,220));
 dropIn(c,t,2.05,.5,()=>garlic(c,.95,'happy'),150,298,200);dropIn(c,t,2.1,.5,()=>garlic(c,.95,'happy'),492,298,200);dropIn(c,t,2.15,.5,()=>rosemary(c,96),320,300,200);
 const lp=seg(t,2.7,3.7);if(lp>0){const y=252-(1-eo(lp))*240;const ls=Math.sin(seg(t,3.55,3.95)*Math.PI)*.06;P(c,()=>lamb(c,0,{face:t>5.8?'happy':'sleep'}),320,y,0,.92*(1+ls),.92*(1-ls));}
 const ji=seg(t,3.85,4.25),jo=seg(t,5.3,5.7);if(ji>0&&jo<1){const k=eo(ji)-eo(jo),ang=-eo(seg(t,4.25,4.45))*.9+eo(seg(t,5.2,5.3))*.9;const pr=seg(t,4.25,5.25);if(pr>0&&pr<1){c.save();c.strokeStyle='rgba(205,140,60,.95)';c.lineWidth=7;c.lineCap='round';c.beginPath();c.moveTo(528,104);c.quadraticCurveTo(512,170,506,296);c.stroke();c.restore();}P(c,()=>{jug(c,.55-pr*.4);face(c,0,-14,.6,'happy');},560+(1-k)*160,140,ang);}
 const a1=seg(t,3.55,3.75);dotted(c,440,82,400,130,350,206,a1);tag(c,470,66,'Fat side up = hat on top',a1,-.03);
 const a2=seg(t,4.9,5.1);dotted(c,104,252,140,300,178,300,a2);tag(c,96,232,'300 ml stock\nshallow pool',a2,.04);
 const a3=seg(t,5.8,6);sparkles(c,320,214,180,36,t,a3);tag(c,320,372,'Meat sits above the stock',a3,-.02);
 grain(c);endFade(c,t,7.6);}},
foil:{loop:6,cap:'Two layers of foil, crimped tight all round the rim',draw(c,t){room(c);
 const tx=320,ty=212,tw=420,th=104;trayAt(c,tx,ty,tw,th,null,460);stockPool(c,tx,ty,tw,th,22,t);
 [188,226,264,302,340,378,416,454].forEach(x=>P(c,()=>onionD(c,22,false),x,310));P(c,()=>lamb(c,0,{face:'sleep'}),320,252,0,.92);
 [[.3,'a'],[1.1,'b']].forEach(([s,id],i)=>{const p=seg(t,s,s+.8);if(p>0){c.save();c.globalAlpha=Math.min(1,p*2)*(i?.9:1);P(c,()=>foilSheet(c,450+i*14,120+i*6),320,214-(1-eo(p))*150);c.restore();}});
 const cr=seg(t,2.2,2.5);if(cr>0){c.save();c.globalAlpha=cr;c.strokeStyle='#8a949e';c.lineWidth=3;[[86,1],[554,-1]].forEach(([x,d])=>{c.beginPath();for(let k=0;k<5;k++)c.lineTo(x+d*k*8,216+(k%2?-7:0));c.stroke();});c.restore();}
 const pr=bump(t,2.2,2.9)+bump(t,3,3.7);if(t>2.1&&t<3.8){P(c,()=>handDown(c),104,172+pr*14,-.25,.8);P(c,()=>handDown(c),536,172+pr*14,.25,.8);}
 tag(c,320,58,'2 layers, sealed tight',seg(t,3.8,4.1),-.02);
 grain(c);endFade(c,t,6);}},
ovenIn:{loop:6,cap:'Slide it in on the sheet. Start the timer when the door is shut.',draw(c,t){room(c);
 P(c,()=>ovenFront(c,300,280,.4,true),316,46);
 const p=eio(seg(t,.3,2));const x=150+p*316;P(c,()=>{sheetPan(c,220);P(c,()=>foilTray(c,180,40),0,-46,0,1,1,true);P(c,()=>foilSheet(c,190,56),0,-44,0,1,1,true);},x,212);
 dcard(c,150,110,[['4 h 30 min','covered']],seg(t,2.4,2.8));
 tag(c,150,200,'Door shut, then start',seg(t,2.8,3.1),.02);
 grain(c);endFade(c,t,6);}},
quiet:{loop:8,cap:'Covered roast. Nothing to check until the timer ends.',draw(c,t){room(c);
 const g=.55+Math.sin(t/8*Math.PI*2)*.25;P(c,()=>{ovenFront(c,270,290,g,false);P(c,()=>{sheetPan(c,170);P(c,()=>foilSheet(c,150,50),0,-4,0,1,1,true);},135,230,0,1,1,true);},330,40);
 P(c,()=>{mug(c,true,'#b27a4a');face(c,1,6,.7,'sleep');},150,302);steam(c,146,270,t,0,40);steam(c,160,272,t,.5,40);
 tag(c,170,150,'Nothing to check. Relax.',seg(t,.5,.9),-.03);
 grain(c);endFade(c,t,8);}},
fork:{loop:7,cap:'Open one corner. Twist a fork in the thickest part.',draw(c,t){room(c);
 P(c,()=>foilTray(c,620,150),320,214);
 P(c,()=>lamb(c,.55,{rub:0,face:t>4?'happy':'sleep'}),280,268,0,1.45);
 const sep=eo(seg(t,2.6,3.8));P(c,()=>lambChunk(c,56,40,4),190+sep*22,236+sep*10,.2);
 P(c,()=>{c.fillStyle=LG(c,0,0,300,0,[[0,'#f2f5f8'],[.5,'#c9d1d8'],[1,'#e3e8ec']]);c.beginPath();c.moveTo(80,0);c.lineTo(330,0);c.lineTo(330,230);c.lineTo(60,230);c.bezierCurveTo(70,140,40,70,80,0);c.fill();NS(c);c.fillStyle=LG(c,0,0,60,60,[[0,'#ffffff'],[1,'#c5ced6']]);c.beginPath();c.moveTo(80,0);c.lineTo(150,0);c.lineTo(92,58);c.closePath();c.fill();},310,112);
 steam(c,402,120,t,0,46);steam(c,428,118,t,.45,46);
 const tw=Math.sin(t*3)*.35*seg(t,.8,1.2)*(1-seg(t,4.4,4.8));P(c,()=>fork(c),200,206,tw);
 tag(c,470,60,'Fork turns easily\n= tender',seg(t,4,4.3),.02);tag(c,150,60,'Still firm?\n+30–45 min, sealed',seg(t,5,5.3),-.02);
 grain(c);endFade(c,t,7);}},
brown:{loop:7,cap:'Foil off. Oven up. Baste and roast until golden.',draw(c,t){c.fillStyle='#22262d';c.fillRect(0,0,PW,PH);c.fillStyle=RG(c,320,200,20,420,[[0,'rgba(255,150,60,.55)'],[1,'rgba(255,110,30,.08)']]);c.fillRect(0,0,PW,PH);c.strokeStyle='#5c636d';c.lineWidth=4;[[60,340]].forEach(([a,y])=>{c.beginPath();c.moveTo(20,y);c.lineTo(620,y);c.stroke();});
 const tx=320,ty=246,tw=440,th=74;trayAt(c,tx,ty,tw,th,null,480);stockPool(c,tx,ty,tw,th,14,t);
 [210,250,290,330,370,410].forEach(x=>P(c,()=>onionD(c,18,true),x,314));
 const ck=.55+.45*eo(seg(t,1.4,5.2));P(c,()=>lamb(c,ck,{rub:0,face:'happy'}),320,262,0,.92);
 const fl=seg(t,.2,1.2);if(fl<1){c.save();c.globalAlpha=1-fl;P(c,()=>foilSheet(c,450,120),320+fl*150,248-fl*130,fl*.4);c.restore();}
 const b=bump(t,1.6,2.6)+bump(t,3.2,4.2);P(c,()=>spoon(c),440,170,-b*.7);if(b>.5){[0,1,2].forEach(k=>{const p=((t*2+k*.33)%1);c.fillStyle='rgba(214,150,70,.9)';c.beginPath();c.arc(420-k*6,180+p*40,3,0,7);c.fill();});}
 const a=seg(t,5.3,5.6);sparkles(c,320,220,170,40,t,a);tag(c,320,56,'Deep golden, crisp edges',a,-.02);
 dcard(c,104,90,[['200°C','conventional'],['180°C','fan']],seg(t,.6,1)*(1-seg(t,5.1,5.4)));
 grain(c);endFade(c,t,7,'#22262d');}},
potOn:{loop:6,cap:'Potatoes in cold, salted water. Bring to the boil.',draw(c,t){room(c);
 P(c,()=>hob(c,320),320,336,0,1,1,true);flames(c,320,340,8,1,240,t,seg(t,.5,.9));
 const ba=seg(t,2,3.6);P(c,()=>steelPot(c,270,160,()=>{water(c,260);[[-80,-2],[-40,4],[0,-4],[40,3],[80,-1],[-60,8],[20,9],[60,8]].forEach(([x,y],i)=>P(c,()=>potato(c,26,16),x,y+Math.sin(t*6+i)*ba*1.5,(i%3-1)*.3));bubbles(c,0,2,110,8,t,16,1.6,ba);}),320,170);
 if(ba>.3){steam(c,280,150,t,0);steam(c,330,146,t,.4);steam(c,370,150,t,.75);}
 const sp=seg(t,.7,1.9);if(sp>0&&sp<1){P(c,()=>pinch(c),470,80);for(let k=0;k<6;k++){const p=((t*1.5+k/6)%1);c.fillStyle='#ffffff';c.fillRect(468+k*3,96+p*70,3,3);}}
 tag(c,170,80,'Cold water + salt,\nthen boil',seg(t,.4,.7),-.02);
 grain(c);endFade(c,t,6);}},
simmer:{loop:6,cap:'Turn down to a simmer. A knife slides in easily when done.',draw(c,t){room(c);
 P(c,()=>hob(c,320),320,336,0,1,1,true);flames(c,320,340,8,.55,240,t,1);
 P(c,()=>steelPot(c,270,160,()=>{water(c,260);[[-80,-2],[-40,4],[0,-4],[40,3],[80,-1],[-60,8],[20,9],[60,8]].forEach(([x,y],i)=>P(c,()=>potato(c,26,16),x,y,(i%3-1)*.3));bubbles(c,0,2,110,8,t,6,.6,.6);}),320,170);
 steam(c,300,148,t,.2);
 const k=bump(t,1.2,3.4);P(c,()=>knife(c),320,40+k*70,0,.8);
 dcard(c,520,110,[['15–20','minutes']],seg(t,.3,.6));tag(c,170,80,'Knife slides in\n= done',seg(t,2.6,2.9),-.02);
 grain(c);endFade(c,t,6);}},
rest:{loop:7,cap:'Lamb on a platter. Loose foil tent. Rest 20 to 30 minutes.',draw(c,t){room(c);
 P(c,()=>plate(c,230,26),290,318);P(c,()=>lamb(c,1,{rub:0,face:'sleep'}),285,272,0,.9);
 const p=seg(t,.3,1.3);if(p>0){c.save();c.globalAlpha=.32*Math.min(1,p*2);P(c,()=>foilSheet(c,430,150),290,312-(1-eo(p))*150,0,1,1,true);c.restore();}
 steam(c,120,290,t,0);steam(c,470,290,t,.5);
 P(c,()=>{plate(c,62,12);[-26,0,26].forEach(x=>P(c,()=>onionD(c,15,true),x,2));},560,326);
 tag(c,300,64,'Rest 20–30 min\nfoil loose',seg(t,1.4,1.7),-.02);
 grain(c);endFade(c,t,7);}},
drain:{loop:7,cap:'Drain. Let the potatoes steam. Warm the milk in the empty pan.',draw(c,t){room(c);
 P(c,()=>colander(c,200),160,226);[[-60,-4],[-30,-10],[0,-6],[30,-12],[60,-4],[-45,-20],[15,-22],[45,-18],[-15,-30]].forEach(([x,y],i)=>P(c,()=>potato(c,26,17),160+x,236+y,(i%3-1)*.4));
 steam(c,120,206,t,0,50);steam(c,165,200,t,.35,50);steam(c,205,206,t,.7,50);
 P(c,()=>hob(c,220),440,336,0,1,1,true);flames(c,440,340,5,.5,120,t,1);
 const tl=eio(seg(t,3.2,3.9))-eio(seg(t,5.2,5.8));P(c,()=>steelPot(c,170,90,()=>{c.fillStyle=LG(c,0,-10,0,10,[[0,'#ffffff'],[1,'#ece8de']]);c.fillRect(-90,-14,180,30);}),440,246,tl*.55);
 if(tl>.6){c.save();c.strokeStyle='#fbfaf6';c.lineWidth=6;c.lineCap='round';c.beginPath();c.moveTo(520,262);c.quadraticCurveTo(552,266,566,286);c.stroke();c.restore();}
 P(c,()=>mug(c,seg(t,3.8,5)>0,'#fbfaf6'),574,302);
 if(t<3.2){steam(c,430,226,t,.2,30);}
 tag(c,160,64,'Steam-dry 2 min',seg(t,.4,.7),-.02);tag(c,470,64,'125 ml milk:\nwarm, not boiling',seg(t,1,1.3),.02);
 grain(c);endFade(c,t,7);}},
mash:{loop:6,cap:'Butter in, mash, then add warm milk a splash at a time.',draw(c,t){room(c);
 const m=seg(t,1.6,3.2);P(c,()=>steelPot(c,280,140,()=>{c.fillStyle=LG(c,0,-12,0,12,[[0,'#fff3d4'],[1,'#ecd497']]);c.fillRect(-140,-14,280,30);if(m<1){c.globalAlpha=1-m;[[-90,-2],[-50,4],[-10,-4],[30,3],[70,-1],[-70,8],[10,9],[50,8],[100,4]].forEach(([x,y],i)=>P(c,()=>potato(c,26,16),x,y,(i%3-1)*.3,1,1,true));c.globalAlpha=1;}if(m>0){c.globalAlpha=m;c.strokeStyle='rgba(205,170,100,.6)';c.lineWidth=2;c.beginPath();c.ellipse(-10,2,60,6,0,0,5);c.stroke();c.fillStyle=RG(c,10,0,1,30,[[0,'#fff3a8'],[1,'#f2c84b']]);c.beginPath();c.ellipse(10,0,30,5,0,0,7);c.fill();c.globalAlpha=1;}const bs=1-seg(t,.4,2.4);if(bs>0)P(c,()=>butter(c,30*bs+2,16*bs+2),-20,-4,0,1,1,true);}),320,190);
 if(m>0){c.save();c.globalAlpha=m;P(c,()=>mash(c,236,40*m+8),320,196);c.restore();}
 const mp=t<3.3?Math.abs(Math.sin(t*3.4)):0;if(t<3.4)P(c,()=>{c.fillStyle='#4a2e1d';rrp(c,-6,-150,12,70,5);c.fill();c.fillStyle='#c8d0d8';c.fillRect(-3,-82,6,66);c.strokeStyle='#d5dce2';c.lineWidth=5;c.beginPath();c.moveTo(-34,-6);for(let k=0;k<6;k++)c.lineTo(-34+k*13+6,k%2?-6:-16);c.stroke();c.fillStyle='#c8d0d8';rrp(c,-36,-6,72,6,3);c.fill();},320,176-mp*26);
 const ml=bump(t,3.2,4.8);P(c,()=>mug(c,true,'#fbfaf6'),540,160,-ml*1.2);if(ml>.6){c.save();c.strokeStyle='#fbfaf6';c.lineWidth=5;c.lineCap='round';c.beginPath();c.moveTo(516,150);c.quadraticCurveTo(480,160,450,186);c.stroke();c.restore();}
 tag(c,480,250,'40 g butter',seg(t,.3,.6),.03);tag(c,170,70,'Warm milk,\na splash at a time',seg(t,3.2,3.5),-.02);
 const a=seg(t,4.8,5.1);sparkles(c,320,180,140,24,t,a);
 grain(c);endFade(c,t,6);}},
sauce:{loop:7,cap:'Spoon the juices through a sieve. Skim the fat. Taste first.',draw(c,t){room(c);
 P(c,()=>sheetPan(c,250),150,320);P(c,()=>foilTray(c,230,58,(top,bot,h)=>{c.fillStyle=LG(c,0,h-28,0,h-6,[[0,'rgba(220,155,75,.95)'],[1,'rgba(160,95,30,.95)']]);c.beginPath();c.moveTo(-bot+2,h-26);c.lineTo(bot-2,h-26);c.lineTo(bot-6,h-6);c.lineTo(-bot+6,h-6);c.closePath();c.fill();}),150,256);
 const lv=.25+eo(seg(t,.6,4.2))*.45;P(c,()=>{jug(c,lv);const top=44-82*lv;const fat=1-seg(t,4.4,5.6);if(fat>0){c.fillStyle=`rgba(250,205,90,${.9*fat})`;c.fillRect(-23,top-1,47,7);}},420,273,0,1.25);
 P(c,()=>{c.fillStyle='rgba(200,208,216,.9)';c.beginPath();c.moveTo(-50,0);c.bezierCurveTo(-50,44,50,44,50,0);c.closePath();c.fill();NS(c);c.strokeStyle='rgba(120,130,140,.6)';c.lineWidth=1;for(let k=-44;k<46;k+=6){c.beginPath();c.moveTo(k,0);c.lineTo(k*.7,32);c.stroke();}c.fillStyle='#9aa4ae';rrp(c,48,-4,70,8,4);c.fill();},420,212);
 const lp=(t%2.1)/2.1;if(t<4.3){const mv=eio(seg(lp,.05,.4))-eio(seg(lp,.7,1)),tl=bump(lp,.4,.7);const x=170+mv*240,y=270-mv*90;P(c,()=>{spoon(c);c.fillStyle='#c98a3a';c.beginPath();c.ellipse(0,0,13,6,0,0,7);c.fill();},x,y,-tl*1.1,1.2);if(tl>.4){c.fillStyle='#c98a3a';c.fillRect(x-4,y+6,6,26);}}
 if(t>4.4&&t<5.8){const k=seg(t,4.4,5.6);P(c,()=>spoon(c),396+k*50,200,0,.9);}
 P(c,()=>lemon(c,20),580,310);
 tag(c,170,60,'Kettle on. Zest\nthe lemon first.',seg(t,.1,.4)*(1-seg(t,3.8,4.1)),-.02);tag(c,440,60,'Skim off the fat',seg(t,4.4,4.7),.02);tag(c,170,130,'Taste first',seg(t,5.6,5.9),-.02);
 grain(c);endFade(c,t,7);}},
beans:{loop:6,cap:'4 to 6 minutes in boiling water. Toss with butter and lemon.',draw(c,t){room(c);
 P(c,()=>hob(c,240),180,336,0,1,1,true);flames(c,180,340,6,.9,170,t,1);
 P(c,()=>steelPot(c,220,140,()=>{water(c,210);[[-70,-2],[-30,3],[10,-3],[50,2],[-50,8],[30,8]].forEach(([x,y],i)=>P(c,()=>bean(c,40),x,y+Math.sin(t*5+i)*2,(i%3-1)*.4));bubbles(c,0,2,90,8,t,14,1.6,1);}),180,190);
 steam(c,160,168,t,0);steam(c,210,166,t,.5);
 P(c,()=>{bowlSide(c,190);},480,282);[[-50,-6,.2],[-20,-10,-.3],[10,-8,.1],[40,-6,-.2],[-35,-16,-.1],[0,-18,.3],[25,-16,-.4]].forEach(([x,y,r])=>P(c,()=>bean(c,46,'#7ad06d'),480+x,282+y,r));
 const bs=1-seg(t,1.8,3.6);if(bs>0)P(c,()=>butter(c,26*bs+3,14*bs+2),488,262);else{c.fillStyle='rgba(255,236,150,.6)';c.beginPath();c.ellipse(488,268,40,6,0,0,7);c.fill();}
 const z=seg(t,2.6,4.6);if(z>0&&z<1){P(c,()=>lemon(c,18),540,170,-.4);for(let k=0;k<6;k++){const p=((t*1.4+k/6)%1);c.fillStyle='#f5cf1d';c.fillRect(510+k*4,190+p*70,4,2);}}
 tag(c,180,60,'4–6 min,\nbright green',seg(t,.4,.7),-.02);tag(c,480,60,'Butter, zest,\na squeeze',seg(t,2,2.3),.02);
 grain(c);endFade(c,t,6);}},
serveL:{loop:6,cap:'Pull the lamb into chunks. Sauce over. Eat.',draw(c,t){room(c);
 P(c,()=>plate(c,260,62),320,300);
 P(c,()=>mash(c,150,84),186,316);
 [[-40,-6,.2],[-14,-12,-.3],[12,-8,.15],[36,-4,-.2],[-26,-18,-.1],[4,-20,.35],[26,-16,-.4]].forEach(([x,y,r])=>P(c,()=>bean(c,46),450+x,312+y,r));
 [[-20,330],[14,332]].forEach(([x,y])=>P(c,()=>onionD(c,15,true),330+x,y));
 [[-46,280,1],[34,276,2],[-8,262,3],[56,292,5],[-30,256,6],[18,250,9]].forEach(([x,y,s])=>P(c,()=>lambChunk(c,78,36,s),320+x,y,(s%3-1)*.25));
 const sp=eo(seg(t,.6,1.8));P(c,()=>lambChunk(c,80,38,7),298-sp*16,294,-.1);P(c,()=>lambChunk(c,70,36,8),342+sp*20,296,.15);
 if(t<2.4){P(c,()=>fork(c),300-sp*16,262,-.3);P(c,()=>fork(c),340+sp*20,262,.3);}
 const dr=seg(t,2.2,3.4);if(dr>0){c.save();c.strokeStyle='rgba(150,80,25,.85)';c.lineWidth=6;c.lineCap='round';c.setLineDash([500*dr,999]);c.beginPath();c.moveTo(270,262);c.bezierCurveTo(300,252,330,286,370,270);c.stroke();c.strokeStyle='rgba(255,220,160,.6)';c.lineWidth=1.6;c.stroke();c.restore();}
 steam(c,290,236,t,0);steam(c,340,232,t,.5);
 const a=seg(t,3.6,3.9);sparkles(c,320,270,220,50,t,a);tag(c,320,60,'Pull into chunks.\nSauce over.',seg(t,.4,.7),-.02);
 grain(c);endFade(c,t,6);}},
prepB:{loop:6.5,cap:'Everything you need, laid out and labelled. Patties stay in the fridge.',draw(c,t){room(c);
 flatlay(c,t,[
  ['Pan and lid',()=>{c.scale(.78,.78);c.translate(-30,0);nsPan(c,52);P(c,()=>{c.fillStyle='rgba(220,236,248,.75)';c.beginPath();c.moveTo(-50,0);c.bezierCurveTo(-46,-36,46,-36,50,0);c.closePath();c.fill();},0,-3,0,1,1,true);}],
  ['Probe thermometer',()=>P(c,()=>probeTool(c),-6,-30,-.2,.72,.72,true)],
  ['1 large onion',()=>P(c,()=>wholeOnion(c,26),0,-26,0,1,1,true)],
  ['2 soft buns',()=>{P(c,()=>bunTop(c,70,26),-36,-2,0,1,1,true);P(c,()=>bunTop(c,70,26),36,-2,0,1,1,true);}],
  ['40–60 g cheddar',()=>P(c,()=>cheddarBlock(c,60,34),-8,0,0,1,1,true)],
  ['Pickles\n+ brine',()=>{c.fillStyle='rgba(225,240,230,.8)';rrp(c,-24,-66,48,66,8);c.fill();NS(c);for(let i=0;i<4;i++)P(c,()=>pickle(c,16),0,-14-i*12,.4*(i%2?1:-1),1,1,true);c.fillStyle='#c33';rrp(c,-26,-74,52,10,3);c.fill();}],
  ['Mayo, mustard,\nketchup',()=>{[['#fffaf0',-34],['#e8b923',0],['#d83a2e',34]].forEach(([col,x])=>{c.fillStyle=col;rrp(c,x-13,-58,26,58,8);c.fill();c.fillStyle='#2b2f36';c.fillRect(x-6,-66,12,9);});}],
  ['15 g butter, oil',()=>{P(c,()=>butter(c,56,26),-24,-14,0,1,1,true);c.fillStyle=LG(c,-12,0,12,0,[[0,'#c9a33a'],[.5,'#f0d27a'],[1,'#b8932c']]);rrp(c,22,-64,24,64,8);c.fill();c.fillRect(29,-76,10,14);}]
 ]);
 grain(c);endFade(c,t,6.5);}},
halfmoon:{loop:6,cap:'Halve the onion, lay it flat, slice across thinly.',draw(c,t){room(c);
 P(c,()=>board(c,560,26),320,304);
 const id='hm';const sw=seg(t,.6,4);const cutX=-110+sw*200;
 P(c,()=>{c.save();c.beginPath();c.moveTo(-110,0);c.bezierCurveTo(-110,-110,100,-110,110,0);c.closePath();c.fillStyle=LG(c,0,-90,0,0,[[0,'#fffaf0'],[1,'#efe2bf']]);c.fill();NS(c);c.clip();c.strokeStyle='#e4d29f';c.lineWidth=2;[-60,-40,-20].forEach(y=>{c.beginPath();c.moveTo(-110,y);c.bezierCurveTo(-60,y-14,60,y-14,110,y);c.stroke();});c.strokeStyle='#a98a5a';c.lineWidth=1.6;for(let x=-104;x<cutX;x+=8){c.beginPath();c.moveTo(x,-100);c.lineTo(x,0);c.stroke();}c.restore();c.fillStyle='#d9bf6a';c.beginPath();c.ellipse(108,-6,6,10,0,0,7);c.fill();},230,302);
 if(t<4.1){const ch=Math.abs(Math.sin(t*16));P(c,()=>knife(c),230+cutX,150+ch*40,0,.85);}
 const n=Math.floor(sw*18);for(let i=0;i<n;i++)P(c,()=>strand(c,10,.02),430+(i%6)*20+((i/6|0)%2)*10,298-(i/6|0)*9,0,1,1,true);
 tag(c,470,200,'Thin, about 3 mm',seg(t,1.2,1.5),.02);
 grain(c);endFade(c,t,6);}},
onions:{loop:8,cap:'Medium-low heat. Stir now and then until soft and deep golden.',draw(c,t){room(c);
 const ck=seg(t,.2,6.8);
 P(c,()=>{c.fillStyle=LG(c,0,-10,0,10,[[0,'#3d424c'],[1,'#1e2127']]);rrp(c,100,-12,170,24,12);c.fill();c.fillStyle='#5a3a24';rrp(c,180,-11,90,22,11);c.fill();c.fillStyle=RG(c,-20,-20,10,130,[[0,'#4c525d'],[1,'#22262c']]);c.beginPath();c.arc(0,0,124,0,7);c.fill();NS(c);c.fillStyle=RG(c,-20,-20,10,110,[[0,'#3c414a'],[1,'#2a2e35']]);c.beginPath();c.arc(0,0,110,0,7);c.fill();
  c.fillStyle=RG(c,0,0,10,95,[[0,mix3('#f3e7c6','#d9a256','#9a5220',ck)],[1,mix3('#e8d9b0','#b9773a','#6e3612',ck)]]);c.beginPath();for(let i=0;i<=20;i++){const a=i/20*Math.PI*2,r=82+Math.sin(i*2.3)*6;i?c.lineTo(Math.cos(a)*r,Math.sin(a)*r):c.moveTo(Math.cos(a)*r,Math.sin(a)*r);}c.fill();const R=rng(41);for(let i=0;i<80;i++){const a=R()*7,r=R()*78,x=Math.cos(a)*r,y=Math.sin(a)*r;P(c,()=>strand(c,10+R()*4,cl(ck+(R()-.5)*.18)),x,y,R()*7,1,1,true);}
  if(ck>.4){c.fillStyle=`rgba(255,220,150,${.12*ck})`;c.beginPath();c.arc(-30,-30,60,0,7);c.fill();}},250,205);
 P(c,()=>woodSpoon(c),250+Math.cos(t*1.6)*55,205+Math.sin(t*1.6)*55,t*1.6+1.2);
 dcard(c,520,110,[['30–40','minutes']],1);
 tag(c,530,220,'Medium-low',seg(t,.3,.6),.03);tag(c,530,284,'Stir now\nand then',seg(t,.9,1.2),-.02);
 const a=seg(t,6.6,6.9);sparkles(c,250,205,140,140,t,a);
 grain(c);endFade(c,t,8);}},
sauceMix:{loop:6,cap:'Mix mayo, mustard, ketchup and pickle brine.',draw(c,t){room(c);
 P(c,()=>{c.fillStyle=RG(c,-20,-20,20,130,[[0,'#ffffff'],[1,'#e6e0d6']]);c.beginPath();c.arc(0,0,124,0,7);c.fill();NS(c);c.fillStyle=RG(c,0,0,10,108,[[0,'#f7f4ee'],[1,'#ebe5da']]);c.beginPath();c.arc(0,0,106,0,7);c.fill();},410,200);
 const mx=seg(t,2.4,3.6);
 const dl=[[0,'#fffdf4',[-26,-12],22],[.4,'#e8b923',[34,-24],13],[.8,'#d83a2e',[30,30],13],[1.2,'#cfe2a6',[-22,34],8]];
 dl.forEach(([s,col,[x,y],r])=>{const p=seg(t,.3+s,.7+s);if(p<=0||mx>=1)return;c.save();c.globalAlpha=1-mx;P(c,()=>{c.fillStyle=RG(c,-r*.3,-r*.3,1,r,[[0,'#ffffff'],[.35,col],[1,col]]);c.beginPath();c.arc(0,0,r,0,7);c.fill();},410+x,200+y-(1-back(p))*120);c.restore();});
 if(mx>0){c.save();c.globalAlpha=mx;c.fillStyle=RG(c,395,185,5,80,[[0,'#ffd0b4'],[1,'#ef9c74']]);c.beginPath();c.arc(410,200,74,0,7);c.fill();c.strokeStyle='rgba(255,255,255,.5)';c.lineWidth=3;c.beginPath();c.arc(410,200,46,t*3,t*3+2.4);c.stroke();c.restore();}
 P(c,()=>spoon(c),410+Math.cos(t*4)*40,200+Math.sin(t*4)*40,t*4+1.6,1.1);
 [['2 tbsp mayo',.3],['1 tsp mustard',.7],['1 tsp ketchup',1.1],['1 tsp pickle brine',1.5]].forEach(([s,a],i)=>tag(c,140,90+i*60,s,seg(t,a,a+.25),(i%2?.02:-.02)));
 grain(c);endFade(c,t,6);}},
slice:{loop:6,cap:'A few pickle slices per burger. Cheddar sliced thin.',draw(c,t){room(c);
 P(c,()=>board(c,580,26),320,304);
 const ps=seg(t,.4,3.4);P(c,()=>{c.fillStyle=LG(c,0,-20,0,20,[[0,'#9cc65c'],[1,'#4f7a26']]);c.beginPath();c.ellipse(0,0,80*(1-ps*.5),20,0,0,7);c.fill();NS(c);c.fillStyle='rgba(40,70,20,.4)';for(let i=0;i<10;i++){c.beginPath();c.arc(-60*(1-ps*.5)+i*12*(1-ps*.5),-6+(i%2)*10,1.8,0,7);c.fill();}},140-ps*40,282);
 if(t<3.5){const ch=Math.abs(Math.sin(t*7));P(c,()=>knife(c),180+ps*-40+60*(1-ps*.5)*0,150+ch*44,0,.8);}
 const n=Math.floor(ps*7);for(let i=0;i<n;i++)P(c,()=>pickle(c,15),196+(i%4)*30,290-(i/4|0)*10,0,1,1);
 P(c,()=>cheddarBlock(c,80,46),470,300);
 [0,1,2].forEach(i=>{const p=seg(t,1.6+i*.6,2.1+i*.6);if(p>0)P(c,()=>{c.fillStyle=LG(c,0,-4,0,4,[[0,'#ffd35c'],[1,'#f0a114']]);rrp(c,-40,-3,80,6,2);c.fill();},470+p*70,262-i*8-p*20+p*p*30,-.1+p*.15);});
 tag(c,170,64,'A few slices each',seg(t,1.2,1.5),-.02);tag(c,490,64,'Slice cheese thin',seg(t,3,3.3),.02);
 grain(c);endFade(c,t,6);}},
chips:{loop:6,cap:'Optional chips, timed from the packet to finish with the burgers.',draw(c,t){room(c);
 P(c,()=>ovenFront(c,300,280,.6,true),316,46);
 const p=eio(seg(t,.3,2));P(c,()=>{sheetPan(c,220);for(let i=0;i<14;i++)P(c,()=>fry(c,30),-86+i*13,-14-(i%3)*3,1.4+(i%4)*.1,1,1,true);},150+p*316,212);
 dcard(c,150,110,[['Packet','time + temp']],seg(t,2.2,2.6));
 tag(c,150,200,'Ends when burgers do',seg(t,2.7,3),.02);
 grain(c);endFade(c,t,6);}},
toBowl:{loop:6,cap:'Onions into a bowl. Keep the pan for the patties.',draw(c,t){room(c);
 const tl=eio(seg(t,.6,1.6))-eio(seg(t,4,4.8));
 P(c,()=>nsPan(c,120,()=>{const R=rng(3);const left=1-seg(t,1.4,3.2);for(let i=0;i<Math.floor(26*left);i++)P(c,()=>strand(c,11,.95),(R()*2-1)*80,(R()*2-1)*12,R()*3,1,1,true);}),220,250,tl*.5);
 for(let i=0;i<8;i++){const p=seg(t,1.4+i*.2,2.2+i*.2);if(p>0&&p<1)P(c,()=>strand(c,11,.95),300+p*170,236+p*p*60-Math.sin(p*Math.PI)*30,p*4,1,1,true);}
 P(c,()=>{bowlSide(c,200);},490,284);const f=seg(t,1.8,3.4);if(f>0)P(c,()=>onionLayer(c,150,46*f+4),490,282);
 tag(c,320,60,'Into a bowl. Keep the pan.',seg(t,3.4,3.7),-.02);
 grain(c);endFade(c,t,6);}},
patties:{loop:7,cap:'Medium heat. Brown the first side, then turn now and then. No pressing.',draw(c,t){room(c);
 P(c,()=>hob(c,360),300,340,0,1,1,true);flames(c,300,344,7,.8,260,t,1);
 P(c,()=>nsPan(c,210),300,282);
 const ck=.15+eo(seg(t,.2,4))*.7;P(c,()=>patty(c,130,40,ck),220,266);
 const fp=seg(t,3.4,4.2);const fy=Math.sin(fp*Math.PI)*60,fs=Math.cos(fp*Math.PI);P(c,()=>patty(c,130,40,fp>.5?1:ck),380,266-fy,0,1,Math.abs(fs)<.08?.08:Math.abs(fs));
 if(fp>0&&fp<1)P(c,()=>{c.fillStyle=LG(c,0,-4,0,4,[[0,'#f2f5f7'],[1,'#9aa4ad']]);rrp(c,-50,-3,100,6,2);c.fill();c.fillStyle='#2b2f36';c.save();c.rotate(-.5);rrp(c,40,-4,90,8,4);c.fill();c.restore();},380,288-fy);
 [[200,240],[240,236],[380,240]].forEach(([x,y],i)=>steam(c,x,y,t*1.4,i*.3,26));
 P(c,()=>{c.fillStyle='#ffffff';c.beginPath();c.arc(0,0,34,0,7);c.fill();NS(c);c.strokeStyle='#d0392b';c.lineWidth=6;c.beginPath();c.arc(0,0,30,0,7);c.stroke();P(c,()=>mitten(c),0,2,0,.42,.42,true);c.beginPath();c.moveTo(-21,21);c.lineTo(21,-21);c.stroke();},84,90);
 tag(c,90,150,'No squashing',seg(t,.5,.8),.03);tag(c,400,60,'Medium heat,\nnot smoking',seg(t,.3,.6),-.02);
 grain(c);endFade(c,t,7);}},
probe:{loop:8.4,cap:'Cheese and onions on, lid on. Probe from the side into the centre.',draw(c,t){room(c);
 P(c,()=>hob(c,380),320,340,0,1,1,true);flames(c,320,344,7,.7,260,t,1);
 P(c,()=>nsPan(c,220),320,290);
 P(c,()=>{patty(c,210,54,1);if(t<.4)face(c,0,4,.9,'sweat');},320,264);
 const cp=seg(t,.4,.9),melt=seg(t,1.2,2.2);if(cp>0)P(c,()=>cheese(c,200,melt),320,238-(1-back(cp))*200);
 const op=seg(t,1.4,1.9);if(op>0)P(c,()=>onionLayer(c,180,18),320,236-(1-back(op))*180);
 const ld=seg(t,2,2.4)-seg(t,3,3.3);if(ld>0){c.save();c.globalAlpha=.8;P(c,()=>{c.fillStyle='rgba(225,240,250,.7)';c.beginPath();c.moveTo(-150,0);c.bezierCurveTo(-140,-110,140,-110,150,0);c.closePath();c.fill();NS(c);c.fillStyle='#2b2f36';rrp(c,-16,-88,32,10,4);c.fill();c.strokeStyle='rgba(255,255,255,.7)';c.lineWidth=3;c.beginPath();c.moveTo(-100,-50);c.quadraticCurveTo(-60,-84,-10,-88);c.stroke();},320,280-(1-eo(ld))*170,0,1,1,true);c.restore();}
 const pr=eo(seg(t,3.3,3.8));if(pr>0)P(c,()=>probeTool(c),110+pr*110,262);
 const temps=[[3.8,'58°C'],[4.3,'66°C'],[4.8,'71°C'],[5.3,'75°C']];let cur=null;temps.forEach(q=>{if(t>=q[0])cur=q[1];});const hold=seg(t,5.3,6.6);
 if(cur){if(hold>=1)sparkles(c,130,92,110,74,t,1);dcard(c,120,100,[[cur,hold>=1?'held 30 s':hold>0?'holding '+Math.round(hold*30)+' s':'reading']],1,hold>=1,hold>0?hold:null);}
 tag(c,470,70,'75°C for 30 s\nor 70°C for 2 min',seg(t,3.8,4),.02);tag(c,470,150,'Check each patty',seg(t,6.7,6.9),-.02);
 grain(c);endFade(c,t,8.4);}},
buns:{loop:6,cap:'Patties rest on a plate. Buns toast cut-side down in the same pan.',draw(c,t){room(c);
 P(c,()=>plate(c,100,18),120,320);P(c,()=>{patty(c,120,36,1);P(c,()=>cheese(c,116,1),0,-14,0,1,1,true);P(c,()=>onionLayer(c,104,14),0,-18,0,1,1,true);},120,300);
 P(c,()=>hob(c,300),420,340,0,1,1,true);flames(c,420,344,6,.6,200,t,1);P(c,()=>nsPan(c,170),420,288);
 P(c,()=>bunTop(c,110,40,true),360,286);
 const lf=bump(t,1.4,4.4);P(c,()=>bunTop(c,110,40,true),484,286-lf*56,lf*.25);
 if(lf>.4){c.save();c.globalAlpha=lf;P(c,()=>{c.fillStyle=RG(c,0,0,5,56,[[0,'#e8a45a'],[1,'#b9702c']]);c.beginPath();c.ellipse(0,0,52,7,0,0,7);c.fill();},484,288-lf*56+2,lf*.25,1,1,true);c.restore();}
 steam(c,380,262,t,0,26);
 tag(c,484,150,'Golden = done',seg(t,2.2,2.5),.02);tag(c,120,230,'Resting',seg(t,.4,.7),-.03);
 grain(c);endFade(c,t,6);}},
build:{loop:8.2,cap:'Bottom bun, sauce, cheesy patty, onions, pickles, top bun.',draw(c,t){room(c);
 P(c,()=>plate(c,170,24),250,322);
 const L=[['Bottom bun',()=>bunBottom(c,190,30,true),306],['Thin sauce',()=>{c.fillStyle=LG(c,0,-6,0,4,[[0,'#ffc2a4'],[1,'#ea8f66']]);c.beginPath();c.moveTo(-88,0);for(let x=-88;x<=88;x+=11)c.quadraticCurveTo(x+5,6,x+11,0);c.lineTo(88,-6);c.lineTo(-88,-6);c.closePath();c.fill();},304],['Cheesy patty',()=>{patty(c,200,46,1);P(c,()=>cheese(c,196,1),0,-20,0,1,1,true);},282],['Browned onions',()=>onionLayer(c,180,18),260],['Pickles',()=>{for(let k=0;k<4;k++)P(c,()=>pickle(c,17),-54+k*36,0,0,1,1,true);},250],['Top bun',()=>{bunTop(c,196,62,false);face(c,0,-34,.9,'happy');},244]];
 L.forEach((l,i)=>{const s=.4+i*.75;if(dropIn(c,t,s,.45,l[1],250,l[2],260))tag(c,520,300-i*38,(i+1)+'. '+l[0],seg(t,s+.35,s+.55),i%2?.02:-.02);});
 [0,1,2,3,4].forEach(k=>P(c,()=>fry(c,44),60+k*12,302,-.2+k*.1));
 const a=seg(t,5.2,5.4);sparkles(c,250,220,140,90,t,a);tag(c,250,60,'Eat straight away',a,-.02);
 grain(c);endFade(c,t,8.2);}},
ahead:{loop:7,cap:'While it roasts: potatoes into cold water, beans trimmed',draw(c,t){room(c);
 P(c,()=>board(c,250,20),170,312);
 const pk=seg(t,.3,2.2);P(c,()=>{c.fillStyle=LG(c,0,-30,0,30,[[0,'#c99a5c'],[1,'#9c6f3a']]);c.beginPath();c.ellipse(0,0,46,30,0,0,7);c.fill();NS(c);c.save();c.beginPath();c.ellipse(0,0,46,30,0,0,7);c.clip();c.fillStyle=LG(c,0,-30,0,30,[[0,'#fbefc0'],[1,'#e6c46c']]);c.fillRect(-46,-30,92*pk,60);c.restore();},120,282,0,1-seg(t,2.2,2.5)*.999);
 if(pk>0&&pk<1){P(c,()=>{c.fillStyle='#c8d0d8';rrp(c,-6,-70,12,52,4);c.fill();c.fillStyle='#2b6cb0';rrp(c,-8,-120,16,52,6);c.fill();},120-46+pk*92,260,.3);for(let k=0;k<Math.floor(pk*6);k++)P(c,()=>{c.strokeStyle='#a8793f';c.lineWidth=4;c.beginPath();c.arc(0,0,10,0,3);c.stroke();},70+k*16,318,k);}
 const ch=seg(t,2.4,2.6);if(ch>0&&t<2.9)[[-20,0],[0,-8],[20,0],[-10,8],[10,8]].forEach(([x,y])=>P(c,()=>potato(c,24,15),120+x,290+y));
 P(c,()=>steelPot(c,200,120,()=>{water(c,190);const n=Math.floor(seg(t,2.9,4)*8);[[-60,-2],[-30,4],[0,-4],[30,3],[60,-1],[-45,8],[15,9],[45,8]].slice(0,n).forEach(([x,y],i)=>P(c,()=>potato(c,24,15),x,y,(i%3-1)*.3));}),440,210);
 for(let i=0;i<5;i++){const p=seg(t,2.9+i*.2,3.3+i*.2);if(p>0&&p<1)P(c,()=>potato(c,24,15),160+p*270,280-Math.sin(p*Math.PI)*110,p*4);}
 const bs=seg(t,4.4,4.8);if(bs>0)P(c,()=>{for(let i=0;i<6;i++)P(c,()=>bean(c,44),-46+(i%3)*46,-(i/3|0)*9,(i%2?.06:-.06),1,1,true);},170,296,0,bs);
 tag(c,160,70,'600 g = about\n2–3 large potatoes',seg(t,.3,.6),-.03);tag(c,470,70,'Cold water.\nHeat off.',seg(t,3.2,3.5),.03);tag(c,170,190,'Trim 200–250 g beans',seg(t,4.6,4.9),-.02);
 grain(c);endFade(c,t,7);}},
compare:{loop:6,cap:'Lamb: 8 thick wedges. Burgers: thin half-moons.',draw(c,t){room(c);
 P(c,()=>{c.fillStyle='#fffaf0';c.fillRect(-140,-130,280,260);NS(c);for(let i=0;i<8;i++){const a1=-Math.PI/2+i*Math.PI/4,a2=a1+Math.PI/4,m=(a1+a2)/2;P(c,()=>onionDisc(c,70,a1,a2),Math.cos(m)*10,-14+Math.sin(m)*10,0,1,1,true);}c.fillStyle='#2b2017';c.font='700 17px "Atkinson Hyperlegible", sans-serif';c.textAlign='center';c.fillText('Lamb: 8 thick wedges',0,104);},170,190,-.02);
 P(c,()=>{c.fillStyle='#fffaf0';c.fillRect(-140,-130,280,260);NS(c);for(let i=0;i<24;i++)P(c,()=>strand(c,11,.05),-80+(i%6)*30+((i/6|0)%2)*14,30-(i/6|0)*20,0,1,1,true);c.fillStyle='#2b2017';c.font='700 17px "Atkinson Hyperlegible", sans-serif';c.textAlign='center';c.fillText('Burgers: thin half-moons',0,94);c.font='400 14px "Atkinson Hyperlegible", sans-serif';c.fillText('about 3 mm',0,114);},470,190,.02);
 grain(c);}}
};


