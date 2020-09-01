const { join, basename } = require('path');
const {
  createLogger,
  transports,
  format,
}                        = require('winston');
const { ensureDirSync }  = require('fs-extra');
const BaseLogger         = require('./BaseLogger');

class WinstonAdapter extends BaseLogger {
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

  debug(log, scope, ...args) {
    super.debug.call(this, log, scope, args);
  }

  info(log, scope, ...args) {
    super.info.call(this, log, scope, args);
  }

  error(log, scope, ...args) {
    super.error.call(this, log, scope, args);
  }

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
