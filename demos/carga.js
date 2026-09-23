/* Carga screenshot viewer — thumbnails, prev/next and arrow keys. No autoplay. */
(function () {
  'use strict';

  var SCREENS = [
    {
      src: '../assets/work/carga/principal.png',
      width: 788,
      height: 1997,
      title: 'Monthly opportunities',
      caption: 'The monthly shortlist. Each product gets a score out of 10, its landed cost, sale price, net margin and ROI, plus risk flags such as effective tariff or seller count — and a suggested call: import, review or pass.',
      alt: 'Carga’s monthly opportunities screen: products shortlisted for import, each card showing a score out of 10, landed cost, sale price, net margin, ROI and risk flags, with a suggested decision stamp.'
    },
    {
      src: '../assets/work/carga/Resumen.png',
      width: 788,
      height: 1904,
      title: 'Product detail',
      caption: 'One product up close. A suggested verdict that Claude writes from the engine’s numbers — marked as a reading, not a decision — the arguments for and against, how the score breaks down by dimension, and the risks to check.',
      alt: 'Carga’s product detail screen: headline cost, margin, ROI and capital figures, an AI-written suggested verdict with arguments for and against, and a table breaking the score down by dimension.'
    }
  ];

  var root = document.querySelector('[data-viewer]');
  if (!root) { return; }

  var stage = root.querySelector('[data-stage]');
  var caption = root.querySelector('[data-caption]');
  var current = root.querySelector('[data-current]');
  var thumbs = Array.prototype.slice.call(root.querySelectorAll('.thumb'));
  var index = 0;

  root.querySelector('[data-total]').textContent = String(SCREENS.length);

  function show(next) {
    index = (next + SCREENS.length) % SCREENS.length;
    var s = SCREENS[index];
    stage.src = s.src;
    stage.width = s.width;
    stage.height = s.height;
    stage.alt = s.alt;
    caption.innerHTML = '';
    var strong = document.createElement('strong');
    strong.textContent = s.title;
    caption.appendChild(strong);
    caption.appendChild(document.createTextNode(s.caption));
    current.textContent = String(index + 1);
    thumbs.forEach(function (t, i) { t.setAttribute('aria-current', i === index ? 'true' : 'false'); });
  }

  thumbs.forEach(function (t) {
    t.addEventListener('click', function () { show(Number(t.getAttribute('data-index'))); });
  });
  root.querySelector('[data-prev]').addEventListener('click', function () { show(index - 1); });
  root.querySelector('[data-next]').addEventListener('click', function () { show(index + 1); });

  document.addEventListener('keydown', function (e) {
    if (e.target.closest && e.target.closest('input, textarea, select')) { return; }
    if (e.key === 'ArrowLeft') { show(index - 1); }
    else if (e.key === 'ArrowRight') { show(index + 1); }
  });
}());
