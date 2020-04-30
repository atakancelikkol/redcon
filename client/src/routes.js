import Home from './components/Home'
import BoardControl from './components/BoardControl'
import PortMapping from './components/PortMapping'
import SerialConsole from './components/SerialConsole'
import USBStorage from './components/USBStorage'
import Login from './components/Login'

const routes = [
  { path: '/', component: Home, meta: {auth: true}  },
  { path: '/board-control', component: BoardControl, meta: {auth: true} },
  { path: '/port-mapping', component: PortMapping, meta: {auth: true} },
  { path: '/serial-console', component: SerialConsole, meta: {auth: true} },
  { path: '/usb-storage', component: USBStorage, meta: {auth: true} },
  { path: '/login', name: 'login', component: Login },
];

export default routes;