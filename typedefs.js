/**
 * @namespace typedefs
*/

/**
 * @typedef {string} scope filename to be used as scope for logging.
 */

/**
 * @typedef  {object} LogOptions
 * @property {string} level  Log Level DEBUG, INFO, ERROR
 * @property {string}  logPath Logs directory path
 * @property {string}  logFile Log file name
*/

/**
 * @typedef {Function} debug
 * @param {any} log log message to be written
 * @param {string} scope filename to be used in log
 * @param {any} args any additional data to be logged
 */

/**
 * @typedef {Function} info
 * @param {any} log log message to be written
 * @param {string} scope filename to be used in log
 * @param {any} args any additional data to be logged
 */

/**
 * @typedef {Function} error
 * @param {any} log log message to be written
 * @param {string} scope filename to be used in log
 * @param {any} args any additional data to be logged
 */

/**
 * BaseLogger definition
 * @typedef {class} BaseLogger creates a logger instance
 * @property {Function} formatMessage formats a message
 * @property {debug} debug logs a debug event
 * @property {info} info logs a info event
 * @property {error} info logs error event
 * @property {Function} preetyMessage returns the colorized formatted string
 * @property {Function} serializeError serializes an error stack
 * @property {Function} customFormat returns the writeable stream to log data
 */

/**
 * @typedef  {class} LogAdapter LogAdapter
 * @property {Function} debug creating debug logs
 * @property {Function} info creating info logs
 * @property {Function} error creating error logs
 * @property {Function} getTransports Returns the transport for writing the logs
 * @property {Function} configure Configures the adapter with specified configuration.
 *
 */
