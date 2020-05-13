import ComponentWithVuex from '../../src/components/SerialConsole.vue'
import store from '../helpers/StoreHelper.js'


describe("ComponentWithVuex", () => {

  it('default baundRate', () => {

    const defaultData = ComponentWithVuex.data()
    expect(defaultData.baudRate).toBe(115200)
  })
  it('default currentSerialDevice', () => {

    const defaultData = ComponentWithVuex.data()
    expect(defaultData.currentSerialDevice).toBe(null)
  })


})