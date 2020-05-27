class ControllerBase {
  /**
   * Constructor for ControllerBase
   * @param {String} name of the controller
   */
  constructor(name) {
    this.name = name;
    this.sendMessageCallback = () => {};
    this.platformObjects = null;
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

  /**
   * isAuthRequired
   * By default, auth is required for controller classes.
   * If the controller needs to respond to all users, override and return false.
   */
  isAuthRequired() {
    return true;
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
