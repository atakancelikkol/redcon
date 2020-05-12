const AppServer = require('../../src/AppServer');
const Authenticator = require('../../src/Authenticator');
const GPIOController = require('../../src/GPIOController');
const PortConfigController = require('../../src/PortConfigController');
const SerialPortController = require('../../src/SerialPortController');
const USBController = require('../../src/USBController');
const UtilityDataHandler = require('../../src/UtilityDataHandler');

dataHandlers.push(new Authenticator({ sendMessageCallback }));
dataHandlers.push(new GPIOController({ sendMessageCallback }));
const usbController = new USBController({ sendMessageCallback });
dataHandlers.push(usbController);
dataHandlers.push(new SerialPortController({ sendMessageCallback }));
dataHandlers.push(new PortConfigController({ sendMessageCallback }));
dataHandlers.push(new UtilityDataHandler({ sendMessageCallback }));

// Handle mock dataHandlers of other components
jest.mock('../../src/Authenticator');
jest.mock('../../src/GPIOController');
jest.mock('../../src/PortConfigController');
jest.mock('../../src/SerialPortController');
jest.mock('../../src/USBController');
jest.mock('../../src/UtilityDataHandler');

const appServer = new AppServer({ dataHandlers });


/*
describe("AppServer", () => {
  test("should return false", () => {
    expect(authenticator.isAuthRequired()).toBe(false);
  });
  

  it('should return the product', async () => {
    const expectedProduct = {
      id: 1,
      name: 'football',
    };
    const productManager = new ProductManager();
    const mockGetById = jest.fn();
    ProductsClient.prototype.getById = mockGetById;
    mockGetById.mockReturnValue(Promise.resolve(expectedProduct));

    const result = await productManager.getProductToManage(1);

    expect(result.name).toBe('football'); // It passes!
  });


});
*/
