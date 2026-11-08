/* ===================== parts library + generic scene kinds =====================
   A plan's step either uses a library scene by name ({"use":"assemble"}) or a
   generic kind ({"kind":"tray", ...}). Unknown names fall back to a labelled card,
   so a new recipe never breaks the page. */

/* ---------- extra food drawings ---------- */
function salmonFillet(c,w,h,st){st=st||{};const ck=st.cooked?1:0;
 c.fillStyle=LG(c,0,-6,0,2,[[0,'#a3afba'],[1,'#5b6772']]);rrp(c,-w/2,-7,w,8,4);c.fill();
 c.beginPath();c.moveTo(-w/2,-5);c.bezierCurveTo(-w/2+4,-h*.95,w*.05,-h*1.08,w/2,-h*.5);c.lineTo(w/2,-5);c.closePath();
 c.fillStyle=LG(c,0,-h,0,0,[[0,ck?'#f8c19f':'#ff9c72'],[1,ck?'#e9946a':'#e2603d']]);c.fill();NS(c);
 c.save();c.clip();c.strokeStyle=ck?'rgba(255,244,232,.85)':'rgba(255,236,222,.85)';c.lineWidth=2.3;
 for(let k=-w/2+12;k<w/2;k+=13){c.beginPath();c.moveTo(k,-3);c.quadraticCurveTo(k+9,-h*.5,k+3,-h*1.1);c.stroke();}
 if(st.coated||ck){const R=rng(17);for(let i=0;i<22;i++){c.fillStyle=R()>.4?'rgba(214,170,40,.85)':'rgba(255,255,255,.7)';c.beginPath();c.arc((R()-.5)*w*.9,-h*.55-R()*h*.35,1.2+R()*1.3,0,7);c.fill();}}
 if(ck){c.fillStyle=LG(c,0,-h,0,-h*.55,[[0,'rgba(205,120,55,.55)'],[1,'rgba(205,120,55,0)']]);c.fillRect(-w/2,-h*1.1,w,h*.6);}
 c.strokeStyle='rgba(255,255,255,.6)';c.lineWidth=2.4;c.beginPath();c.moveTo(-w*.3,-h*.72);c.quadraticCurveTo(-w*.05,-h*.92,w*.2,-h*.78);c.stroke();c.restore();}
function asparagusSpear(c,len,st){st=st||{};const ck=st.cooked;const L=st.trimmed===false?len:len*.86;
 if(st.trimmed===false){c.fillStyle=LG(c,0,-5,0,3,[[0,'#d8d2a0'],[1,'#b9b27a']]);rrp(c,-len/2,-6,len*.16,7,3.5);c.fill();}
 const x0=-len/2+(st.trimmed===false?len*.15:0);
 c.fillStyle=LG(c,0,-6,0,2,[[0,ck?'#6d9a3a':'#8cc65a'],[1,ck?'#3f6420':'#4e8a2c']]);rrp(c,x0,-6,L-12,7,3.5);c.fill();
 c.fillStyle=ck?'#4b5a2a':'#5d7f34';for(let k=0;k<4;k++){c.beginPath();c.moveTo(x0+L-12-k*6,-6);c.lineTo(x0+L-4-k*6,-2.5);c.lineTo(x0+L-12-k*6,1);c.fill();}
 c.beginPath();c.ellipse(x0+L-6,-2.5,7,4.5,0,0,7);c.fill();NS(c);
 c.fillStyle='rgba(60,90,30,.5)';for(let k=1;k<5;k++){c.beginPath();c.moveTo(x0+k*(L/6),-6);c.lineTo(x0+k*(L/6)+5,-3);c.lineTo(x0+k*(L/6),-3);c.fill();}
 if(ck){c.fillStyle='rgba(40,30,10,.5)';[.2,.45,.7].forEach(q=>{c.beginPath();c.arc(x0+L*q,-3,1.8,0,7);c.fill();});}
 c.fillStyle='rgba(255,255,255,.45)';c.fillRect(x0+4,-5,L-24,1.5);}
function babyPotato(c,w,st){st=st||{};const h=w*.56;const R0=rng(Math.round(w*7)+(st.seed||0));const j=()=>(R0()-.5)*w*.08;
 const skin=st.cooked?[[0,'#efc77e'],[.6,'#cf9445'],[1,'#9a5f24']]:[[0,'#eedcac'],[.65,'#d4b47a'],[1,'#a98552']];
 c.fillStyle=RG(c,-w*.18,-h*.75,2,w*.75,skin);c.beginPath();
 if(st.cut===false){c.moveTo(-w/2,-h*.45);c.bezierCurveTo(-w/2+j(),-h*1.02,w*.1+j(),-h*1.08,w/2,-h*.55);c.bezierCurveTo(w/2+2,-h*.08,w*.1,0,-w*.1,0);c.bezierCurveTo(-w*.4,0,-w/2-1,-h*.12,-w/2,-h*.45);}
 else{c.moveTo(-w/2,0);c.bezierCurveTo(-w/2+j(),-h*1.05,w/2+j(),-h*1.15,w/2,0);c.closePath();}
 c.fill();NS(c);
 if(st.cut!==false){c.fillStyle=st.cooked?LG(c,0,-5,0,1,[[0,'#d99442'],[1,'#8f521b']]):LG(c,0,-5,0,1,[[0,'#fbefc2'],[1,'#ead48c']]);rrp(c,-w/2+1,-5,w-2,6,2.5);c.fill();}
 const R=rng(Math.round(w*13));c.fillStyle=st.cooked?'rgba(110,60,20,.35)':'rgba(120,85,40,.4)';for(let i=0;i<9;i++){c.beginPath();c.ellipse((R()-.5)*w*.75,-h*.25-R()*h*.55,1+R()*1.2,.7,R()*3,0,7);c.fill();}
 if(st.cooked){c.fillStyle='rgba(255,236,190,.35)';c.beginPath();c.ellipse(-w*.12,-h*.7,w*.1,h*.06,-.3,0,7);c.fill();}}
function jar(c,w,h,fill,lid){c.fillStyle='rgba(228,240,248,.75)';rrp(c,-w/2,-h,w,h,7);c.fill();NS(c);c.fillStyle=fill;rrp(c,-w/2+3,-h*.72,w-6,h*.72-3,5);c.fill();c.fillStyle=lid||'#2b2f36';rrp(c,-w/2-2,-h-8,w+4,9,3);c.fill();c.fillStyle='rgba(255,255,255,.5)';c.fillRect(-w/2+5,-h+6,3,h-14);}
function bottle(c,w,h,col){c.fillStyle=LG(c,-w/2,0,w/2,0,[[0,mix(col,'#000000',.25)],[.5,col],[1,mix(col,'#000000',.3)]]);rrp(c,-w/2,-h,w,h,8);c.fill();c.fillRect(-w*.2,-h-12,w*.4,14);NS(c);c.fillStyle='rgba(255,255,255,.35)';c.fillRect(-w/2+4,-h+8,3,h-16);}
function herbSprig(c,len,col){c.strokeStyle='#5a7a34';c.lineWidth=2.4;c.beginPath();c.moveTo(-len/2,0);c.quadraticCurveTo(0,-10,len/2,-4);c.stroke();NS(c);for(let i=0;i<7;i++){const x=-len/2+8+i*(len-12)/6,y=-6-Math.sin(i)*3;c.fillStyle=i%2?'#4f8a3a':'#6aa84f';c.beginPath();c.ellipse(x,y-5,6,4.5,i,0,7);c.fill();c.beginPath();c.ellipse(x+3,y+3,5,4,-i,0,7);c.fill();}}
function lemonWedge(c,r){c.fillStyle='#f5d22e';c.beginPath();c.moveTo(-r,0);c.arc(0,0,r,Math.PI,0);c.closePath();c.fill();NS(c);c.fillStyle='#fff4b0';c.beginPath();c.moveTo(-r+3,0);c.arc(0,0,r-3,Math.PI,0);c.closePath();c.fill();c.strokeStyle='#f0c419';c.lineWidth=1.4;[-.6,-.2,.2,.6].forEach(a=>{c.beginPath();c.moveTo(0,0);c.lineTo(Math.sin(a)*(r-4),-Math.cos(a)*(r-4));c.stroke();});}


/* ---------- more everyday foods ---------- */
function speckle(c,w,h,n,col,seed){const R=rng(seed);c.fillStyle=col;for(let i=0;i<n;i++){c.beginPath();c.arc((R()-.5)*w,-R()*h,0.8+R()*1.4,0,7);c.fill();}}
function chickenPiece(c,w,st){const h=w*.38,ck=st.cooked;c.fillStyle=LG(c,0,-h,0,0,ck?[[0,'#efc489'],[1,'#c98c44']]:[[0,'#f6cfc4'],[1,'#e2a395']]);c.beginPath();c.moveTo(-w/2,-2);c.bezierCurveTo(-w/2,-h*1.2,w*.25,-h*1.3,w/2,-h*.35);c.quadraticCurveTo(w/2+2,0,w*.3,0);c.lineTo(-w/2+4,0);c.closePath();c.fill();NS(c);
 if(st.cut){c.strokeStyle=ck?'rgba(140,85,30,.55)':'rgba(190,110,100,.6)';c.lineWidth=2;for(let k=-2;k<=2;k++){c.beginPath();c.moveTo(k*w*.16,-h*.95);c.lineTo(k*w*.16+4,-1);c.stroke();}}
 if(ck)speckle(c,w*.7,h*.8,10,'rgba(150,80,20,.35)',5);c.fillStyle='rgba(255,255,255,.35)';c.beginPath();c.ellipse(-w*.15,-h*.85,w*.16,h*.12,-.2,0,7);c.fill();}
