import { Link, Route, Routes } from 'react-router-dom'
import { Calculator as Ca, Clock as Cl, CalendarDays, StickyNote, Images, FileText, Globe, Presentation } from 'lucide-react'
import Calculator from '../apps/Calculator'
import Clock from '../apps/Clock'
import Calendar from '../apps/Calendar'
import Notes from '../apps/Notes'
import Gallery from '../apps/Gallery'
import PDFReader from '../apps/PDFReader'
import Browser from '../apps/Browser'
import Presentations from '../apps/Presentations'
export const APPS=[['calculator','Calculator',Ca],['clock','Clock',Cl],['calendar','Calendar',CalendarDays],['notes','Notes',StickyNote],['gallery','Gallery',Images],['pdf','PDF Reader',FileText],['browser','Browser',Globe],['presentations','Presentations',Presentation]] as const
function Grid(){return <div className="mx-auto max-w-5xl"><h1 className="mb-6 text-4xl font-extrabold">Applications</h1>
 <div className="grid grid-cols-2 gap-4 md:grid-cols-4">{APPS.map(([to,l,I])=><Link key={to} to={to} className="card flex min-h-[160px] flex-col justify-between transition hover:bg-surf active:scale-95"><I size={36} className="text-accent"/><span className="text-lg font-semibold">{l}</span></Link>)}</div></div>}
export default function Applications(){return <Routes><Route index element={<Grid/>}/><Route path="calculator" element={<Calculator/>}/><Route path="clock" element={<Clock/>}/><Route path="calendar" element={<Calendar/>}/><Route path="notes" element={<Notes/>}/><Route path="gallery" element={<Gallery/>}/><Route path="pdf" element={<PDFReader/>}/><Route path="browser" element={<Browser/>}/><Route path="presentations" element={<Presentations/>}/><Route path="*" element={<Grid/>}/></Routes>}
