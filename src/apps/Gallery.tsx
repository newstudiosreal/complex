import { useRef, useState } from 'react'
import { ImagePlus, X, ChevronLeft, ChevronRight } from 'lucide-react'
import AppFrame, { Empty } from '../components/AppFrame'
import { useBlobUrl, useFM } from '../hooks/useFM'
const Img=({id,cls}:{id:string;cls?:string})=>{const u=useBlobUrl(id);return u?<img src={u} alt="" className={cls}/>:<div className={`${cls} animate-pulse bg-surf`}/>}
export default function Gallery(){
 const {fm,ready,error,add}=useFM(),f=useRef<HTMLInputElement>(null),[i,setI]=useState<number|null>(null),imgs=fm.files.filter(x=>x.type.startsWith('image/'))
 return <AppFrame title="Gallery" wide>{error&&<p role="alert" className="mb-3 text-accent">{error}</p>}
  <button className="btn btn-accent mb-4" onClick={()=>f.current?.click()}><ImagePlus/>Importa immagini</button><input ref={f} type="file" accept="image/*" multiple hidden onChange={e=>{add([...e.target.files!],null);e.target.value=''}}/>
  {ready&&!imgs.length?<Empty>Nessuna immagine. Importale qui o dal File Manager: compaiono in entrambi.</Empty>:<div className="grid grid-cols-2 gap-3 md:grid-cols-4">{imgs.map((x,k)=><button key={x.id} onClick={()=>setI(k)} className="overflow-hidden rounded-2xl" aria-label={x.name}><Img id={x.id} cls="aspect-video w-full object-cover"/></button>)}</div>}
  {i!==null&&imgs[i]&&<div className="fixed inset-0 z-50 grid place-items-center bg-black/90 p-6" onClick={()=>setI(null)}><Img id={imgs[i].id} cls="max-h-full max-w-full object-contain"/>
   <button className="btn absolute right-6 top-6" aria-label="Chiudi"><X/></button><button className="btn absolute left-6" aria-label="Precedente" onClick={e=>{e.stopPropagation();setI((i+imgs.length-1)%imgs.length)}}><ChevronLeft/></button><button className="btn absolute right-6" aria-label="Successiva" onClick={e=>{e.stopPropagation();setI((i+1)%imgs.length)}}><ChevronRight/></button></div>}</AppFrame>}
