import { useEffect, useRef, useState } from 'react'
import { FolderPlus, Upload, Star, Trash2, Folder as Fo, FileText, Image as Im, File as Fl, Search, Download, X, ChevronRight } from 'lucide-react'
import { useBlobUrl, useFM } from '../hooks/useFM'
import { FFile, getBlob } from '../services/files'
import { Empty } from '../components/AppFrame'
const size=(n:number)=>n>1048576?(n/1048576).toFixed(1)+' MB':Math.max(1,Math.round(n/1024))+' KB'
function Thumb({f}:{f:FFile}){const u=useBlobUrl(f.type.startsWith('image/')?f.id:null);return u?<img src={u} alt="" className="h-28 w-full rounded-2xl object-cover"/>:<div className="grid h-28 place-items-center rounded-2xl bg-surf text-mute">{f.type==='application/pdf'?<FileText size={36}/>:f.type.startsWith('image/')?<Im size={36}/>:<Fl size={36}/>}</div>}
function Preview({f,close}:{f:FFile;close:()=>void}){
 const u=useBlobUrl(f.id),[t,setT]=useState('')
 useEffect(()=>{if(f.type.startsWith('text/'))getBlob(f.id).then(b=>b?.text()).then(x=>setT(x||''))},[f])
 return <div className="fixed inset-0 z-50 flex flex-col gap-3 bg-black/90 p-6"><div className="flex items-center gap-3"><h2 className="flex-1 truncate text-xl font-extrabold text-white">{f.name}</h2>
  {u&&<a className="btn" href={u} download={f.name}><Download size={20}/>Scarica</a>}<button className="btn" aria-label="Chiudi" onClick={close}><X/></button></div>
  <div className="grid flex-1 place-items-center overflow-auto">{f.type.startsWith('image/')&&u&&<img src={u} alt={f.name} className="max-h-full max-w-full object-contain"/>}
   {f.type==='application/pdf'&&u&&<iframe title={f.name} src={u} className="h-full w-full rounded-2xl bg-white"/>}
   {f.type.startsWith('text/')&&<pre className="max-h-full w-full overflow-auto whitespace-pre-wrap rounded-2xl bg-bg2 p-6 text-white">{t}</pre>}
   {!/^(image\/|text\/|application\/pdf)/.test(f.type)&&<p className="text-white">Anteprima non disponibile per questo tipo di file: usa Scarica.</p>}</div></div>}