function mound(c,w,h,top,bot){c.fillStyle=LG(c,0,-h,0,0,[[0,top],[1,bot]]);c.beginPath();c.moveTo(-w/2,0);c.bezierCurveTo(-w*.4,-h*1.3,w*.4,-h*1.3,w/2,0);c.closePath();c.fill();NS(c);}
function minceHeap(c,w,st){const ck=st.cooked;mound(c,w,w*.32,ck?'#9a6040':'#d76b6b',ck?'#6e3f26':'#b54a4f');const R=rng(9);for(let i=0;i<34;i++){c.fillStyle=ck?(R()>.5?'rgba(60,30,15,.5)':'rgba(190,130,90,.5)'):(R()>.5?'rgba(255,215,215,.75)':'rgba(140,40,45,.45)');c.beginPath();c.arc((R()-.5)*w*.8,-R()*w*.3,1.6+R()*1.4,0,7);c.fill();}}
function riceHeap(c,w,st){mound(c,w,w*.3,'#fbfaf3','#e6e1cf');const R=rng(3);c.fillStyle='rgba(200,190,160,.7)';for(let i=0;i<40;i++){c.save();c.translate((R()-.5)*w*.8,-R()*w*.28);c.rotate(R()*3);c.fillRect(-2.5,-1,5,2);c.restore();}}
function redPepper(c,w,st){const col=st.color||'#d8322a';if(st.cut){for(let i=0;i<5;i++)P(c,()=>{c.fillStyle=col;rrp(c,-w*.4,-5,w*.8,6,3);c.fill();},(i-2)*6,-i*5,(i%2?.15:-.15),1,1,true);return;}
 c.fillStyle=RG(c,-w*.15,-w*.6,4,w*.7,[[0,mix(col,'#ffffff',.25)],[1,mix(col,'#000000',.25)]]);c.beginPath();c.moveTo(-w*.45,-w*.55);c.bezierCurveTo(-w*.55,-w*.1,-w*.3,0,-w*.12,-w*.05);c.quadraticCurveTo(0,0,w*.12,-w*.05);c.bezierCurveTo(w*.3,0,w*.55,-w*.1,w*.45,-w*.55);c.bezierCurveTo(w*.35,-w*.85,-w*.35,-w*.85,-w*.45,-w*.55);c.fill();NS(c);
 c.fillStyle='#4f7a2c';rrp(c,-4,-w*.92,8,w*.18,3);c.fill();c.fillStyle='rgba(255,255,255,.4)';c.beginPath();c.ellipse(-w*.2,-w*.55,w*.06,w*.16,.2,0,7);c.fill();}
function broccoliHead(c,w,st){const ck=st.cooked;c.fillStyle=ck?'#8fbf5a':'#a9c97a';rrp(c,-w*.1,-w*.45,w*.2,w*.45,4);c.fill();NS(c);const R=rng(11);for(let i=0;i<9;i++){const a=i/9*Math.PI,r=w*.3;c.fillStyle=i%2?(ck?'#3f8a32':'#356f2a'):(ck?'#4fa03c':'#447f31');c.beginPath();c.arc(Math.cos(a+Math.PI)*r*.9,-w*.55+Math.sin(a+Math.PI)*r*.55,w*.17+R()*3,0,7);c.fill();}c.fillStyle=ck?'#4fa03c':'#3e7a2e';c.beginPath();c.arc(0,-w*.68,w*.2,0,7);c.fill();}
function dumpling(c,w,st){const h=w*.6,ck=st.cooked;c.fillStyle=LG(c,0,-h,0,0,[[0,ck?'#fbf3e2':'#f7f1e4'],[1,ck?'#e8d6b4':'#e2d8c3']]);c.beginPath();c.moveTo(-w/2,0);c.bezierCurveTo(-w/2,-h*.9,w/2,-h*.9,w/2,0);c.closePath();c.fill();NS(c);
 c.strokeStyle='rgba(170,150,115,.6)';c.lineWidth=1.6;for(let k=-2;k<=2;k++){c.beginPath();c.moveTo(k*w*.13,-h*.68);c.quadraticCurveTo(k*w*.13+5,-h*.45,k*w*.15,-h*.3);c.stroke();}
 if(ck){c.fillStyle='rgba(255,255,255,.55)';c.beginPath();c.ellipse(-w*.15,-h*.5,w*.1,h*.08,-.3,0,7);c.fill();}}
function eggShape(c,w,st){if(st.cut||st.cracked){c.fillStyle='#ffffff';c.beginPath();c.ellipse(0,-6,w*.7,8,0,0,7);c.fill();NS(c);c.fillStyle='#f4b400';c.beginPath();c.arc(0,-9,w*.25,0,7);c.fill();return;}
 c.fillStyle=RG(c,-w*.15,-w*.9,2,w*.9,[[0,'#f7e3c8'],[1,'#c99a6a']]);c.beginPath();c.ellipse(0,-w*.62,w*.42,w*.6,0,0,7);c.fill();NS(c);}
function bananaShape(c,w,st){const ripe=st.ripe;c.fillStyle=LG(c,0,-w*.3,0,0,[[0,ripe?'#e3c046':'#f6d64a'],[1,ripe?'#b98a28':'#d9ac22']]);c.beginPath();c.moveTo(-w/2,-w*.22);c.quadraticCurveTo(0,w*.12,w/2,-w*.26);c.quadraticCurveTo(w*.05,-w*.02,-w/2+4,-w*.3);c.closePath();c.fill();NS(c);
 c.fillStyle='#5a4320';rrp(c,w/2-5,-w*.3,9,6,2);c.fill();if(ripe)speckle(c,w*.7,w*.18,16,'rgba(90,55,20,.7)',7);}
function tinCan(c,w,st){const h=w*1.3;c.fillStyle=LG(c,-w/2,0,w/2,0,[[0,'#9aa3ad'],[.5,'#e6eaee'],[1,'#8a939d']]);rrp(c,-w/2,-h,w,h,4);c.fill();NS(c);c.fillStyle=st.color||'#c0392b';c.fillRect(-w/2,-h*.75,w,h*.5);c.fillStyle='rgba(255,255,255,.85)';c.beginPath();c.ellipse(0,-h*.5,w*.28,h*.12,0,0,7);c.fill();}
function cucumberShape(c,w,st){if(st.cut){for(let i=0;i<5;i++){c.fillStyle='#3f7a2f';c.beginPath();c.ellipse((i-2)*15,-8,8,8,0,0,7);c.fill();c.fillStyle='#d9ecb5';c.beginPath();c.ellipse((i-2)*15,-8,6,6,0,0,7);c.fill();}return;}
 c.fillStyle=LG(c,0,-22,0,0,[[0,'#4f8a35'],[1,'#2e5c22']]);rrp(c,-w/2,-22,w,22,11);c.fill();NS(c);speckle(c,w*.85,18,14,'rgba(220,240,190,.55)',13);}
function springOnionShape(c,w,st){c.fillStyle='#f3f1e4';rrp(c,-w/2,-9,w*.4,9,4);c.fill();NS(c);c.fillStyle=LG(c,0,-9,0,0,[[0,'#7fbf4a'],[1,'#4f8a2c']]);rrp(c,-w/2+w*.38,-9,w*.62,9,4);c.fill();c.fillStyle='#d8cfb6';rrp(c,-w/2-4,-7,6,5,2);c.fill();}
function loafShape(c,w,st){const h=w*.42;c.fillStyle=LG(c,0,-h,0,0,[[0,'#a5622e'],[1,'#6f3b17']]);c.beginPath();c.moveTo(-w/2,0);c.lineTo(-w/2,-h*.7);c.quadraticCurveTo(0,-h*1.25,w/2,-h*.7);c.lineTo(w/2,0);c.closePath();c.fill();NS(c);c.strokeStyle='rgba(250,220,170,.55)';c.lineWidth=3;c.beginPath();c.moveTo(-w*.3,-h*.92);c.quadraticCurveTo(0,-h*1.08,w*.3,-h*.92);c.stroke();}


function carrotShape(c,w,st){if(st.cut){for(let i=0;i<6;i++)P(c,()=>{c.fillStyle='#e8822a';rrp(c,-w*.22,-5,w*.44,6,3);c.fill();},(i%3-1)*16,-(i/3|0)*7,(i%2?.2:-.2),1,1,true);return;}
 c.fillStyle=LG(c,0,-14,0,0,[[0,'#f39a3d'],[1,'#d36a1c']]);c.beginPath();c.moveTo(-w/2,-7);c.quadraticCurveTo(-w*.2,-15,w*.42,-8);c.lineTo(w/2,-6);c.lineTo(w*.42,-3);c.quadraticCurveTo(-w*.2,2,-w/2,-5);c.closePath();c.fill();NS(c);
 c.strokeStyle='rgba(150,70,20,.4)';c.lineWidth=1.3;for(let k=-2;k<=2;k++){c.beginPath();c.moveTo(k*w*.15,-12);c.lineTo(k*w*.15+3,-3);c.stroke();}c.fillStyle='#5e9a34';for(let k=0;k<3;k++){P(c,()=>{c.beginPath();c.ellipse(0,0,12,3,0,0,7);c.fill();},-w/2-8,-7+(k-1)*4,(k-1)*.4,1,1,true);}}
function peasPile(c,w,st){const R=rng(21);for(let i=0;i<26;i++){const x=(R()-.5)*w*.8,y=-4-R()*w*.18*(1-Math.abs(x)/(w*.5));c.fillStyle=RG(c,x-1.5,y-1.5,0.5,6,[[0,st.cooked?'#a8dc6a':'#9ad25c'],[1,st.cooked?'#4e9a2a':'#3f8a24']]);c.beginPath();c.arc(x,y,5,0,7);c.fill();}}
function limeShape(c,w,st){if(st.cut){c.fillStyle='#7fb83a';c.beginPath();c.moveTo(-w/2,0);c.arc(0,0,w/2,Math.PI,0);c.closePath();c.fill();NS(c);c.fillStyle='#d6eea0';c.beginPath();c.moveTo(-w/2+3,0);c.arc(0,0,w/2-3,Math.PI,0);c.closePath();c.fill();return;}
 c.fillStyle=RG(c,-w*.15,-w*.65,2,w*.6,[[0,'#a6d65a'],[1,'#4f8a22']]);c.beginPath();c.ellipse(0,-w*.45,w*.5,w*.44,0,0,7);c.fill();NS(c);speckle(c,w*.7,w*.7,10,'rgba(230,250,200,.5)',3);}
