const PinoAdapter = require('../adapters/PinoAdapter');
const BunyanAdapter = require('../adapters/BunyanAdapter');
const WinstonAdapter = require('../adapters/WinstonAdapter');

/**
 * @description: Will create and return instance of Adapters
 * @exports getAdapter
 * @class LoggerFactory
 */
class LoggerFactory {
  /**
  * Gets the instances of the adapter for defined scope
  * @static
  * @param {('pino'|'winston'|'bunyan')} adapterName - name of adapter to be used for logging
  * @param {logOptions} logOptions - LogOptions for logging
  * @return {LogAdapter} - Instance of Adapter
  * @throws {Error} - LoggerError when invalid adapter is provided.
  * @memberof LoggerFactory
  */
  static getAdapter(adapterName, logOptions) {
    switch (adapterName) {
      case 'pino':
        return new PinoAdapter(logOptions);
      case 'bunyan':
        return new BunyanAdapter(logOptions);
      case 'winston':
        return new WinstonAdapter(logOptions);
      default:
        throw new Error('MLogger: Invalid adapter value');
    }
  }
}

module.exports = LoggerFactory;
