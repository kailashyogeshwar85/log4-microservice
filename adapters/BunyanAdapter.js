const { join, basename } = require('path');
const Bunyan = require('bunyan');
const {
  createWriteStream,
  ensureDirSync,
} = require('fs-extra');
const BaseLogger = require('./BaseLogger');

/**
 * Bunyan Adapter for logging
 * @class BunyanAdapter
 * @extends {BaseLogger}
 */
class BunyanAdapter extends BaseLogger {
  /**
   * Creates an instance of BunyanAdapter.
   *
   * @constructor
   * @param {LogOptions} logOptions options for configuring adapter
   */
  constructor(logOptions) {
    super();
    this.env = process.env.NODE_ENV || process.env.NODE || 'local';
    this.service = process.env.SERVICE || basename(process.cwd());
    this.zone = logOptions.zone || 'IN';
    this.logLevel = logOptions.level;
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
   * @memberof BunyanAdapter
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
   * @memberof BunyanAdapter
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
   * @memberof BunyanAdapter
   */
  error(log, scope, ...args) {
    super.error.call(this, log, scope, args);
  }

  /**
   * Returns the writeable stream for writing logs
   *
   * @private
   * @return {WritableStream} - WriteableStream to log file.
   * @memberof BunyanAdapter
   */
  getWriteableStream() {
    return createWriteStream(join(this.logOptions.logPath, this.logOptions.logFile), { flags: 'a' });
  }

  /**
   * Gets the logging transports
   *
   * @private
   * @return {Array} - Transport options that will be used by Adapter
   * @memberof BunyanAdapter
   */
  getTransports() {
    return [
      { level: this.logLevel, type: 'raw', stream: BaseLogger.customFormatStream() },
      { level: this.logLevel, stream: this.getWriteableStream() },
    ];
  }

  /**
   * Configures the Adapter with {@link LogOptions}
   *
   * @public
   * @returns {void} nothing
   * @memberof BunyanAdapter
   */
  configure() {
    this.logger = Bunyan.createLogger({
      name: this.service,
      level: this.logLevel,
      streams: this.getTransports(),
      microservice: this.service,
      zone: this.zone,
      env: this.env,
    });
  }
}

module.exports = BunyanAdapter;
