import { useState } from 'react'
import { Radio, Link2, Link2Off } from 'lucide-react'
import { Link } from 'react-router-dom'
type St='Reale'|'Simulato'|'Non disponibile'
const ROWS:[string,St,string][]=[['Salvataggio locale (IndexedDB)','Reale','Funziona offline su questo dispositivo.'],['Esportazione e importazione configurazione','Reale','Da Impostazioni → Archiviazione.'],['Screenshot','Reale','Usa la cattura schermo del browser, con permesso.'],['Ricerca e abbinamento dispositivi','Simulato','Mostra l\u2019interfaccia con dispositivi dimostrativi.'],['Voto dai dispositivi degli studenti','Simulato','Oggi i voti si contano a mano in Classroom.'],['Condivisione schermo wireless','Non disponibile','Richiede un servizio di rete non ancora esistente.'],['Sincronizzazione tra LIM','Non disponibile','Richiede un backend, escluso dal prototipo.']]
const badge=(s:St)=>s==='Reale'?'bg-accent text-[#090909]':s==='Simulato'?'bg-sky-400 text-[#090909]':'bg-surf text-mute'
const DEMO=['Tablet studente 1 (demo)','Tablet studente 2 (demo)','Telecomando docente (demo)']
export default function Connect(){
 const [scan,setScan]=useState(false),[found,setFound]=useState<string[]>([]),[on,setOn]=useState<string[]>([])
 const search=()=>{setScan(true);setFound([]);setTimeout(()=>{setFound(DEMO);setScan(false)},1500)}
 return <div className="mx-auto max-w-4xl"><h1 className="mb-2 text-4xl font-extrabold">COMPLEX Connect</h1><p className="mb-6 text-mute">Interfaccia per la futura connessione con dispositivi esterni. Qui sotto vedi cosa è già reale e cosa è solo simulato.</p>
  <div className="card mb-4 !p-2">{ROWS.map(([n,s,d])=><div key={n} className="flex items-center gap-3 border-b border-surf p-3 last:border-0"><div className="flex-1"><p className="font-semibold">{n}</p><p className="text-sm text-mute">{d}</p></div><span className={`rounded-full px-3 py-1 text-sm font-bold ${badge(s)}`}>{s}</span></div>)}</div>
  <div className="card"><div className="mb-3 flex items-center justify-between"><h2 className="text-xl font-extrabold">Dispositivi <span className="rounded-full bg-sky-400 px-2 py-0.5 text-xs text-[#090909]">SIMULATO</span></h2><button className="btn btn-accent" disabled={scan} onClick={search}><Radio/>{scan?'Ricerca…':'Cerca dispositivi'}</button></div>
   {!found.length&&!scan&&<p className="text-mute">Premi "Cerca dispositivi": comparirà un elenco dimostrativo, non reale.</p>}
   {found.map(d=>{const c=on.includes(d);return <div key={d} className="mb-2 flex items-center gap-3 rounded-2xl bg-surf p-3"><span className="flex-1">{d}</span><button className={`btn ${c?'':'btn-accent'}`} onClick={()=>setOn(c?on.filter(x=>x!==d):[...on,d])}>{c?<><Link2Off size={18}/>Scollega</>:<><Link2 size={18}/>Collega</>}</button></div>})}</div>
  <Link to="/workspace" className="btn mt-4">Torna al Workspace</Link></div>}
