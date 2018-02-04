const net = require('net');
const funfixExec = require('funfix-exec');
const funfixCore = require('funfix-core');

const modRequetPlz = require('./osuApi');
const auth = require('../auth');

const scheduler = new funfixExec.GlobalScheduler(false);

const server = 'cho.ppy.sh';
const pass = auth.irc.serverPassword;
const nick = auth.irc.username;
const login = nick;

const channel = '#modreqs';
const privmsg = `PRIVMSG ${channel} :`;

const osuPattern = /\b((https?:\/\/)(osu\.ppy\.sh)(\/[bs]{1}\/)([\d.-]*))/g;

let globalChoFlagPing = 0;
let socket = null;


/* eslint brace-style: 0 */
/* eslint no-console: 0 */

const choListener = () => {
  // Connect directly to the IRC server.
  socket = new net.Socket();

  socket.setEncoding('utf8');

  socket.connect(6667, server, () => {
    console.log('[CHO][Listener]', 'CONNECTED TO: Bancho');
    socket.write(`PASS ${pass}\r\n`);
    socket.write(`NICK ${nick}\r\n`);
    socket.write(`USER ${login} 8 * : Modreqs Express.js Testing\r\n`);
  });

  socket.on('data', (data) => {
    // Get lines
    const lines = data.split('\n');

    lines.forEach((line) => {
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
        globalChoFlagPing = 1;
        // console.log(new Date(), `<ping>: ${line}`);
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
            console.log(`[MOD PLZ]>> ${text} - (${userNick}, ${idType}, ${id})'`);
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

      // Nothing... just to debug.
      else {
        // Print the raw line received by the bot.
        // console.log(new Date(), `<> => ${line}`);
      }
    });
  });

  socket.on('error', (err) => {
    console.error('[CHO][Listener]', err, new Date());
  });
};


const choTaskFlagPing =
  scheduler.scheduleAtFixedRate(
    funfixExec.Duration.seconds(30),
    funfixExec.Duration.seconds(30),
    () => { globalChoFlagPing += 1; },
  );


const choSupervisor =
  scheduler.scheduleAtFixedRate(
    funfixExec.Duration.minutes(5),
    funfixExec.Duration.minutes(5),
    () => {
      if (globalChoFlagPing > 3) {
        // matar conexión y reiniciar
        const tryDestroy = funfixCore.Try
          .of(() => socket)
          .map(s => s.end())
          .map(s => s.destroy());
        tryDestroy.forEach(() => {
          socket = null;
          choListener();
        });
        tryDestroy.fold(
          error => console.error('[CHO][Supervisor]', error, new Date()),
          () => console.log('[CHO][Supervisor]', 'Restarted cho service.', new Date()),
        );
      }
    },
  );

const choInit = () => {
  console.log('[CHO][Init]', 'Starting ChoListener Service!!!');
  choListener();
};

module.exports = choInit;
