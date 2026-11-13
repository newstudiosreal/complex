import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, Plus, Trash2, Shuffle, Dices, Play, Focus, Presentation, X, Eye } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useStored } from '../hooks/useStored'
import { useSettings } from '../hooks/useSettings'
import { useNotify } from '../hooks/useNotify'
import { Stopwatch, Timer } from '../apps/Clock'
interface Poll{id:number;q:string;opts:string[];correct?:number;votes:number[]}
interface Lesson{id:number;name:string;students:string[];groups:string[][];polls:Poll[];created:number}
const shuffle=<T,>(a:T[])=>{const r=[...a];for(let i=r.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[r[i],r[j]]=[r[j],r[i]]}return r}
const inp='min-h-[48px] rounded-2xl bg-surf px-4 outline-none'
function Students({l,patch}:{l:Lesson;patch:(p:Partial<Lesson>)=>void}){
 const [v,setV]=useState(''),[cur,setCur]=useState(''),[picked,setPicked]=useState<string[]>([]),[norep,setNorep]=useState(true),[n,setN]=useState(2),spin=useRef<number>()
 const add=()=>{const names=v.split(/[\n,;]+/).map(x=>x.trim()).filter(Boolean);if(names.length)patch({students:[...l.students,...names.filter(x=>!l.students.includes(x))]});setV('')}
 const pick=()=>{const pool=norep?l.students.filter(x=>!picked.includes(x)):l.students;if(!pool.length)return;clearInterval(spin.current);let i=0;spin.current=window.setInterval(()=>{setCur(pool[Math.floor(Math.random()*pool.length)]);if(++i>12){clearInterval(spin.current);const w=pool[Math.floor(Math.random()*pool.length)];setCur(w);setPicked(p=>[...p,w])}},80)}
 useEffect(()=>()=>clearInterval(spin.current),[])
 const left=norep?l.students.filter(x=>!picked.includes(x)).length:l.students.length
 return <div className="grid gap-4 lg:grid-cols-2"><div className="card"><h3 className="mb-3 text-xl font-extrabold">Studenti ({l.students.length})</h3>
   <div className="mb-3 flex gap-2"><input value={v} onChange={e=>setV(e.target.value)} onKeyDown={e=>e.key==='Enter'&&add()} placeholder="Nome (o più nomi separati da virgola)" className={`${inp} flex-1`}/><button className="btn btn-accent" onClick={add}><Plus/></button></div>
   {!l.students.length&&<p className="text-mute">Nessuno studente: aggiungi i nomi per usare estrazione e gruppi.</p>}
   <div className="flex flex-wrap gap-2">{l.students.map(x=><span key={x} className="flex items-center gap-1 rounded-2xl bg-surf py-1 pl-4 pr-1">{x}<button className="btn !min-h-[40px] !min-w-[40px] !p-0" aria-label={`Rimuovi ${x}`} onClick={()=>patch({students:l.students.filter(y=>y!==x),groups:[]})}><X size={16}/></button></span>)}</div></div>
  <div className="flex flex-col gap-4"><div className="card text-center"><h3 className="mb-3 text-xl font-extrabold">Estrazione casuale</h3><p className="mb-4 min-h-[72px] text-5xl font-extrabold text-accent" role="status">{cur||'—'}</p>
    <div className="flex flex-wrap justify-center gap-2"><button className="btn btn-accent" disabled={!left} onClick={pick}><Dices/>Estrai</button><button className={`btn ${norep?'btn-accent':''}`} onClick={()=>setNorep(!norep)}>Senza ripetizioni</button><button className="btn" onClick={()=>{setPicked([]);setCur('')}}>Azzera</button></div>
    {norep&&l.students.length>0&&<p className="mt-2 text-sm text-mute">{left===0?'Hanno risposto tutti: premi Azzera.':`Ancora da estrarre: ${left}`}</p>}</div>
   <div className="card"><h3 className="mb-3 text-xl font-extrabold">Gruppi</h3><div className="mb-3 flex items-center gap-2"><input type="number" min="2" max="10" value={n} onChange={e=>setN(Math.max(2,Math.min(10,+e.target.value||2)))} className={`${inp} w-24`} aria-label="Numero di gruppi"/><button className="btn btn-accent" disabled={l.students.length<n} onClick={()=>{const s=shuffle(l.students),g:string[][]=Array.from({length:n},()=>[]);s.forEach((x,i)=>g[i%n].push(x));patch({groups:g})}}><Shuffle/>Crea gruppi</button></div>
    {l.students.length<n&&<p className="text-mute">Servono almeno {n} studenti.</p>}
    <div className="grid grid-cols-2 gap-2">{l.groups.map((g,i)=><div key={i} className="rounded-2xl bg-surf p-3"><p className="font-extrabold text-accent">Gruppo {i+1}</p>{g.map(x=><p key={x}>{x}</p>)}</div>)}</div></div></div></div>}
