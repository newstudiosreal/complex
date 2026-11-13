import { useState } from 'react'
import { ChevronLeft, ChevronRight, Trash2 } from 'lucide-react'
import AppFrame from '../components/AppFrame'
import { useStored } from '../hooks/useStored'
interface Ev{id:number;t:string;time:string}
const key=(d:Date)=>`${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`
export default function Calendar(){
 const [ev,setEv]=useStored<Record<string,Ev[]>>('calendar',{}),[m,setM]=useState(()=>{const n=new Date();return new Date(n.getFullYear(),n.getMonth(),1)}),[sel,setSel]=useState(new Date()),[t,setT]=useState(''),[time,setTime]=useState('09:00')
 const off=(m.getDay()+6)%7,days=new Date(m.getFullYear(),m.getMonth()+1,0).getDate(),k=key(sel),list=(ev[k]||[]).slice().sort((a,b)=>a.time.localeCompare(b.time))
 const add=()=>{if(!t.trim())return;setEv(o=>({...o,[k]:[...(o[k]||[]),{id:Date.now(),t:t.trim(),time}]}));setT('')}
 return <AppFrame title="Calendar" wide><div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
  <div className="card"><div className="mb-4 flex items-center justify-between"><button className="btn" aria-label="Mese precedente" onClick={()=>setM(new Date(m.getFullYear(),m.getMonth()-1,1))}><ChevronLeft/></button>
   <h2 className="text-2xl font-extrabold capitalize">{m.toLocaleDateString('it-IT',{month:'long',year:'numeric'})}</h2><button className="btn" aria-label="Mese successivo" onClick={()=>setM(new Date(m.getFullYear(),m.getMonth()+1,1))}><ChevronRight/></button></div>
   <div className="grid grid-cols-7 gap-2 text-center">{['L','M','M','G','V','S','D'].map((d,i)=><span key={i} className="text-mute">{d}</span>)}{Array.from({length:off}).map((_,i)=><span key={'e'+i}/>)}
    {Array.from({length:days},(_,i)=>{const d=new Date(m.getFullYear(),m.getMonth(),i+1),has=(ev[key(d)]||[]).length>0,on=key(d)===k;return <button key={i} onClick={()=>setSel(d)} className={`btn !min-h-[64px] flex-col !gap-0 ${on?'btn-accent':''} ${key(d)===key(new Date())&&!on?'ring-2 ring-accent':''}`}>{i+1}{has&&<span className={`h-1.5 w-1.5 rounded-full ${on?'bg-[#090909]':'bg-accent'}`}/>}</button>})}</div></div>
  <div className="card"><h2 className="mb-3 text-xl font-extrabold capitalize">{sel.toLocaleDateString('it-IT',{weekday:'long',day:'numeric',month:'long'})}</h2>
   {list.length===0&&<p className="mb-3 text-mute">Nessun evento: aggiungine uno qui sotto.</p>}
   {list.map(e=><div key={e.id} className="mb-2 flex items-center gap-3 rounded-2xl bg-surf p-3"><span className="font-bold tabular-nums text-accent">{e.time}</span><span className="flex-1">{e.t}</span><button aria-label="Elimina evento" className="btn !min-h-[40px]" onClick={()=>setEv(o=>({...o,[k]:o[k].filter(x=>x.id!==e.id)}))}><Trash2 size={18}/></button></div>)}
   <div className="mt-3 flex flex-col gap-2"><input value={t} onChange={e=>setT(e.target.value)} onKeyDown={e=>e.key==='Enter'&&add()} placeholder="Titolo evento" className="min-h-[48px] rounded-2xl bg-surf px-4 outline-none"/><input type="time" value={time} onChange={e=>setTime(e.target.value)} className="min-h-[48px] rounded-2xl bg-surf px-4 outline-none"/><button className="btn btn-accent" onClick={add}>Aggiungi evento</button></div></div></div></AppFrame>}
