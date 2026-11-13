import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { Settings } from '../types'
import { loadSettings, saveSettings } from '../services/storage'
type Ctx={s:Settings;set:(p:Partial<Settings>)=>void}
const C=createContext<Ctx>(null!)
export const useSettings=()=>useContext(C)
const rgb=(h:string)=>{const n=parseInt(h.slice(1),16);return `${n>>16} ${(n>>8)&255} ${n&255}`}
export function SettingsProvider({children}:{children:ReactNode}){
 const [s,setS]=useState(loadSettings)
 useEffect(()=>{saveSettings(s);const r=document.documentElement
  r.dataset.theme=s.theme;r.dataset.bg=s.bg;r.dataset.anim=s.anim?'on':'off';r.style.setProperty('--accent',rgb(s.accent));r.style.setProperty('--ui',String(s.ui));r.style.filter=s.brightness<1?`brightness(${s.brightness})`:''},[s])
 return <C.Provider value={{s,set:p=>setS(o=>({...o,...p}))}}>{children}</C.Provider>}
