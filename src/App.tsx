import { HashRouter, Route, Routes } from 'react-router-dom'
import Shell from './components/Shell'
import Home from './pages/Home'
import Settings from './pages/Settings'
import MultiBoard from './systems/MultiBoard'
import Workspace from './systems/Workspace'
import SplitScreen from './systems/SplitScreen'
import Connect from './systems/Connect'
import Applications from './pages/Applications'
import Files from './pages/Files'
import Classroom from './pages/Classroom'
import Soon from './pages/Soon'
export default function App(){
 return <HashRouter><Routes><Route element={<Shell/>}>
  <Route index element={<Home/>}/>
  <Route path="whiteboard" element={<MultiBoard/>}/><Route path="workspace" element={<Workspace/>}/><Route path="split" element={<SplitScreen/>}/><Route path="connect" element={<Connect/>}/>
  <Route path="classroom" element={<Classroom/>}/>
  <Route path="apps/*" element={<Applications/>}/>
  <Route path="files" element={<Files/>}/>
  <Route path="settings" element={<Settings/>}/>
  <Route path="*" element={<Soon title="Pagina non trovata" phase={1} items="usa la sidebar per tornare a una sezione"/>}/>
 </Route></Routes></HashRouter>}
