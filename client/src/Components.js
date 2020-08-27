import Home from './components/Home.vue';
import BoardControl from './components/BoardControl.vue';
import NetworkConfig from './components/NetworkConfig.vue';
import SerialConsole from './components/SerialConsole.vue';
import USBStorage from './components/USBStorage.vue';
import Login from './components/Login.vue';
import Utility from './components/Utility.vue';
import Register from './components/Register.vue';

const components = {
  home: {
    component: Home,
    title: 'Home',
    path: '/',
    meta: { auth: true },
    atMenu: true,
  },

  boardControl: {
    component: BoardControl,
    title: 'Board Control',
    path: '/board-control',
    meta: { auth: true },
    atMenu: true,
  },

  networkConfig: {
    component: NetworkConfig,
    title: 'Network Config',
    path: '/network-config',
    meta: { auth: true },
    atMenu: true,
  },

  serialConsole: {
    component: SerialConsole,
    title: 'Serial Console',
    path: '/serial-console',
    meta: { auth: true },
    atMenu: true,
  },

  usbStorage: {
    component: USBStorage,
    title: 'USB Storage',
    path: '/usb-storage',
    meta: { auth: true },
    atMenu: true,
  },

  utility: {
    component: Utility,
    title: 'Utility',
    path: '/utility',
    meta: { auth: true },
    atMenu: true,
  },

  register: {
    path: '/register',
    component: Register,
  },

  login: {
    path: '/login',
    component: Login,
  },

};
const keys = Object.keys(components);

const routes = [];
keys.forEach((key) => {
  if (components[key].path) {
    routes.push(components[key]);
  }
});


const atMenu = [];
keys.forEach((key) => {
  if (components[key].atMenu) {
    atMenu.push(components[key]);
  }
});

export default routes;
export const menuComponents = atMenu;
