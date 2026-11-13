import { useEffect, useState } from 'react'
import { Plus, Play, Trash2, X } from 'lucide-react'
import AppFrame from '../components/AppFrame'
import { useStored } from '../hooks/useStored'
interface Slide{title:string;body:string}interface Deck{id:number;title:string;slides:Slide[]}
export default function Presentations(){
 const [decks,setDecks]=useStored<Deck[]>('decks',[]),[di,setDi]=useState<number|null>(null),[si,setSi]=useState(0),[play,setPlay]=useState(false)
 const d=decks.find(x=>x.id===di),s=d?.slides[si]
 const patch=(f:(d:Deck)=>Deck)=>setDecks(o=>o.map(x=>x.id===di?f(x):x))
 useEffect(()=>{if(!play||!d)return;const k=(e:KeyboardEvent)=>{if(e.key==='Escape')setPlay(false);if(e.key==='ArrowRight'||e.key===' ')setSi(i=>Math.min(i+1,d.slides.length-1));if(e.key==='ArrowLeft')setSi(i=>Math.max(i-1,0))};addEventListener('keydown',k);return()=>removeEventListener('keydown',k)},[play,d])
 return <AppFrame title="Presentations" wide>
  <div className="mb-4 flex flex-wrap gap-2"><button className="btn btn-accent" onClick={()=>{const x={id:Date.now(),title:'Nuova presentazione',slides:[{title:'Titolo',body:''}]};setDecks(o=>[...o,x]);setDi(x.id);setSi(0)}}><Plus/>Nuova presentazione</button>
   {decks.map(x=><button key={x.id} className={`btn ${di===x.id?'btn-accent':''}`} onClick={()=>{setDi(x.id);setSi(0)}}>{x.title}</button>)}</div>
  {!d?<div className="card text-center text-mute">{decks.length?'Scegli una presentazione.':'Nessuna presentazione. Creane una per iniziare.'}</div>:
  <div className="grid gap-4 md:grid-cols-[220px_1fr]"><div className="card flex flex-col gap-2">{d.slides.map((x,i)=><button key={i} onClick={()=>setSi(i)} className={`btn !justify-start truncate ${si===i?'btn-accent':''}`}>{i+1}. {x.title||'Senza titolo'}</button>)}
    <button className="btn" onClick={()=>{patch(x=>({...x,slides:[...x.slides,{title:'',body:''}]}));setSi(d.slides.length)}}><Plus/>Slide</button></div>
   <div className="card flex flex-col gap-3"><input value={d.title} onChange={e=>patch(x=>({...x,title:e.target.value}))} aria-label="Nome presentazione" className="min-h-[48px] rounded-2xl bg-surf px-4 font-semibold outline-none"/>
    {s&&<><input value={s.title} onChange={e=>patch(x=>({...x,slides:x.slides.map((y,i)=>i===si?{...y,title:e.target.value}:y)}))} placeholder="Titolo slide" className="min-h-[56px] rounded-2xl bg-surf px-4 text-2xl font-extrabold outline-none"/>
     <textarea value={s.body} onChange={e=>patch(x=>({...x,slides:x.slides.map((y,i)=>i===si?{...y,body:e.target.value}:y)}))} placeholder="Testo della slide" className="h-56 resize-none rounded-2xl bg-surf p-4 text-lg outline-none"/></>}
    <div className="flex flex-wrap gap-2"><button className="btn btn-accent" onClick={()=>setPlay(true)}><Play/>Presenta</button>
     <button className="btn" disabled={d.slides.length<2} onClick={()=>{patch(x=>({...x,slides:x.slides.filter((_,i)=>i!==si)}));setSi(Math.max(0,si-1))}}><Trash2/>Elimina slide</button>
     <button className="btn" onClick={()=>{if(confirm('Eliminare la presentazione?')){setDecks(o=>o.filter(x=>x.id!==d.id));setDi(null)}}}>Elimina presentazione</button></div></div></div>}
  {play&&d&&s&&<div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-8 bg-bg p-16 text-center" onClick={()=>setSi(i=>Math.min(i+1,d.slides.length-1))}>
   <h2 className="text-7xl font-extrabold">{s.title}</h2><p className="max-w-4xl whitespace-pre-wrap text-4xl text-mute">{s.body}</p>
   <p className="absolute bottom-6 text-mute">{si+1} / {d.slides.length} · frecce o tocco per avanzare</p><button className="btn absolute right-6 top-6" aria-label="Esci" onClick={e=>{e.stopPropagation();setPlay(false)}}><X/></button></div>}</AppFrame>}
