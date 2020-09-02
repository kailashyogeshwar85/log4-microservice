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
    const user = { id: 1, email: 'abc@gmail.com', cart: { id: 1, products: [], active: false } };
    this.logger.debug('usercontroller', user, { user_id: 1 });
  }
}

module.exports = UserController;
