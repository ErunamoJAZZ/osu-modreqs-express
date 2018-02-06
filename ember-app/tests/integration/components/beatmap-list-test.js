import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('beatmap-list', 'Integration | Component | beatmap list', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{beatmap-list}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#beatmap-list}}
      template block text
    {{/beatmap-list}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
