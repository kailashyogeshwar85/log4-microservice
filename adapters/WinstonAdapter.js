const { join, basename } = require('path');
const {
  createLogger,
  transports,
  format,
}                        = require('winston');
const flatten            = require('flatten');
const { ensureDirSync }  = require('fs-extra');

class WinstonAdapter {
  constructor(logOptions) {
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

  // eslint-disable-next-line
  formatMessage(data) {
    return flatten(data)[0] || {};
  }

  debug(log, scope, ...args) {
    this.logger.debug({
      meta: scope,
      message: log,
      event: this.formatMessage(args),
    });
  }

  info(log, scope, ...args) {
    this.logger.info({
      meta: scope,
      message: log,
      event: this.formatMessage(args),
    });
  }

  error(log, scope, ...args) {
    this.logger.error({
      meta: scope,
      message: log.message || log,
      error: WinstonAdapter.serializeError(args),
    });
  }

  static prettyMessage(log) {
    const colorize = format.colorize();
    const service  = log.level === 'info'
      ? ` [${log.microservice}] [${log.meta.substr(0, 6)}]`
      : `[${log.microservice}] [${log.meta.substr(0, 6)}]`;
    const mesg  = log.level === 'info' ? log.message.substr(1) : log.message;
    return colorize.colorize(
      log.level,
      `${log.level.toUpperCase()} ${service} ${mesg} ${JSON.stringify(log.event || log.error)}`,
    );
  }

  getTransports() {
    const consoleOptions = new transports.Console({
      level: this.logLevel,
      format: format.combine(
        format.simple(),
        format.padLevels(),
        format.printf((msg) => WinstonAdapter.prettyMessage(msg)),
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

  static serializeError(error) {
    const err = error.filter((el) => el);
    if (!err) {
      return {};
    }
    if (err && err[0] && err[0] instanceof Error) {
      return { name: err[0].name, reason: err[0].message, stack: err[0].stack };
    }
    return { name: 'Error', reason: JSON.stringify(err), stack: {} };
  }

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
