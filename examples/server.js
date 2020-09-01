process.env.SERVICE     = 'Payment';
process.env.LOG_ADAPTER = 'winston';
process.env.LOG_LEVEL   = 'debug';
process.env.LOG_PATH    = 'logs';
process.env.LOG_FILE    = 'payment.log';

const MLogger = require('../mlogger');
const UserController = require('./controller');

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

const user = {
  "index": 0,
  "guid": "efde7e40-3c28-41c7-b156-e95006737da7",
  "isActive": false,
  "balance": "$1,825.15",
  "picture": "http://placehold.it/32x32",
  "age": 28,
  "eyeColor": "blue",
  "name": "Reyna Hurley",
  "gender": "female",
  "company": "COMBOGEN",
  "email": "reynahurley@combogen.com",
  "phone": "+1 (887) 448-3366",
  "address": "860 Irving Street, Harviell, Pennsylvania, 8294",
  "about": "Elit ex in quis anim non irure exercitation exercitation ea Lorem esse amet labore labore. Reprehenderit pariatur sint qui occaecat amet minim. Veniam sint adipisicing magna ex officia consequat consequat sunt elit.\r\n",
  "registered": "2016-03-30T07:22:36 -06:-30",
  "latitude": 28.308992,
  "longitude": -37.767538,
  "tags": [
    "irure",
    "culpa",
    "anim",
    "exercitation",
    "tempor",
    "ad",
    "id"
  ],
  "friends": [
    {
      "id": 0,
      "name": "Shauna Vazquez"
    },
    {
      "id": 1,
      "name": "Atkinson Larson"
    },
    {
      "id": 2,
      "name": "Cameron Allen"
    }
  ],
  "greeting": "Hello, Reyna Hurley! You have 9 unread messages.",
  "favoriteFruit": "banana"
};

logger.info('serverlog');
// const controller = new UserController();
// controller.doSomething();
logger.debug('serverlog', user, { transaction_id: 1, gateway: 101 });
// logger.error('serverlog', new Error('myerror'));
// const payment = require('./payment');

// new payment().doSomething();
