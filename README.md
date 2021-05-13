# log4-microservice
LoggerSDK for Microservices with multiple adapters eg: Pino, Winston, Bunyan.

### Installation
```
  npm install log4-microservice --save
```

### Configuration Required
```
  process.env.SERVICE = 'Payment'; // Name of the microservice
  process.env.LOG_ADAPTER = 'pino'; // any one of the pino, winston, bunyan values
  process.env.LOG_LEVEL = 'debug';
  process.env.LOG_PATH = 'logs'; // log directory path
  process.env.LOG_FILE = 'payment.log'; // log file name
```

### Usage
- Step1 : Configure
```
  // Entry Point of your Microservice
  // server.js
  const { Log4Microservice } = require('log4-microservice');


  // Typescript
  // import { Log4Microservice } from 'log4-microservice'

  //...other initialization code
  function configureLogger() {
    const logOptions = {
      level: process.env.LOG_LEVEL,
      logPath: process.env.LOG_PATH,
      logFile: process.env.LOG_FILE,
  };

  Log4Microservice.setLoggerOptions(logOptions);
  Log4Microservice.addAdapter(process.env.LOG_ADAPTER, Log4Microservice.setAdapter(process.env.LOG_ADAPTER));
}

// should be configured once hence in entry point file
configureLogger();

```
- Step2 : Create instances
```
// mymodule.js
const { Log4Microservice } = require('log4-microservice');
const logger = new Log4Microservice('mymodule');
logger.debug('debug');
logger.info('info');
logger.error(new Error());
logger.log('level', msg, arbitarydata, correlationIdJson)
```

NOTE: scope will be truncated to first 6 chars for formatting.

### CorrelationIds
In order to add the correlationIds often known as MDC (Mapped Domain Context or Context Mapping) related to specific event it can be supplied to any of the loggers API as the last argument. CorrelationId should be a valid JSON Object. Incase if correlationIds are not passed on default correlationIds assigned during instantiation will be used.

#### Motive for implementing MDC
Often when there are lot of microservices and logs are been forwarded it becomes difficult to find the reason for error and sequence of events that might have caused the error. MDC approach helps to group together the events that are related to specific event for eg. Order Checkout failed or Payment Failure on Ecommerce site.As customer is unaware of the internal things it is wise idea to add some related information as correlationIds like { orderID: 101 } so it can be searched quickly.

#### Usage of CorrelationIds
```
 processPayment(orderData) {
   logger.debug(`Processing payment for orderID ${orderData.id}`, { orderId: orderData.id });
 }
```
#### Run Examples
```
  node examples server.js
```

#### Setup Requirement For New Relic Integration
- Install td-agent 4 [Installation](https://docs.fluentd.org/installation/install-by-deb)
- Configure td-agent.conf in /etc/td-agent/td-agent.conf

```
<source>
  @type tail
  path /tmp/logs/payment.log
  tag payment.stdout
  pos_file /tmp/payment.log.pos
  <parse>
    @type json
  </parse>
</source>

<match payment.stdout>
  @type http
  log_level debug
  endpoint https://log-api.eu.newrelic.com/log/v1
  http_method post
  content_type application/json
  headers {"x-license-key":"ENTER_LICENSE_KEY" }
  <format>
      @type json
  </format>
  <buffer>
    flush_interval 2s
  </buffer>
</match>
```

---
HappyCoding :bowtie:
