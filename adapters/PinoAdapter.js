const { join, basename }    = require('path');
const Pino                  = require('pino-multi-stream');
const {
  createWriteStream,
  ensureDirSync,
}                           = require('fs-extra');
const BaseLogger            = require('./BaseLogger');

// TODO: LogRotation, Correlation Meta
class PinoAdapter extends BaseLogger {
  constructor(logOptions) {
    super();
    this.env        = process.env.NODE_ENV || process.env.NODE || 'local';
    this.service    = process.env.SERVICE || basename(process.cwd());
    this.zone       = logOptions.zone || 'IN';
    this.logLevel   = logOptions.level;
    this.logOptions = logOptions;
    this.logOptions.logPath = this.logOptions.logPath || join(process.cwd(), 'logs');
    this.logOptions.logFile = this.logOptions.logFile || `${this.service}.log`;
    ensureDirSync(join(this.logOptions.logPath));
    this.configure();
  }

  debug(log, ...args) {
    this.logger.debug({ message: log, event: this.formatMessage(args) });
  }

  info(log, ...args) {
    this.logger.info({ message: log, event: this.formatMessage(args) });
  }

  error(log, ...args) {
    this.logger.error({ message: log.message || log, error: args });
  }

  getWriteableStream() {
    return createWriteStream(join(this.logOptions.logPath, this.logOptions.logFile), { flags: 'a' });
  }

  getTransports() {
    return [
      { level: this.logLevel, stream: process.stdout },
      { level: this.logLevel, stream: this.getWriteableStream() },
    ];
  }

  configure() {
    this.logger = Pino({
      name: this.service,
      level: this.logLevel,
      messageKey: 'message',
      serializers: {
        error: BaseLogger.serializeError,
      },
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
