import { useCallback, useEffect, useState } from 'react'
import { FM, importFiles, loadFM, saveFM, delBlob, getBlob } from '../services/files'
export function useFM(){
 const [fm,setFm]=useState<FM>({folders:[],files:[]}),[ready,setReady]=useState(false),[error,setError]=useState('')
 useEffect(()=>{loadFM().then(setFm).catch(()=>setError('Impossibile leggere i file salvati.')).finally(()=>setReady(true))},[])
 const update=useCallback(async(f:(m:FM)=>FM)=>{const n=f(fm);setFm(n);try{await saveFM(n)}catch{setError('Salvataggio non riuscito: spazio esaurito?')}},[fm])
 const add=async(list:File[],folder:string|null)=>{try{const n=await importFiles(list,folder);await update(m=>({...m,files:[...m.files,...n]}))}catch{setError('Importazione non riuscita: spazio esaurito o file non leggibile.')}}
 const remove=async(ids:string[])=>{await Promise.all(ids.map(delBlob).map(p=>p.catch(()=>0)));await update(m=>({...m,files:m.files.filter(f=>!ids.includes(f.id))}))}
 return {fm,ready,error,setError,update,add,remove}}
export function useBlobUrl(id:string|null){
 const [u,setU]=useState<string>('');useEffect(()=>{let url='',dead=false;setU('');if(id)getBlob(id).then(b=>{if(b&&!dead){url=URL.createObjectURL(b);setU(url)}});return()=>{dead=true;if(url)URL.revokeObjectURL(url)}},[id]);return u}
