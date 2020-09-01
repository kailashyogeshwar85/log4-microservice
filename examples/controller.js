const MLogger = require('../mlogger');

class UserController {
  constructor(logger = undefined) {
    if (!logger) {
      this.configureLogger();
    } else {
      this.logger = logger;
    }
  }

  configureLogger() {
    this.logger = new MLogger('userco');
  }

  doSomething() {
    this.logger.debug('usercontroller');
  }
}

module.exports = UserController;
