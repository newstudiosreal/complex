import { useState } from 'react'
import { Wifi, Bluetooth, Volume2, Sun, Camera, Timer as Ti, Focus, Settings as Cog, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useSettings } from '../hooks/useSettings'
import { useNotify } from '../hooks/useNotify'
import { Timer } from '../apps/Clock'
export default function QuickPanel({open,close}:{open:boolean;close:()=>void}){
 const {s,set}=useSettings(),{notify}=useNotify(),[msg,setMsg]=useState('')
 const shot=async()=>{close();try{const st=await (navigator.mediaDevices as any).getDisplayMedia({video:true,preferCurrentTab:true});const v=document.createElement('video');v.srcObject=st;await v.play();await new Promise(r=>setTimeout(r,300))
  const c=document.createElement('canvas');c.width=v.videoWidth;c.height=v.videoHeight;c.getContext('2d')!.drawImage(v,0,0);st.getTracks().forEach((t:MediaStreamTrack)=>t.stop())
  const a=document.createElement('a');a.href=c.toDataURL('image/png');a.download='complex-screenshot.png';a.click();notify('Screenshot salvato')}catch{setMsg('Screenshot non disponibile o permesso negato.')}}
 const T=({on,l,I,sim,f}:{on:boolean;l:string;I:typeof Wifi;sim?:boolean;f:()=>void})=><button onClick={f} aria-pressed={on} className={`btn !h-24 flex-col !gap-1 ${on?'btn-accent':''}`}><I/><span>{l}</span>{sim&&<span className="text-[10px] font-normal opacity-70">simulato</span>}</button>
 return <aside aria-hidden={!open} className={`fixed bottom-0 right-0 top-0 z-40 flex w-96 max-w-full flex-col gap-4 overflow-y-auto bg-bg2 p-5 shadow-2xl transition-transform duration-200 ${open?'translate-x-0':'invisible translate-x-full'}`}>
  <div className="flex items-center justify-between"><h2 className="text-2xl font-extrabold">Pannello rapido</h2><button className="btn" aria-label="Chiudi" onClick={close}><X/></button></div>
  <div className="grid grid-cols-3 gap-2"><T on={s.wifi} l="Wi-Fi" I={Wifi} sim f={()=>set({wifi:!s.wifi})}/><T on={s.bt} l="Bluetooth" I={Bluetooth} sim f={()=>set({bt:!s.bt})}/><T on={s.focus} l="Focus" I={Focus} f={()=>{set({focus:!s.focus});close()}}/></div>
  <label className="flex flex-col gap-1"><span className="flex items-center gap-2 font-semibold"><Volume2 size={20}/>Volume {s.volume}% <em className="text-xs font-normal text-mute">(vale per i suoni del timer)</em></span><input type="range" min="0" max="100" value={s.volume} onChange={e=>set({volume:+e.target.value})} className="h-12 accent-[rgb(var(--accent))]"/></label>
  <label className="flex flex-col gap-1"><span className="flex items-center gap-2 font-semibold"><Sun size={20}/>Luminosità {Math.round(s.brightness*100)}% <em className="text-xs font-normal text-mute">(oscura lo schermo)</em></span><input type="range" min="0.5" max="1" step="0.05" value={s.brightness} onChange={e=>set({brightness:+e.target.value})} className="h-12 accent-[rgb(var(--accent))]"/></label>
  <button className="btn" onClick={shot}><Camera/>Screenshot</button>{msg&&<p role="alert" className="text-sm text-accent">{msg}</p>}
  <div className="rounded-3xl bg-surf p-4"><p className="mb-2 flex items-center gap-2 font-semibold"><Ti size={20}/>Timer</p><Timer onEnd={()=>notify('Timer scaduto')}/></div>
  <Link to="/settings" onClick={close} className="btn"><Cog/>Impostazioni</Link>
  <p className="text-xs text-mute">Wi-Fi e Bluetooth sono solo stati simulati: il browser non può controllarli.</p></aside>}
