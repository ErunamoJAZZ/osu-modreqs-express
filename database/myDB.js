const pgp = require('pg-promise')();
const auth = require('../auth');


/* eslint no-console: 0 */

// 5432
// Database connection.
const db = pgp(auth.db);


/**
 * Insert or update if exist before, a beatmap.
 *
 * @param  {[type]}   beatmap item to insert
 * @param  {Function} next    function to excecute after perform the insert.
 * @return {[type]}           a promise.
 */
const insertBeatmap = (beatmap, next) => {
  const insertStament =
      'INSERT INTO beatmap ' +
      '(beatmapset_id, artist, title, creator, bpm, favourite_count) ' +
      'VALUES ($[beatmapset_id], $[artist], $[title], $[creator], $[bpm], $[favourite_count]) ' +
      'ON CONFLICT (beatmapset_id) DO UPDATE SET ' +
      '(artist, title, creator, bpm, favourite_count) = ' +
      '($[artist], $[title], $[creator], $[bpm], $[favourite_count])';

  return db.any(insertStament, beatmap)
    .then(next)
    .catch(error =>
      console.error(`[DATABASE][Error] insertBeatmap( ${beatmap} ).`, error, new Date()));
};

/**
 * Insert a new request for modding.
 *
 * @param  {[type]}   modrequest modreqs object.
 * @param  {Function} next       function to excecute after perform the insert.
 * @return {[type]}              a promise.
 */
const insertModRequest = (modrequest, next) => {
  const insertStament =
    'INSERT INTO mod_request ' +
    '("time", nick, set, beatmap_id) ' +
    'VALUES ($[time], $[nick], $[set], $[beatmap_id])';

  return db.any(insertStament, modrequest)
    .then(next)
    .catch(error =>
      console.error(`[DATABASE][Error] insertModRequest( ${modrequest} ).`, error, new Date()));
};

/**
 * Select the last two days posted maps.
 *
 * @return {[type]} a promise with result.
 */
const selectLastRequests = () => {
  const daysAgo = new Date();
  daysAgo.setDate(daysAgo.getDate() - 2);
  const selectStament =
      'select A.*, B.* from beatmap A, ' +
      '(mod_request B inner join (select beatmap_id, max(id) as id from mod_request group by beatmap_id) as C ' +
      'on B.beatmap_id = C.beatmap_id and B.id = C.id) ' +
      'where ' +
      'B.time > $1 and ' +
      'A.beatmapset_id = B.beatmap_id ' +
      'order by B.time DESC';

  return db.any(selectStament, [daysAgo.toISOString()])
    .catch(error =>
      console.error('[DATABASE][Error] selectLastRequests().', error, new Date()));
};


const deleteOldRequest = () => {
  const monthsAgo = new Date();
  monthsAgo.setMonth(monthsAgo.getMonth() - 2);
  const deleteStament =
      'delete from beatmap A ' +
      'using (mod_request B inner join ( ' +
        'select beatmap_id, max(id) as id from mod_request group by beatmap_id ' +
      ') as C on B.beatmap_id = C.beatmap_id and B.id = C.id) ' +
      'where ' +
      'B.time < $1 and A.beatmapset_id = B.beatmap_id';

  return db.result(deleteStament, [monthsAgo.toISOString()])
    .then(result => console.log('[DATABASE][Log] deleteOldRequest()', result.rowCount))
    .catch(error =>
      console.error('[DATABASE][Error] deleteOldRequest().', error, new Date()));
};

module.exports = {
  insertBeatmap,
  insertModRequest,
  selectLastRequests,
  deleteOldRequest,
  cacheName: 'beatmap_list',
};
