import { createContext, useContext, useState, ReactNode } from 'react'
import { Delete, Lock } from 'lucide-react'
import { useSettings } from './useSettings'
export const hashPin=async(p:string)=>{const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode('complex:'+p));return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')}
const C=createContext<{lock:()=>void}>({lock:()=>{}})
export const useLock=()=>useContext(C)
function Screen({onOk}:{onOk:()=>void}){
 const {s}=useSettings(),[v,setV]=useState(''),[err,setErr]=useState('')
 const go=async(p:string)=>{try{if(await hashPin(p)===s.pin)onOk();else{setErr('PIN errato');setV('')}}catch{setErr('PIN non verificabile: serve una connessione sicura (https).')}}
 const press=(k:string)=>{setErr('');if(k==='⌫')setV(v.slice(0,-1));else if(k==='OK'){if(v.length>=4)go(v)}else if(v.length<8)setV(v+k)}
 return <div className="grid h-screen place-items-center"><div className="card w-80 text-center"><Lock className="mx-auto mb-2 text-accent" size={36}/><h1 className="text-2xl font-extrabold">COMPLEX bloccato</h1><p className="text-mute">{s.name}</p>
  <p className="my-4 h-10 text-3xl tracking-[0.4em]" aria-label="PIN inserito">{'•'.repeat(v.length)||'\u00a0'}</p>{err&&<p role="alert" className="mb-2 text-accent">{err}</p>}
  <div className="grid grid-cols-3 gap-2">{['1','2','3','4','5','6','7','8','9','⌫','0','OK'].map(k=><button key={k} onClick={()=>press(k)} aria-label={k==='⌫'?'Cancella':k} className={`btn !min-h-[64px] text-xl ${k==='OK'?'btn-accent':''}`}>{k==='⌫'?<Delete/>:k}</button>)}</div>
  <p className="mt-4 text-xs text-mute">Il PIN protegge solo l'accesso all'interfaccia su questo dispositivo, non cifra i dati.</p></div></div>}
export function LockProvider({children}:{children:ReactNode}){
 const {s}=useSettings(),[locked,setLocked]=useState(!!s.pin)
 if(locked&&s.pin)return <Screen onOk={()=>setLocked(false)}/>
 return <C.Provider value={{lock:()=>s.pin&&setLocked(true)}}>{children}</C.Provider>}
