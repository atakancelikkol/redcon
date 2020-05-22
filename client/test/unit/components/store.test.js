import Vue from 'vue'
import Vuex, { Store, mapActions } from 'vuex';
import WebSocketConnector from '../../../src/WebSocketConnector';
import StorageHelper from '../../../src/helpers/StorageHelper';
import store from '../../../src/store/store';
//import { actions, mutations } from '../../../src/store/store.js'

//let webSocketConnector = new WebSocketConnector();
Vue.use(Vuex);


describe("store", () => {
  it("state of store", () => {
    expect({}).toStrictEqual(store.state.receivedData);
    expect({}).toStrictEqual(store.state.serialData);
    expect(true).toStrictEqual(store.state.isConnected);
    expect(null).toStrictEqual(store.state.user);
    expect('').toStrictEqual(store.state.authStatus);
    expect('').toStrictEqual(store.state.token);
  });

  it("changeGPIOPort of actions", () => {  
    
    /*var store = new Vuex.Store({
      actions, state, mutations
    })*/
    var authData = {
      user : "bora",
      authStatus : true,
      token : "test token"
  } 

    store.dispatch('onDataReceived', authData);

    console.log(store.state.user);

    /*store.dispatch('changeGPIOPort')
      .then(() => expect(webSocketConnector({ store })
      .toHaveBeenCalledTimes(1)
      )*/
  });

});

