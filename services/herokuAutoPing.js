const http = require('http');
const funfixExec = require('funfix-exec');

const scheduler = new funfixExec.GlobalScheduler(false);

/**
 * Each 10min, do a ping to the app in heroku.
 */
const pingService = () => {
  scheduler.scheduleAtFixedRate(
    funfixExec.Duration.minutes(1),
    funfixExec.Duration.minutes(10),
    () => http.get('http://modreqs-web.herokuapp.com/api/ping'),
  );
};

module.exports = {
  pingService,
};
