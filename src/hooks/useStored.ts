import { useEffect, useRef, useState } from 'react'
import { dbGet, dbSet } from '../services/storage'
export function useStored<T>(key:string,init:T){
 const [v,setV]=useState<T>(init),[ready,setReady]=useState(false),t=useRef<number>()
 useEffect(()=>{dbGet<T>(key).then(d=>{if(d!==undefined)setV(d)}).catch(()=>{}).finally(()=>setReady(true))},[key])
 useEffect(()=>{if(!ready)return;clearTimeout(t.current);t.current=window.setTimeout(()=>{dbSet(key,v).catch(()=>{})},500);return()=>clearTimeout(t.current)},[v,ready,key])
 return [v,setV,ready] as const}
