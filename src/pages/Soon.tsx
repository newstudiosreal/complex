import { Link } from 'react-router-dom'
export default function Soon({title,phase,items}:{title:string;phase:number;items:string}){
 return <div className="mx-auto mt-16 max-w-xl text-center"><h1 className="text-4xl font-extrabold">{title}</h1>
  <p className="mt-4 text-lg text-mute">Questa sezione è prevista nella Fase {phase}: {items}.</p>
  <Link to="/" className="btn btn-accent mt-8">Torna alla Home</Link></div>}
