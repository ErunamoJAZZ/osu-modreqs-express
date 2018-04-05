import Component from '@ember/component';
import { task } from 'ember-concurrency';
import _ from 'npm:lodash';

export default Component.extend({

  beatmaps: null,
  beatmapsFltered: null,

  orderBeatmapsBy: '',

  init() {
    this._super(...arguments);
    this.get('getBeatmaps').perform();
  },

  getBeatmaps: task(function * () {
    try {
      const response = yield fetch('/api/v1/beatmaps');
      const json = yield response.json();
      this.set('beatmaps', json.beatmaps);
      this.get('onFilter').perform();
    } catch (e) {
      alert(`Error getting map list.\n${e}`)
    }
  }).drop(),

  /**
   * Perform a sort or filter, using lodash.
   */
  onFilter: task(function * () {
    const beatmaps = yield this.get('beatmaps');
    const orderBeatmapsBy = this.get('orderBeatmapsBy');

    let beatmapsFltered;
    switch(orderBeatmapsBy) {
    case 'bpm':
        beatmapsFltered = _.sortBy(beatmaps, i => _.toNumber(i.bpm));
        break;
    case 'favs':
        beatmapsFltered = _.sortBy(beatmaps,  i => -_.toNumber(i.favourite_count));
        break;
    case 'numDiffs':
        beatmapsFltered = _.sortBy(beatmaps, i => -i.diffs.length);
        break;
    default:
        beatmapsFltered = beatmaps;
    }

    this.set('beatmapsFltered', beatmapsFltered);
  }).drop(),

  actions: {
    reloadBeatmaps() {
      this.get('getBeatmaps').perform();
    },
  }
});
