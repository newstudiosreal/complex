import { useState } from 'react'
import AppFrame from '../components/AppFrame'
const fmt=(r:number)=>Number.isFinite(r)?String(+r.toPrecision(12)):'Errore'
const calc=(a:number,b:number,o:string)=>o==='+'?a+b:o==='−'?a-b:o==='×'?a*b:b===0?NaN:a/b
const KEYS=['C','±','%','÷','7','8','9','×','4','5','6','−','1','2','3','+','0','.','=']
export default function Calculator(){
 const [d,setD]=useState('0'),[acc,setAcc]=useState<number|null>(null),[op,setOp]=useState<string|null>(null),[fresh,setFresh]=useState(true)
 const press=(k:string)=>{
  if(/\d/.test(k)){setD(fresh||d==='0'?k:d+k);setFresh(false)}
  else if(k==='.'){if(fresh){setD('0.');setFresh(false)}else if(!d.includes('.'))setD(d+'.')}
  else if(k==='C'){setD('0');setAcc(null);setOp(null);setFresh(true)}
  else if(k==='±'&&d!=='Errore')setD(fmt(-d))
  else if(k==='%'&&d!=='Errore')setD(fmt(+d/100))
  else if(k==='='){if(op&&acc!==null){setD(fmt(calc(acc,+d,op)));setAcc(null);setOp(null);setFresh(true)}}
  else if('÷×−+'.includes(k)&&d!=='Errore'){if(op&&acc!==null&&!fresh){const r=calc(acc,+d,op);setAcc(r);setD(fmt(r))}else setAcc(+d);setOp(k);setFresh(true)}}
 return <AppFrame title="Calculator"><div className="card mx-auto max-w-sm"><div className="mb-4 truncate rounded-2xl bg-surf p-4 text-right text-5xl font-extrabold tabular-nums" aria-live="polite">{d}</div>
  <div className="grid grid-cols-4 gap-3">{KEYS.map(k=><button key={k} onClick={()=>press(k)} className={`btn !min-h-[72px] text-2xl ${k==='0'?'col-span-2':''} ${'÷×−+='.includes(k)?'btn-accent':''}`}>{k}</button>)}</div></div></AppFrame>}