function wholeChicken(c,w,st){const h=w*.55,ck=st.cooked;c.fillStyle=LG(c,0,-h,0,0,ck?[[0,'#e7a44c'],[1,'#a8601f']]:[[0,'#f8dccf'],[1,'#e2ab98']]);c.beginPath();c.moveTo(-w*.45,0);c.bezierCurveTo(-w*.55,-h*1.1,w*.45,-h*1.15,w*.48,-h*.25);c.quadraticCurveTo(w*.45,0,w*.2,0);c.closePath();c.fill();NS(c);
 [[-.42,1],[.36,-1]].forEach(([fx,dir])=>{c.fillStyle=ck?'#b8702a':'#eab8a6';c.beginPath();c.ellipse(w*fx,-h*.28,w*.12,h*.3,dir*.5,0,7);c.fill();c.fillStyle=ck?'#f3e2c6':'#fff4ec';c.beginPath();c.arc(w*fx+dir*-w*.08,-h*.02,w*.035,0,7);c.fill();});
 if(ck)speckle(c,w*.7,h*.8,16,'rgba(120,60,15,.35)',8);c.fillStyle='rgba(255,255,255,.3)';c.beginPath();c.ellipse(-w*.05,-h*.82,w*.2,h*.1,-.1,0,7);c.fill();}


/* ---------- world kitchen: common foods across cuisines ---------- */
const hi=(c,x,y,rx,ry,a)=>{c.fillStyle=`rgba(255,255,255,${a||.4})`;c.beginPath();c.ellipse(x,y,rx,ry,-.3,0,7);c.fill();};
function tomatoShape(c,w,st){if(st.cut){c.fillStyle='#d8352a';c.beginPath();c.moveTo(-w/2,0);c.arc(0,0,w/2,Math.PI,0);c.closePath();c.fill();NS(c);c.fillStyle='#f06a4e';c.beginPath();c.moveTo(-w/2+4,0);c.arc(0,0,w/2-4,Math.PI,0);c.closePath();c.fill();c.fillStyle='#f6d36b';[-.25,0,.25].forEach(f=>{c.beginPath();c.ellipse(f*w,-w*.18,3,5,0,0,7);c.fill();});return;}
 c.fillStyle=RG(c,-w*.15,-w*.65,3,w*.6,[[0,'#ff7a5c'],[1,'#b8231b']]);c.beginPath();c.ellipse(0,-w*.42,w*.5,w*.42,0,0,7);c.fill();NS(c);c.fillStyle='#3f7a2a';for(let k=0;k<5;k++){P(c,()=>{c.beginPath();c.ellipse(6,0,7,2.4,0,0,7);c.fill();},0,-w*.82,k*1.26,1,1,true);}hi(c,-w*.18,-w*.6,w*.1,w*.06);}
function mushroomShape(c,w,st){const ck=st.cooked;if(st.cut){c.fillStyle=ck?'#b8916a':'#efe4d2';c.beginPath();c.moveTo(-w/2,-w*.3);c.quadraticCurveTo(0,-w*.75,w/2,-w*.3);c.lineTo(w*.14,-w*.3);c.lineTo(w*.12,0);c.lineTo(-w*.12,0);c.lineTo(-w*.14,-w*.3);c.closePath();c.fill();NS(c);c.strokeStyle='rgba(120,90,60,.4)';c.lineWidth=1.2;c.beginPath();c.moveTo(-w*.4,-w*.32);c.lineTo(w*.4,-w*.32);c.stroke();return;}
 c.fillStyle=ck?'#c9a882':'#f1ebe0';rrp(c,-w*.14,-w*.42,w*.28,w*.42,5);c.fill();c.fillStyle=LG(c,0,-w*.8,0,-w*.3,[[0,ck?'#8a5a32':'#c9a27a'],[1,ck?'#5e3a1c':'#9a7350']]);c.beginPath();c.moveTo(-w/2,-w*.36);c.bezierCurveTo(-w/2,-w*.9,w/2,-w*.9,w/2,-w*.36);c.closePath();c.fill();NS(c);hi(c,-w*.15,-w*.7,w*.12,w*.05,.3);}
function tofuCube(c,w,st){const col=st.color||'#f5efd8',ck=st.cooked;const top=ck?'#e4b35e':mix(col,'#ffffff',.3),fr=ck?'#c98a35':col;c.fillStyle=fr;c.fillRect(-w/2,-w*.6,w*.8,w*.6);c.fillStyle=top;c.beginPath();c.moveTo(-w/2,-w*.6);c.lineTo(-w*.3,-w*.75);c.lineTo(w/2,-w*.75);c.lineTo(w*.3,-w*.6);c.closePath();c.fill();c.fillStyle=mix(fr.startsWith('#')?fr:'#c98a35','#000000',.15);c.beginPath();c.moveTo(w*.3,-w*.6);c.lineTo(w/2,-w*.75);c.lineTo(w/2,-w*.15);c.lineTo(w*.3,0);c.closePath();c.fill();NS(c);}
function prawnShape(c,w,st){const ck=st.cooked;const a=ck?'#ff8a5c':'#c9b8b0',b=ck?'#e0532c':'#8f7d76';c.lineCap='round';for(let k=0;k<6;k++){const ang=Math.PI*(.15+k*.14);c.strokeStyle=k%2?a:b;c.lineWidth=w*.22-k*1.6;c.beginPath();c.arc(0,-w*.45,w*.32,ang,ang+.2);c.stroke();}c.fillStyle=ck?'#fff1e6':'#e9e1dc';c.beginPath();c.ellipse(-w*.3,-w*.2,w*.1,w*.06,.6,0,7);c.fill();c.fillStyle=b;[[w*.3,-w*.68],[w*.38,-w*.62]].forEach(([x,y])=>{c.beginPath();c.moveTo(x,y);c.lineTo(x+w*.12,y-w*.14);c.lineTo(x+w*.04,y);c.closePath();c.fill();});}
function steakShape(c,w,st){const ck=st.cooked,h=w*.4;if(st.cut){for(let i=0;i<5;i++)P(c,()=>{c.fillStyle=ck?'#6b3a20':'#b5373a';rrp(c,-7,-h*.9,14,h*.9,4);c.fill();c.fillStyle=ck?'#d97a7a':'#e06a6a';rrp(c,-4,-h*.8,8,h*.7,3);c.fill();},(i-2)*15,0,(i-2)*.06,1,1,true);return;}
 c.fillStyle=LG(c,0,-h,0,0,ck?[[0,'#7a4425'],[1,'#4a2512']]:[[0,'#d14a4f'],[1,'#9a2a30']]);c.beginPath();c.moveTo(-w/2,-h*.2);c.bezierCurveTo(-w*.55,-h*1.1,w*.3,-h*1.2,w/2,-h*.55);c.quadraticCurveTo(w*.5,0,w*.2,0);c.lineTo(-w*.4,0);c.closePath();c.fill();NS(c);c.strokeStyle=ck?'rgba(240,220,190,.6)':'rgba(255,240,235,.85)';c.lineWidth=3;c.beginPath();c.moveTo(-w*.47,-h*.3);c.bezierCurveTo(-w*.5,-h*1,w*.25,-h*1.08,w*.46,-h*.58);c.stroke();if(ck){c.strokeStyle='rgba(30,15,5,.5)';c.lineWidth=2.5;for(let k=-2;k<=2;k++){c.beginPath();c.moveTo(k*w*.14-6,-h*.85);c.lineTo(k*w*.14+6,-h*.2);c.stroke();}}}
function sausageShape(c,w,st){const ck=st.cooked,h=w*.2;c.fillStyle=LG(c,0,-h,0,0,ck?[[0,'#b86a3a'],[1,'#7a3a1a']]:[[0,st.color||'#e59a8a'],[1,'#c06a5c']]);rrp(c,-w/2,-h,w,h,h/2);c.fill();NS(c);hi(c,-w*.15,-h*.75,w*.22,h*.14,.35);if(st.cut){c.strokeStyle='rgba(60,25,10,.5)';c.lineWidth=2;for(let k=-2;k<=2;k++){c.beginPath();c.moveTo(k*w*.17,-h);c.lineTo(k*w*.17,0);c.stroke();}}}
function baconShape(c,w,st){const ck=st.cooked;c.save();c.beginPath();for(let x=-w/2;x<=w/2;x+=4)c.lineTo(x,-6-Math.sin(x/9)*4);for(let x=w/2;x>=-w/2;x-=4)c.lineTo(x,8-Math.sin(x/9)*4-6);c.closePath();c.fillStyle=ck?'#a04a2c':'#e88a86';c.fill();NS(c);c.clip();c.fillStyle=ck?'#e9c08a':'#fbe3d8';for(let k=0;k<2;k++)c.fillRect(-w/2,-12+k*7,w,2.4);c.restore();}
function chilliShape(c,w,st){const col=st.color||'#d8241f';c.fillStyle=LG(c,0,-w*.2,0,0,[[0,mix(col,'#ffffff',.2)],[1,mix(col,'#000000',.2)]]);c.beginPath();c.moveTo(-w*.4,-w*.12);c.quadraticCurveTo(0,-w*.26,w*.48,0);c.quadraticCurveTo(0,-w*.02,-w*.4,-w*.02);c.closePath();c.fill();NS(c);c.fillStyle='#3f7a2a';rrp(c,-w*.5,-w*.12,w*.12,w*.1,3);c.fill();hi(c,0,-w*.14,w*.16,2,.35);}
function avocadoShape(c,w,st){const h=w*1.2;if(st.cut){c.fillStyle='#3a5a1f';c.beginPath();c.ellipse(0,-h*.42,w*.5,h*.42,0,0,7);c.fill();NS(c);c.fillStyle='#dfe8a0';c.beginPath();c.ellipse(0,-h*.42,w*.43,h*.36,0,0,7);c.fill();c.fillStyle='#8a5a2a';c.beginPath();c.arc(0,-h*.34,w*.2,0,7);c.fill();return;}
 c.fillStyle=RG(c,-w*.1,-h*.6,2,h*.5,[[0,'#4f6a2a'],[1,'#22351a']]);c.beginPath();c.moveTo(0,-h*.85);c.bezierCurveTo(w*.35,-h*.85,w*.55,-h*.2,0,0);c.bezierCurveTo(-w*.55,-h*.2,-w*.35,-h*.85,0,-h*.85);c.fill();NS(c);speckle(c,w*.6,h*.7,14,'rgba(120,150,70,.5)',5);}
