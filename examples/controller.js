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
    this.logger.debug('usercontroller', user, { '1f484c61-4451-4ae3-ab66-24ad662b5f0b': 'correlationid'});
  }
}

module.exports = UserController;
