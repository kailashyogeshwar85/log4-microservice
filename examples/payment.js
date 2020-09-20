const MLogger = require('../logger');

class PaymentController {
  constructor(logger = undefined) {
    if (!logger) {
      this.configureLogger();
    } else {
      this.logger = logger;
    }
  }

  configureLogger() {
    this.logger = new MLogger(__filename);
    return this;
  }

  doSomething() {
    this.logger.debug('payment', { gateway: 'mobikwik' });
  }
}

module.exports = PaymentController;
