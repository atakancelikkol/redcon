
import logger from '../../../src/helpers/Logger';

describe('Logger', () => {
  it('test level', () => {
    expect(logger.level).toBe(undefined);
  });

  it('tests info', () => {
    const spyLogger = jest.spyOn(console, 'info');
    logger.info('arg', 123);
    expect(spyLogger).toHaveBeenCalledWith('arg', 123);
    spyLogger.mockClear();
  });

  it('tests error', () => {
    const spyLogger = jest.spyOn(console, 'error');
    logger.error('arg', 123);
    expect(spyLogger).toHaveBeenCalledWith('arg', 123);
    spyLogger.mockClear();
  });

  it('tests debug', () => {
    const spyLogger = jest.spyOn(console, 'debug');
    logger.debug('arg', 123);
    expect(spyLogger).toHaveBeenCalledWith('arg', 123);
    spyLogger.mockClear();
  });
});
