import Component from '@ember/component';
import { task } from 'ember-concurrency';

export default Component.extend({

  beatmaps: null,

  init() {
    this._super(...arguments);
    this.get('getBeatmaps').perform();
  },

  getBeatmaps: task(function * () {
    try {
      const response = yield fetch('/api/v1/beatmaps');
      const json = yield response.json();
      this.set('beatmaps', json.beatmaps);
    } catch (e) {
      alert(`Error getting map list.\n${e}`)
    }
  }).drop(),

  actions: {
    reloadBeatmaps() {
      this.get('getBeatmaps').perform();
    },
  }
});
