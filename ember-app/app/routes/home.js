import Route from '@ember/routing/route';

export default Route.extend({
  model() {
    return fetch('/api/v1/beatmaps')
      .then(response => response.json())
      .catch(e => alert(`Error getting map list.\n${e}`));
  }
});
