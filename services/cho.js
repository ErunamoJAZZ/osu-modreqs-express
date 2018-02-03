const net = require('net');
const modRequetPlz = require('./osuApi');
const auth = require('../auth');

function choListener() {
  console.log('Init ChoListener Service!!!');

  const server = 'cho.ppy.sh';
  const pass = auth.irc.serverPassword;
  const nick = auth.irc.username;
  const login = nick;

  const channel = '#modreqs';
  const privmsg = `PRIVMSG ${channel} :`;

  const osuPattern = /\b((https?:\/\/)(osu\.ppy\.sh)(\/[bs]{1}\/)([\d.-]*))/g;

  // Connect directly to the IRC server.
  const socket = new net.Socket();

  socket.setEncoding('utf8');

  socket.connect(6667, server, () => {
    console.log('CONNECTED TO: Bancho');
    socket.write(`PASS ${pass}\r\n`);
    socket.write(`NICK ${nick}\r\n`);
    socket.write(`USER ${login} 8 * : Modreqs Express.js Testing\r\n`);
  });

  socket.on('data', (data) => {
    const lines = data.split('\n');

    /* eslint brace-style: 0 */
    lines.forEach((line) => {
      // console.log(JSON.stringify(line));
      // console.log(typeof(line));
      /**
       * Most common case. Ignore all Join, Part, and Quit messages.
       */
      if (line.includes('JOIN :') || line.includes('PART :') ||
        line.includes('QUIT :') || line.startsWith(':BanchoBot!cho@cho.ppy.sh MODE ') ||
        line === '') {
        // empty
      }

      /**
       * Ping case. Necessary to avoid disconnections.
       */
      else if (line.startsWith('PING ')) {
        // console.log('<ping>: ' + line);
        // We must respond to PINGs to avoid being disconnected.
        socket.write(`PONG ${line.substring(5)}\r\n`);
      }

      /**
       * Nice case. Get the map Url using matchPattern.
       */
      else if (line.indexOf(privmsg) > -1) {
        const text = line.substring(line.indexOf(privmsg) + privmsg.length);
        const userNick = line.substring(1, line.indexOf('!cho@ppy.sh'));

        // Get multiple beatmap URLs in a chat line.
        const urls = text.match(osuPattern);
        if (urls != null) {
          urls.forEach((url) => {
            const splited = url.split('/');
            const idType = splited[3];
            const id = splited[4];
            console.log(`>>>>>>>>>>${text} - (${userNick}, ${idType}, ${id})'`);
            // HEREEEEE!!! :3
            modRequetPlz(userNick, idType, id);
          });
        }
      }

      /**
       * Case for join in #modreqs, after server connection was all ready.
       */
      else if (line.startsWith(':cho.ppy.sh 376')) {
        socket.write(`JOIN ${channel}\r\n`);
        // socket.write('AWAY :Hi, if I don\'t answer in a while and it is important, ' +
        //     'try send me a message in forum please or ask in #help. (PD: use http://modreqs-web.tk/ !!!)\r\n');
      }

      /**
       * Nothing... just to debug.
       */
      else {
        // Print the raw line received by the bot.
        console.log(new Date(), `<> => ${line}`);
      }
    });
  });


  socket.on('error', (data) => {
    console.log(new Date(), `error: ${data}`);
  });
}

module.exports = choListener;
