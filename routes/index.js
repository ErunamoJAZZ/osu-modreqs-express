const express = require('express');
const cache = require('memory-cache');
const myDB = require('../database/myDB');
const diffIcon = require('../services/diffIcon');

const router = express.Router();

/**
 * API to get the list of maps.
 */
router.get('/api/v1/beatmaps', (req, res/* , next */) => {
  const cachedList = cache.get(myDB.cacheName);

  if (cachedList === null) {
    myDB.selectLastRequests()
      .then((data) => {
        const newData = data.map((item, idx) => {
          const diffs = JSON.parse(item.set).map(diffIcon);

          return {
            idx: data.length - idx,
            url: `https://osu.ppy.sh/s/${item.beatmap_id}`,
            thumb: `https://b.ppy.sh/thumb/${item.beatmap_id}l.jpg`,
            artist: item.artist,
            title: item.title,
            creator: item.creator,
            bpm: item.bpm,
            favourite_count: item.favourite_count,
            time: item.time,
            nick: item.nick,
            diffs,
            beatmap_id: item.beatmap_id,
          };
        });
        cache.put(myDB.cacheName, newData);
        res.json({ beatmaps: newData });
      });
  } else {
    res.json({ beatmaps: cachedList });
  }
});


/**
 * Load the Ember page directly.
 */
router.get('*', (req, res) => {
  res.sendFile('./public/index.html'); // load our public/index.html file of Ember.
});

module.exports = router;
