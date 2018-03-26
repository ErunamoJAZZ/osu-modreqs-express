# #modreqs web, for osu! game

In the past, osu! had a section of its website that displayed the latest maps posted in the #modreqs channel.
For some reason, this stopped working in 2014: https://osu.ppy.sh/forum/t/211410

This simple app tries to emulate a bit this utility.

I hope people (especially _Nominators_), can find it useful!!

# Technologies
- Backend: Express.js
- Frontend: Ember.js
- CSS: PureCSS

# How to dev
## Requirements
- Node.js
- NPM or Yarn
- ember-cli
- PostgreSQL (Create Database `modreqsdb`. Table creation is in _database/ddl.sql_)

## Setting Credentials
- You will need an API key from osu! Go [here](https://osu.ppy.sh/p/api)
- You also will need your Credentials for IRC. Get them [here](https://osu.ppy.sh/p/irc)
- Configuration things are in _auth.js_. **Avoid commit over this file**. It's recommended to
  do this command: `git update-index --assume-unchanged auth.js`, to ignore any changes over this file.

## Run
- Run `npm install` or `yarn install` on both root folder and _/ember-app_
- To start Backend use `npm start` in the root folder.
- To start ember use `npm start` or `ember s --proxy=http://localhost:3000` in _/ember-app_ folder.
- Go to http://localhost:4200/

## Production
- To compile ember with production mode, you can use `npm run-script build`.
