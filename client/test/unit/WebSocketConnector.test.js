import ReconnectingWebSocket from 'reconnecting-websocket';
import StorageHelper from '../../src/helpers/StorageHelper';
import webSocketConnector from '../../src/WebSocketConnector';

let lastCalledActionString = '';
let lastCalledActionParameter = undefined;
const mockStore = {
  dispatch: (actionString, parameter) => {
    lastCalledActionString = actionString;
    lastCalledActionParameter = parameter;
  }
}

jest.mock('reconnecting-websocket');

describe("WebSocketConnector", () => {
  it("should initialize correctly.", () => {
    expect(webSocketConnector.connectionSocket).not.toBe(undefined);
    expect(typeof webSocketConnector.connectionSocket.onopen).toBe('function');
    expect(typeof webSocketConnector.connectionSocket.onmessage).toBe('function');
    expect(typeof webSocketConnector.connectionSocket.onclose).toBe('function');
  });

  it("checks vuex plugin.", () => {
    const vuexPluginFunction = webSocketConnector.getVuexPlugin();
    const registerSpy = jest.spyOn(webSocketConnector, 'registerStore');
    expect(webSocketConnector.store).toBe(undefined);
    vuexPluginFunction(mockStore);
    expect(registerSpy).toHaveBeenCalledWith(mockStore);
  });

  it("checks register store.", () => {
    expect(webSocketConnector.store).toBe(mockStore);
    expect(() => {
      webSocketConnector.registerStore(mockStore);
    }).toThrow('store is already registered!');
  });

  it("checks websocket url", () => {
    process.env.NODE_ENV = 'debug';
    delete window.location;
    window.location = {
      protocol: 'http:',
      host: 'testhost'
    };
    expect(webSocketConnector.getWebSocketURL()).toBe('ws://localhost:3000');

    process.env.NODE_ENV = 'production';
    expect(webSocketConnector.getWebSocketURL()).toBe('ws://testhost');

    window.location = {
      protocol: 'https:',
      host: 'testhost'
    };
    expect(webSocketConnector.getWebSocketURL()).toBe('wss://testhost');
  });

  it("checks onOpen handler.", () => {
    expect(lastCalledActionString).toBe('');
    expect(lastCalledActionParameter).toBe(undefined);

    const sendStoredTokenSpy = jest.spyOn(webSocketConnector, 'sendStoredToken');
    webSocketConnector.onOpen();

    expect(lastCalledActionString).toBe('updateConnectionStatus');
    expect(lastCalledActionParameter).toBe(true);
    expect(sendStoredTokenSpy).toHaveBeenCalled();
  });

  it("checks sendStoredToken", () => {
    StorageHelper.setItem('token', 'testdata');
    webSocketConnector.sendStoredToken();
    expect(webSocketConnector.connectionSocket.send).toHaveBeenCalledWith('{"auth":{"action":"checkStoredToken","storedToken":"testdata"}}');
  });
});

