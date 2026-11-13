import { useSettings } from './useSettings'
export const useFmt=()=>{const {s}=useSettings();return (d:Date,sec=false)=>d.toLocaleTimeString('it-IT',{hour:'2-digit',minute:'2-digit',...(sec?{second:'2-digit'}:{}),hour12:s.h12})}
