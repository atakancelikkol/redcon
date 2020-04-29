import Home from './components/Home'
import BoardControl from './components/BoardControl'
import PortMapping from './components/PortMapping'
import SerialConsole from './components/SerialConsole'
import USBStorage from './components/USBStorage'
import Utility from './components/Utility'

const routes = [
  { path: '/', component: Home },
  { path: '/board-control', component: BoardControl },
  { path: '/port-mapping', component: PortMapping },
  { path: '/serial-console', component: SerialConsole },
  { path: '/usb-storage', component: USBStorage },
  { path: '/utility', component: Utility},
];

export default routes;