process.env.SERVICE     = 'Payment';
process.env.LOG_ADAPTER = 'winston';
process.env.LOG_LEVEL   = 'debug';
process.env.LOG_PATH    = 'logs';
process.env.LOG_FILE    = 'payment.log';

const MLogger = require('../logger');
const UserController = require('./controller');
const Payment = require('./payment');

function configureLogger() {
  const logOptions = {
    level: process.env.LOG_LEVEL,
    logPath: process.env.LOG_PATH,
    logFile: process.env.LOG_FILE,
  };

  MLogger.setLoggerOptions(logOptions);
  MLogger.addAdapter(process.env.LOG_ADAPTER, MLogger.setAdapter(process.env.LOG_ADAPTER));
}
configureLogger();

const logger = new MLogger(__filename);


logger.log('debug', 'starting to listen for new job on queue: payments');

const Job = require('./job');

let JOB_ID = 0;
let USER_ID = 0;

const getJob = () => ({
  type: 'payment',
  gateway: 'mobikwik',
  transaction_id: `T${Date.now()}`,
  id: ++JOB_ID,
  amount: Math.floor(Math.random(1, 10000) * 10e3),
  user_id: ++USER_ID,
});

setInterval(() => {
  new Job(getJob()).processJob();
}, 2000);

logger.info('Initilazling user controller');
logger.info('do something');

const user = new UserController();

user.doSomething();

logger.error(new Error('GatewayError: Failed to process payment transaction'));

setInterval(() => {
  new Payment().configureLogger().doSomething();
}, 3000);