function Polls({l,patch}:{l:Lesson;patch:(p:Partial<Lesson>)=>void}){
 const [q,setQ]=useState(''),[o,setO]=useState(''),[kind,setKind]=useState<'poll'|'quiz'>('poll'),[c,setC]=useState(1),[run,setRun]=useState<number|null>(null),[show,setShow]=useState(false),[err,setErr]=useState('')
 const p=l.polls.find(x=>x.id===run),up=(f:(p:Poll)=>Poll)=>patch({polls:l.polls.map(x=>x.id===run?f(x):x)})
 const add=()=>{const opts=o.split('\n').map(x=>x.trim()).filter(Boolean);if(!q.trim()||opts.length<2||opts.length>6){setErr('Scrivi la domanda e da 2 a 6 opzioni (una per riga).');return}
  if(kind==='quiz'&&(c<1||c>opts.length)){setErr(`La risposta corretta deve essere tra 1 e ${opts.length}.`);return}
  setErr('');patch({polls:[...l.polls,{id:Date.now(),q:q.trim(),opts,correct:kind==='quiz'?c-1:undefined,votes:opts.map(()=>0)}]});setQ('');setO('')}
 const tot=p?p.votes.reduce((a,b)=>a+b,0):0
 return <div className="grid gap-4 lg:grid-cols-2"><div className="card flex flex-col gap-2"><h3 className="text-xl font-extrabold">Nuova domanda</h3>
   <div className="flex gap-2">{(['poll','quiz'] as const).map(k=><button key={k} className={`btn flex-1 ${kind===k?'btn-accent':''}`} onClick={()=>setKind(k)}>{k==='poll'?'Sondaggio':'Quiz'}</button>)}</div>
   <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Domanda" className={inp}/><textarea value={o} onChange={e=>setO(e.target.value)} placeholder={'Opzioni, una per riga\nA\nB\nC'} className="h-32 resize-none rounded-2xl bg-surf p-4 outline-none"/>
   {kind==='quiz'&&<label className="flex items-center gap-2">Risposta corretta (n°)<input type="number" min="1" max="6" value={c} onChange={e=>setC(+e.target.value)} className={`${inp} w-24`}/></label>}
   {err&&<p role="alert" className="text-accent">{err}</p>}<button className="btn btn-accent" onClick={add}><Plus/>Aggiungi</button>
   <p className="text-sm text-mute">I voti si registrano toccando le opzioni durante la domanda (conteggio manuale). La votazione da dispositivi arriverà con COMPLEX Connect.</p></div>
  <div className="card flex flex-col gap-2"><h3 className="text-xl font-extrabold">Domande ({l.polls.length})</h3>{!l.polls.length&&<p className="text-mute">Nessuna domanda: creane una a sinistra.</p>}
   {l.polls.map(x=><div key={x.id} className="flex items-center gap-2 rounded-2xl bg-surf p-3"><div className="min-w-0 flex-1"><p className="truncate font-semibold">{x.q}</p><p className="text-sm text-mute">{x.correct===undefined?'Sondaggio':'Quiz'} · {x.votes.reduce((a,b)=>a+b,0)} voti</p></div>
    <button className="btn btn-accent" onClick={()=>{setRun(x.id);setShow(false)}}><Play size={18}/>Avvia</button><button className="btn" aria-label="Elimina" onClick={()=>patch({polls:l.polls.filter(y=>y.id!==x.id)})}><Trash2 size={18}/></button></div>)}</div>
  {p&&<div className="fixed inset-0 z-50 flex flex-col gap-6 overflow-auto bg-bg p-10"><div className="flex items-start justify-between gap-4"><h2 className="text-5xl font-extrabold">{p.q}</h2><button className="btn" aria-label="Chiudi" onClick={()=>setRun(null)}><X/></button></div>
   <div className="grid gap-4 md:grid-cols-2">{p.opts.map((x,i)=>{const pc=tot?Math.round(p.votes[i]/tot*100):0,ok=show&&p.correct===i;return <div key={i} className={`relative overflow-hidden rounded-3xl bg-bg2 ${ok?'ring-4 ring-accent':''}`}><div className="absolute inset-y-0 left-0 bg-accent/30 transition-all" style={{width:`${pc}%`}}/>
    <div className="relative flex min-h-[120px] items-center gap-4 p-5"><button className="btn flex-1 !justify-start !text-2xl" onClick={()=>up(y=>({...y,votes:y.votes.map((v,j)=>j===i?v+1:v)}))}>{x}</button><span className="text-3xl font-extrabold tabular-nums">{p.votes[i]} <span className="text-lg text-mute">({pc}%)</span></span>
     <button className="btn" aria-label="Togli un voto" onClick={()=>up(y=>({...y,votes:y.votes.map((v,j)=>j===i?Math.max(0,v-1):v)}))}>−1</button></div></div>})}</div>
   <div className="flex gap-2">{p.correct!==undefined&&<button className="btn btn-accent" onClick={()=>setShow(!show)}><Eye/>{show?'Nascondi risposta':'Mostra risposta'}</button>}<button className="btn" onClick={()=>up(y=>({...y,votes:y.opts.map(()=>0)}))}>Azzera voti</button><span className="ml-auto self-center text-mute">Totale voti: {tot}</span></div></div>}</div>}