export default function Files(){
 const {fm,ready,error,setError,update,add,remove}=useFM(),inp=useRef<HTMLInputElement>(null)
 const [dir,setDir]=useState<string|null>(null),[tab,setTab]=useState<'all'|'fav'|'recent'>('all'),[q,setQ]=useState(''),[prev,setPrev]=useState<FFile|null>(null)
 const path=(()=>{const p=[];let c=dir;while(c){const f=fm.folders.find(x=>x.id===c);if(!f)break;p.unshift(f);c=f.parent}return p})()
 let files=fm.files,folders=fm.folders.filter(x=>x.parent===dir)
 if(q.trim()){files=files.filter(f=>f.name.toLowerCase().includes(q.toLowerCase()));folders=fm.folders.filter(x=>x.name.toLowerCase().includes(q.toLowerCase()))}
 else if(tab==='fav'){files=files.filter(f=>f.fav);folders=[]}
 else if(tab==='recent'){files=files.filter(f=>f.opened).sort((a,b)=>b.opened-a.opened).slice(0,20);folders=[]}
 else files=files.filter(f=>f.folder===dir)
 const open=(f:FFile)=>{setPrev(f);update(m=>({...m,files:m.files.map(x=>x.id===f.id?{...x,opened:Date.now()}:x)}))}
 const newFolder=()=>{const n=prompt('Nome della cartella');if(n?.trim())update(m=>({...m,folders:[...m.folders,{id:crypto.randomUUID(),name:n.trim(),parent:dir}]}))}
 const delFolder=(id:string)=>{if(!confirm('Eliminare la cartella e tutto il suo contenuto?'))return;const ids=new Set([id]);let n=0;while(ids.size!==n){n=ids.size;fm.folders.forEach(f=>f.parent&&ids.has(f.parent)&&ids.add(f.id))}
  remove(fm.files.filter(f=>f.folder&&ids.has(f.folder)).map(f=>f.id)).then(()=>update(m=>({...m,folders:m.folders.filter(f=>!ids.has(f.id))})))}
 return <div className="mx-auto max-w-6xl"><h1 className="mb-4 text-4xl font-extrabold">Files</h1>
  {error&&<p role="alert" className="mb-3 text-accent" onClick={()=>setError('')}>{error}</p>}
  <div className="mb-4 flex flex-wrap items-center gap-2"><button className="btn btn-accent" onClick={()=>inp.current?.click()}><Upload/>Importa file</button><input ref={inp} type="file" multiple hidden onChange={e=>{add([...e.target.files!],dir);e.target.value=''}}/>
   <button className="btn" onClick={newFolder}><FolderPlus/>Nuova cartella</button>
   {(['all','fav','recent'] as const).map(t=><button key={t} className={`btn ${tab===t&&!q?'btn-accent':''}`} onClick={()=>{setTab(t);setQ('')}}>{t==='all'?'Tutti':t==='fav'?'Preferiti':'Recenti'}</button>)}
   <label className="flex min-h-[48px] flex-1 items-center gap-2 rounded-2xl bg-surf px-4"><Search size={20}/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Cerca per nome" className="w-full bg-transparent outline-none"/></label></div>
  {tab==='all'&&!q&&<div className="mb-4 flex flex-wrap items-center gap-1 text-lg"><button className="btn !min-h-[40px]" onClick={()=>setDir(null)}>Tutti i file</button>{path.map(p=><span key={p.id} className="flex items-center"><ChevronRight size={18}/><button className="btn !min-h-[40px]" onClick={()=>setDir(p.id)}>{p.name}</button></span>)}</div>}
  {ready&&!files.length&&!folders.length?<Empty>{q?'Nessun risultato per questa ricerca.':tab==='fav'?'Nessun preferito: tocca la stella su un file.':tab==='recent'?'Nessun file aperto di recente.':'Questa cartella è vuota. Importa dei file o crea una cartella.'}</Empty>:
  <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
   {folders.map(f=><div key={f.id} className="card flex flex-col gap-3 !p-4"><button className="flex flex-1 items-center gap-3 text-left text-lg font-semibold" onClick={()=>{setDir(f.id);setQ('');setTab('all')}}><Fo className="text-accent" size={32}/><span className="truncate">{f.name}</span></button>
    <button className="btn !min-h-[40px]" aria-label="Elimina cartella" onClick={()=>delFolder(f.id)}><Trash2 size={18}/></button></div>)}
   {files.map(f=><div key={f.id} className="card flex flex-col gap-2 !p-3"><button onClick={()=>open(f)} aria-label={`Apri ${f.name}`}><Thumb f={f}/></button><p className="truncate font-semibold" title={f.name}>{f.name}</p><p className="text-sm text-mute">{size(f.size)}</p>
    <div className="flex gap-1"><button className={`btn !min-h-[44px] flex-1 ${f.fav?'btn-accent':''}`} aria-label="Preferito" onClick={()=>update(m=>({...m,files:m.files.map(x=>x.id===f.id?{...x,fav:!x.fav}:x)}))}><Star size={18}/></button>
     <select aria-label="Sposta in" value={f.folder??''} onChange={e=>update(m=>({...m,files:m.files.map(x=>x.id===f.id?{...x,folder:e.target.value||null}:x)}))} className="min-h-[44px] w-20 rounded-2xl bg-surf px-2 text-sm"><option value="">Radice</option>{fm.folders.map(x=><option key={x.id} value={x.id}>{x.name}</option>)}</select>
     <button className="btn !min-h-[44px]" aria-label="Elimina" onClick={()=>confirm(`Eliminare ${f.name}?`)&&remove([f.id])}><Trash2 size={18}/></button></div></div>)}</div>}
  {prev&&<Preview f={prev} close={()=>setPrev(null)}/>}</div>}
