/* eslint-env node */
'use strict';

module.exports = function(/* environment, appConfig */) {
  // See https://github.com/san650/ember-web-app#documentation for a list of
  // supported properties

  return {
    name: "Modreqs-Web",
    short_name: "Modreqs-Web",
    description: "Here you will find the last 2 days posted maps in #modreqs channel.",
    start_url: "/",
    display: "browser",
    background_color: "#fff",
    theme_color: "#fff",
    icons: [
      {
        src: '/favicon.png',
        sizes: '152x152'
      }
    ],
    ms: {
      tileColor: '#fff'
    }
  };
}
