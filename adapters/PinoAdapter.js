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

  debug(log, scope, ...args) {
    super.debug.call(this, log, scope, args);
  }

  info(log, scope, ...args) {
    super.info.call(this, log, scope, args);
  }

  error(log, scope, ...args) {
    super.error.call(this, log, scope, args);
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
