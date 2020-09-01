const { join, basename } = require('path');
const Bunyan             = require('bunyan');
const {
  createWriteStream,
  ensureDirSync,
}                        = require('fs-extra');
const BaseLogger         = require('./BaseLogger');

// TODO: CorelationID
class BunyanAdapter extends BaseLogger {
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
      { level: this.logLevel, type: 'raw', stream: BaseLogger.customFormatStream() },
      { level: this.logLevel, stream: this.getWriteableStream() },
    ];
  }

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
