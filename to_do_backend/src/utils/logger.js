/**
 * Minimal structured logger.
 * Emits JSON logs to stdout/stderr so logs remain grep-able and machine-parseable.
 */
class Logger {
  info(obj) {
    console.log(JSON.stringify({ level: 'info', time: new Date().toISOString(), ...obj }));
  }

  error(obj) {
    console.error(JSON.stringify({ level: 'error', time: new Date().toISOString(), ...obj }));
  }
}

module.exports = { Logger };
