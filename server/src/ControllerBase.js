class ControllerBase {
  /**
   * Constructor for ControllerBase
   * @param {String} name of the controller
   */
  constructor(name) {
    this.name = name;
    this.sendMessageCallback = () => {};
    this.platformObjects = null;
    this.dataStorage = null;
    this.httpServer = null;
  }

  /**
   * init
   * init method is called right after initiated.
   */
  init() {

  }

  /**
   * Registers send message callback
   * @param {Function} callback
   */
  registerSendMessageCallback(callback) {
    this.sendMessageCallback = callback;
  }

  /**
   * Registers platform objects instance
   * @param {Object} platformObjects
   */
  registerPlatformObjects(platformObjects) {
    if (this.platformObjects) {
      throw new Error('platformObjects is already defined!');
    }

    this.platformObjects = platformObjects;
  }

  registerDataStorage(dataStorage) {
    if (this.dataStorage) {
      throw new Error('dataStorage is already defined!');
    }

    this.dataStorage = dataStorage;
  }

  registerHttpServer(httpServer) {
    if (this.httpServer) {
      throw new Error('httpServer is already defined!');
    }

    this.httpServer = httpServer;
  }

  /**
   * isAuthRequired
   * By default, auth is required for controller classes.
   * If the controller needs to respond to all users, override and return false.
   */
  isAuthRequired() {
    return true;
  }

  /**
   * onConnectionClosed
   * onConnectionClosed is called by HttpServer when a new client connection is closed.
   * If the controller needs to make arrangements when closing connection, override this function.
   */
  onConnectionClosed(/* clients */) {

  }

  /**
   * appendData
   * appendData is called by HttpServer when a new client is connected.
   * If the controller needs to send data to every new client, override this function.
   */
  appendData(/* obj */) {

  }

  /**
   * handleMessage
   * This method is called by HttpServer when new data is received from a client.
   */
  handleMessage(/* obj, client */) {

  }

  /**
   * onExit
   * This method is called right before the server process exits.
   */
  onExit() {

  }
}

module.exports = ControllerBase;
