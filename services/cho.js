var net = require('net');
var modRequetPlz = require('./osuApi');
var auth = require('../auth');

function choListener() {
    console.log('Init ChoListener Service!!!');

    var server = 'cho.ppy.sh';
    var pass = auth.irc.serverPassword;
    var nick = auth.irc.username;
    var login = nick;

    var channel = '#modreqs';
    var privmsg = 'PRIVMSG ' + channel + ' :';

    var osuPattern = /\b((https?:\/\/)(osu\.ppy\.sh)(\/[bs]{1}\/)([\d\.-]*))/g;

// Connect directly to the IRC server.
    var socket = new net.Socket();

    socket.setEncoding('utf8');

    socket.connect(6667, server, function () {

        console.log('CONNECTED TO: Bancho');
        socket.write('PASS ' + pass + '\r\n');
        socket.write('NICK ' + nick + '\r\n');
        socket.write('USER ' + login + ' 8 * : Modreqs Express.js Testing\r\n');
    });

    socket.on('data', function (data) {
        var lines = data.split('\n');


        lines.forEach(function (line) {

            //console.log(JSON.stringify(line));
            //console.log(typeof(line));
            /**
             * Most common case. Ignore all Join, Part, and Quit messages.
             */
            if (line.includes('JOIN :') || line.includes('PART :') ||
                line.includes('QUIT :') || line.startsWith(':BanchoBot!cho@cho.ppy.sh MODE ') ||
                line == '') {
            }

            /**
             * Ping case. Necessary to avoid disconnections.
             */
            else if (line.startsWith('PING ')) {
                //console.log('<ping>: ' + line);
                // We must respond to PINGs to avoid being disconnected.
                socket.write('PONG ' + line.substring(5) + '\r\n');
            }

            /**
             * Nice case. Get the map Url using matchPattern.
             */
            else if (line.indexOf(privmsg) > -1) {
                var text = line.substring(line.indexOf(privmsg) + privmsg.length);
                var nick = line.substring(1, line.indexOf('!cho@ppy.sh'));


                // Get multiple beatmap URLs in a chat line.
                var urls = text.match(osuPattern);
                if (urls != null) {
                    urls.forEach(function (url) {
                        var splited = url.split('/');
                        var id_type = splited[3];
                        var id = splited[4];
                        console.log(' >>>>>>>>>>' + text + ' - (' + nick + ', ' + id_type + ', ' + id + ')');
                        //HEREEEEE!!! :3
                        modRequetPlz(nick, id_type, id);
                    });
                }
            }

            /**
             * Case for join in #modreqs, after server connection was all ready.
             */
            else if (line.startsWith(':cho.ppy.sh 376')) {
                socket.write('JOIN ' + channel + '\r\n');
                // socket.write('AWAY :Hi, if I don\'t answer in a while and it is important, ' +
                //     'try send me a message in forum please or ask in #help. (PD: use http://modreqs-web.tk/ !!!)\r\n');
            }

            /**
             * Nothing... just to debug.
             */
            else {
                // Print the raw line received by the bot.
                console.log(new Date(), '<> => ' + line);
            }
        });


    });


    socket.on('error', function (data) {
        console.log(new Date(), 'error: ' + data);
    });
}

module.exports = choListener;
