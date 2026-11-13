import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import AppFrame from '../components/AppFrame'
import { useStored } from '../hooks/useStored'
interface Note{id:number;title:string;body:string;updated:number}
export default function Notes(){
 const [notes,setNotes]=useStored<Note[]>('notes',[]),[sel,setSel]=useState<number|null>(null),n=notes.find(x=>x.id===sel)
 const patch=(p:Partial<Note>)=>setNotes(o=>o.map(x=>x.id===sel?{...x,...p,updated:Date.now()}:x))
 const add=()=>{const x={id:Date.now(),title:'Nuova nota',body:'',updated:Date.now()};setNotes(o=>[x,...o]);setSel(x.id)}
 return <AppFrame title="Notes" wide><div className="grid gap-4 md:grid-cols-[280px_1fr]">
  <div className="card flex flex-col gap-2"><button className="btn btn-accent" onClick={add}><Plus/>Nuova nota</button>
   {notes.length===0&&<p className="text-mute">Nessuna nota. Creane una per iniziare.</p>}
   {notes.slice().sort((a,b)=>b.updated-a.updated).map(x=><button key={x.id} onClick={()=>setSel(x.id)} className={`btn !justify-start text-left ${sel===x.id?'btn-accent':''}`}><span className="truncate">{x.title||'Senza titolo'}</span></button>)}</div>
  <div className="card min-h-[420px]">{n?<><div className="mb-3 flex gap-2"><input value={n.title} onChange={e=>patch({title:e.target.value})} className="min-h-[48px] flex-1 rounded-2xl bg-surf px-4 text-xl font-extrabold outline-none"/><button className="btn" aria-label="Elimina nota" onClick={()=>{if(confirm('Eliminare la nota?')){setNotes(o=>o.filter(x=>x.id!==n.id));setSel(null)}}}><Trash2/></button></div>
   <textarea value={n.body} onChange={e=>patch({body:e.target.value})} placeholder="Scrivi qui. Si salva da solo." className="h-[340px] w-full resize-none rounded-2xl bg-surf p-4 text-lg outline-none"/></>:<p className="text-mute">Seleziona o crea una nota.</p>}</div></div></AppFrame>}
