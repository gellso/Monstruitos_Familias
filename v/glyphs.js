/* Monstruitos — iconos propios para la estrella y la energía (antes, moneda).
   macOS 10.13 solo trae emojis hasta la versión 5.0: la moneda 🪙 (Emoji 13) no existe allí
   y la estrella depende de la fuente del sistema. Aquí se dibujan en SVG para que se vean
   igual en cualquier ordenador. Un observador cambia automáticamente cada ⭐ y 🪙 que
   aparezca en la pantalla (también en avisos, diplomas y contadores animados). */
(function () {
  'use strict';
  const STAR = '<svg class="ic ic-star" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 1.9l2.95 6.2 6.75.85-5 4.68 1.3 6.73L12 17.06l-6 3.3 1.3-6.73-5-4.68 6.75-.85z" fill="#ffc83d" stroke="#e08e00" stroke-width="1.5" stroke-linejoin="round"/><path d="M8.6 9.1l1.7-3.4" stroke="#fff4c2" stroke-width="1.7" stroke-linecap="round"/></svg>';
  const COIN = '<svg class="ic ic-coin ic-energy" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12.9" r="9.9" fill="#2f5fd0"/><circle cx="12" cy="11.6" r="9.9" fill="#4f8dff" stroke="#2f5fd0" stroke-width="1.4"/><path d="M13.4 3.9L6.9 13.1h4.6l-1.6 7.1 7-9.8h-4.7z" fill="#ffe14d" stroke="#d99a00" stroke-width="1.2" stroke-linejoin="round"/><path d="M6.4 7.3a7 7 0 0 1 3.4-2.6" stroke="#cfe0ff" stroke-width="1.6" stroke-linecap="round" fill="none"/></svg>'; // 2.2: energía (antes moneda)
  const LINE = (d) => '<svg class="ic ic-line" viewBox="0 0 24 24" aria-hidden="true"><path d="' + d + '" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const MAP = {
    '\u2B50': STAR, '\uD83E\uDE99': COIN,
    '\u26F6': LINE('M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5'),            // pantalla completa
    '\u21B6': LINE('M9 14L4 9l5-5M4 9h10a6 6 0 0 1 0 12h-3'),              // deshacer
    '\u232B': LINE('M9 5h11v14H9l-6-7zM12.5 9.5l5 5M17.5 9.5l-5 5')        // borrar
  };
  const RE = /\u2B50\uFE0F?|\uD83E\uDE99\uFE0F?|[\u26F6\u21B6\u232B]/;
  const RE_ALL = /\u2B50\uFE0F?|\uD83E\uDE99\uFE0F?|[\u26F6\u21B6\u232B]/g;
  const SKIP = { SCRIPT: 1, STYLE: 1, TEXTAREA: 1, OPTION: 1, SELECT: 1, TITLE: 1, INPUT: 1 };
  const SVGNS = 'http://www.w3.org/2000/svg';

  function iconFor(ch) { return MAP[ch.replace('\uFE0F', '')] || ch; }
  /** Texto escapado con los iconos ya puestos (para plantillas HTML) */
  function html(s) { return String(s).replace(RE_ALL, iconFor); }

  function fixTextNode(node) {
    const text = node.nodeValue;
    if (!text || !RE.test(text)) return;
    const p = node.parentNode;
    if (!p || SKIP[p.nodeName] || p.namespaceURI === SVGNS || (p.closest && p.closest('svg'))) return;
    const frag = document.createDocumentFragment();
    let last = 0;
    text.replace(RE_ALL, (m, idx) => {
      if (idx > last) frag.appendChild(document.createTextNode(text.slice(last, idx)));
      const span = document.createElement('m-ic'); // etiqueta propia: no le afectan reglas de span/i
      span.className = 'ic-wrap';
      span.innerHTML = iconFor(m);
      frag.appendChild(span);
      last = idx + m.length;
      return m;
    });
    if (last < text.length) frag.appendChild(document.createTextNode(text.slice(last)));
    p.replaceChild(frag, node);
  }
  function scan(root) {
    if (!root) return;
    if (root.nodeType === 3) return fixTextNode(root);
    if (root.nodeType !== 1 || SKIP[root.nodeName] || root.namespaceURI === SVGNS) return;
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    const list = [];
    let n;
    while ((n = w.nextNode())) if (RE.test(n.nodeValue)) list.push(n);
    list.forEach(fixTextNode);
  }
  function start() {
    scan(document.body);
    new MutationObserver(muts => {
      for (const m of muts) {
        if (m.type === 'characterData') fixTextNode(m.target);
        else m.addedNodes.forEach(scan);
      }
    }).observe(document.body, { childList: true, subtree: true, characterData: true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();

  window.Glyphs = { STAR, COIN, html };
})();
