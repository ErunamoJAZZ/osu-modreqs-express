const pgp = require('pg-promise')();
const auth = require('../auth');


// 5432
// Database connection.
const db = pgp(auth.db);


/**
 * Insert or updat if exist before, a beatmap.
 *
 * @param  {[type]}   beatmap item to insert
 * @param  {Function} next    function to excecute after perform the insert.
 * @return {[type]}           a promise.
 */
function insertBeatmap(beatmap, next) {
  const insertStament =
      'INSERT INTO beatmap ' +
      '(beatmapset_id, artist, title, creator, bpm, favourite_count) ' +
      'VALUES ($[beatmapset_id], $[artist], $[title], $[creator], $[bpm], $[favourite_count]) ' +
      'ON CONFLICT (beatmapset_id) DO UPDATE SET ' +
      '(artist, title, creator, bpm, favourite_count) = ' +
      '($[artist], $[title], $[creator], $[bpm], $[favourite_count])';

  return db.any(insertStament, beatmap)
    .then(next)
    .catch((error) => {
      console.error(new Date(), `Error insertBeatmap( ${beatmap} ).`, error);
    });
}

/**
 * Insert a new request for modding.
 *
 * @param  {[type]}   modrequest modreqs object.
 * @param  {Function} next       function to excecute after perform the insert.
 * @return {[type]}              a promise.
 */
function insertModRequest(modrequest, next) {
  const insertStament =
    'INSERT INTO mod_request ' +
    '("time", nick, set, beatmap_id) ' +
    'VALUES ($[time], $[nick], $[set], $[beatmap_id])';

  return db.any(insertStament, modrequest)
    .then(next)
    .catch((error) => {
      console.error(new Date(), `Error insertModRequest( ${modrequest} ).`, error);
    });
}

/**
 * Select the last two days posted maps.
 *
 * @return {[type]} a promise with result.
 */
function selectLastRequests() {
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
    .catch((error) => {
      console.error(new Date(), 'Error selectLastRequests().', error);
    });
}

module.exports = {
  insertBeatmap,
  insertModRequest,
  selectLastRequests,
  cacheName: 'beatmap_list',
};
