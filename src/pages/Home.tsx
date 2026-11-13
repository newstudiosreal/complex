import { Link } from 'react-router-dom'
import { PenTool, GraduationCap, LayoutGrid, Folder } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useSettings } from '../hooks/useSettings'
import { useClock } from '../components/Shell'
import { loadFM, FFile } from '../services/files'
import { useFmt } from '../hooks/useFmt'
import { APPS } from './Applications'
import { usage } from '../services/storage'
const hello=(h:number)=>h<13?'Buongiorno':h<18?'Buon pomeriggio':'Buonasera'
export default function Home(){
 const {s}=useSettings();const d=useClock(),fmt=useFmt();const [u,setU]=useState({used:0,quota:0});const [rec,setRec]=useState<FFile[]>([]);useEffect(()=>{usage().then(setU);loadFM().then(m=>setRec(m.files.filter(f=>f.opened).sort((a,b)=>b.opened-a.opened).slice(0,4))).catch(()=>{})},[])
 const links=[{to:'/whiteboard',l:'Apri la lavagna',i:PenTool},{to:'/classroom',l:'Avvia una lezione',i:GraduationCap},{to:'/apps',l:'Applicazioni',i:LayoutGrid},{to:'/files',l:'Documenti',i:Folder}]
 return <div className="mx-auto flex max-w-6xl flex-col gap-6">
  <div><h1 className="text-5xl font-extrabold tracking-tight">{hello(d.getHours())}, {s.name}</h1>
   <p className="mt-2 text-lg capitalize text-mute">{d.toLocaleDateString('it-IT',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}</p></div>
  <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">{links.map(({to,l,i:I})=>
   <Link key={to} to={to} className="card flex min-h-[140px] flex-col justify-between transition hover:bg-surf active:scale-95"><I size={32} className="text-accent"/><span className="text-lg font-semibold">{l}</span></Link>)}</div>
  {s.favApps.length>0&&<div className="flex flex-wrap gap-3">{APPS.filter(a=>s.favApps.includes(a[0])).map(([to,l,I])=><Link key={to} to={`/apps/${to}`} className="btn !min-h-[56px]"><I size={22} className="text-accent"/>{l}</Link>)}</div>}
  <div className="grid gap-4 md:grid-cols-3">
   {s.widgets.includes('clock')&&<div className="card"><p className="text-mute">Ora</p><p className="text-6xl font-extrabold tabular-nums">{fmt(d,true)}</p></div>}
   {s.widgets.includes('storage')&&<div className="card"><p className="text-mute">Spazio utilizzato</p><p className="text-3xl font-extrabold">{(u.used/1048576).toFixed(1)} MB</p>
    <p className="text-sm text-mute">{u.quota?`su ${(u.quota/1073741824).toFixed(1)} GB disponibili`:'stima non disponibile in questo browser'}</p></div>}
   {s.widgets.includes('quick')&&<div className="card"><p className="text-mute">Documenti recenti</p>{rec.length?rec.map(f=><Link key={f.id} to="/files" className="mt-2 block truncate font-semibold hover:text-accent">{f.name}</Link>):<p className="mt-2">Nessun documento aperto: importa un file dalla sezione Files.</p>}</div>}
  </div></div>}
