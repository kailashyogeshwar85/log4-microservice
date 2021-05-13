const { sep } = require('path');
const LoggerFactory = require('./factory/LoggerFactory');

/**
 * Log4Microservice class should be used to configure the adapters. It is the main entry point of SDK.
 *
 * @class
 * @description Class responsible for configuring and managing multiple adapters of LogAdapters
 */
class Log4Microservice {
  /**
  * Creates instance of Logger
  *
  * @constructor
  * @param {scope} [scope=app] scope file scope
  * @param {object} [context={}] correlationIds in json.
  */
  constructor(scope, context) {
    this.scope = Log4Microservice.parsePathToScope(scope || Log4Microservice.defaultScope);
    this.context = (context && typeof context === 'object' && !Array.isArray(context)) ? context : {};
  }

  /**
  * Adds the adapter to Logger's AdapterMap
  *
  * @static
  * @param {string} adapterName name of adapter
  * @param {LogAdapter} adapterInstance instance of adapter
  * @memberof Logger
  * @return {void}
  */
  static addAdapter(adapterName, adapterInstance) {
    Log4Microservice.AdapterMap.set(adapterName, adapterInstance);
  }

  /**
  * Creates and sets the Adapter with Logger
  *
  * @static
  * @param {string} adapterName name of dapter
  * @memberof Logger
  * @return {LogAdapter} Instance of adapter
  */
  static setAdapter(adapterName = 'pino') {
    Log4Microservice.AdapterName = adapterName;
    Log4Microservice.Adapter = LoggerFactory.getAdapter(adapterName, Log4Microservice.LogOptions);
    return Log4Microservice.Adapter;
  }

  /**
  * Will set the loggerOptions once should be called once
  *
  * @static
  * @param {LogOptions} logOptions logOptions
  * @memberof Logger
  * @return {void}
  */
  static setLoggerOptions(logOptions) {
    if (!logOptions.logPath || !logOptions.logFile || !logOptions.level) {
      throw new Error('Log4Microservice: Missing logOptions logPath, logFilePath or level');
    }
    Log4Microservice.LogOptions = logOptions;
  }

  /**
   * Parses the path to scope string
   *
   * @static
   * @param {string} scopePath scope or filename upto 6 chars to be used.
   * @memberof Logger
   * @return {string} return the scope string
   */
  static parsePathToScope(scopePath) {
    return scopePath.replace(process.cwd(), '')
      .replace(`${sep}src${sep}`, '')
      .replace(`${sep}dist${sep}`, '')
      .replace('.js', '')
      .replace(sep, '')
      .split('/')
      .pop();
  }

  /**
  * Gets the name of Adapter configured
  *
  * @static
  * @return {string}
  * @memberof Logger
  * @return {LogAdapter} instance of LogAdapter
  */
  static getAdapter() {
    return Log4Microservice.AdapterName;
  }

  /**
   * Sends a debug log to be printed.
   *
   * @param {any} msg message to be logged
   * @param {any} arg any event data to be logged
   * @memberof Logger
   * @return {void}
   */
  debug(msg, ...arg) {
    this.log('debug', msg, arg, arg.pop());
  }

  /**
   * Sends a info log to be printed.
   *
   * @param {any} msg message to be logged
   * @param {any} arg any event data to be logged
   * @memberof Logger
   * @return {void}
   */
  info(msg, ...arg) {
    this.log('info', msg, arg.pop());
  }

  /**
   * Sends a error log to be printed.
   *
   * @param {any} msg message to be logged
   * @param {Error} error Error stack to be displayed
   * @param {any} arg any event data to be logged
   * @memberof Logger
   * @return {void}
   */
  error(msg, error, ...arg) {
    this.log('error', msg, error, arg.pop());
  }

  /**
   * Will log the events to be recorded.
   *
   * @param {string} [level='debug'] log level defaults to debug
   * @param {any} msg log message to be recorded
   * @param {any} args correlationIds
   * @memberof Logger
   * @return {void}
   */
  log(level = 'debug', msg, ...args) {
    if (!Log4Microservice.Adapter) {
      throw new Error('Log4Microservice not configured');
    }
    if (Log4Microservice.Adapter) {
      this.adapter = Log4Microservice.AdapterMap.get(Log4Microservice.AdapterName);
    }

    if (!this.adapter[level]) {
      msg = level;
      level = 'info';
    }
    this.adapter[level](msg, this.scope, args, { ...args.pop(), ...this.context });
  }
}

/**
  *
  * defaultScope for Logger
  *
  * @type {scope}
  * @static
  * @memberof Logger
  */
Log4Microservice.defaultScope = 'app';

/**
  *
  * Map containing adapter instances
  * @type {Map<LogAdapter>}
  * @static
  * @memberof Log4Microservice
  */
Log4Microservice.AdapterMap = new Map();

/**
  * LogOptions to use for creating logs
  *
  * @static
  * @type {LogOptions}
  * @memberof Log4Microservice
  */
Log4Microservice.LogOptions = {};

/**
 * Adapter Name to be used for Logging
 *
 * @static
 * @type {string}
 * @memberof Log4Microservice
 */
Log4Microservice.AdapterName = '';

/**
 * @type {LogAdapter}
 * @static
 */
Log4Microservice.Adapter = null;

module.exports = {
  Log4Microservice,
};
