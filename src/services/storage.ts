import { DEFAULTS, Settings } from '../types'
// Ogni profilo ha settings, notifiche e database IndexedDB propri.
export const pid=()=>localStorage.getItem('complex.profile')||'default'
export const pkey=(b:string,id=pid())=>id==='default'?b:`${b}.${id}`
const dbName=(id=pid())=>id==='default'?'complex':'complex-'+id
export const loadSettings=():Settings=>{try{return {...DEFAULTS,...JSON.parse(localStorage.getItem(pkey('complex.settings'))||'{}')}}catch{return DEFAULTS}}
export const saveSettings=(s:Settings)=>{try{localStorage.setItem(pkey('complex.settings'),JSON.stringify(s))}catch{/* quota */}}
const open=()=>new Promise<IDBDatabase>((res,rej)=>{const r=indexedDB.open(dbName(),1);r.onupgradeneeded=()=>r.result.createObjectStore('kv');r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)})
export const dbSet=async(k:string,v:unknown)=>{const d=await open();return new Promise<void>((res,rej)=>{const t=d.transaction('kv','readwrite');t.objectStore('kv').put(v,k);t.oncomplete=()=>res();t.onerror=()=>rej(t.error)})}
export const dbGet=async<T,>(k:string)=>{const d=await open();return new Promise<T|undefined>((res,rej)=>{const r=d.transaction('kv').objectStore('kv').get(k);r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)})}
export const dbDel=async(k:string)=>{const d=await open();return new Promise<void>((res,rej)=>{const t=d.transaction('kv','readwrite');t.objectStore('kv').delete(k);t.oncomplete=()=>res();t.onerror=()=>rej(t.error)})}
export const usage=async()=>{try{const e=await navigator.storage.estimate();return {used:e.usage??0,quota:e.quota??0}}catch{return {used:0,quota:0}}}
const wipe=(id:string)=>{localStorage.removeItem(pkey('complex.settings',id));localStorage.removeItem(pkey('complex.notif',id));indexedDB.deleteDatabase(dbName(id))}
export const resetAll=async()=>wipe(pid())
export const profileIds=():string[]=>{try{const l:string[]=JSON.parse(localStorage.getItem('complex.profiles')||'[]');return l.includes('default')?l:['default',...l]}catch{return['default']}}
export const profileName=(id:string)=>{try{return JSON.parse(localStorage.getItem(pkey('complex.settings',id))||'{}').name||'Docente'}catch{return 'Docente'}}
export const createProfile=(name:string)=>{const id=crypto.randomUUID().slice(0,8);localStorage.setItem('complex.profiles',JSON.stringify([...profileIds(),id]));localStorage.setItem(pkey('complex.settings',id),JSON.stringify({...DEFAULTS,name}));return id}
export const switchProfile=(id:string)=>{localStorage.setItem('complex.profile',id);location.reload()}
export const deleteProfile=(id:string)=>{wipe(id);localStorage.setItem('complex.profiles',JSON.stringify(profileIds().filter(x=>x!==id)))}
