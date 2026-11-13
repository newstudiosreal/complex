import { useCallback, useEffect, useRef, useState } from 'react'
import { MousePointer2, Pencil, Highlighter, Eraser, Minus, MoveUpRight, Square, Circle, Triangle, Type, ImagePlus, Hand, Undo2, Redo2, Trash2, Grid3x3, Ruler, ZoomIn, ZoomOut, Image as Img, FileText, ChevronLeft, ChevronRight, FilePlus, FileX } from 'lucide-react'
import { Shape, View, Pt, render, hit, exportCanvas } from './draw'
import { dbGet, dbSet } from '../../services/storage'
const TOOLS=[['select','Selezione',MousePointer2],['pen','Penna',Pencil],['hl','Evidenziatore',Highlighter],['eraser','Gomma',Eraser],['line','Linea',Minus],['arrow','Freccia',MoveUpRight],['rect','Rettangolo',Square],['ellipse','Cerchio',Circle],['tri','Triangolo',Triangle],['text','Testo',Type],['pan','Sposta lavagna',Hand]] as const
const COLORS=['#090909','#FFFFFF','#FACC15','#EF4444','#38BDF8','#4ADE80']
type Tool=typeof TOOLS[number][0]
const Btn=({on,t,children,...p}:{on?:boolean;t:string}&React.ButtonHTMLAttributes<HTMLButtonElement>)=><button {...p} title={t} aria-label={t} className={`btn !px-0 w-12 ${on?'btn-accent':''} disabled:opacity-30`}>{children}</button>
export default function Whiteboard({boardId='main'}:{boardId?:string}){
 const BK=boardId==='main'?'whiteboard':'whiteboard:'+boardId
 const wrap=useRef<HTMLDivElement>(null),cv=useRef<HTMLCanvasElement>(null),file=useRef<HTMLInputElement>(null)
 const [pages,setPages]=useState<Shape[][]>([[]]),[cur,setCur]=useState(0),[tool,setTool]=useState<Tool>('pen'),[color,setColor]=useState('#FACC15'),[width,setWidth]=useState(4)
 const [view,setView]=useState<View>({x:0,y:0,z:1}),[grid,setGrid]=useState(false),[ruler,setRuler]=useState(false),[sel,setSel]=useState<number|null>(null)
 const [txt,setTxt]=useState<{p:Pt;sx:number;sy:number}|null>(null),[saved,setSaved]=useState(''),[ready,setReady]=useState(false),[rp,setRp]=useState({x:80,y:140})
 const past=useRef<string[]>([]),future=useRef<string[]>([]),draft=useRef<Shape|null>(null),ptrs=useRef(new Map<number,Pt>()),drag=useRef<any>(null),id=useRef(Date.now()),pinch=useRef(0)
 const shapes=pages[cur]||[]
 const draw=useCallback(()=>{const c=cv.current,w=wrap.current;if(!c||!w)return;const r=devicePixelRatio||1;if(c.width!==w.clientWidth*r||c.height!==w.clientHeight*r){c.width=w.clientWidth*r;c.height=w.clientHeight*r}
  const g=c.getContext('2d')!;g.save();g.scale(r,r);render(g,draft.current?[...shapes,draft.current]:shapes,view,w.clientWidth,w.clientHeight,grid,sel,draw);g.restore()},[shapes,view,grid,sel])
 useEffect(()=>{draw()},[draw]);useEffect(()=>{const o=new ResizeObserver(draw);o.observe(wrap.current!);return()=>o.disconnect()},[draw])
 useEffect(()=>{dbGet<{pages:Shape[][];cur:number}>(BK).then(d=>{if(d?.pages?.length){setPages(d.pages);setCur(Math.min(d.cur,d.pages.length-1))}}).catch(()=>setSaved('Impossibile leggere i dati salvati')).finally(()=>setReady(true))},[])
 useEffect(()=>{if(!ready)return;const t=setTimeout(()=>dbSet(BK,{pages,cur}).then(()=>setSaved('Salvato')).catch(()=>setSaved('Salvataggio non riuscito')),700);return()=>clearTimeout(t)},[pages,cur,ready])
 const snap=()=>{past.current.push(JSON.stringify(pages));future.current=[]}
 const setShapes=(f:(s:Shape[])=>Shape[])=>setPages(p=>p.map((s,i)=>i===cur?f(s):s))
 const commit=(f:(s:Shape[])=>Shape[])=>{snap();setShapes(f)}
 const undo=()=>{const s=past.current.pop();if(!s)return;future.current.push(JSON.stringify(pages));const p=JSON.parse(s);setPages(p);setCur(c=>Math.min(c,p.length-1));setSel(null)}
 const redo=()=>{const s=future.current.pop();if(!s)return;past.current.push(JSON.stringify(pages));setPages(JSON.parse(s));setSel(null)}
 const delSel=()=>{if(sel!==null){commit(s=>s.filter(x=>x.id!==sel));setSel(null)}}
 useEffect(()=>{const k=(e:KeyboardEvent)=>{if((e.target as HTMLElement).tagName==='INPUT'||(e.target as HTMLElement).tagName==='TEXTAREA')return
  if((e.ctrlKey||e.metaKey)&&e.key==='z'){e.preventDefault();e.shiftKey?redo():undo()}else if((e.ctrlKey||e.metaKey)&&e.key==='y')redo();else if(e.key==='Delete'||e.key==='Backspace')delSel()}
  addEventListener('keydown',k);return()=>removeEventListener('keydown',k)})
 const world=(e:React.PointerEvent):Pt=>{const r=cv.current!.getBoundingClientRect();return[(e.clientX-r.left-view.x)/view.z,(e.clientY-r.top-view.y)/view.z]}
 const zoomAt=(f:number,cx:number,cy:number)=>setView(v=>{const z=Math.max(.2,Math.min(5,v.z*f));return{z,x:cx-(cx-v.x)*z/v.z,y:cy-(cy-v.y)*z/v.z}})
 const down=(e:React.PointerEvent)=>{cv.current!.setPointerCapture(e.pointerId);const r=cv.current!.getBoundingClientRect();ptrs.current.set(e.pointerId,[e.clientX,e.clientY])
  if(ptrs.current.size===2){draft.current=null;drag.current={kind:'pan2'};const [a,b]=[...ptrs.current.values()];pinch.current=Math.hypot(a[0]-b[0],a[1]-b[1]);return}
  const p=world(e)
  if(tool==='pan'||e.button===1){drag.current={kind:'pan',sx:e.clientX,sy:e.clientY,vx:view.x,vy:view.y};return}
  if(tool==='text'){setTxt({p,sx:e.clientX-r.left,sy:e.clientY-r.top});return}
  if(tool==='select'){const h=[...shapes].reverse().find(s=>hit(s,p[0],p[1],8/view.z));setSel(h?.id??null);if(h){snap();drag.current={kind:'move',last:p,before:JSON.stringify(pages)}}return}
  if(tool==='eraser'){snap();drag.current={kind:'erase',before:JSON.stringify(pages)};erase(p);return}
  draft.current={id:++id.current,t:tool as Shape['t'],c:color,w:width,pts:[p,p]};drag.current={kind:'draw'};draw()}
 const erase=(p:Pt)=>setShapes(s=>s.filter(x=>!hit(x,p[0],p[1],width*3/view.z)))
 const move=(e:React.PointerEvent)=>{if(ptrs.current.has(e.pointerId))ptrs.current.set(e.pointerId,[e.clientX,e.clientY]);const d=drag.current;if(!d)return
  if(d.kind==='pan2'&&ptrs.current.size>=2){const [a,b]=[...ptrs.current.values()],dist=Math.hypot(a[0]-b[0],a[1]-b[1]),r=cv.current!.getBoundingClientRect();zoomAt(dist/pinch.current,(a[0]+b[0])/2-r.left,(a[1]+b[1])/2-r.top);pinch.current=dist;return}
  if(d.kind==='pan'){setView(v=>({...v,x:d.vx+e.clientX-d.sx,y:d.vy+e.clientY-d.sy}));return}
  const p=world(e)
  if(d.kind==='erase')erase(p)
  else if(d.kind==='move'){const dx=p[0]-d.last[0],dy=p[1]-d.last[1];d.last=p;setShapes(s=>s.map(x=>x.id===sel?{...x,pts:x.pts.map(q=>[q[0]+dx,q[1]+dy] as Pt)}:x))}
  else if(d.kind==='draw'&&draft.current){const s=draft.current;if(s.t==='pen'||s.t==='hl')s.pts.push(p);else s.pts=[s.pts[0],p];draw()}}
 const up=(e:React.PointerEvent)=>{ptrs.current.delete(e.pointerId);const d=drag.current;if(ptrs.current.size<2&&d?.kind==='pan2')drag.current=null
  if(!d||d.kind==='pan2')return;drag.current=null
  if(d.kind==='draw'&&draft.current){const s=draft.current;draft.current=null;const tiny=s.pts.length<3&&Math.hypot(s.pts[1][0]-s.pts[0][0],s.pts[1][1]-s.pts[0][1])<3&&s.t!=='pen'&&s.t!=='hl';if(!tiny)commit(a=>[...a,s]);else draw()}
  if((d.kind==='erase'||d.kind==='move')&&d.before===JSON.stringify(pages))past.current.pop()}
 const addImage=(f?:File)=>{if(!f)return;const rd=new FileReader();rd.onload=()=>{const src=String(rd.result),i=new window.Image();i.onload=()=>{const k=Math.min(1,500/i.naturalWidth),w=i.naturalWidth*k,h=i.naturalHeight*k,x=(-view.x+200)/view.z,y=(-view.y+120)/view.z;commit(s=>[...s,{id:++id.current,t:'img',c:'#000',w:1,src,pts:[[x,y],[x+w,y+h]]}])};i.src=src};rd.readAsDataURL(f)}
 const addText=(v:string)=>{if(txt&&v.trim())commit(s=>[...s,{id:++id.current,t:'text',c:color,w:width,text:v,pts:[txt.p]}]);setTxt(null)}
 const dl=(url:string,n:string)=>{const a=document.createElement('a');a.href=url;a.download=n;a.click()}
 const png=async()=>dl((await exportCanvas(shapes)).toDataURL('image/png'),`lavagna-pagina-${cur+1}.png`)
 const pdf=async()=>{setSaved('Creo il PDF…');const {jsPDF}=await import('jspdf');let doc:InstanceType<typeof jsPDF>|null=null
  for(const pg of pages){const c=await exportCanvas(pg),f:[number,number]=[c.width,c.height];if(!doc)doc=new jsPDF({orientation:'landscape',unit:'px',format:f});else doc.addPage(f,'landscape');doc.addImage(c.toDataURL('image/png'),'PNG',0,0,c.width,c.height)}
  doc?.save('lavagna.pdf');setSaved('PDF esportato')}
 const clearPage=()=>{if(shapes.length&&confirm('Cancellare tutta la pagina?'))commit(()=>[]);setSel(null)}
 const delPage=()=>{if(pages.length<2){clearPage();return}if(!confirm('Eliminare questa pagina?'))return;snap();setPages(p=>p.filter((_,i)=>i!==cur));setCur(c=>Math.max(0,c-1));setSel(null)}
 const addPage=()=>{snap();setPages(p=>[...p,[]]);setCur(pages.length);setSel(null)}
 const Sep=()=><span className="mx-1 h-8 w-px bg-surf"/>
 return <div className="relative flex gap-3" style={{height:'100%'}}>
  <div className="flex w-[72px] flex-col items-center gap-1 overflow-y-auto rounded-3xl bg-bg2 p-2">{TOOLS.map(([k,l,I])=><Btn key={k} t={l} on={tool===k} onClick={()=>{setTool(k);if(k!=='select')setSel(null)}}><I size={22}/></Btn>)}
   <Btn t="Inserisci immagine" onClick={()=>file.current?.click()}><ImagePlus size={22}/></Btn><input ref={file} type="file" accept="image/*" hidden onChange={e=>{addImage(e.target.files?.[0]);e.target.value=''}}/></div>
  <div className="flex min-w-0 flex-1 flex-col gap-3">
   <div className="flex flex-wrap items-center gap-1 rounded-3xl bg-bg2 p-2">
    {COLORS.map(c=><button key={c} aria-label={c} onClick={()=>setColor(c)} style={{background:c}} className={`h-10 w-10 rounded-full border border-surf ${color===c?'ring-4 ring-accent':''}`}/>)}
    <input aria-label="Spessore" type="range" min="1" max="16" value={width} onChange={e=>setWidth(+e.target.value)} className="mx-2 h-12 w-28 accent-[rgb(var(--accent))]"/><Sep/>
    <Btn t="Annulla" onClick={undo} disabled={!past.current.length}><Undo2 size={22}/></Btn><Btn t="Ripeti" onClick={redo} disabled={!future.current.length}><Redo2 size={22}/></Btn>
    {sel!==null&&<Btn t="Elimina selezione" onClick={delSel}><Trash2 size={22}/></Btn>}<Btn t="Cancella pagina" onClick={clearPage}><FileX size={22}/></Btn><Sep/>
    <Btn t="Griglia" on={grid} onClick={()=>setGrid(!grid)}><Grid3x3 size={22}/></Btn><Btn t="Righello" on={ruler} onClick={()=>setRuler(!ruler)}><Ruler size={22}/></Btn>
    <Btn t="Riduci" onClick={()=>zoomAt(.8,300,200)}><ZoomOut size={22}/></Btn><button className="btn" onClick={()=>setView({x:0,y:0,z:1})} title="Ripristina vista">{Math.round(view.z*100)}%</button><Btn t="Ingrandisci" onClick={()=>zoomAt(1.25,300,200)}><ZoomIn size={22}/></Btn><Sep/>
    <Btn t="Esporta PNG" onClick={png}><Img size={22}/></Btn><Btn t="Esporta PDF" onClick={pdf}><FileText size={22}/></Btn><span className="ml-auto px-2 text-sm text-mute" role="status">{saved}</span></div>
   <div ref={wrap} className="relative flex-1 overflow-hidden rounded-3xl" style={{['--wb-bg' as any]:'#fff'}}>
    <canvas ref={cv} className="h-full w-full" style={{touchAction:'none',cursor:tool==='pan'?'grab':tool==='select'?'default':'crosshair'}} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} onWheel={e=>{const r=cv.current!.getBoundingClientRect();zoomAt(e.deltaY<0?1.1:.9,e.clientX-r.left,e.clientY-r.top)}}/>
    {ruler&&<div onPointerDown={e=>{e.currentTarget.setPointerCapture(e.pointerId);drag.current=null;(e.currentTarget as any)._o=[e.clientX-rp.x,e.clientY-rp.y]}} onPointerMove={e=>{const o=(e.currentTarget as any)._o;if(o&&e.buttons)setRp({x:e.clientX-o[0],y:e.clientY-o[1]})}} className="absolute h-14 w-[756px] cursor-move rounded-lg bg-accent/90 text-[10px] font-bold text-[#090909]" style={{left:rp.x-72-12,top:rp.y-100,touchAction:'none',backgroundImage:'repeating-linear-gradient(90deg,#090909 0 1px,transparent 1px 37.8px)',backgroundSize:'37.8px 14px',backgroundRepeat:'repeat-x'}}>
     {Array.from({length:20},(_,i)=><span key={i} className="absolute top-4" style={{left:i*37.8+3}}>{i}</span>)}<span className="absolute bottom-1 right-2">cm (riferimento visivo)</span></div>}
    {txt&&<textarea autoFocus rows={2} placeholder="Scrivi e premi Invio" onBlur={e=>addText(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();addText(e.currentTarget.value)}if(e.key==='Escape')setTxt(null)}} className="absolute min-w-[200px] rounded-xl border-2 border-accent bg-white p-2 text-lg font-semibold text-black outline-none" style={{left:txt.sx,top:txt.sy}}/>}
    {!shapes.length&&!txt&&<p className="pointer-events-none absolute inset-0 grid place-items-center text-lg text-neutral-400">Pagina vuota: scegli uno strumento e disegna.</p>}
   </div>
   <div className="flex items-center justify-center gap-2"><Btn t="Pagina precedente" disabled={cur===0} onClick={()=>{setCur(cur-1);setSel(null)}}><ChevronLeft/></Btn><span className="min-w-[120px] text-center font-semibold">Pagina {cur+1} di {pages.length}</span>
    <Btn t="Pagina successiva" disabled={cur>=pages.length-1} onClick={()=>{setCur(cur+1);setSel(null)}}><ChevronRight/></Btn><Btn t="Nuova pagina" onClick={addPage}><FilePlus/></Btn><Btn t="Elimina pagina" onClick={delPage}><Trash2/></Btn></div>
  </div></div>}
