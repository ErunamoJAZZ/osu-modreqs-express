# #modreqs web, for osu! game

In the past, osu! had a section of its website that displayed the latest maps posted in the #modreqs channel.
For some reason, this stopped working in 2014: https://osu.ppy.sh/forum/t/211410

This simple app tries to emulate a bit this utility.

I hope people (especially _Nominators_), can find it useful!!


# Technology
- Backend: Express.js
- Frontend: Ember.js
- CSS: PureCSS

#How to dev
- Backend and Frontend are different apps.
- You must have Node.js, NPM or Yarn, and ember-cli installed.
- Database is in PostgreSQL, you can find table creation in _database/ddl.sql_.
- You must do `yarn install` or `npm install` for each one (backend and frontend).
- Setup your editor with Eslint.
- To start backend use `npm start` in the root folder.
- To start ember use `ember s --proxy=http://localhost:3000` in _ember-app_ folder.
- To compile ember with production mode, you can use `npm run-script build`.
- Configuration things are in _auth.js_, **avoid commit over this file**. I high recommend to
  do this command: `git update-index --assume-unchanged auth.js`, to ignore any change
  over this file.
