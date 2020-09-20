const { join, basename } = require('path');
const {
  createLogger,
  transports,
  format,
} = require('winston');
const { ensureDirSync } = require('fs-extra');
const BaseLogger = require('./BaseLogger');

/**
 * WinstonAdapter for logging
 * @class WinstonAdapter
 * @extends BaseLogger
 */
class WinstonAdapter extends BaseLogger {
  /**
   * Creates an instance of WinstonAdapter.
   * @constructor
   * @param {LogOptions} logOptions options for configuring adapter
   */
  constructor(logOptions) {
    super(logOptions);
    this.env = process.env.NODE_ENV || process.env.NODE || 'local';
    this.service = process.env.SERVICE || basename(process.cwd());
    this.zone = logOptions.zone || 'IN';
    this.logLevel = logOptions.level || 'debug';
    this.logOptions = logOptions;
    this.logOptions.logPath = this.logOptions.logPath || join(process.cwd(), 'logs');
    this.logOptions.logFile = this.logOptions.logFile || `${this.service}.log`;
    ensureDirSync(join(this.logOptions.logPath));
    this.configure();
  }

  /**
   * Writes/Prints debug log event
   *
   * @override
   * @param {any} log - Log Message to be printed
   * @param {scope} scope - Scope (filename) to be used as log originator default: app
   * @param {any} args - Event data to be logged
   * @memberof WinstonAdapter
  */
  debug(log, scope, ...args) {
    super.debug.call(this, log, scope, args);
  }

  /**
   * Writes/Prints info log event
   *
   * @override
   * @param {any} log - Log Message to be printed
   * @param {scope} scope - Scope (filename) to be used as log originator default: app
   * @param {any} args - Event data to be logged
   * @memberof WinstonAdapter
   */
  info(log, scope, ...args) {
    super.info.call(this, log, scope, args);
  }

  /**
  * Writes and prints error event log
  *
  * @override
  * @param {any} log - Log Message to be printed
  * @param {scope} scope - Scope (filename) to be used as log originator default: app
  * @param {any} args - Event data to be logged
  * @memberof WinstonAdapter
  */
  error(log, scope, ...args) {
    super.error.call(this, log, scope, args);
  }

  /**
   * Returns the transports for logging ie. Stdout, FileStream
   * @private
   * @return {Object} Stdout, FileTransport configurations
   * @memberof WinstonAdapter
   */
  getTransports() {
    const consoleOptions = new transports.Console({
      level: this.logLevel,
      format: format.combine(
        format.simple(),
        format.padLevels(),
        format.printf((msg) => BaseLogger.prettyMessage(msg)),
      ),
      handleExceptions: this.env === 'production',
    });

    const fileOptions = new transports.File({
      name: this.service,
      filename: join(this.logOptions.logPath, this.logOptions.logFile),
      handleExceptions: false,
      maxFiles: this.logOptions.maxFiles || 10,
      maxsize: this.logOptions.maxSize || 10e5,
      tailable: true,
      level: this.logLevel,
    });
    return { consoleOptions, fileOptions };
  }

  /**
   * Configures the Adapter with {@link LogOptions}
   *
   * @public
   * @returns {void} nothing
   * @memberof WinstonAdapter
   */
  configure() {
    const transportOptions = this.getTransports();
    this.logger = createLogger({
      name: this.service,
      level: this.logLevel,
      transports: [
        transportOptions.consoleOptions,
        transportOptions.fileOptions,
      ],
    });
    this.logger = this.logger.child({
      microservice: this.service,
      zone: this.zone,
      env: this.env,
    });
  }
}

module.exports = WinstonAdapter;
