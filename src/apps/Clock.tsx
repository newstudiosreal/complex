import { useEffect, useRef, useState } from 'react'
import AppFrame from '../components/AppFrame'
import { useClock } from '../components/Shell'
import { useFmt } from '../hooks/useFmt'
import { pkey } from '../services/storage'
const mmss=(ms:number)=>{const s=Math.floor(ms/1000),c=Math.floor(ms%1000/10);return `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}.${String(c).padStart(2,'0')}`}
export const beep=()=>{try{const st=JSON.parse(localStorage.getItem(pkey('complex.settings'))||'{}');if(st.sound===false)return;const a=new AudioContext(),o=a.createOscillator(),g=a.createGain();g.gain.value=(st.volume??80)/100;o.connect(g);g.connect(a.destination);o.frequency.value=880;o.start();o.stop(a.currentTime+.6)}catch{/* audio non disponibile */}}
export function Stopwatch(){
 const [ms,setMs]=useState(0),[run,setRun]=useState(false),[laps,setLaps]=useState<number[]>([]),st=useRef(0)
 useEffect(()=>{if(!run)return;st.current=Date.now()-ms;const t=setInterval(()=>setMs(Date.now()-st.current),30);return()=>clearInterval(t)},[run])
 return <div className="text-center"><p className="text-7xl font-extrabold tabular-nums">{mmss(ms)}</p>
  <div className="my-6 flex justify-center gap-3"><button className="btn btn-accent" onClick={()=>setRun(!run)}>{run?'Pausa':'Avvia'}</button><button className="btn" disabled={!run} onClick={()=>setLaps([ms,...laps])}>Giro</button><button className="btn" onClick={()=>{setRun(false);setMs(0);setLaps([])}}>Azzera</button></div>
  {laps.map((l,i)=><p key={i} className="tabular-nums text-mute">Giro {laps.length-i}: {mmss(l)}</p>)}</div>}
export function Timer({onEnd}:{onEnd?:()=>void}){
 const [total,setTotal]=useState(300),[left,setLeft]=useState<number|null>(null),[run,setRun]=useState(false),end=useRef(0)
 useEffect(()=>{if(!run)return;const t=setInterval(()=>{const l=end.current-Date.now();if(l<=0){setLeft(0);setRun(false);beep();onEnd?.()}else setLeft(l)},100);return()=>clearInterval(t)},[run])
 const shown=left??total*1000
 return <div className="text-center"><p className={`text-7xl font-extrabold tabular-nums ${left===0?'text-accent':''}`}>{mmss(shown).slice(0,5)}</p>{left===0&&<p className="mt-2 text-accent" role="status">Tempo scaduto</p>}
  <div className="my-4 flex flex-wrap justify-center gap-2">{[1,5,10,15,30].map(m=><button key={m} className="btn" disabled={run} onClick={()=>{setTotal(m*60);setLeft(null)}}>{m} min</button>)}</div>
  <div className="flex justify-center gap-3"><button className="btn btn-accent" onClick={()=>{if(run){setRun(false)}else{end.current=Date.now()+(left&&left>0?left:total*1000);setLeft(left&&left>0?left:total*1000);setRun(true)}}}>{run?'Pausa':'Avvia'}</button><button className="btn" onClick={()=>{setRun(false);setLeft(null)}}>Azzera</button></div></div>}
export default function Clock(){
 const [tab,setTab]=useState(0),d=useClock(),fmt=useFmt()
 return <AppFrame title="Clock"><div className="card"><div className="mb-8 flex justify-center gap-2">{['Orologio','Cronometro','Timer'].map((t,i)=><button key={t} className={`btn ${tab===i?'btn-accent':''}`} onClick={()=>setTab(i)}>{t}</button>)}</div>
  {tab===0&&<div className="text-center"><p className="text-8xl font-extrabold tabular-nums">{fmt(d,true)}</p><p className="mt-3 text-xl capitalize text-mute">{d.toLocaleDateString('it-IT',{weekday:'long',day:'numeric',month:'long'})}</p></div>}
  {tab===1&&<Stopwatch/>}{tab===2&&<Timer/>}</div></AppFrame>}
