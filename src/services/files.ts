import { dbDel, dbGet, dbSet } from './storage'
export interface FFile{id:string;name:string;type:string;size:number;folder:string|null;fav:boolean;opened:number;created:number}
export interface Folder{id:string;name:string;parent:string|null}
export interface FM{folders:Folder[];files:FFile[]}
export const loadFM=async():Promise<FM>=>(await dbGet<FM>('fm'))||{folders:[],files:[]}
export const saveFM=(m:FM)=>dbSet('fm',m)
export const getBlob=(id:string)=>dbGet<Blob>('blob:'+id)
export const delBlob=(id:string)=>dbDel('blob:'+id)
export async function importFiles(list:File[],folder:string|null):Promise<FFile[]>{
 const out:FFile[]=[];for(const f of list){const id=crypto.randomUUID();await dbSet('blob:'+id,f);out.push({id,name:f.name,type:f.type||'application/octet-stream',size:f.size,folder,fav:false,opened:0,created:Date.now()})}return out}
