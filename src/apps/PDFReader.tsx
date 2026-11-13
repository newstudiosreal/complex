import { useRef, useState } from 'react'
import { FileUp } from 'lucide-react'
import AppFrame, { Empty } from '../components/AppFrame'
import { useBlobUrl, useFM } from '../hooks/useFM'
export default function PDFReader(){
 const {fm,ready,error,add}=useFM(),f=useRef<HTMLInputElement>(null),[id,setId]=useState<string|null>(null),u=useBlobUrl(id),pdfs=fm.files.filter(x=>x.type==='application/pdf')
 return <AppFrame title="PDF Reader" wide>{error&&<p role="alert" className="mb-3 text-accent">{error}</p>}
  <div className="mb-4 flex flex-wrap gap-2"><button className="btn btn-accent" onClick={()=>f.current?.click()}><FileUp/>Apri PDF</button><input ref={f} type="file" accept="application/pdf" hidden onChange={async e=>{const l=[...e.target.files!];e.target.value='';await add(l,null);}}/>
   {pdfs.map(x=><button key={x.id} className={`btn ${id===x.id?'btn-accent':''}`} onClick={()=>setId(x.id)}>{x.name}</button>)}</div>
  {u?<iframe title="PDF" src={u} className="h-[calc(100vh-14rem)] w-full rounded-3xl bg-white"/>:ready&&<Empty>{pdfs.length?'Scegli un PDF dall\u2019elenco.':'Nessun PDF. Aprine uno: resta salvato nel File Manager. La visualizzazione usa il lettore PDF del browser.'}</Empty>}</AppFrame>}