function aubergineShape(c,w,st){const h=w*.42;if(st.cut){for(let i=0;i<4;i++){c.fillStyle='#4a2a4a';c.beginPath();c.ellipse((i-1.5)*24,-h*.4,h*.42,h*.42,0,0,7);c.fill();c.fillStyle=st.cooked?'#c9a065':'#ece4c4';c.beginPath();c.ellipse((i-1.5)*24,-h*.4,h*.36,h*.36,0,0,7);c.fill();}return;}
 c.fillStyle=LG(c,0,-h,0,0,[[0,'#6a3a6e'],[1,'#2e1530']]);c.beginPath();c.moveTo(-w*.35,-h*.5);c.bezierCurveTo(-w*.3,-h*1.05,w*.5,-h*1.15,w*.5,-h*.45);c.bezierCurveTo(w*.5,0,-w*.3,0,-w*.35,-h*.5);c.fill();NS(c);c.fillStyle='#4f7a2c';c.beginPath();c.moveTo(-w*.3,-h*.75);c.lineTo(-w*.5,-h*.55);c.lineTo(-w*.28,-h*.3);c.closePath();c.fill();hi(c,w*.05,-h*.82,w*.18,h*.08,.3);}
function flatbreadShape(c,w,st){const col=st.color||'#f0d9a8';c.fillStyle=LG(c,0,-w*.12,0,0,[[0,col],[1,mix(col,'#8a5a2a',.25)]]);c.beginPath();c.ellipse(0,-w*.07,w/2,w*.07,0,0,7);c.fill();NS(c);const R=rng(17);c.fillStyle='rgba(140,80,30,.45)';for(let i=0;i<14;i++){c.beginPath();c.ellipse((R()-.5)*w*.85,-w*.08+(R()-.5)*w*.05,3+R()*4,1.5+R(),0,0,7);c.fill();}}
function pastaPile(c,w,st){const col=st.color||'#efd27a';const R=rng(31);for(let i=0;i<18;i++){const x=(R()-.5)*w*.8,y=-4-R()*w*.25*(1-Math.abs(x)/(w*.55));P(c,()=>{c.fillStyle=LG(c,0,-4,0,4,[[0,mix(col,'#ffffff',.25)],[1,mix(col,'#8a5a1a',.25)]]);rrp(c,-9,-3.5,18,7,3);c.fill();c.strokeStyle='rgba(150,100,30,.35)';c.lineWidth=1;for(let k=-1;k<=1;k++){c.beginPath();c.moveTo(k*5,-3);c.lineTo(k*5+2,3);c.stroke();}},x,y,R()*3,1,1,true);}}
function strandsPile(c,w,st){const col=st.color||'#efd27a';c.strokeStyle=mix(col,'#8a5a1a',.2);c.lineWidth=2.4;const R=rng(st.seed||41);for(let i=0;i<22;i++){c.beginPath();const y0=-4-R()*w*.22;c.moveTo(-w*.45,y0);c.bezierCurveTo(-w*.15,y0-12+R()*24,w*.15,y0-12+R()*24,w*.45,y0+(R()-.5)*10);c.stroke();}c.strokeStyle=mix(col,'#ffffff',.25);c.lineWidth=1.4;for(let i=0;i<10;i++){c.beginPath();const y0=-6-R()*w*.2;c.moveTo(-w*.4,y0);c.bezierCurveTo(-w*.1,y0-10+R()*20,w*.1,y0-10+R()*20,w*.4,y0);c.stroke();}}
function smallPile(c,w,col,col2,r,n,seed){const R=rng(seed||23);for(let i=0;i<n;i++){const x=(R()-.5)*w*.85,y=-r-R()*w*.2*(1-Math.abs(x)/(w*.5));c.fillStyle=RG(c,x-r*.3,y-r*.3,.5,r*1.2,[[0,col2],[1,col]]);c.beginPath();c.ellipse(x,y,r,r*.9,0,0,7);c.fill();}}
function gingerShape(c,w,st){c.fillStyle=LG(c,0,-w*.35,0,0,[[0,'#e8c590'],[1,'#b88a4e']]);[[-w*.25,-w*.12,w*.28,w*.14],[w*.08,-w*.16,w*.26,w*.15],[w*.3,-w*.3,w*.12,w*.16],[-w*.05,-w*.3,w*.12,w*.14]].forEach(([x,y,rx,ry])=>{c.beginPath();c.ellipse(x,y,rx,ry,0,0,7);c.fill();});NS(c);c.strokeStyle='rgba(130,90,40,.4)';c.lineWidth=1.2;for(let k=-2;k<=2;k++){c.beginPath();c.moveTo(k*w*.15,-w*.25);c.lineTo(k*w*.15+3,-w*.05);c.stroke();}}
function stalkShape(c,w,col,leaf){c.fillStyle=LG(c,0,-10,0,0,[[0,mix(col,'#ffffff',.25)],[1,col]]);rrp(c,-w/2,-10,w*.6,10,5);c.fill();NS(c);c.fillStyle=leaf;c.beginPath();c.moveTo(w*.08,-10);c.quadraticCurveTo(w*.35,-22,w/2,-6);c.quadraticCurveTo(w*.3,-2,w*.08,0);c.closePath();c.fill();}
function pakChoiShape(c,w,st){for(let k=-2;k<=2;k++){c.fillStyle='#f1f4e6';c.beginPath();c.moveTo(-w*.06+k*4,0);c.quadraticCurveTo(k*w*.1,-w*.45,k*w*.16,-w*.62);c.lineTo(k*w*.16+8,-w*.6);c.quadraticCurveTo(k*w*.1+10,-w*.4,w*.06+k*4,0);c.closePath();c.fill();}NS(c);
 [-1,0,1].forEach(k=>{c.fillStyle=k?'#3f8a32':'#4f9a3c';c.beginPath();c.ellipse(k*w*.22,-w*.78,w*.2,w*.3,k*.4,0,7);c.fill();});}
function oliveShape(c,w,st){const col=st.color||'#3d4a22';c.fillStyle=RG(c,-w*.15,-w*.55,1,w*.5,[[0,mix(col,'#ffffff',.25)],[1,col]]);c.beginPath();c.ellipse(0,-w*.38,w*.5,w*.38,0,0,7);c.fill();NS(c);hi(c,-w*.18,-w*.52,w*.12,w*.06,.45);}
function cornShape(c,w,st){c.fillStyle='#e9c23a';rrp(c,-w/2,-w*.26,w*.85,w*.26,w*.13);c.fill();NS(c);c.fillStyle='rgba(255,240,170,.8)';for(let x=-w*.44;x<w*.3;x+=7)for(let y=-w*.22;y<-4;y+=6){c.beginPath();c.arc(x+(y%12?3:0),y,2,0,7);c.fill();}c.fillStyle='#8fb44a';c.beginPath();c.moveTo(w*.3,-w*.26);c.quadraticCurveTo(w*.55,-w*.3,w*.5,0);c.lineTo(w*.3,0);c.closePath();c.fill();}
function yoghurtBowl(c,w,st){c.fillStyle=st.color||'#fbfaf5';c.beginPath();c.ellipse(0,-w*.3,w*.42,w*.08,0,0,7);c.fill();c.fillStyle=LG(c,0,-w*.3,0,0,[[0,'#e4e6ea'],[1,'#a9b0b8']]);c.beginPath();c.moveTo(-w/2,-w*.3);c.quadraticCurveTo(0,w*.1,w/2,-w*.3);c.closePath();c.fill();NS(c);}
function sugarBag(c,w,st){paperBag(c);c.fillStyle=st.color||'#fbfaf3';c.beginPath();c.ellipse(0,-64,18,5,0,0,7);c.fill();}
/* any food the kit lacks: the agent looks it up and describes shape and colours in plan.json "parts" */
function shapePart(c,w,sp,st){if(st.cut&&!st._piece&&['round','oval','long','cube','wedge'].includes(sp.shape||'round')){[[-w*.3,0],[w*.3,0],[0,-4]].forEach(([dx,dy])=>{c.save();c.translate(dx,dy);c.scale(.45,.45);shapePart(c,w,sp,Object.assign({},st,{_piece:true}));c.restore();});return;}
 const col=(st.cooked&&sp.cooked)||sp.color||'#c9a774',c2=(st.cooked&&sp.cooked2)||(st.cooked&&sp.cooked?mix(sp.cooked,'#ffffff',.3):null)||sp.color2||mix(col,'#ffffff',.35),sh=sp.shape||'round';
 const body={round:()=>{c.fillStyle=RG(c,-w*.15,-w*.62,2,w*.6,[[0,c2],[1,col]]);c.beginPath();c.ellipse(0,-w*.45,w*.5,w*.45,0,0,7);c.fill();},
  oval:()=>{c.fillStyle=RG(c,-w*.15,-w*.4,2,w*.5,[[0,c2],[1,col]]);c.beginPath();c.ellipse(0,-w*.27,w*.5,w*.27,0,0,7);c.fill();},
  long:()=>{c.fillStyle=LG(c,0,-w*.18,0,0,[[0,c2],[1,col]]);rrp(c,-w/2,-w*.18,w,w*.18,w*.09);c.fill();},
  flat:()=>{c.fillStyle=LG(c,0,-w*.1,0,0,[[0,c2],[1,col]]);c.beginPath();c.ellipse(0,-w*.06,w/2,w*.06,0,0,7);c.fill();},
  cube:()=>tofuCube(c,w,{color:col}),
  mound:()=>mound(c,w,w*.3,c2,col),
  pile:()=>smallPile(c,w,col,c2,Math.max(3,w*.06),26,7),
  strands:()=>strandsPile(c,w,{color:col}),
  leafy:()=>{[-1,0,1].forEach(k=>{c.fillStyle=k?col:c2;c.beginPath();c.ellipse(k*w*.2,-w*.42,w*.22,w*.4,k*.45,0,7);c.fill();});},
  bunch:()=>{for(let k=0;k<5;k++){c.fillStyle=k%2?col:c2;rrp(c,-w/2,-6-k*6,w,6,3);c.fill();}},
  wedge:()=>{c.fillStyle=LG(c,0,-w*.45,0,0,[[0,c2],[1,col]]);c.beginPath();c.moveTo(-w/2,0);c.lineTo(w*.35,-w*.45);c.lineTo(w/2,0);c.closePath();c.fill();},
  liquid:()=>{jar(c,w*.7,w,col);}}[sh]||(()=>{});
 body();NS(c);if(sp.spots)speckle(c,w*.7,w*.35,12,sp.spots,9);if(sh==='round'||sh==='oval')hi(c,-w*.18,-w*.5,w*.1,w*.05,.35);}

