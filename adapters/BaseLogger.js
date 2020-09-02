const flatten      = require('flatten');
const { format }   = require('winston');
const { Writable } = require('stream');
const bunyan       = require('bunyan');

class BaseLogger {
  // eslint-disable-next-line
  formatMessage(data) {
    return flatten(data)[0] || {};
  }

  debug(log, scope, args = []) {
    this.logger.debug({
      meta: scope,
      message: log,
      correlationIds: args.pop(),
      event: this.formatMessage(args),
    });
  }

  info(log, scope, args = []) {
    this.logger.info({
      meta: scope,
      message: log,
      correlationIds: args.pop(),
      event: this.formatMessage(args),
    });
  }

  error(log, scope, args = []) {
    this.logger.error({
      meta: scope,
      correlationIds: args.pop(),
      message: log.message || log,
      error: BaseLogger.serializeError(args),
    });
  }

  static prettyMessage(log) {
    const colorize = format.colorize({ colors: { info: 'white' } });
    const service  = log.level === 'info'
      ? ` [${log.microservice}] [${log.meta.substr(0, 6)}]`
      : `[${log.microservice}] [${log.meta.substr(0, 6)}]`;
    const mesg  = log.level === 'info' && /^\s+/.test(log.message) ? log.message.substr(1) : log.message;
    return colorize.colorize(
      log.level,
      // eslint-disable-next-line
      `${log.level.toUpperCase()} ${service} ${mesg} ${JSON.stringify(log.event || log.error)} ${JSON.stringify({ correlationIds: log.correlationIds })}`,
    );
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

  static customFormatStream() {
    const ws = new Writable();
    ws.write = (obj) => {
      const log = obj;
      log.level = bunyan.nameFromLevel[obj.level];
      process.stdout.write(BaseLogger.prettyMessage(log));
      process.stdout.write('\n');
    };
    return ws;
  }
}

module.exports = BaseLogger;
