const auth = require('../auth');
const cache = require('memory-cache');
const request = require('superagent');
const myDB = require('../database/myDB');

/**
 *  Must insert in a Database!
 *
 * @param mapSet array from peppy's api
 * @param nick from requester
 */
function insertMapAndMod(mapSet, nick) {
  // get diffs information
  const modeStaringArray = mapSet
    .map((item) => { // eslint-disable-line
      return {
        difficultyrating: parseFloat(item.difficultyrating),
        version: item.version,
        mode: parseInt(item.mode, 10),
      };
    }) // Order it for mode and stars
    .sort((a, b) =>
      a.mode - b.mode || a.difficultyrating - b.difficultyrating);

  // get first element
  const oneMap = mapSet[0];

  // beatmap object.
  const beatmap = {
    beatmapset_id: parseInt(oneMap.beatmapset_id, 10),
    artist: oneMap.artist,
    title: oneMap.title,
    creator: oneMap.creator,
    bpm: oneMap.bpm,
    favourite_count: oneMap.favourite_count,
  };

  // modrequest object
  const modRequest = {
    time: new Date().toISOString(),
    nick,
    set: JSON.stringify(modeStaringArray),
    beatmap_id: parseInt(oneMap.beatmapset_id, 10),
  };

  // console.log(beatmap, modRequest)
  myDB.insertBeatmap(beatmap, () => {
    console.log('Insertado insertBeatmap.');
    myDB.insertModRequest(modRequest, () => {
      console.log('inserted modrequest.');
      cache.del(myDB.cacheName);
    });
  });
}

/**
 * MOD MY MAPPU PLZ, THX
 *
 * @param nick
 * @param bmType beatmap type. Must be 's' or 'b'.
 * @param bmId map identification.
 */
function modRequetPlz(nick, bmType, bmId) {
  const osuApiKey = auth.osu.key;

  const queryBase = `https://osu.ppy.sh/api/get_beatmaps?k=${osuApiKey}`;
  const queryMapp = `${bmType}=${bmId}`;

  request
    .get(`${queryBase}&${queryMapp}`)
    .end((err, res) => {
      if (res.body.length < 1) {
        console.log('Map does not exist?', queryMapp);
      } else if (bmType === 's') {
        insertMapAndMod(res.body, nick);
      } else {
        request
          .get(queryBase)
          .query({ s: res.body[0].beatmapset_id })
          .end((err2, newRes) => {
            // console.log(new_res.body);
            insertMapAndMod(newRes.body, nick);
          });
      }
    });
}

// modRequetPlz('Eru', 's', 134151);

module.exports = modRequetPlz;