/* ---------- parts: drawn at origin = bottom centre ---------- */
const PART={
 tomato:{w:56,h:48,d:(c,s)=>tomatoShape(c,54,s)},
 mushroom:{w:52,h:44,d:(c,s)=>mushroomShape(c,50,s)},
 tofu:{w:56,h:44,d:(c,s)=>tofuCube(c,54,s)},
 prawn:{w:58,h:50,d:(c,s)=>prawnShape(c,56,s)},
 steak:{w:120,h:50,d:(c,s)=>steakShape(c,116,s)},
 sausage:{w:104,h:22,d:(c,s)=>sausageShape(c,100,s)},
 bacon:{w:104,h:20,d:(c,s)=>baconShape(c,100,s)},
 chilli:{w:70,h:20,d:(c,s)=>chilliShape(c,68,s)},
 avocado:{w:54,h:66,d:(c,s)=>avocadoShape(c,52,s)},
 aubergine:{w:110,h:48,d:(c,s)=>aubergineShape(c,106,s)},
 flatbread:{w:124,h:16,d:(c,s)=>flatbreadShape(c,120,s)},
 pasta:{w:96,h:30,d:(c,s)=>pastaPile(c,92,s)},
 spaghetti:{w:110,h:28,d:(c,s)=>strandsPile(c,106,s)},
 noodles:{w:110,h:28,d:(c,s)=>strandsPile(c,106,Object.assign({color:'#f3e2a8',seed:44},s))},
 chickpeas:{w:84,h:24,d:(c,s)=>smallPile(c,82,s.color||'#d9b072',s.color2||'#f2d9a2',5.5,28,23)},
 lentils:{w:84,h:20,d:(c,s)=>smallPile(c,82,s.color||'#c8642c',s.color2||'#eb9a5c',3,44,25)},
 black_beans:{w:84,h:22,d:(c,s)=>smallPile(c,82,'#1f1a1e','#4a4048',4.5,30,27)},
 ginger:{w:70,h:30,d:(c,s)=>gingerShape(c,68,s)},
 lemongrass:{w:112,h:20,d:(c,s)=>stalkShape(c,108,'#d6dca0','#8fb44a')},
 pak_choi:{w:66,h:70,d:(c,s)=>pakChoiShape(c,64,s)},
 olive:{w:30,h:24,d:(c,s)=>oliveShape(c,28,s)},
 sweetcorn:{w:96,h:28,d:(c,s)=>cornShape(c,94,s)},
 yoghurt:{w:84,h:36,d:(c,s)=>yoghurtBowl(c,82,s)},
 flour:{w:64,h:70,d:(c,s)=>sugarBag(c,60,s)},
 carrot:{w:96,h:20,d:(c,s)=>carrotShape(c,92,s)},
 peas:{w:80,h:22,d:(c,s)=>peasPile(c,78,s)},
 lime:{w:46,h:40,d:(c,s)=>limeShape(c,44,s)},
 courgette:{w:124,h:24,d:(c,s)=>{c.save();c.filter='hue-rotate(-10deg) brightness(1.15)';cucumberShape(c,120,s);c.restore();}},
 whole_chicken:{w:150,h:84,d:(c,s)=>wholeChicken(c,146,s)},
 chicken:{w:96,h:38,d:(c,s)=>chickenPiece(c,92,s)},
 mince:{w:96,h:34,d:(c,s)=>minceHeap(c,92,s)},
 rice:{w:96,h:32,d:(c,s)=>riceHeap(c,92,s)},
 red_pepper:{w:60,h:56,d:(c,s)=>redPepper(c,56,s)},
 broccoli:{w:62,h:56,d:(c,s)=>broccoliHead(c,60,s)},
 dumpling:{w:58,h:34,d:(c,s)=>dumpling(c,56,s)},
 egg:{w:38,h:48,d:(c,s)=>eggShape(c,36,s)},
 banana:{w:104,h:34,d:(c,s)=>bananaShape(c,100,s)},
 tin:{w:46,h:60,d:(c,s)=>tinCan(c,44,s)},
 cucumber:{w:124,h:24,d:(c,s)=>cucumberShape(c,120,s)},
 spring_onion:{w:112,h:12,d:(c,s)=>springOnionShape(c,108,s)},
 loaf:{w:124,h:56,d:(c,s)=>loafShape(c,120,s)},
 lamb:{w:140,h:62,d:(c,s)=>P(c,()=>lamb(c,s.cooked?1:0,{face:s.face?'sleep':null,rub:s.rub?1:0}),-8,-22,0,.42,.42,true)},
 salmon:{w:118,h:40,d:(c,s)=>{salmonFillet(c,112,32,s);if(s.face)face(c,6,-16,.45,'sleep');}},
 asparagus:{w:108,h:14,d:(c,s)=>asparagusSpear(c,104,s)},
 baby_potato:{w:40,h:26,d:(c,s)=>babyPotato(c,38,s)},
 potato:{w:40,h:26,d:(c,s)=>{if(s.cut===false)babyPotato(c,46,{cut:false});else P(c,()=>potato(c,28,17),0,-9,0,1,1,true);}},
 onion:{w:56,h:62,d:(c,s)=>{if(s.cut)P(c,()=>onionD(c,22,!!s.cooked),0,0,0,1,1,true);else P(c,()=>wholeOnion(c,24),0,-26,0,1,1,true);}},
 garlic:{w:40,h:30,d:(c,s)=>P(c,()=>garlic(c,1,s.face?'happy':null),0,-12,0,1,1,true)},
 lemon:{w:60,h:44,d:(c,s)=>{if(s.cut)lemonWedge(c,20);else P(c,()=>lemon(c,19),0,-20,0,1,1,true);}},
 rosemary:{w:100,h:22,d:(c,s)=>P(c,()=>rosemary(c,96),0,-10,0,1,1,true)},
 parsley:{w:90,h:26,d:(c,s)=>herbSprig(c,86)},
 herbs:{w:90,h:26,d:(c,s)=>herbSprig(c,86)},
 butter:{w:56,h:28,d:(c,s)=>P(c,()=>butter(c,52,24),0,-12,0,1,1,true)},
 milk:{w:56,h:56,d:(c,s)=>P(c,()=>mug(c,true,'#fbfaf6'),0,-28,0,1,1,true)},
 stock:{w:60,h:90,d:(c,s)=>P(c,()=>jug(c,.55),0,-44,0,.85,.85,true)},
 water:{w:60,h:90,d:(c,s)=>P(c,()=>jug(c,.6,'rgba(150,200,235,.9)'),0,-44,0,.85,.85,true)},
 oil:{w:30,h:76,d:(c,s)=>bottle(c,26,62,'#8f9d3a')},
 salt:{w:22,h:40,d:(c,s)=>{c.fillStyle='#ffffff';rrp(c,-10,-40,20,40,7);c.fill();NS(c);c.fillStyle='#c9ced4';c.fillRect(-10,-44,20,6);}},
 pepper:{w:22,h:46,d:(c,s)=>{c.fillStyle='#2b2f36';rrp(c,-10,-46,20,46,7);c.fill();}},
 mustard:{w:40,h:52,d:(c,s)=>jar(c,36,44,'#d9a520','#7a5a20')},
 dressing:{w:40,h:56,d:(c,s)=>jar(c,38,48,LG(c,0,-40,0,0,[[0,'#f2d27a'],[1,'#d9a83c']]),'#c0392b')},
 beans:{w:70,h:24,d:(c,s)=>{for(let i=0;i<5;i++)P(c,()=>bean(c,46,s.cooked?'#7ad06d':null),-12+(i%3)*12,-6-i*3,(i%2?.1:-.1),1,1,true);}},
 patty:{w:80,h:26,d:(c,s)=>P(c,()=>patty(c,76,24,s.cooked?1:.1),0,-12,0,1,1,true)},
 bun:{w:80,h:34,d:(c,s)=>P(c,()=>bunTop(c,74,28,!!s.cooked),0,0,0,1,1,true)},
 cheese:{w:70,h:40,d:(c,s)=>P(c,()=>cheddarBlock(c,50,30),-8,0,0,1,1,true)},
 pickle:{w:36,h:16,d:(c,s)=>P(c,()=>pickle(c,16),0,-6,0,1,1,true)},
 chips:{w:70,h:40,d:(c,s)=>{for(let i=0;i<6;i++)P(c,()=>fry(c,36),-20+i*8,-18,-.25+i*.1,1,1,true);}},
 mash:{w:110,h:50,d:(c,s)=>mash(c,104,46)},
 tray:{w:130,h:16,d:(c,s)=>P(c,()=>sheetPan(c,120),0,-6,0,1,1,true)},
 pot:{w:120,h:90,d:(c,s)=>P(c,()=>steelPot(c,96,70),0,-76,0,1,1,true)},
 pan:{w:150,h:40,d:(c,s)=>P(c,()=>nsPan(c,52),-30,-26,0,1,1,true)},
 bowl:{w:100,h:44,d:(c,s)=>P(c,()=>bowlSide(c,96),0,-42,0,1,1,true)},
 probe:{w:120,h:20,d:(c,s)=>P(c,()=>probeTool(c),-10,-10,0,.7,.7,true)},
 foil:{w:96,h:30,d:(c,s)=>{c.fillStyle=LG(c,0,-26,0,0,[[0,'#f2f5f8'],[.5,'#c4ccd4'],[1,'#e4e9ed']]);rrp(c,-46,-26,92,26,8);c.fill();NS(c);c.fillStyle='#d9dfe5';c.beginPath();c.ellipse(-46,-13,6,13,0,0,7);c.fill();}}
};
const PART_ALIAS={'tomatoes':'tomato','cherry tomatoes':'tomato','mushrooms':'mushroom','paneer':'tofu','feta':'tofu','halloumi':'tofu','prawns':'prawn','shrimp':'prawn','king prawns':'prawn','beef steak':'steak','sirloin':'steak','ribeye':'steak','sausages':'sausage','chorizo':'sausage','bacon rashers':'bacon','pancetta':'bacon','red chilli':'chilli','green chilli':'chilli','chillies':'chilli','avocados':'avocado','aubergines':'aubergine','naan':'flatbread','tortilla':'flatbread','tortillas':'flatbread','pitta':'flatbread','wrap':'flatbread','chapati':'flatbread','roti':'flatbread','penne':'pasta','fusilli':'pasta','macaroni':'pasta','rigatoni':'pasta','linguine':'spaghetti','tagliatelle':'spaghetti','egg noodles':'noodles','rice noodles':'noodles','udon':'noodles','ramen':'noodles','chickpea':'chickpeas','red lentils':'lentils','dal':'lentils','black bean':'black_beans','pak choy':'pak_choi','bok choy':'pak_choi','olives':'olive','corn':'sweetcorn','yogurt':'yoghurt','greek yoghurt':'yoghurt','plain flour':'flour','self-raising flour':'flour','sugar':'flour','caster sugar':'flour','coconut milk':'tin','plantain':'banana','carrots':'carrot','frozen peas':'peas','pea':'peas','limes':'lime','courgettes':'courgette','whole chicken':'whole_chicken','roast chicken':'whole_chicken','chicken breast':'chicken','chicken breasts':'chicken','chicken thighs':'chicken','chicken thigh':'chicken','beef mince':'mince','pork mince':'mince','lamb mince':'mince','minced beef':'mince','red pepper':'red_pepper','red peppers':'red_pepper','bell pepper':'red_pepper','peppers':'red_pepper','dumplings':'dumpling','eggs':'egg','bananas':'banana','tinned tomatoes':'tin','chopped tomatoes':'tin','kidney beans':'tin','cucumbers':'cucumber','spring onion':'spring_onion','spring onions':'spring_onion','banana bread':'loaf','bread':'loaf','basmati rice':'rice','long-grain rice':'rice','baby potatoes':'baby_potato','new potatoes':'baby_potato','potatoes':'potato','salmon fillet':'salmon','salmon fillets':'salmon','green beans':'beans','dijon':'mustard','olive oil':'oil','shallot':'onion','chicken stock':'stock','cheddar':'cheese','buns':'bun','patties':'patty','pickles':'pickle'};
const RAW_OK=new Set(['tofu','cheese','avocado','lemon','lime','herbs','parsley','rosemary','tomato','cucumber','olive','yoghurt','pickle','chilli','spring_onion','butter','banana','dressing','mustard']);
function registerParts(defs){Object.entries(defs||{}).forEach(([name,sp])=>{const key=name.toLowerCase().trim();if(PART[key]||PART_ALIAS[key])return;const w=sp.w||(sp.shape==='long'||sp.shape==='strands'||sp.shape==='flat'?110:sp.shape==='pile'||sp.shape==='mound'?90:56);PART[key]={w,h:sp.h||(sp.shape==='long'||sp.shape==='flat'?24:w*.9),d:(c,st)=>shapePart(c,w,sp,st||{})};});}
function partKey(n){n=String(n||'').toLowerCase();return PART[n]?n:(PART_ALIAS[n]||null);}
function unknownPart(c,name){const t=String(name||'?');c.font='700 15px "Atkinson Hyperlegible", sans-serif';const w=Math.min(150,c.measureText(t).width+22),h=40;c.fillStyle='#fffaf0';c.beginPath();c.moveTo(-w/2,-h);c.lineTo(w/2-10,-h);c.lineTo(w/2,-h+10);c.lineTo(w/2,0);c.lineTo(-w/2,0);c.closePath();c.fill();NS(c);c.fillStyle='#e9dfc9';c.beginPath();c.moveTo(w/2-10,-h);c.lineTo(w/2-10,-h+10);c.lineTo(w/2,-h+10);c.closePath();c.fill();c.fillStyle='#2b2017';c.textAlign='center';c.textBaseline='middle';c.fillText(t.length>16?t.slice(0,15)+'…':t,0,-h/2+1);}
function drawPart(c,name,st,x,y,sc,rot){st=st||{};const k=partKey(name);P(c,()=>{if(k)PART[k].d(c,st);else unknownPart(c,name);},x,y,rot||0,sc||1,sc||1);}
function flatlay12(c,t,items){items.forEach(([label,fn],i)=>{const col=i%4,row=i/4|0,x=80+col*160,y=[96,212,326][row];const p=seg(t,.2+i*.14,.6+i*.14);if(p<=0)return;P(c,fn,x,y-(1-back(p))*50,0,.72,.72);itemTag(c,x,y+30,label,seg(t,.4+i*.14,.7+i*.14));});}
function paperBag(c){c.fillStyle=LG(c,-34,0,34,0,[[0,'#c9a774'],[.5,'#e2c693'],[1,'#bd9a66']]);c.beginPath();c.moveTo(-30,0);c.lineTo(-26,-60);c.lineTo(26,-60);c.lineTo(30,0);c.closePath();c.fill();NS(c);c.fillStyle='#b48f5c';c.beginPath();c.moveTo(-26,-60);c.lineTo(-20,-68);c.lineTo(20,-68);c.lineTo(26,-60);c.closePath();c.fill();c.strokeStyle='rgba(90,60,25,.35)';c.lineWidth=1.5;c.beginPath();c.moveTo(-22,-48);c.lineTo(22,-48);c.stroke();}
function partW(name){const k=partKey(name);return k?PART[k].w:120;}

