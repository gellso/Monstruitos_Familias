/* Monstruitos 2.4 — Dibujo de los vales (SVG propio). Lo usan el Mac y la página de las familias.
   Escrito en ES5 para que funcione en cualquier navegador.
   Vales.art(v, opts): v = { k: 'e' | 's' | 'p', n, st: 'pend' | 'done' | 'exp' | 'void' }
   opts = { unit: 'energía', title: 'VALE', stamp: 'CANJEADO', cls: '', name: 'Ser el encargado', icon: '🧹' }
   2.7: k 'p' = vale de un PASE del Taller (en vez del número va el nombre del pase y su icono) */
(function () {
  'use strict';
  var seq = 0;
  var PAL = {
    e: { a: '#3f7dff', b: '#7b5cff', c: '#2a4fc4', glow: '#bcd2ff' },
    s: { a: '#ffb020', b: '#ff7a3c', c: '#c96400', glow: '#fff0b8' },
    p: { a: '#21c49a', b: '#0f9f9a', c: '#0a6e6a', glow: '#c8f7ea' }
  };
  var TICKET = 'M-24 -17H24A5 5 0 0 0 24 -7A7 7 0 0 0 24 7A5 5 0 0 0 24 17H-24A5 5 0 0 0 -24 7A7 7 0 0 0 -24 -7A5 5 0 0 0 -24 -17Z';
  var FONT = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif";
  // nombre del pase en una o dos líneas (lo que quepa a la izquierda de la línea discontinua)
  function nameLines(t) {
    t = String(t || ''); if (t.length <= 13) return [t];
    var words = t.split(' '), a = '', b = '';
    for (var i = 0; i < words.length; i++) { if (!b && (a + ' ' + words[i]).trim().length <= 14) a = (a + ' ' + words[i]).trim(); else b = (b + ' ' + words[i]).trim(); }
    if (b.length > 15) b = b.slice(0, 14) + '…';
    return b ? [a, b] : [a];
  }
  var BOLT = 'M8 -27 L-13 4 H-1 L-6 27 L15 -5 H3 Z';
  var STAR = 'M0 -28 L8.2 -10.6 L27 -8.6 L12.8 4.6 L16.6 23.4 L0 13.8 L-16.6 23.4 L-12.8 4.6 L-27 -8.6 L-8.2 -10.6 Z';
  function esc(s) { return String(s === undefined || s === null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  function art(v, opts) {
    opts = opts || {};
    var k = v && (v.k === 's' || v.k === 'p') ? v.k : 'e', p = PAL[k], id = 'vl' + (++seq);
    var st = (v && v.st) || 'pend';
    var n = Math.max(0, Math.round(Number(v && v.n) || 0));
    var shape = 'M16 0H198A12 12 0 0 0 222 0H284Q300 0 300 16V134Q300 150 284 150H222A12 12 0 0 0 198 150H16Q0 150 0 134V16Q0 0 16 0Z';
    var dots = '';
    for (var i = 0; i < 9; i++) dots += '<circle cx="' + (24 + (i * 47) % 170) + '" cy="' + (18 + (i * 61) % 118) + '" r="' + (2 + i % 3) + '" fill="#fff" opacity="' + (0.18 + (i % 3) * 0.08) + '"/>';
    var icon = k === 'p'
      ? '<path d="' + TICKET + '" transform="scale(1.05) rotate(-12)" fill="#fff" stroke="#0a6e6a" stroke-width="3"/><text transform="rotate(-12)" y="1" text-anchor="middle" dominant-baseline="central" font-size="22" font-family="\'Apple Color Emoji\',\'Segoe UI Emoji\',\'Noto Color Emoji\',sans-serif">' + esc(opts.icon || '\uD83C\uDF9F\uFE0F') + '</text>'
      : k === 's'
      ? '<path d="' + STAR + '" fill="#ffe14d" stroke="#e08e00" stroke-width="3" stroke-linejoin="round"/><path d="M-6 -8 L-2 -16" stroke="#fff8d0" stroke-width="3.4" stroke-linecap="round"/>'
      : '<circle r="25" fill="#4f8dff" stroke="#2f5fd0" stroke-width="3"/><path d="' + BOLT + '" transform="scale(.78)" fill="#ffe14d" stroke="#d99a00" stroke-width="2.6" stroke-linejoin="round"/>';
    var txt = String(n);
    var fs = txt.length > 2 ? 40 : 48;
    var main;
    if (k === 'p') {
      var L = nameLines(opts.name || opts.unit || '');
      main = L.length === 1
        ? '<text x="152" y="84" text-anchor="middle" font-family="' + FONT + '" font-weight="900" font-size="' + (L[0].length > 10 ? 22 : 27) + '" fill="#fff" stroke="' + p.c + '" stroke-width="1.2" paint-order="stroke">' + esc(L[0]) + '</text>'
        : '<text x="152" y="70" text-anchor="middle" font-family="' + FONT + '" font-weight="900" font-size="21" fill="#fff" stroke="' + p.c + '" stroke-width="1.2" paint-order="stroke">' + esc(L[0]) + '</text><text x="152" y="95" text-anchor="middle" font-family="' + FONT + '" font-weight="900" font-size="21" fill="#fff" stroke="' + p.c + '" stroke-width="1.2" paint-order="stroke">' + esc(L[1]) + '</text>';
    } else main = '<text x="152" y="86" text-anchor="middle" font-family="' + FONT + '" font-weight="900" font-size="' + fs + '" fill="#fff" stroke="' + p.c + '" stroke-width="1.5" paint-order="stroke">+' + esc(txt) + '</text>';
    var out = '<svg class="vale-art k-' + k + ' st-' + esc(st) + (opts.cls ? ' ' + esc(opts.cls) : '') + '" viewBox="-4 -4 308 158" role="img" aria-label="' + esc((opts.title || 'VALE') + (k === 'p' ? ' ' + (opts.name || '') : ' +' + n + ' ' + (opts.unit || ''))) + '">' +
      '<defs><linearGradient id="' + id + 'g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + p.a + '"/><stop offset="1" stop-color="' + p.b + '"/></linearGradient>' +
      '<linearGradient id="' + id + 'h" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".45"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>' +
      '<clipPath id="' + id + 'c"><path d="' + shape + '"/></clipPath></defs>' +
      '<path d="' + shape + '" transform="translate(0 4)" fill="' + p.c + '" opacity=".35"/>' +
      '<path d="' + shape + '" fill="url(#' + id + 'g)"/>' +
      '<g clip-path="url(#' + id + 'c)">' + dots +
        '<circle cx="62" cy="75" r="58" fill="#fff" opacity=".1"/><circle cx="62" cy="75" r="42" fill="#fff" opacity=".14"/>' +
        '<rect class="vl-shine" x="-120" y="-20" width="70" height="200" transform="rotate(18)" fill="url(#' + id + 'h)"/>' +
        '<rect x="222" y="0" width="80" height="150" fill="#fff" opacity=".12"/></g>' +
      '<path d="' + shape + '" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="2.5"/>' +
      '<path d="M210 18V132" stroke="#fff" stroke-opacity=".7" stroke-width="3" stroke-dasharray="7 7" stroke-linecap="round"/>' +
      '<g transform="translate(62 75)">' + icon + '</g>' +
      main +
      '<text x="152" y="' + (k === 'p' ? 120 : 114) + '" text-anchor="middle" font-family="-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,sans-serif" font-weight="800" font-size="15" fill="#fff" opacity=".95">' + esc(opts.unit || '') + '</text>' +
      '<text transform="translate(262 75) rotate(-90)" text-anchor="middle" dominant-baseline="central" font-family="-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,sans-serif" font-weight="900" font-size="26" letter-spacing="4" fill="#fff">' + esc(opts.title || 'VALE') + '</text>';
    if (st === 'done' || st === 'exp' || st === 'void') {
      var col = st === 'done' ? '#18a46a' : '#7a7290';
      out += '<path d="' + shape + '" fill="#fff" opacity="' + (st === 'done' ? '.45' : '.6') + '"/>' +
        '<g transform="translate(150 75) rotate(-12)"><rect x="-92" y="-24" width="184" height="48" rx="10" fill="#fff" fill-opacity=".85" stroke="' + col + '" stroke-width="5"/>' +
        '<text y="2" text-anchor="middle" dominant-baseline="central" font-family="-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,sans-serif" font-weight="900" font-size="' + ((opts.stamp || '').length > 10 ? 20 : 24) + '" letter-spacing="2" fill="' + col + '">' + esc(opts.stamp || '') + '</text></g>';
    }
    return out + '</svg>';
  }
  window.Vales = { art: art };
})();
