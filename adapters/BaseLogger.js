class BaseLogger {
  constructor(adapterInstance) {
    this.logger = adapterInstance;
  }

  debug(msg, scope, ) {

  }
  info() {}
  error() {}
  log() {}

  getTransports() { }
  configure() {}

}

module.exports = BaseLogger;
