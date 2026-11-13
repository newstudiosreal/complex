import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
export interface Notif{id:number;msg:string;time:number;read:boolean}
import { pkey } from '../services/storage'
const K=pkey('complex.notif')
const C=createContext<{list:Notif[];notify:(m:string)=>void;clear:()=>void;readAll:()=>void}>(null!)
export const useNotify=()=>useContext(C)
export function NotifyProvider({children}:{children:ReactNode}){
 const [list,setList]=useState<Notif[]>(()=>{try{return JSON.parse(localStorage.getItem(K)||'[]')}catch{return[]}})
 useEffect(()=>{try{localStorage.setItem(K,JSON.stringify(list))}catch{/* quota */}},[list])
 return <C.Provider value={{list,notify:m=>setList(o=>[{id:Date.now(),msg:m,time:Date.now(),read:false},...o].slice(0,30)),clear:()=>setList([]),readAll:()=>setList(o=>o.map(n=>({...n,read:true})))}}>{children}</C.Provider>}
