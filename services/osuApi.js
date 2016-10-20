var request = require('superagent');
var myDB = require('../database/myDB');
var auth = require('../auth');

/**
 *  Must insert in a Database!
 *
 * @param mapSet array from peppy's api
 * @param nick from requester
 */
function insertMapAndMod(mapSet, nick) {
    // get diffs information
    var modeStaringArray = mapSet
        .map(function (item) {
            return {
                difficultyrating: parseFloat(item.difficultyrating),
                version: item.version,
                mode: parseInt(item.mode, 10)
            };
        }) //Order it for mode and stars
        .sort(function (a, b) {
            return a.mode - b.mode || a.difficultyrating - b.difficultyrating;
        });

    //get first element
    var oneMap = mapSet[0];

    //beatmap object.
    var beatmap = {
        beatmapset_id: parseInt(oneMap.beatmapset_id, 10),
        artist: oneMap.artist,
        title: oneMap.title,
        creator: oneMap.creator,
        bpm: oneMap.bpm,
        favourite_count: oneMap.favourite_count
    };

    //modrequest object
    var modRequest = {
        time: new Date().toISOString(),
        nick: nick,
        set: JSON.stringify(modeStaringArray),
        beatmap_id: parseInt(oneMap.beatmapset_id, 10)
    };

    //console.log(beatmap, modRequest)
    myDB.insertBeatmap(beatmap, function () {
        console.log('Insertado insertBeatmap.')
        myDB.insertModRequest(modRequest)
    });

}

/**
 * MOD MY MAPPU PLZ, THX
 *
 * @param nick
 * @param bm_type beatmap type. will be 's' or 'b'
 * @param bm_id map identification
 */
function modRequetPlz(nick, bm_type, bm_id) {
    var osuApiKey = auth.osu.key;

    var query_base = 'https://osu.ppy.sh/api/get_beatmaps?k=' + osuApiKey;
    var query_mapp = '' + bm_type + '=' + bm_id;

    request
        .get(query_base + '&' + query_mapp)
        .end(function (err, res) {
            if (res.body.length < 1) {
                console.log('Map does not exist?', query_mapp)
            } else if (bm_type === 's') {
                insertMapAndMod(res.body, nick);
            } else {
                request
                    .get(query_base)
                    .query({s: res.body[0].beatmapset_id})
                    .end(function (err, new_res) {
                        //console.log(new_res.body);
                        insertMapAndMod(new_res.body, nick);
                    });
            }
        });
}

//modRequetPlz('Eru', 's', 134151);

module.exports = modRequetPlz;