var express = require('express');
var router = express.Router();
var myDB = require('../database/myDB');
var diffIcon = require('../services/diffIcon')

/* GET home page. */
router.get('/', function (req, res, next) {

    myDB.selectLastRequests()
        .then(function (data) {
            var length = data.length;

            var newData = data.map(function (item, idx) {

                var diffs = JSON.parse(item.set).map(diffIcon)

                return {
                    idx: length - idx,
                    url: 'https://osu.ppy.sh/s/' + item.beatmap_id,
                    thumb: 'https://b.ppy.sh/thumb/' + item.beatmap_id + 'l.jpg',
                    artist: item.artist,
                    title: item.title,
                    creator: item.creator,
                    bpm: item.bpm,
                    favourite_count: item.favourite_count,
                    time: item.time,
                    nick: item.nick,
                    diffs: diffs,
                    beatmap_id: '487377'
                }
            });
            res.render('index', {
                beatmapsPage: true,
                beatmaps: newData
            });
        });
});

router.get('/about', function (req, res, next) {
    res.render('about', {aboutPage: true});
});


module.exports = router;
