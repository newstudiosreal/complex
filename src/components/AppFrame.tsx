import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { createContext, ReactNode, useContext } from 'react'
export const SplitCtx=createContext(false)
export default function AppFrame({title,children,wide}:{title:string;children:ReactNode;wide?:boolean}){
 const split=useContext(SplitCtx)
 return <div className={`mx-auto ${wide?'max-w-6xl':'max-w-3xl'}`}><div className="mb-6 flex items-center gap-4">{!split&&<Link to="/apps" className="btn" aria-label="Torna alle applicazioni"><ArrowLeft/></Link>}<h1 className="text-4xl font-extrabold">{title}</h1></div>{children}</div>}
export const Empty=({children}:{children:ReactNode})=><div className="card text-center text-mute">{children}</div>