/* ---------- shared scene helpers ---------- */
const TAGPOS=[[170,64],[470,64],[170,132],[470,132]];
function sceneTags(c,t,sp,start){(sp.tags||[]).forEach((tx,i)=>{const pos=(tx&&typeof tx==='object'&&tx.at)||TAGPOS[i%4];const text=typeof tx==='string'?tx:tx.text;const at=(start==null?2.6:start)+i*.5;tag(c,pos[0],pos[1],text,seg(t,at,at+.3),i%2?.02:-.02);});}
function tempsCard(c,sp,a,x,y){if(sp.temps&&sp.temps.length===2)dcard(c,x||460,y||110,[[sp.temps[0]+'°C','conventional'],[sp.temps[1]+'°C','fan']],a);}
function layGroup(g,x0,x1,y){const n=Math.max(1,g.n||1),w=partW(g.part);const out=[];if(!partKey(g.part))return[{x:(x0+x1)/2,y,rot:0,sc:1,unk:(n>1?n+' × ':'')+g.part}];const span=x1-x0;const sc=g.scale||(w<60?1.6:1);
 if(partKey(g.part)==='asparagus'){for(let i=0;i<n;i++)out.push({x:(x0+x1)/2+((i%2)?6:-6),y:y-i*6.5,rot:(i%3-1)*.03,sc});return out;}
 const per=Math.min(w*sc*.95,span/n);const cols=Math.max(1,Math.floor(span/(w*sc*.9)));
 for(let i=0;i<n;i++){const row=Math.floor(i/cols),col=i%cols;const inRow=Math.min(cols,n-row*cols);const rowW=inRow*w*sc*.92;const sx=(x0+x1)/2-rowW/2+w*sc*.46+(row%2)*w*sc*.3;out.push({x:sx+col*w*sc*.92,y:y-row*Math.min(12,w*sc*.3),rot:((i*37)%5-2)*.03,sc:sc*(1-row*.06)});}
 return out.sort((a,b)=>a.y-b.y);}
function slotRange(slot,cx,W){const L=cx-W/2,R=cx+W/2;return slot==='left'?[L,cx-W/6]:slot==='right'?[cx+W/6,R]:slot==='mid'?[cx-W/6,cx+W/6]:slot==='leftHalf'?[L,cx]:slot==='rightHalf'?[cx,R]:[L,R];}
function ovenBG(c,t){c.fillStyle='#22262d';c.fillRect(0,0,PW,PH);c.fillStyle=RG(c,320,200,20,420,[[0,'rgba(255,150,60,.55)'],[1,'rgba(255,110,30,.08)']]);c.fillRect(0,0,PW,PH);c.strokeStyle='#5c636d';c.lineWidth=4;c.beginPath();c.moveTo(20,342);c.lineTo(620,342);c.stroke();}

