const MLogger = require('../mlogger');

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
  }

  doSomething() {
    this.logger.debug('payment', { gateway: 'mobikwik' });
  }
}

module.exports = PaymentController;
