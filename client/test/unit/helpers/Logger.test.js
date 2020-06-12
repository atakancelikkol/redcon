
import logger from '../../../src/helpers/Logger';

describe('Logger', () => {
  it('test currentLogLevel', () => {
    expect(logger.currentLogLevel).toBe(logger.LOG_LEVELS.debug); // default level is set to debug
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

  it('tests changing log level debug', () => {
    logger.setLevel('debug');
    expect(logger.currentLogLevel).toBe(logger.LOG_LEVELS.debug);
  });

  it('tests changing log level info', () => {
    logger.setLevel('info');
    expect(logger.currentLogLevel).toBe(logger.LOG_LEVELS.info);
  });

  it('tests changing log level error', () => {
    logger.setLevel('error');
    expect(logger.currentLogLevel).toBe(logger.LOG_LEVELS.error);
  });

  it('tests changing log level default', () => {
    logger.setLevel('debug'); // set to default level debug before the test
    logger.setLevel('defaultlevel'); // no change
    expect(logger.currentLogLevel).toBe(logger.LOG_LEVELS.debug);
  });
});
