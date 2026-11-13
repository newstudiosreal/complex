import { ReactNode, useEffect, useState } from 'react'
import { Download, RotateCcw, Lock } from 'lucide-react'
import { useSettings } from '../hooks/useSettings'
import { useLock, hashPin } from '../hooks/useLock'
import { createProfile, deleteProfile, pid, profileIds, profileName, resetAll, switchProfile, usage } from '../services/storage'
import { DEFAULTS } from '../types'
import { APPS } from './Applications'
const ACC=['#FACC15','#FFFFFF','#38BDF8','#4ADE80','#F472B6'],AV=['','😀','🦊','🐼','🚀','📚','🎨','⚽','🌟']
const W=[['clock','Orologio'],['storage','Archiviazione'],['quick','Documenti recenti']]
const NAVS=[['/whiteboard','Whiteboard'],['/classroom','Classroom'],['/apps','Applications'],['/files','Files'],['/workspace','Workspace']]
const Row=({t,children}:{t:string;children:ReactNode})=><div className="flex min-h-[64px] flex-wrap items-center justify-between gap-3 border-b border-surf py-2 last:border-0"><span className="font-semibold">{t}</span>{children}</div>
const Sec=({t,children}:{t:string;children:ReactNode})=><section className="card mb-4"><h2 className="mb-2 text-xl font-extrabold">{t}</h2>{children}</section>
const Tg=({on,f,a='Sì',b='No'}:{on:boolean;f:()=>void;a?:string;b?:string})=><button aria-pressed={on} className={`btn ${on?'btn-accent':''}`} onClick={f}>{on?a:b}</button>
const field='min-h-[48px] rounded-2xl bg-surf px-4 font-semibold outline-none'
const toggle=(l:string[],x:string)=>l.includes(x)?l.filter(y=>y!==x):[...l,x]
export default function Settings(){
 const {s,set}=useSettings(),{lock}=useLock(),[msg,setMsg]=useState(''),[cur,setCur]=useState(''),[nw,setNw]=useState(''),[np,setNp]=useState(''),[u,setU]=useState(0)
 useEffect(()=>{usage().then(x=>setU(x.used))},[])
 const exp=()=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify({...s,pin:''},null,2)],{type:'application/json'}));a.download='complex-config.json';a.click();setMsg('Configurazione esportata (senza PIN).')}
 const imp=async(f?:File)=>{if(!f)return;try{const d=JSON.parse(await f.text());if(typeof d!=='object'||d===null)throw 0;const{pin:_p,...rest}=d;set(rest);setMsg('Configurazione importata.')}catch{setMsg('File non valido: scegli un export di COMPLEX (.json).')}}
 const setPin=async()=>{if(!/^\d{4,8}$/.test(nw)){setMsg('Il PIN deve avere da 4 a 8 cifre.');return}
  try{if(s.pin&&await hashPin(cur)!==s.pin){setMsg('PIN attuale errato.');return}set({pin:await hashPin(nw)});setNw('');setCur('');setMsg('PIN impostato.')}catch{setMsg('PIN non disponibile: serve una connessione sicura (https).')}}
 const rmPin=async()=>{try{if(await hashPin(cur)!==s.pin){setMsg('PIN attuale errato.');return}set({pin:''});setCur('');setMsg('PIN rimosso.')}catch{setMsg('PIN non verificabile in questo contesto.')}}
 return <div className="mx-auto max-w-3xl"><h1 className="mb-6 text-4xl font-extrabold">Impostazioni</h1>{msg&&<p role="status" className="mb-3 rounded-2xl bg-bg2 p-3 text-accent">{msg}</p>}
  <Sec t="Aspetto"><Row t="Tema"><div className="flex gap-2">{(['dark','light'] as const).map(t=><button key={t} className={`btn ${s.theme===t?'btn-accent':''}`} onClick={()=>set({theme:t})}>{t==='dark'?'Scuro':'Chiaro'}</button>)}</div></Row>
   <Row t="Colore principale"><div className="flex gap-3">{ACC.map(c=><button key={c} aria-label={c} onClick={()=>set({accent:c})} style={{background:c}} className={`h-12 w-12 rounded-full ${s.accent===c?'ring-4 ring-ink':''}`}/>)}</div></Row>
   <Row t="Sfondo"><div className="flex gap-2">{([['none','Nessuno'],['dots','Punti'],['lines','Righe']] as const).map(([k,l])=><button key={k} className={`btn ${s.bg===k?'btn-accent':''}`} onClick={()=>set({bg:k})}>{l}</button>)}</div></Row>
   <Row t={`Dimensione interfaccia (${Math.round(s.ui*100)}%)`}><input type="range" min="0.85" max="1.4" step="0.05" value={s.ui} onChange={e=>set({ui:+e.target.value})} className="h-12 w-48 accent-[rgb(var(--accent))]"/></Row>
   <Row t="Animazioni"><Tg on={s.anim} f={()=>set({anim:!s.anim})} a="Attive" b="Disattivate"/></Row></Sec>
  <Sec t="Sistema"><Row t="Formato ora"><div className="flex gap-2"><button className={`btn ${!s.h12?'btn-accent':''}`} onClick={()=>set({h12:false})}>24 ore</button><button className={`btn ${s.h12?'btn-accent':''}`} onClick={()=>set({h12:true})}>12 ore</button></div></Row>
   <Row t="Suono del timer"><Tg on={s.sound} f={()=>set({sound:!s.sound})} a="Attivo" b="Disattivato"/></Row>
   <Row t="Volume e luminosità"><span className="text-mute">Nel pannello rapido</span></Row><Row t="Lingua"><span className="text-mute">Italiano (altre lingue non ancora disponibili)</span></Row></Sec>
  <Sec t="Personalizzazione"><p className="mt-2 font-semibold">Widget della Home</p>{W.map(([k,l])=><Row key={k} t={l}><Tg on={s.widgets.includes(k)} f={()=>set({widgets:toggle(s.widgets,k)})} a="Visibile" b="Nascosto"/></Row>)}
   <p className="mt-4 font-semibold">Applicazioni preferite</p><div className="flex flex-wrap gap-2 py-2">{APPS.map(([id,l])=><button key={id} aria-pressed={s.favApps.includes(id)} className={`btn ${s.favApps.includes(id)?'btn-accent':''}`} onClick={()=>set({favApps:toggle(s.favApps,id)})}>{l}</button>)}</div>
   <p className="mt-4 font-semibold">Voci della sidebar</p>{NAVS.map(([to,l])=><Row key={to} t={l}><Tg on={!s.hiddenNav.includes(to)} f={()=>set({hiddenNav:toggle(s.hiddenNav,to)})} a="Visibile" b="Nascosta"/></Row>)}</Sec>
  <Sec t="Account"><Row t="Nome utente"><input value={s.name} onChange={e=>set({name:e.target.value})} aria-label="Nome utente" className={field}/></Row>
   <Row t="Avatar"><div className="flex flex-wrap gap-2">{AV.map(a=><button key={a||'iniziale'} aria-label={a||'Iniziale del nome'} onClick={()=>set({avatar:a})} className={`btn !px-0 w-12 text-xl ${s.avatar===a?'btn-accent':''}`}>{a||'Aa'}</button>)}</div></Row></Sec>
  <Sec t="Sicurezza"><p className="mb-2 text-sm text-mute">Il PIN blocca l'accesso all'interfaccia su questo dispositivo. Non cifra i dati e non protegge da chi apre gli strumenti del browser.</p>
   <div className="flex flex-wrap items-center gap-2 py-2">{s.pin&&<input type="password" inputMode="numeric" value={cur} onChange={e=>setCur(e.target.value)} placeholder="PIN attuale" aria-label="PIN attuale" className={`${field} w-36`}/>}
    <input type="password" inputMode="numeric" value={nw} onChange={e=>setNw(e.target.value)} placeholder="Nuovo PIN (4-8 cifre)" aria-label="Nuovo PIN" className={`${field} w-52`}/>
    <button className="btn btn-accent" onClick={setPin}>{s.pin?'Cambia PIN':'Imposta PIN'}</button>{s.pin&&<><button className="btn" onClick={rmPin}>Rimuovi PIN</button><button className="btn" onClick={lock}><Lock size={18}/>Blocca ora</button></>}</div>
   <p className="mt-4 font-semibold">Profili (dati separati per ciascun profilo)</p>{profileIds().map(id=><Row key={id} t={`${profileName(id)}${id===pid()?' · in uso':''}`}><div className="flex gap-2">{id!==pid()&&<button className="btn" onClick={()=>switchProfile(id)}>Passa a questo</button>}{id!=='default'&&id!==pid()&&<button className="btn" onClick={()=>{if(confirm(`Eliminare il profilo "${profileName(id)}" e tutti i suoi dati?`)){deleteProfile(id);setMsg('Profilo eliminato.')}}}>Elimina</button>}</div></Row>)}
   <div className="flex gap-2 py-2"><input value={np} onChange={e=>setNp(e.target.value)} placeholder="Nome del nuovo profilo" aria-label="Nome nuovo profilo" className={`${field} flex-1`}/><button className="btn btn-accent" onClick={()=>{if(np.trim())switchProfile(createProfile(np.trim()))}}>Crea e passa</button></div></Sec>
  <Sec t="Archiviazione"><Row t="Spazio utilizzato"><span className="font-semibold">{(u/1048576).toFixed(1)} MB</span></Row>
   <div className="flex flex-wrap gap-3 py-2"><button className="btn" onClick={exp}><Download/>Esporta configurazione</button><label className="btn cursor-pointer">Importa configurazione<input type="file" accept=".json" hidden onChange={e=>{imp(e.target.files?.[0]);e.target.value=''}}/></label>
    <button className="btn" onClick={()=>{set({...DEFAULTS,pin:s.pin,name:s.name});setMsg('Impostazioni ripristinate (PIN e nome mantenuti).')}}><RotateCcw/>Ripristina impostazioni</button>
    <button className="btn" onClick={async()=>{if(confirm('Eliminare tutti i dati di questo profilo (file, note, lezioni, lavagne)?')){await resetAll();location.reload()}}}>Cancella i dati del profilo</button></div></Sec></div>}
