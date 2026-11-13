import { useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import Whiteboard from '../pages/Whiteboard'
import { useStored } from '../hooks/useStored'
import { dbDel } from '../services/storage'
interface B{id:string;name:string}
export default function MultiBoard(){
 const [boards,setBoards,ready]=useStored<B[]>('boards',[{id:'main',name:'Lavagna 1'}]),[cur,setCur]=useState(()=>localStorage.getItem('complex.board')||'main')
 if(!ready)return null
 const b=boards.find(x=>x.id===cur)||boards[0]
 const pick=(id:string)=>{setCur(id);localStorage.setItem('complex.board',id)}
 const add=()=>{const id=Date.now().toString(36);setBoards(o=>[...o,{id,name:`Lavagna ${o.length+1}`}]);pick(id)}
 const del=()=>{if(boards.length<2||!confirm(`Eliminare "${b.name}" e il suo contenuto?`))return;dbDel(b.id==='main'?'whiteboard':'whiteboard:'+b.id).catch(()=>{});const r=boards.filter(x=>x.id!==b.id);setBoards(r);pick(r[0].id)}
 return <div className="flex h-full flex-col gap-3"><div className="flex items-center gap-2 overflow-x-auto" role="tablist" aria-label="Lavagne">
  {boards.map(x=><button key={x.id} role="tab" aria-selected={x.id===b.id} className={`btn shrink-0 ${x.id===b.id?'btn-accent':''}`} onClick={()=>pick(x.id)}>{x.name}</button>)}
  <button className="btn shrink-0" aria-label="Nuova lavagna" onClick={add}><Plus/></button><button className="btn shrink-0" aria-label="Rinomina lavagna" onClick={()=>{const n=prompt('Nome della lavagna',b.name);if(n?.trim())setBoards(o=>o.map(x=>x.id===b.id?{...x,name:n.trim()}:x))}}><Pencil size={20}/></button>
  <button className="btn shrink-0" aria-label="Elimina lavagna" disabled={boards.length<2} onClick={del}><Trash2 size={20}/></button></div>
  <div className="min-h-0 flex-1"><Whiteboard key={b.id} boardId={b.id}/></div></div>}
