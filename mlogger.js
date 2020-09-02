const { sep }        = require('path');
const LoggerFactory  = require('./factory/LoggerFactory');

class MLogger {
  // for multiple adapters
  static defaultScope  = 'app';

  static AdapterMap    = new Map();

  static LogOptions    = { };

  static AdapterName   = '';

  static Adapter = null;

  constructor(scope, context) {
    this.scope = MLogger.parsePathToScope(scope || MLogger.defaultScope);
    this.context = (context && typeof context === 'object' && !Array.isArray(context)) ? context : { };
  }

  static addAdapter(adapterName, adapterInstance) {
    MLogger.AdapterMap.set(adapterName, adapterInstance);
  }

  static setAdapter(adapterName = 'pino') {
    MLogger.AdapterName = adapterName;
    MLogger.Adapter = LoggerFactory.getAdapter(adapterName, MLogger.LogOptions);
    return MLogger.Adapter;
  }

  static setLoggerOptions(logOptions) {
    if (!logOptions.logPath || !logOptions.logFile || !logOptions.level) {
      throw new Error('MLogger: Missing logOptions logPath, logFilePath or level');
    }
    MLogger.LogOptions = logOptions;
  }

  static parsePathToScope(scopePath) {
    return scopePath.replace(process.cwd(), '')
      .replace(`${sep}src${sep}`, '')
      .replace(`${sep}dist${sep}`, '')
      .replace('.js', '')
      .replace(sep, '')
      .split('/')
      .pop();
  }

  static getAdapter() {
    return MLogger.AdapterName;
  }

  debug(msg, arg, correlationIds) {
    this.log('debug', msg, this.scope, arg, correlationIds);
  }

  info(msg, arg, correlationIds) {
    this.log('info', msg, this.scope, arg, correlationIds);
  }

  error(msg, arg, correlationIds) {
    this.log('error', msg, this.scope, arg, correlationIds);
  }

  log(level = 'debug', msg, scope = this.scope, args, correlationIds = {}) {
    if (!MLogger.Adapter) {
      throw new Error('MLogger not configured');
    }
    if (MLogger.Adapter) {
      this.adapter = MLogger.AdapterMap.get(MLogger.AdapterName);
    }
    this.adapter[level](msg, scope, args, { ...correlationIds, ...this.context });
  }
}

module.exports = MLogger;
