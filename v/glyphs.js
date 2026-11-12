/* Monstruitos — iconos propios para la estrella y la moneda.
   macOS 10.13 solo trae emojis hasta la versión 5.0: la moneda 🪙 (Emoji 13) no existe allí
   y la estrella depende de la fuente del sistema. Aquí se dibujan en SVG para que se vean
   igual en cualquier ordenador. Un observador cambia automáticamente cada ⭐ y 🪙 que
   aparezca en la pantalla (también en avisos, diplomas y contadores animados). */
(function () {
  'use strict';
  const STAR = '<svg class="ic ic-star" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 1.9l2.95 6.2 6.75.85-5 4.68 1.3 6.73L12 17.06l-6 3.3 1.3-6.73-5-4.68 6.75-.85z" fill="#ffc83d" stroke="#e08e00" stroke-width="1.5" stroke-linejoin="round"/><path d="M8.6 9.1l1.7-3.4" stroke="#fff4c2" stroke-width="1.7" stroke-linecap="round"/></svg>';
  const COIN = '<svg class="ic ic-coin" viewBox="0 0 24 24" aria-hidden="true"><ellipse cx="12" cy="13.2" rx="9.6" ry="9.2" fill="#d99a06"/><circle cx="12" cy="11.6" r="9.6" fill="#ffcf3a" stroke="#c98a00" stroke-width="1.5"/><circle cx="12" cy="11.6" r="6.4" fill="none" stroke="#e8a90f" stroke-width="1.4"/><path d="M12 7.4l1.25 2.6 2.85.36-2.1 1.97.55 2.84L12 13.8l-2.55 1.37.55-2.84-2.1-1.97 2.85-.36z" fill="#f2b417"/><path d="M6.6 7.2a6.9 6.9 0 0 1 3.6-2.5" stroke="#fff3b8" stroke-width="1.6" stroke-linecap="round" fill="none"/></svg>';
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
