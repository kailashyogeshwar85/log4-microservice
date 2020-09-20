const { join, basename } = require('path');
const Pino = require('pino-multi-stream');
const {
  createWriteStream,
  ensureDirSync,
} = require('fs-extra');
const BaseLogger = require('./BaseLogger');

/**
 * PinoAdapter for logging
 *
 * @class PinoAdapter
 * @classdesc Pino is a minimalist high throughput logging sdk available in NodeJS. {@link https://getpino.io/#/docs/benchmarks| Pino Benchmarks }
 * @extends {BaseLogger}
 */
class PinoAdapter extends BaseLogger {
  /**
   * Creates an instance of PinoAdapter.
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
  * @memberof PinoAdapter
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
  * @memberof PinoAdapter
  */
  info(log, scope, ...args) {
    super.info.call(this, log, scope, args);
  }

  /**
  * Writes/Prints error log event
  *
  * @override
  * @param {any} log - Log Message to be printed
  * @param {scope} scope - Scope (filename) to be used as log originator default: app
  * @param {any} args - Event data to be logged
  * @memberof PinoAdapter
  */
  error(log, scope, ...args) {
    super.error.call(this, log, scope, args);
  }

  /**
  * Returns the writeable stream for writing logs
  *
  * @private
  * @return {WritableStream} - WriteableStream to log file.
  * @memberof PinoAdapter
  */
  getWriteableStream() {
    return createWriteStream(join(this.logOptions.logPath, this.logOptions.logFile), { flags: 'a' });
  }

  /**
   * Gets the logging transports
   *
   * @private
   * @return {Array} - Transport options that will be used by Adapter
   * @memberof PinoAdapter
   */
  getTransports() {
    return [
      { level: this.logLevel, stream: process.stdout },
      { level: this.logLevel, stream: this.getWriteableStream() },
    ];
  }

  /**
   * Configures the Adapter with {@link LogOptions}
   *
   * @public
   * @returns {void} nothing
   * @memberof PinoAdapter
   */
  configure() {
    this.logger = Pino({
      name: this.service,
      level: this.logLevel,
      messageKey: 'message',
      formatters: {
        level: (label) => ({ level: label.toUpperCase() }),
      },
      streams: this.getTransports(),
    });
    this.logger = this.logger.child({
      microservice: this.service,
      zone: this.zone,
      env: this.env,
    });
  }
}

module.exports = PinoAdapter;
