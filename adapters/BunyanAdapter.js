const { join, basename } = require('path');
const flatten            = require('flatten');
const Bunyan             = require('bunyan');
const {
  createWriteStream,
  ensureDirSync,
}                        = require('fs-extra');

class BunyanAdapter {
  constructor(logOptions) {
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

  setScope(scope) {
    this.scope = scope;
    this.logger = this.logger.child({
      microservice: this.service,
      zone: this.zone,
      meta: this.getScope(),
      env: this.env,
    });
  }

  // eslint-disable-next-line
  formatMessage(data) {
    return flatten(data)[0] || {};
  }

  debug(log, ...args) {
    this.logger.debug({ message: log, event: this.formatMessage(args) });
  }

  info(log, ...args) {
    this.logger.info({ message: log, event: this.formatMessage(args) });
  }

  error(log, ...args) {
    this.logger.error({ message: log.message || log, error: BunyanAdapter.serializeError(args) });
  }

  getScope() {
    return this.scope.split('/').pop();
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

  static serializeError(error) {
    const err = error.filter((el) => el);
    if (!err) {
      return {};
    }
    if (err && err[0] && err[0] instanceof Error) {
      return { name: err[0].name, reason: err[0].message, stack: err.stack };
    }
    return { name: 'Error', reason: JSON.stringify(err), stack: {} };
  }

  configure() {
    this.logger = Bunyan.createLogger({
      name: this.service,
      level: this.logLevel,
      streams: this.getTransports(),
    });
  }
}

module.exports = BunyanAdapter;
