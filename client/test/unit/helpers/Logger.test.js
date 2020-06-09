
import logger from '../../../src/helpers/Logger';

describe('Logger', () => {
  it('test level', () => {
    expect(logger.level).toBe(0);
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
    expect(logger.level).toBe(0);
  });

  it('tests changing log level info', () => {
    logger.setLevel('info');
    expect(logger.level).toBe(1);
  });

  it('tests changing log level error', () => {
    logger.setLevel('error');
    expect(logger.level).toBe(2);
  });

  it('tests changing log level default', () => {
    logger.setLevel('defaultlevel');
    expect(logger.level).toBe(0);
  });
});
