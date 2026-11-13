import { Link } from 'react-router-dom'
import { Star, Columns2, PenTool, Focus, Radio, FileText } from 'lucide-react'
import { APPS } from '../pages/Applications'
import { useSettings } from '../hooks/useSettings'
import { useFM } from '../hooks/useFM'
export default function Workspace(){
 const {s,set}=useSettings(),{fm,ready}=useFM(),favs=fm.files.filter(f=>f.fav)
 const sys=[{to:'/whiteboard',l:'MultiBoard',d:'Più lavagne, una per argomento',i:PenTool},{to:'/split',l:'SplitScreen',d:'Due applicazioni affiancate',i:Columns2},{to:'/connect',l:'COMPLEX Connect',d:'Dispositivi esterni (in parte simulato)',i:Radio}]
 return <div className="mx-auto max-w-5xl"><h1 className="mb-6 text-4xl font-extrabold">Workspace</h1>
  <h2 className="mb-3 text-xl font-extrabold">Applicazioni preferite</h2>
  {s.favApps.length?<div className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-4">{APPS.filter(a=>s.favApps.includes(a[0])).map(([to,l,I])=><Link key={to} to={`/apps/${to}`} className="card flex min-h-[120px] flex-col justify-between !p-4 transition hover:bg-surf active:scale-95"><I size={30} className="text-accent"/><span className="font-semibold">{l}</span></Link>)}</div>
   :<p className="card mb-8 text-mute">Nessuna app preferita. Scegline alcune qui sotto.</p>}
  <div className="mb-8 flex flex-wrap gap-2">{APPS.map(([id,l])=>{const on=s.favApps.includes(id);return <button key={id} aria-pressed={on} className={`btn ${on?'btn-accent':''}`} onClick={()=>set({favApps:on?s.favApps.filter(x=>x!==id):[...s.favApps,id]})}><Star size={18}/>{l}</button>})}</div>
  <h2 className="mb-3 text-xl font-extrabold">Documenti preferiti</h2>
  {ready&&!favs.length?<p className="card mb-8 text-mute">Nessun documento preferito: nella sezione Files tocca la stella su un file.</p>:<div className="mb-8 flex flex-col gap-2">{favs.map(f=><Link key={f.id} to="/files" className="card flex items-center gap-3 !p-4 hover:bg-surf"><FileText className="text-accent"/>{f.name}</Link>)}</div>}
  <h2 className="mb-3 text-xl font-extrabold">Sistemi</h2>
  <div className="grid gap-3 md:grid-cols-2">{sys.map(({to,l,d,i:I})=><Link key={to} to={to} className="card flex items-center gap-4 !p-4 hover:bg-surf"><I size={30} className="text-accent"/><div><p className="font-extrabold">{l}</p><p className="text-sm text-mute">{d}</p></div></Link>)}
   <button className="card flex items-center gap-4 !p-4 text-left hover:bg-surf" onClick={()=>set({focus:true})}><Focus size={30} className="text-accent"/><div><p className="font-extrabold">Focus Mode</p><p className="text-sm text-mute">Interfaccia semplificata per la lezione</p></div></button></div></div>}
