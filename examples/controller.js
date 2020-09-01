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
    this.logger = new MLogger(__filename);
  }

  doSomething() {
    this.logger.debug('usercontroller');
  }
}

module.exports = UserController;
