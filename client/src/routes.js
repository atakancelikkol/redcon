import Home from './components/Home.vue';
import BoardControl from './components/BoardControl.vue';
import NetworkConfig from './components/NetworkConfig.vue';
import SerialConsole from './components/SerialConsole.vue';
import USBStorage from './components/USBStorage.vue';
import Login from './components/Login.vue';
import Utility from './components/Utility.vue';

const routes = [
  { path: '/', component: Home, meta: { auth: true } },
  { path: '/board-control', component: BoardControl, meta: { auth: true } },
  { path: '/port-mapping', component: NetworkConfig, meta: { auth: true } },
  { path: '/serial-console', component: SerialConsole, meta: { auth: true } },
  { path: '/usb-storage', component: USBStorage, meta: { auth: true } },
  { path: '/utility', component: Utility, meta: { auth: true } },
  { path: '/login', component: Login },
];

export default routes;