export default function Classroom(){
 const [ls,setLs,ready]=useStored<Lesson[]>('classroom',[]),[id,setId]=useState<number|null>(null),[name,setName]=useState(''),[tab,setTab]=useState(0),{set}=useSettings(),{notify}=useNotify(),l=ls.find(x=>x.id===id)
 const patch=(p:Partial<Lesson>)=>setLs(o=>o.map(x=>x.id===id?{...x,...p}:x))
 const create=()=>{if(!name.trim())return;const x:Lesson={id:Date.now(),name:name.trim(),students:[],groups:[],polls:[],created:Date.now()};setLs(o=>[x,...o]);setId(x.id);setTab(0);setName('');notify(`Lezione creata: ${x.name}`)}
 if(!l)return <div className="mx-auto max-w-3xl"><h1 className="mb-6 text-4xl font-extrabold">Classroom</h1>
  <div className="card mb-4 flex gap-2"><input value={name} onChange={e=>setName(e.target.value)} onKeyDown={e=>e.key==='Enter'&&create()} placeholder="Nome della lezione, es. Matematica 2B" className={`${inp} flex-1`}/><button className="btn btn-accent" onClick={create}><Plus/>Crea lezione</button></div>
  {ready&&!ls.length&&<div className="card text-center text-mute">Nessuna lezione. Creane una per gestire studenti, timer, quiz e sondaggi.</div>}
  <div className="flex flex-col gap-2">{ls.map(x=><div key={x.id} className="card flex items-center gap-3 !p-4"><button className="flex-1 text-left" onClick={()=>{setId(x.id);setTab(0)}}><p className="text-lg font-extrabold">{x.name}</p><p className="text-sm text-mute">{x.students.length} studenti · {x.polls.length} domande · {new Date(x.created).toLocaleDateString('it-IT')}</p></button>
   <button className="btn" aria-label="Elimina lezione" onClick={()=>confirm(`Eliminare "${x.name}"?`)&&setLs(o=>o.filter(y=>y.id!==x.id))}><Trash2/></button></div>)}</div></div>
 return <div className="mx-auto max-w-6xl"><div className="mb-4 flex flex-wrap items-center gap-2"><button className="btn" aria-label="Tutte le lezioni" onClick={()=>setId(null)}><ArrowLeft/></button>
  <input value={l.name} onChange={e=>patch({name:e.target.value})} aria-label="Nome lezione" className={`${inp} flex-1 text-2xl font-extrabold`}/>
  <Link to="/apps/presentations" className="btn"><Presentation/>Presentazione</Link><button className="btn" onClick={()=>set({focus:true})}><Focus/>Focus Mode</button></div>
  <div className="mb-4 flex gap-2">{['Studenti','Timer e cronometro','Quiz e sondaggi'].map((t,i)=><button key={t} className={`btn ${tab===i?'btn-accent':''}`} onClick={()=>setTab(i)}>{t}</button>)}</div>
  {tab===0&&<Students l={l} patch={patch}/>}
  {tab===1&&<div className="grid gap-4 md:grid-cols-2"><div className="card"><h3 className="mb-4 text-center text-xl font-extrabold">Timer</h3><Timer onEnd={()=>notify(`Timer scaduto: ${l.name}`)}/></div><div className="card"><h3 className="mb-4 text-center text-xl font-extrabold">Cronometro</h3><Stopwatch/></div></div>}
  {tab===2&&<Polls l={l} patch={patch}/>}</div>}
