
/* eslint no-nested-ternary: 0 */

const diffIcon = (item) => {
  const x = item.difficultyrating;

  const urlStar =
    x <= 1.50 ? 'https://s.ppy.sh/images/easy.png' :
      x <= 2.25 ? 'https://s.ppy.sh/images/normal.png' :
        x <= 3.75 ? 'https://s.ppy.sh/images/hard.png' :
          x <= 5.25 ? 'https://s.ppy.sh/images/insane.png' :
            'https://s.ppy.sh/images/expert.png';
  const urlImage =
    item.mode === 0 ? urlStar :
      item.mode === 1 ? urlStar.replace('.png', '-t.png') :
        item.mode === 2 ? urlStar.replace('.png', '-f.png') :
          urlStar.replace('.png', '-m.png');

  item.urlImage = urlImage; // eslint-disable-line
  return item;
};

module.exports = diffIcon;
