const funfixExec = require('funfix-exec');
const myDB = require('../database/myDB');

const scheduler = new funfixExec.GlobalScheduler(false);


/**
 * Each day, clean old maps from DB. This proccess is because Heroku's limit in postgres.
 */
const cleanerService = () => {
  scheduler.scheduleAtFixedRate(
    funfixExec.Duration.hours(12),
    funfixExec.Duration.days(1),
    () => myDB.deleteOldRequest(),
  );
};

module.exports = {
  cleanerService,
};
