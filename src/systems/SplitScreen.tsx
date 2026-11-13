import { useState } from 'react'
import { ArrowLeftRight } from 'lucide-react'
import { SplitCtx } from '../components/AppFrame'
import MultiBoard from './MultiBoard'
import Classroom from '../pages/Classroom'
import Files from '../pages/Files'
import Calculator from '../apps/Calculator'
import Clock from '../apps/Clock'
import Calendar from '../apps/Calendar'
import Notes from '../apps/Notes'
import Gallery from '../apps/Gallery'
import PDFReader from '../apps/PDFReader'
import Browser from '../apps/Browser'
import Presentations from '../apps/Presentations'
const R:[string,string,()=>JSX.Element|null][]=[['whiteboard','Whiteboard',MultiBoard],['classroom','Classroom',Classroom],['files','Files',Files],['calculator','Calculator',Calculator],['clock','Clock',Clock],['calendar','Calendar',Calendar],['notes','Notes',Notes],['gallery','Gallery',Gallery],['pdf','PDF Reader',PDFReader],['browser','Browser',Browser],['presentations','Presentations',Presentations]]
const load=():[string,string]=>{try{const v=JSON.parse(localStorage.getItem('complex.split')||'');if(R.some(r=>r[0]===v[0])&&R.some(r=>r[0]===v[1])&&v[0]!==v[1])return v}catch{/* default */}return['whiteboard','notes']}
export default function SplitScreen(){
 const [[a,b],setAb]=useState<[string,string]>(load)
 const set=(x:string,y:string)=>{setAb([x,y]);localStorage.setItem('complex.split',JSON.stringify([x,y]))}
 const sel=(v:string,other:string,on:(x:string)=>void,l:string)=><select aria-label={l} value={v} onChange={e=>on(e.target.value)} className="min-h-[48px] flex-1 rounded-2xl bg-surf px-4 font-semibold">{R.map(([id,n])=><option key={id} value={id} disabled={id===other}>{n}</option>)}</select>
 const C=(id:string)=>{const Comp=R.find(r=>r[0]===id)![2];return <SplitCtx.Provider value={true}><Comp/></SplitCtx.Provider>}
 return <div className="flex h-full flex-col gap-3"><div className="flex items-center gap-2">{sel(a,b,x=>set(x,b),'Applicazione a sinistra')}<button className="btn" aria-label="Scambia" onClick={()=>set(b,a)}><ArrowLeftRight/></button>{sel(b,a,x=>set(a,x),'Applicazione a destra')}</div>
  <div className="flex min-h-0 flex-1 gap-3"><div className="min-w-0 flex-1 overflow-auto rounded-3xl bg-bg2 p-4">{C(a)}</div><div className="min-w-0 flex-1 overflow-auto rounded-3xl bg-bg2 p-4">{C(b)}</div></div></div>}
