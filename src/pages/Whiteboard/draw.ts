export type Pt=[number,number]
export interface Shape{id:number;t:'pen'|'hl'|'line'|'arrow'|'rect'|'ellipse'|'tri'|'text'|'img';c:string;w:number;pts:Pt[];text?:string;src?:string}
export interface View{x:number;y:number;z:number}
const cache=new Map<string,HTMLImageElement>()
export const loadImg=(src:string)=>new Promise<HTMLImageElement>(res=>{const c=cache.get(src);if(c?.complete)return res(c);const i=new Image();i.onload=()=>{cache.set(src,i);res(i)};i.onerror=()=>res(i);i.src=src})
const fs=(s:Shape)=>s.w*4+12
export function drawShape(g:CanvasRenderingContext2D,s:Shape,redraw:()=>void){
 g.save();g.strokeStyle=s.c;g.fillStyle=s.c;g.lineWidth=s.t==='hl'?s.w*4:s.w;g.lineCap='round';g.lineJoin='round';if(s.t==='hl')g.globalAlpha=0.35
 const [a,b]=[s.pts[0],s.pts[s.pts.length-1]]
 if(s.t==='pen'||s.t==='hl'){g.beginPath();g.moveTo(a[0],a[1]);for(let i=1;i<s.pts.length-1;i++){const m=[(s.pts[i][0]+s.pts[i+1][0])/2,(s.pts[i][1]+s.pts[i+1][1])/2];g.quadraticCurveTo(s.pts[i][0],s.pts[i][1],m[0],m[1])}g.lineTo(b[0],b[1]);g.stroke()}
 else if(s.t==='line'||s.t==='arrow'){g.beginPath();g.moveTo(a[0],a[1]);g.lineTo(b[0],b[1]);g.stroke()
  if(s.t==='arrow'){const an=Math.atan2(b[1]-a[1],b[0]-a[0]),h=14+s.w*2;g.beginPath();g.moveTo(b[0],b[1]);g.lineTo(b[0]-h*Math.cos(an-.45),b[1]-h*Math.sin(an-.45));g.moveTo(b[0],b[1]);g.lineTo(b[0]-h*Math.cos(an+.45),b[1]-h*Math.sin(an+.45));g.stroke()}}
 else if(s.t==='rect')g.strokeRect(a[0],a[1],b[0]-a[0],b[1]-a[1])
 else if(s.t==='ellipse'){g.beginPath();g.ellipse((a[0]+b[0])/2,(a[1]+b[1])/2,Math.abs(b[0]-a[0])/2,Math.abs(b[1]-a[1])/2,0,0,7);g.stroke()}
 else if(s.t==='tri'){g.beginPath();g.moveTo((a[0]+b[0])/2,a[1]);g.lineTo(b[0],b[1]);g.lineTo(a[0],b[1]);g.closePath();g.stroke()}
 else if(s.t==='text'){g.font=`600 ${fs(s)}px Manrope,sans-serif`;g.textBaseline='top';(s.text||'').split('\n').forEach((l,i)=>g.fillText(l,a[0],a[1]+i*fs(s)*1.2))}
 else if(s.t==='img'&&s.src){const i=cache.get(s.src);if(i?.complete)g.drawImage(i,a[0],a[1],b[0]-a[0],b[1]-a[1]);else loadImg(s.src).then(redraw)}
 g.restore()}
export function render(g:CanvasRenderingContext2D,shapes:Shape[],v:View,w:number,h:number,grid:boolean,sel:number|null,redraw:()=>void){
 g.setTransform(1,0,0,1,0,0);g.clearRect(0,0,w,h);g.fillStyle=getComputedStyle(document.documentElement).getPropertyValue('--wb-bg')||'#fff';g.fillRect(0,0,w,h)
 g.setTransform(v.z,0,0,v.z,v.x,v.y)
 if(grid){const st=40,x0=Math.floor(-v.x/v.z/st)*st,y0=Math.floor(-v.y/v.z/st)*st;g.strokeStyle='rgba(120,120,120,.25)';g.lineWidth=1/v.z;g.beginPath()
  for(let x=x0;x<x0+w/v.z+st;x+=st){g.moveTo(x,y0);g.lineTo(x,y0+h/v.z+st)}for(let y=y0;y<y0+h/v.z+st;y+=st){g.moveTo(x0,y);g.lineTo(x0+w/v.z+st,y)}g.stroke()}
 shapes.forEach(s=>drawShape(g,s,redraw))
 const s=shapes.find(x=>x.id===sel);if(s){const b=bbox(s,g);g.strokeStyle='#38BDF8';g.setLineDash([6/v.z,6/v.z]);g.lineWidth=2/v.z;g.strokeRect(b[0]-6,b[1]-6,b[2]-b[0]+12,b[3]-b[1]+12)}}
let mg:CanvasRenderingContext2D|null=null
export function bbox(s:Shape,g?:CanvasRenderingContext2D):[number,number,number,number]{
 const xs=s.pts.map(p=>p[0]),ys=s.pts.map(p=>p[1]);let b:[number,number,number,number]=[Math.min(...xs),Math.min(...ys),Math.max(...xs),Math.max(...ys)]
 if(s.t==='text'){mg=mg||document.createElement('canvas').getContext('2d')!;const c=g||mg;c.font=`600 ${fs(s)}px Manrope,sans-serif`;const L=(s.text||'').split('\n');b=[b[0],b[1],b[0]+Math.max(...L.map(l=>c.measureText(l).width)),b[1]+L.length*fs(s)*1.2]}
 return b}
const dseg=(p:Pt,a:Pt,b:Pt)=>{const dx=b[0]-a[0],dy=b[1]-a[1],l=dx*dx+dy*dy||1,t=Math.max(0,Math.min(1,((p[0]-a[0])*dx+(p[1]-a[1])*dy)/l));return Math.hypot(p[0]-a[0]-t*dx,p[1]-a[1]-t*dy)}
export function hit(s:Shape,x:number,y:number,r:number){
 if(['pen','hl','line','arrow'].includes(s.t)){const p:Pt=[x,y];const q=s.pts.length>1?s.pts:[s.pts[0],s.pts[0]];for(let i=1;i<q.length;i++)if(dseg(p,q[i-1],q[i])<=r+s.w)return true;return false}
 const b=bbox(s);return x>=b[0]-r&&x<=b[2]+r&&y>=b[1]-r&&y<=b[3]+r}
export async function exportCanvas(shapes:Shape[]){
 await Promise.all(shapes.filter(s=>s.src).map(s=>loadImg(s.src!)))
 let b:[number,number,number,number]=[0,0,1280,720];if(shapes.length){const bs=shapes.map(s=>bbox(s));b=[Math.min(...bs.map(x=>x[0]))-40,Math.min(...bs.map(x=>x[1]))-40,Math.max(...bs.map(x=>x[2]))+40,Math.max(...bs.map(x=>x[3]))+40]}
 const w=Math.max(1280,b[2]-b[0]),h=Math.max(720,b[3]-b[1]),c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d')!
 g.fillStyle='#fff';g.fillRect(0,0,w,h);g.translate(-b[0],-b[1]);shapes.forEach(s=>drawShape(g,{...s,c:s.c==='#FFFFFF'?'#090909':s.c},()=>{}));return c}