/* ---------- generic kinds ---------- */
const KINDS={
 oven:{loop:6,draw(c,t,sp){room(c);const g=seg(t,.3,2.6);P(c,()=>ovenFront(c,230,290,g,false),30,40);c.save();c.translate(60,60);c.rotate(-2+eo(seg(t,.2,1.2))*2.6);c.fillStyle='#2b2f36';c.fillRect(-1.5,-9,3,9);c.restore();
  (sp.inside||[]).forEach((p,i)=>{c.save();c.globalAlpha=.85;drawPart(c,p.part||p,p.state||{},145+(i-(sp.inside.length-1)/2)*70,260,.9);c.restore();});
  tempsCard(c,sp,seg(t,.6,1),460,110);sceneTags(c,t,{tags:(sp.tags||[]).map((x,i)=>({text:typeof x==='string'?x:x.text,at:[470,236+i*58]}))},2.4);
  if(sp.tags&&sp.tags.length)null;grain(c);endFade(c,t,6);}},
 wait:{loop:7,draw(c,t,sp){room(c);const g=.55+Math.sin(t/7*Math.PI*2)*.25;
  if(sp.where==='hob'){P(c,()=>hob(c,300),200,336,0,1,1,true);flames(c,200,340,6,sp.heat==='off'?0:.5,200,t,sp.heat==='off'?0:1);P(c,()=>steelPot(c,220,140,()=>{if(sp.color){c.fillStyle=sp.color;c.fillRect(-105,-14,210,30);}else water(c,210);(sp.inside||[]).forEach(g=>layGroup(Object.assign({},g,{scale:(g.scale||1)*.6}),-80,80,6).forEach(q=>drawPart(c,q.unk||g.part||g,g.state||{},q.x,q.y,q.sc,q.rot)));if(sp.heat!=='off')bubbles(c,0,2,90,8,t,6,.6,.7);}),200,190);if(sp.lid)P(c,()=>{c.fillStyle=LG(c,0,-20,0,4,[[0,'#e6eaee'],[1,'#9aa3ad']]);c.beginPath();c.ellipse(0,0,118,16,0,Math.PI,0);c.fill();NS(c);c.fillStyle='#2b2f36';rrp(c,-14,-26,28,10,4);c.fill();},200,122);else steam(c,190,170,t,0);}
  else if(sp.where==='counter'){P(c,()=>plate(c,170,22),200,318);(sp.inside||[]).forEach((p,i)=>drawPart(c,p.part||p,p.state||{},200+(i-(sp.inside.length-1)/2)*80,314,1.1));if(sp.cover!==false){c.save();c.globalAlpha=.4;P(c,()=>foilSheet(c,330,120),200,316,0,1,1,true);c.restore();}}
  else{P(c,()=>{ovenFront(c,250,290,g,false);},30,40);c.save();c.beginPath();c.rect(54,108,202,170);c.clip();P(c,()=>sheetPan(c,170),155,250,0,1,1,true);(sp.inside||[]).forEach((p,i,a)=>{const gr=layGroup(Object.assign({n:p.n||1},p),80,230,244);gr.forEach(q=>drawPart(c,q.unk||p.part||p,p.state||{},q.x,q.y,q.sc*.8,q.rot));});c.restore();}
  if(sp.time)dcard(c,470,110,[[sp.time,sp.timeLabel||'']],seg(t,.3,.6));sceneTags(c,t,{tags:(sp.tags||[]).map((x,i)=>typeof x==='object'?x:{text:x,at:[470,226+i*58]})},1);grain(c);endFade(c,t,7);}},
 chop:{loop:6,draw(c,t,sp){room(c);P(c,()=>board(c,580,24),320,306);const part=sp.part,w=partW(part),sc=sp.scale||Math.min(2.4,210/w),cx=210,by=304;
  const cuts=sp.cut==='halve'?1:sp.cut==='trim'?1:(sp.cuts||5);const x0=cx-w*sc/2,x1=cx+w*sc/2;const done=seg(t,.6,3.4);const nCut=Math.floor(done*cuts+1e-6);
  const trimmed=sp.cut==='trim'&&t>1.6;const st=Object.assign({},sp.state||{},sp.cut==='trim'?{trimmed:!trimmed?false:true}:{} ,sp.cut==='halve'?{cut:false}:{});
  if(partKey(part)==='asparagus'){const n=sp.n||6;for(let q=n-1;q>=0;q--)drawPart(c,part,st,cx+(q%2?5:-5),by-q*7,Math.min(2.2,sc));}
  else if(!(sp.cut==='halve'&&t>2.4))drawPart(c,part,st,cx,by,sc);
  if(sp.cut==='trim'&&trimmed){const p=seg(t,1.6,2.4);P(c,()=>{c.fillStyle='#c9c08a';rrp(c,-10,-6,22,7,3);c.fill();},x0+8-p*40,by-2+p*10,-p,1,1,true);}
  if(sp.cut!=='halve'&&sp.cut!=='trim'){c.save();c.strokeStyle='rgba(120,90,50,.55)';c.lineWidth=2;for(let k=1;k<=nCut;k++){const x=x0+k*(x1-x0)/(cuts+1);c.beginPath();c.moveTo(x,by-partWH(part)*sc);c.lineTo(x,by-2);c.stroke();}c.restore();}
  if(sp.cut==='halve'&&t>2.4){const p=eo(seg(t,2.4,2.9));drawPart(c,part,Object.assign({},sp.state,{cut:true}),cx-14-p*16,by,sc);drawPart(c,part,Object.assign({},sp.state,{cut:true}),cx+14+p*16,by,sc,0);}
  const kx=sp.cut==='trim'?x0+20:x0+(Math.min(cuts,nCut+1))*(x1-x0)/(cuts+1),ch=Math.abs(Math.sin(t*(sp.cut==='halve'||sp.cut==='trim'?3:6)));if(t<3.6)P(c,()=>knife(c),kx,by-partWH(part)*sc-130+ch*40,0,.8);
  const n=sp.pile||0;if(n&&t>3.4){const pr=seg(t,3.4,4.4);const k=Math.ceil(pr*n);for(let i=0;i<k;i++)drawPart(c,sp.pileOf||part,Object.assign({},sp.state,{cut:true,trimmed:true}),440+(i%4)*42+((i/4|0)%2)*14,by-(i/4|0)*16,sp.pileScale||1,(i%3-1)*.15);}
  sceneTags(c,t,sp,2.6);grain(c);endFade(c,t,6);}},
 bowl:{loop:6.5,draw(c,t,sp){room(c);const cx=sp.list?420:320;const add=sp.add||[];
  P(c,()=>bowlSide(c,300),cx,236);const fill=(sp.stay===true||sp.color)?seg(t,.3,.4+add.length*.5):0;
  if(fill>0){c.save();c.beginPath();c.ellipse(cx,236,140,12,0,0,7);c.clip();c.fillStyle=sp.color||'#e3c070';c.globalAlpha=Math.min(1,fill*1.4);c.fillRect(cx-150,220,300,30);c.restore();}
  const stay=sp.stay!=null?sp.stay:!sp.color;
  if(stay)add.forEach((it,i)=>{const s0=.3+i*.5;if(t<s0+.5)return;const g=typeof it==='object'?it:{part:it};layGroup(Object.assign({},g,{scale:(g.scale||Math.min(1.3,120/partW(g.part)))}),cx-90,cx+90,240).forEach(q=>drawPart(c,q.unk||g.part,g.state||{},q.x+(i%2?18:-18),q.y,q.sc,q.rot));});
  add.forEach((it,i)=>{const s0=.3+i*.5,p=seg(t,s0,s0+.5);if(p>0&&p<1){c.save();c.globalAlpha=1-seg(p,.7,1);drawPart(c,it.part||it,it.state||{},cx+(i%2?40:-40),236-(1-eo(p))*150,.9);c.restore();}});
  if(t>.4+add.length*.5)P(c,()=>spoon(c),cx+Math.cos(t*4)*60,228+Math.sin(t*4)*6,t*4,1.1);
  if(sp.list)sp.list.forEach((s,i)=>tag(c,150,90+i*58,s,seg(t,.3+i*.5,.55+i*.5),i%2?.02:-.02));
  sceneTags(c,t,{tags:(sp.tags||[]).map((x,i)=>({text:typeof x==='string'?x:x.text,at:sp.list?[440,70+i*58]:TAGPOS[i%4]}))},3.6);grain(c);endFade(c,t,6.5);}},
 board:{loop:6,draw(c,t,sp){room(c);P(c,()=>board(c,520,24),320,306);const sc=sp.scale||Math.min(2.6,(sp.n===2?250:300)/partW(sp.part));const coated=sp.action==='coat'&&t>2.4;
  if(sp.n===2){drawPart(c,sp.part,Object.assign({},sp.state,{coated}),220,304,sc*.75);drawPart(c,sp.part,Object.assign({},sp.state,{coated}),430,304,sc*.75);}else drawPart(c,sp.part,Object.assign({},sp.state,{coated}),320,304,sc);
  if(sp.action==='coat'&&t<3.2){const b=bump(t,.6,2.6);P(c,()=>{spoon(c);c.fillStyle='#e0b453';c.beginPath();c.ellipse(0,0,12,5,0,0,7);c.fill();},320+Math.sin(t*2)*90,170,-b*.9,1.2);if(b>.4){c.fillStyle='#e0b453';[0,1,2].forEach(k=>{const p=(t*2+k*.33)%1;c.beginPath();c.arc(316+Math.sin(t*2)*90,184+p*70,3,0,7);c.fill();});}}
  if(sp.action==='press'&&t<3.6){const p=seg(t,.4,3.2);P(c,()=>pinch(c),200+p*240,250+Math.abs(Math.sin(t*8))*8);}
  if(sp.action==='season'&&t<3.4){P(c,()=>pinch(c),320,90);for(let k=0;k<6;k++){const p=((t*1.4+k/6)%1);c.fillStyle=k%2?'#ffffff':'#3a3a3a';c.fillRect(318+k*3,108+p*120,3,3);}}
  sceneTags(c,t,sp,2.8);grain(c);endFade(c,t,6);}},
 tray:{loop:7,draw(c,t,sp){if(sp.oven)ovenBG(c,t);else room(c);const cx=320,W=440,y=310;
  P(c,()=>{sheetPan(c,W+40);c.fillStyle=LG(c,0,-14,0,0,[[0,'#d2d8de'],[1,'#9aa5b1']]);rrp(c,-W/2-20,-14,W+40,10,3);c.fill();},cx,y+8,0,1,1,false);
  const push=sp.push?eo(seg(t,.6,1.6)):0;
  (sp.have||[]).forEach(g=>{let[r0,r1]=slotRange(g.slot||'all',cx,W);if(sp.push){const[t0,t1]=slotRange(sp.push,cx,W);r0=r0+(t0-r0)*push;r1=r1+(t1-r1)*push;}layGroup(g,r0,r1,y).forEach(q=>drawPart(c,q.unk||g.part,g.state||{},q.x,q.y,q.sc,q.rot));});
  (sp.add||[]).forEach((g,gi)=>{const[r0,r1]=slotRange(g.slot||'all',cx,W);layGroup(g,r0,r1,y).forEach((q,i)=>{const s0=(sp.push?1.8:.4)+gi*.6+i*.08,p=seg(t,s0,s0+.45);if(p<=0)return;drawPart(c,q.unk||g.part,g.state||{},q.x,q.y-(1-back(p))*140,q.sc,q.rot);});});
  if(sp.oven||sp.hot){steam(c,220,260,t,0,40);steam(c,420,256,t,.5,40);}
  if(sp.done){sparkles(c,cx,250,200,40,t,seg(t,4.4,4.8));}
  tempsCard(c,sp,seg(t,.3,.6),120,100);sceneTags(c,t,sp.temps?{tags:(sp.tags||[]).map((x,i)=>typeof x==='object'?x:{text:x,at:[440,64+i*62]})}:sp,sp.push?3.4:2.6);grain(c);endFade(c,t,7,sp.oven?'#22262d':null);}},
 pot:{loop:6,draw(c,t,sp){room(c);const heat=sp.heat||'boil';P(c,()=>hob(c,320),320,336,0,1,1,true);flames(c,320,340,8,heat==='boil'?1:heat==='simmer'?.55:0,240,t,heat==='off'?0:1);
  P(c,()=>steelPot(c,270,160,()=>{if(sp.liquid!=='none'){c.fillStyle=sp.color||(sp.liquid==='stock'?'rgba(214,160,85,.95)':sp.liquid==='sauce'?'rgba(200,110,60,.95)':'');if(sp.color||sp.liquid==='stock'||sp.liquid==='sauce')c.fillRect(-135,-14,270,30);else water(c,260);}
   [...(sp.have||[]),...(sp.add||[]).filter((g,gi)=>t>=1+gi*.6)].filter(g=>partKey(g.part)).forEach(g=>layGroup(Object.assign({},g,{scale:(g.scale||1)*.7}),-100,100,6).forEach((q,i)=>drawPart(c,g.part,g.state||{},q.x,q.y+Math.sin(t*5+i)*1.5,q.sc,q.rot)));
   if(heat!=='off')bubbles(c,0,2,110,8,t,heat==='boil'?16:6,heat==='boil'?1.6:.6,1);}),320,170);
  (sp.add||[]).forEach((g,gi)=>{const s0=.5+gi*.6,p=seg(t,s0,s0+.5);const nm=partKey(g.part)?g.part:((g.n>1?g.n+' × ':'')+g.part);if(p>0&&p<1){c.save();c.globalAlpha=1-seg(p,.75,1);drawPart(c,nm,g.state||{},320+(gi%2?50:-50),170-(1-eo(p))*130,.8);c.restore();}});
  const unk=[...(sp.have||[]),...(sp.add||[])].filter(g=>!partKey(g.part));unk.forEach((g,i)=>itemTag(c,320+(i-(unk.length-1)/2)*170,46,(g.n>1?g.n+' × ':'')+g.part,seg(t,.8+i*.3,1.1+i*.3)));
  if(sp.lid)P(c,()=>{c.fillStyle=LG(c,0,-20,0,4,[[0,'#e6eaee'],[1,'#9aa3ad']]);c.beginPath();c.ellipse(0,0,142,18,0,Math.PI,0);c.fill();NS(c);c.fillStyle='#2b2f36';rrp(c,-16,-28,32,11,4);c.fill();},320,92);else if(heat!=='off'){steam(c,290,150,t,0);steam(c,350,146,t,.5);}sceneTags(c,t,sp,2);grain(c);endFade(c,t,6);}},
 pan:{loop:6,draw(c,t,sp){room(c);const heat=sp.heat||'medium';P(c,()=>hob(c,360),300,340,0,1,1,true);flames(c,300,344,7,heat==='high'?1:heat==='low'?.45:.75,260,t,1);P(c,()=>nsPan(c,210),300,282);if(sp.color){c.fillStyle=sp.color;c.beginPath();c.ellipse(300,270,176,16,0,0,7);c.fill();c.fillStyle='rgba(255,255,255,.18)';c.beginPath();c.ellipse(260,266,60,4,0,0,7);c.fill();}
  (sp.have||[]).forEach(g=>{const[r0,r1]=slotRange(g.slot||'all',300,320);return layGroup(g,r0,r1,276).forEach((q,i)=>{let y=q.y,s=1;if(sp.flip&&i===0){const fp=seg(t,2.4,3.2);y-=Math.sin(fp*Math.PI)*50;s=Math.max(.08,Math.abs(Math.cos(fp*Math.PI)));}P(c,()=>drawPart(c,q.unk||g.part,(sp.flip&&i===0&&t>2.8)?Object.assign({},g.state,{cooked:true}):(g.state||{}),0,0,q.sc,q.rot),q.x,y,0,1,s,true);});});
  (sp.add||[]).forEach((g,gi)=>{const[r0,r1]=slotRange(g.slot||'all',300,320);return layGroup(g,r0,r1,276).forEach((q,i)=>{const s0=.4+gi*.5+i*.1,p=seg(t,s0,s0+.45);if(p>0)drawPart(c,q.unk||g.part,g.state||{},q.x,q.y-(1-back(p))*140,q.sc,q.rot);});});
  [[220,240],[300,236],[380,240]].forEach(([x,y],i)=>steam(c,x,y,t*1.4,i*.3,26));sceneTags(c,t,sp,2.4);grain(c);endFade(c,t,6);}},
 probe:{loop:8,draw(c,t,sp){room(c);const on=sp.on||'pan';if(on==='pan'){P(c,()=>hob(c,380),320,340,0,1,1,true);flames(c,320,344,7,.7,260,t,1);P(c,()=>nsPan(c,220),320,290);}else P(c,()=>sheetPan(c,460),320,318);
  drawPart(c,sp.part,Object.assign({cooked:true},sp.state||{}),320,on==='pan'?286:312,sp.scale||1.7);
  const pr=eo(seg(t,1,1.6));if(pr>0)P(c,()=>probeTool(c),110+pr*110,on==='pan'?262:290);
  const tgt=sp.temp||75,secs=sp.hold||30;const climb=seg(t,1.6,3.6);if(climb>0){const cur=Math.round(tgt-14+climb*14);const hold=seg(t,3.6,5.2);if(hold>=1)sparkles(c,120,100,110,74,t,1);dcard(c,120,100,[[cur+'°C',hold>=1?('held '+secs+' s'):hold>0?'holding '+Math.round(hold*secs)+' s':'reading']],1,hold>=1,hold>0?hold:null);}
  sceneTags(c,t,{tags:(sp.tags||[]).map((x,i)=>typeof x==='object'?x:{text:x,at:[470,64+i*62]})},4);grain(c);endFade(c,t,8);}},
 plate:{loop:6,draw(c,t,sp){room(c);P(c,()=>plate(c,250,60),320,300);const items=sp.items||[];const xs=items.length;
  items.forEach((g,i)=>{const x=320+(i-(xs-1)/2)*Math.min(150,420/Math.max(1,xs));const p=seg(t,.3+i*.35,.7+i*.35);if(p<=0)return;const ps=g.scale||Math.min(1.7,110/partW(g.part));const gr=layGroup(Object.assign({n:g.n||1},g,{scale:ps}),x-70,x+70,314);gr.forEach(q=>drawPart(c,q.unk||g.part,Object.assign({cooked:!RAW_OK.has(partKey(g.part)||'')},g.state||{}),q.x,q.y-(1-back(p))*60,q.sc,q.rot));});
  steam(c,290,240,t,0);steam(c,350,236,t,.5);sparkles(c,320,270,220,50,t,seg(t,3.4,3.7));sceneTags(c,t,sp,2.6);grain(c);endFade(c,t,6);}},
 flatlay:{loop:6.5,draw(c,t,sp){room(c);const big=(sp.items||[]).length>8;const fl=big?flatlay12:flatlay;fl(c,t,(sp.items||[]).slice(0,12).map(it=>[it.label||it.part,()=>{const k=partKey(it.part);if(!k){paperBag(c);return;}const f=Math.min(2.6,118/PART[k].w,74/PART[k].h);c.translate(0,24);c.scale(f,f);if(k==='baby_potato'||k==='potato'){c.scale(.62,.62);[[-22,0],[20,0],[0,-8]].forEach(([dx,dy],q)=>{c.save();c.translate(dx*.7,dy);PART[k].d(c,{cut:false,seed:q});c.restore();});}else if(k==='asparagus'){for(let q=0;q<4;q++){c.save();c.translate(q%2?4:-4,-q*7);PART[k].d(c,{trimmed:false});c.restore();}}else PART[k].d(c,Object.assign({face:FACES&&['lamb','salmon','garlic'].includes(k)},it.state||{}));}]));grain(c);endFade(c,t,6.5);}},
 card:{loop:6,draw(c,t,sp){room(c);const p=seg(t,.2,.7);P(c,()=>{c.fillStyle='#fffaf0';rrp(c,-230,-120,460,240,10);c.fill();NS(c);c.fillStyle='rgba(255,226,140,.85)';c.fillRect(-30,-128,60,14);c.fillStyle='#2b2017';c.font='700 26px "Atkinson Hyperlegible", sans-serif';c.textAlign='center';c.textBaseline='middle';const words=String(sp.title||'').split(' ');let line='',lines=[];words.forEach(w=>{const test=line?line+' '+w:w;if(c.measureText(test).width>400){lines.push(line);line=w;}else line=test;});if(line)lines.push(line);lines=lines.slice(0,4);lines.forEach((l,i)=>c.fillText(l,0,-((lines.length-1)*34)/2+i*34-10));if(sp.tool){P(c,()=>drawPart(c,sp.tool,{},0,0,.8),0,96,0,1,1,true);}},320,190,-.015,.85+p*.15);sceneTags(c,t,sp,1.2);grain(c);endFade(c,t,6);}}
};
function partWH(name){const k=partKey(name);return k?PART[k].h:40;}
/* resolve a step's scene spec into {loop, cap, draw} */
function sceneOf(sp,stepTitle){sp=sp||{};if(sp.use){if(SC[sp.use])return{loop:SC[sp.use].loop,cap:sp.cap||SC[sp.use].cap,key:sp.key,draw:(c,t)=>SC[sp.use].draw(c,t)};return Object.assign(sceneOf({kind:'card',title:stepTitle,tags:sp.tags},stepTitle),{fallback:true});}
 const k=KINDS[sp.kind]||KINDS.card;const spec=(KINDS[sp.kind]&&sp.kind!=='card')?sp:Object.assign({},sp,{title:sp.title||stepTitle});return{loop:sp.loop||k.loop,cap:sp.cap||'',key:sp.key,fallback:!KINDS[sp.kind]||sp.kind==='card',draw:(c,t)=>k.draw(c,t,spec)};}
