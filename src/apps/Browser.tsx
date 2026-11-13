import { useState } from 'react'
import { ExternalLink } from 'lucide-react'
import AppFrame from '../components/AppFrame'
const SITES=[['Wikipedia','https://it.wikipedia.org'],['OpenStreetMap','https://www.openstreetmap.org'],['Esempio','https://example.com']]
export default function Browser(){
 const [v,setV]=useState(''),[url,setUrl]=useState('')
 const go=(x:string)=>{const t=x.trim();if(!t)return;const u=/^https?:\/\//.test(t)?t:'https://'+t;setV(u);setUrl(u)}
 return <AppFrame title="Browser" wide><div className="mb-3 flex gap-2"><input value={v} onChange={e=>setV(e.target.value)} onKeyDown={e=>e.key==='Enter'&&go(v)} placeholder="Scrivi un indirizzo, es. it.wikipedia.org" className="min-h-[48px] flex-1 rounded-2xl bg-surf px-4 outline-none"/>
  <button className="btn btn-accent" onClick={()=>go(v)}>Vai</button>{url&&<a className="btn" href={url} target="_blank" rel="noreferrer"><ExternalLink size={20}/>Nuova scheda</a>}</div>
  <div className="mb-3 flex flex-wrap gap-2">{SITES.map(([n,u])=><button key={n} className="btn" onClick={()=>go(u)}>{n}</button>)}</div>
  <p className="mb-3 text-sm text-mute">Molti siti (Google, YouTube, banche) vietano l'apertura in una pagina incorporata e resteranno vuoti: usa "Nuova scheda".</p>
  {url&&<iframe title="Browser" src={url} sandbox="allow-scripts allow-same-origin allow-forms allow-popups" className="h-[calc(100vh-20rem)] w-full rounded-3xl bg-white"/>}</AppFrame>}
