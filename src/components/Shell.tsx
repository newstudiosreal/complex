import { NavLink, Outlet, Link } from 'react-router-dom'
import { Home, PenTool, GraduationCap, LayoutGrid, Folder, Settings as Cog, PanelLeftClose, PanelLeftOpen, Sun, Moon, Bell, SlidersHorizontal, Focus, LayoutDashboard, Lock } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useSettings } from '../hooks/useSettings'
import { useNotify } from '../hooks/useNotify'
import QuickPanel from './QuickPanel'
import { useFmt } from '../hooks/useFmt'
import { useLock } from '../hooks/useLock'
const NAV=[{to:'/',l:'Home',i:Home},{to:'/whiteboard',l:'Whiteboard',i:PenTool},{to:'/classroom',l:'Classroom',i:GraduationCap},{to:'/apps',l:'Applications',i:LayoutGrid},{to:'/files',l:'Files',i:Folder},{to:'/workspace',l:'Workspace',i:LayoutDashboard},{to:'/settings',l:'Settings',i:Cog}]
export const useClock=()=>{const [d,setD]=useState(new Date());useEffect(()=>{const t=setInterval(()=>setD(new Date()),1000);return()=>clearInterval(t)},[]);return d}
export default function Shell(){
 const {s,set}=useSettings(),d=useClock(),fmt=useFmt(),{lock}=useLock(),{list,clear,readAll}=useNotify(),[p,setP]=useState<null|'n'|'p'|'q'>(null),unread=list.filter(n=>!n.read).length
 useEffect(()=>{const k=(e:KeyboardEvent)=>{if(e.key==='Escape')setP(null)};addEventListener('keydown',k);return()=>removeEventListener('keydown',k)},[])
 const toggle=(x:'n'|'p'|'q')=>{const n=p===x?null:x;setP(n);if(n==='n')readAll()}
 if(s.focus)return <div className="relative h-screen overflow-auto p-8"><Outlet/><button className="btn btn-accent fixed bottom-6 right-6 z-50" onClick={()=>set({focus:false})}><Focus/>Esci da Focus Mode</button>
  <div className="fixed left-6 top-4 text-2xl font-extrabold tabular-nums text-mute">{fmt(d)}</div></div>
 return <div className="flex h-screen">
  <aside className={`flex flex-col gap-2 bg-bg2 p-3 transition-[width] duration-200 ${s.sidebarCollapsed?'w-[84px]':'w-64'}`}>
   <div className="flex items-center gap-3 px-2 py-3"><div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-accent text-xl font-extrabold text-[#090909]">C</div>
    {!s.sidebarCollapsed&&<span className="text-xl font-extrabold tracking-tight">COMPLEX</span>}</div>
   <nav className="flex flex-1 flex-col gap-1">{NAV.filter(n=>!s.hiddenNav.includes(n.to)).map(({to,l,i:I})=>
    <NavLink key={to} to={to} end={to==='/'} title={l} className={({isActive})=>`flex min-h-[56px] items-center gap-4 rounded-2xl px-4 font-semibold transition ${isActive?'bg-accent text-[#090909]':'text-mute hover:bg-surf hover:text-ink'}`}>
     <I size={24} className="shrink-0"/>{!s.sidebarCollapsed&&l}</NavLink>)}</nav>
   <button className="btn" onClick={()=>set({sidebarCollapsed:!s.sidebarCollapsed})} aria-label="Comprimi sidebar">{s.sidebarCollapsed?<PanelLeftOpen/>:<><PanelLeftClose/>Comprimi</>}</button>
  </aside>
  <div className="flex min-w-0 flex-1 flex-col">
   <header className="relative flex h-20 items-center justify-between px-8">
    <div className="text-lg font-semibold tabular-nums">{fmt(d)}</div>
    <div className="flex items-center gap-2">
     <button className="btn" onClick={()=>set({theme:s.theme==='dark'?'light':'dark'})} aria-label="Cambia tema">{s.theme==='dark'?<Sun/>:<Moon/>}</button>
     <button className="btn relative" onClick={()=>toggle('n')} aria-label="Notifiche"><Bell/>{unread>0&&<span className="absolute -right-1 -top-1 grid h-6 w-6 place-items-center rounded-full bg-accent text-xs font-extrabold text-[#090909]">{unread}</span>}</button>
     <button className="btn" onClick={()=>toggle('q')} aria-label="Pannello rapido"><SlidersHorizontal/></button>
     <button className="btn !px-0 w-12 bg-accent text-lg font-extrabold text-[#090909]" onClick={()=>toggle('p')} aria-label="Profilo">{s.avatar||(s.name[0]||'?').toUpperCase()}</button></div>
    {p==='n'&&<div className="absolute right-8 top-20 z-30 w-80 rounded-3xl bg-bg2 p-4 shadow-2xl"><div className="mb-2 flex items-center justify-between"><h2 className="font-extrabold">Notifiche</h2>{list.length>0&&<button className="text-sm text-accent" onClick={clear}>Cancella tutto</button>}</div>
     {list.length===0?<p className="text-mute">Nessuna notifica. Compariranno qui timer scaduti e altri eventi.</p>:list.map(n=><div key={n.id} className="mb-2 rounded-2xl bg-surf p-3"><p>{n.msg}</p><p className="text-xs text-mute">{new Date(n.time).toLocaleString('it-IT')}</p></div>)}</div>}
    {p==='p'&&<div className="absolute right-8 top-20 z-30 w-72 rounded-3xl bg-bg2 p-4 shadow-2xl"><p className="text-xl font-extrabold">{s.name}</p><p className="mb-3 text-sm text-mute">Profilo locale su questo dispositivo</p><Link to="/settings" onClick={()=>setP(null)} className="btn">Modifica profilo</Link>{s.pin&&<button className="btn mt-2 w-full" onClick={()=>{setP(null);lock()}}><Lock/>Blocca interfaccia</button>}</div>}
   </header>
   {(p==='n'||p==='p')&&<div className="fixed inset-0 z-20" onClick={()=>setP(null)}/>}
   <main className="flex-1 overflow-auto px-8 pb-8"><Outlet/></main>
  </div>
  {p==='q'&&<div className="fixed inset-0 z-30" onClick={()=>setP(null)}/>}
  <QuickPanel open={p==='q'} close={()=>setP(null)}/></div>}
