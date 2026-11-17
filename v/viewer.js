/* Monstruitos — visor para familias.
   Esta página no contiene datos: lee la clave que va tras el # del enlace (que el navegador nunca
   envía al servidor), descarga el archivo cifrado de ese niño y lo descifra aquí mismo. */
(function () {
  'use strict';
  const $app = document.getElementById('app');
  const ID_SALT = 'monstruitos-familias:';
  const SAVE_KEY = 'monstruitos-guardados';

  // ---------- Textos ----------
  const L = {
    es: {
      loading: 'Abriendo el monstruo…', hello: '¡Hola!', welcome: 'Escanea con la cámara del móvil el código QR que te ha dado el tutor o la tutora y verás aquí el monstruo de tu hijo o hija.',
      saved: 'Guardados en este móvil', badKey: 'Este enlace no está completo. Vuelve a escanear el código QR o pide uno nuevo al tutor.',
      notFound: 'Todavía no hay ninguna ficha para este código. Si te lo acaban de dar, vuelve a probar dentro de unos minutos. Si antes funcionaba, puede que el tutor lo haya renovado: pídele uno nuevo.', netError: 'No se ha podido conectar. Revisa la conexión a internet e inténtalo de nuevo.', oldPhone: 'Este navegador es demasiado antiguo para abrir la ficha cifrada. Prueba con otro navegador o actualiza el móvil.',
      retry: 'Reintentar', monsterOf: 'El monstruo de {name}', yourMonster: 'Su monstruo', stars: 'estrellas', coins: 'monedas',
      toNext: 'Le faltan {n} ⭐ para llegar a {phase}', maxPhase: '¡Ha llegado a Mítico, la fase más alta!', path: 'Su camino', week: 'Esta semana', weekStars: '+{n} ⭐', bonusDays: '{n} días sin incidencias', weekNone: 'Todavía no hay estrellas esta semana',
      shop: 'Tienda de la clase', shopNote: 'Lo compra en clase, el «Día de tienda», con sus monedas. Gastar nunca le quita estrellas.', filterCan: 'Puede comprar', filterAll: 'Todo', cos: 'Para su monstruo', priv: 'Privilegios',
      seeAll: 'Ver todos ({n})', st_ok: '¡Le llega!', st_coins: 'Faltan {n} 🪙', st_phase: 'Desde {phase}', st_owned: 'Ya lo tiene', st_soldout: 'Agotado hoy', st_weekly: 'Ya lo usó esta semana', mystery: 'Caja sorpresa', mysteryNote: 'un adorno al azar',
      saving: 'Está ahorrando para', vouchers: 'Sus vales', vPending: 'Por canjear', vRedeemed: 'Disfrutado', noVouchers: 'Todavía no ha comprado ningún privilegio.', goals: 'Premios de la clase', goalMine: 'ha aportado {n} 🪙', goalDone: '¡Conseguido!',
      how: '¿Cómo funciona?',
      howText: ['Cada buen comportamiento en clase le da estrellas ⭐.', 'Con las estrellas su monstruo evoluciona: Cría, Joven, Adulto, Heroico, Legendario y Mítico.', 'Cada estrella es también una moneda 🪙 para la tienda de la clase. Gastar monedas nunca le quita estrellas ni fases.'],
      howBonus: 'Si un día no tiene ningún «a mejorar», a las {time} recibe {n} ⭐ extra.', howDraw: 'La forma Mítica es su propio dibujo, convertido en monstruo.',
      updated: 'Actualizado el {date}', privacy: 'Estos datos van cifrados: solo se pueden abrir con este código. No lo compartas fuera de la familia.',
      remember: 'Guardar en este móvil', remembered: 'Guardado en este móvil', forget: 'Quitar de este móvil', homeHint: 'Consejo: añade esta página a la pantalla de inicio para abrirla como una app.',
      days: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'], months: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
      phases: { huevo: 'Huevo', cria: 'Cría', joven: 'Joven', adulto: 'Adulto', heroico: 'Heroico', legendario: 'Legendario', mitico: 'Mítico' },
      buy: 'Comprar', buyQ: '¿Comprar «{item}» por {n} 🪙?', buyNote: 'Se descuenta ahora mismo de sus monedas y ya es suyo. Lo verá en clase.', bought: '¡Comprado!', boughtCos: 'Su monstruo ya lo lleva puesto.', boughtPriv: 'Lo podrá canjear en clase.', mine: 'Ya es suyo', homeNote: '🏠 Comprado desde casa: se anotará en clase en cuanto se abra Monstruitos.', spentHome: '{n} gastadas desde casa', buyYes: 'Sí, comprar', cancel: 'Cancelar', sending: 'Enviando…', sent: '¡Pedido enviado!', sendErr: 'No se ha podido enviar. Revisa la conexión e inténtalo otra vez.', pendingTitle: 'Pedidos en camino', pendingChip: 'En camino', reserved: '{n} reservadas en pedidos', shopNoteHome: 'Puedes comprar desde aquí con sus monedas: el pedido llega a clase y lo verá allí. Gastar nunca le quita estrellas.', available: 'disponibles',
      history: 'Historial', histMore: 'Ver más', histNone: 'Todavía no hay movimientos.', h_bonus: 'Día sin incidencias', h_adjust: 'Ajuste del tutor', h_coins: 'Ajuste de monedas del tutor', h_buy: 'Compra', h_home: 'desde casa', h_mystery: 'Caja sorpresa: {item}', today: 'Hoy', yesterday: 'Ayer',
      newsTitle: 'Novedades desde tu última visita', newsOk: 'Entendido', n_stars: 'Ha ganado {n} ⭐', n_neg: '{n} «a mejorar»', n_up: '¡Ha evolucionado a {phase}!', n_down: 'Ha vuelto a la fase {phase}', n_bought: 'Ha comprado {item}', n_boughtHome: 'Compra hecha desde casa: {item}', n_redeemed: 'Ha disfrutado su privilegio: {item}', n_coins: 'El tutor ha cambiado sus monedas: {d}', n_orderOk: 'Tu compra «{item}» ya está anotada en clase', n_orderNo: 'Al final no se pudo comprar «{item}» ({why}): sus monedas siguen ahí',
      why_nocoins: 'no tenía monedas suficientes', why_phase: 'aún no ha llegado a la fase necesaria', why_owned: 'ya lo tenía', why_soldout: 'se agotó por hoy', why_weekly: 'ya lo usó esta semana', why_season: 'ya no es temporada', why_gone: 'ya no está en la tienda', why_error: 'hubo un problema'
    },
    va: {
      loading: 'Obrint el monstre…', hello: 'Hola!', welcome: 'Escaneja amb la càmera del mòbil el codi QR que t’ha donat el tutor o la tutora i veuràs ací el monstre del teu fill o filla.',
      saved: 'Guardats en aquest mòbil', badKey: 'Aquest enllaç no està complet. Torna a escanejar el codi QR o demana’n un de nou al tutor.',
      notFound: 'Encara no hi ha cap fitxa per a aquest codi. Si te l’acaben de donar, torna a provar d’ací a uns minuts. Si abans funcionava, pot ser que el tutor l’haja renovat: demana-li’n un de nou.', netError: 'No s’ha pogut connectar. Revisa la connexió a internet i torna-ho a provar.', oldPhone: 'Aquest navegador és massa antic per a obrir la fitxa xifrada. Prova amb un altre navegador o actualitza el mòbil.',
      retry: 'Tornar a provar', monsterOf: 'El monstre de {name}', yourMonster: 'El seu monstre', stars: 'estreles', coins: 'monedes',
      toNext: 'Li falten {n} ⭐ per a arribar a {phase}', maxPhase: 'Ha arribat a Mític, la fase més alta!', path: 'El seu camí', week: 'Aquesta setmana', weekStars: '+{n} ⭐', bonusDays: '{n} dies sense incidències', weekNone: 'Encara no hi ha estreles aquesta setmana',
      shop: 'Botiga de la classe', shopNote: 'Ho compra a classe, el «Dia de botiga», amb les seues monedes. Gastar mai li lleva estreles.', filterCan: 'Pot comprar', filterAll: 'Tot', cos: 'Per al seu monstre', priv: 'Privilegis',
      seeAll: 'Veure’ls tots ({n})', st_ok: 'Li arriba!', st_coins: 'Falten {n} 🪙', st_phase: 'Des de {phase}', st_owned: 'Ja el té', st_soldout: 'Esgotat hui', st_weekly: 'Ja l’ha usat aquesta setmana', mystery: 'Caixa sorpresa', mysteryNote: 'un adorn a l’atzar',
      saving: 'Està estalviant per a', vouchers: 'Els seus vals', vPending: 'Per bescanviar', vRedeemed: 'Gaudit', noVouchers: 'Encara no ha comprat cap privilegi.', goals: 'Premis de la classe', goalMine: 'ha aportat {n} 🪙', goalDone: 'Aconseguit!',
      how: 'Com funciona?',
      howText: ['Cada bon comportament a classe li dona estreles ⭐.', 'Amb les estreles el seu monstre evoluciona: Cria, Jove, Adult, Heroic, Llegendari i Mític.', 'Cada estrela és també una moneda 🪙 per a la botiga de la classe. Gastar monedes mai li lleva estreles ni fases.'],
      howBonus: 'Si un dia no té cap «a millorar», a les {time} rep {n} ⭐ extra.', howDraw: 'La forma Mítica és el seu propi dibuix, convertit en monstre.',
      updated: 'Actualitzat el {date}', privacy: 'Aquestes dades van xifrades: només es poden obrir amb aquest codi. No el compartisques fora de la família.',
      remember: 'Guardar en aquest mòbil', remembered: 'Guardat en aquest mòbil', forget: 'Llevar d’aquest mòbil', homeHint: 'Consell: afig aquesta pàgina a la pantalla d’inici per a obrir-la com una app.',
      days: ['diumenge', 'dilluns', 'dimarts', 'dimecres', 'dijous', 'divendres', 'dissabte'], months: ['gener', 'febrer', 'març', 'abril', 'maig', 'juny', 'juliol', 'agost', 'setembre', 'octubre', 'novembre', 'desembre'],
      phases: { huevo: 'Ou', cria: 'Cria', joven: 'Jove', adulto: 'Adult', heroico: 'Heroic', legendario: 'Llegendari', mitico: 'Mític' },
      buy: 'Comprar', buyQ: 'Comprar «{item}» per {n} 🪙?', buyNote: 'Es descompta ara mateix de les seues monedes i ja és seu. Ho veurà a classe.', bought: 'Comprat!', boughtCos: 'El seu monstre ja el porta posat.', boughtPriv: 'El podrà bescanviar a classe.', mine: 'Ja és seu', homeNote: '🏠 Comprat des de casa: s’anotarà a classe tan prompte com s’òbriga Monstrets.', spentHome: '{n} gastades des de casa', buyYes: 'Sí, comprar', cancel: 'Cancel·lar', sending: 'Enviant…', sent: 'Comanda enviada!', sendErr: 'No s’ha pogut enviar. Revisa la connexió i torna-ho a provar.', pendingTitle: 'Comandes en camí', pendingChip: 'En camí', reserved: '{n} reservades en comandes', shopNoteHome: 'Pots comprar des d’ací amb les seues monedes: la comanda arriba a classe i ho veurà allí. Gastar mai li lleva estreles.', available: 'disponibles',
      history: 'Historial', histMore: 'Veure’n més', histNone: 'Encara no hi ha moviments.', h_bonus: 'Dia sense incidències', h_adjust: 'Ajust del tutor', h_coins: 'Ajust de monedes del tutor', h_buy: 'Compra', h_home: 'des de casa', h_mystery: 'Caixa sorpresa: {item}', today: 'Hui', yesterday: 'Ahir',
      newsTitle: 'Novetats des de la teua última visita', newsOk: 'D’acord', n_stars: 'Ha guanyat {n} ⭐', n_neg: '{n} «a millorar»', n_up: 'Ha evolucionat a {phase}!', n_down: 'Ha tornat a la fase {phase}', n_bought: 'Ha comprat {item}', n_boughtHome: 'Compra feta des de casa: {item}', n_redeemed: 'Ha gaudit del seu privilegi: {item}', n_coins: 'El tutor ha canviat les seues monedes: {d}', n_orderOk: 'La teua compra «{item}» ja està anotada a classe', n_orderNo: 'Al final no s’ha pogut comprar «{item}» ({why}): les seues monedes continuen ahí',
      why_nocoins: 'no tenia monedes suficients', why_phase: 'encara no ha arribat a la fase necessària', why_owned: 'ja el tenia', why_soldout: 's’ha esgotat per hui', why_weekly: 'ja l’ha usat aquesta setmana', why_season: 'ja no és temporada', why_gone: 'ja no està a la botiga', why_error: 'hi ha hagut un problema'
    }
  };
  let lang = 'es', langChosen = false;
  try { const s0 = localStorage.getItem('monstruitos-lang'); if (s0 === 'es' || s0 === 'va') { lang = s0; langChosen = true; } } catch (e) { /* sin almacenamiento */ }
  if (!langChosen && /^(ca|va)/i.test(navigator.language || '')) lang = 'va';
  const t = (k, p) => { let s = (L[lang] || L.es)[k]; if (s === undefined) s = L.es[k]; if (typeof s === 'string' && p) Object.keys(p).forEach(x => { s = s.split('{' + x + '}').join(p[x]); }); return s; };
  const esc = (s) => String(s === undefined || s === null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const nm = (o) => (o && (o[lang] || o.es)) || '';
  const fmtDate = (iso) => { const d = new Date(iso); const m = t('months')[d.getMonth()]; const de = lang === 'va' && /^[aeiou]/.test(m) ? "d'" : 'de '; return t('days')[d.getDay()] + ' ' + d.getDate() + ' ' + de + m + ', ' + String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0'); };

  // ---------- Guardados en el móvil ----------
  function savedList() { try { return JSON.parse(localStorage.getItem(SAVE_KEY) || '[]'); } catch (e) { return []; } }
  function setSaved(list) { try { localStorage.setItem(SAVE_KEY, JSON.stringify(list)); return true; } catch (e) { return false; } }

  // ---------- Cifrado ----------
  const fromB64url = (s) => { const b = atob(s.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((s.length + 3) % 4)); const u = new Uint8Array(b.length); for (let i = 0; i < b.length; i++) u[i] = b.charCodeAt(i); return u; };
  const toB64url = (u) => { let s = ''; u.forEach(x => { s += String.fromCharCode(x); }); return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); };
  const enc = (s) => new TextEncoder().encode(s);
  async function fileId(key) { const h = new Uint8Array(await crypto.subtle.digest('SHA-256', enc(ID_SALT + key))); return toB64url(h).slice(0, 22); }
  async function decrypt(key, buf) {
    const u = new Uint8Array(buf);
    if (u.length < 31 || u[0] !== 77 || u[1] !== 70 || u[2] !== 49) throw new Error('formato');
    const k = await crypto.subtle.importKey('raw', fromB64url(key), { name: 'AES-GCM' }, false, ['decrypt']);
    const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: u.slice(3, 15), additionalData: enc('MF1'), tagLength: 128 }, k, u.slice(15));
    return JSON.parse(new TextDecoder().decode(plain));
  }

  async function encryptMsg(key, obj) {
    const k = await crypto.subtle.importKey('raw', fromB64url(key), { name: 'AES-GCM' }, false, ['encrypt']);
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const ct = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv, additionalData: enc('MF1'), tagLength: 128 }, k, enc(JSON.stringify(obj))));
    const out = new Uint8Array(3 + 12 + ct.length); out.set(enc('MF1'), 0); out.set(iv, 3); out.set(ct, 15);
    return toB64url(out);
  }
  const rid = () => { const u = crypto.getRandomValues(new Uint8Array(9)); return toB64url(u); };

  // ---------- Recuerdos de este móvil (pedidos en camino y última visita) ----------
  const LS = { get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* nada */ } } };
  let fid = '';
  const pendKey = () => 'mn-pend-' + fid, seenKey = () => 'mn-seen-' + fid;
  // Compras hechas desde casa que el Mac aún no ha recogido: las de este móvil y, si el buzón lo
  // permite, las de cualquier otro móvil de la familia (se leen cifradas del buzón).
  let remoteOrders = [], remoteFor = '';
  function pendingOrders() {
    const noticed = (data && data.notices || []).map(n => n.n);
    const week = Date.now() - 14 * 864e5;
    const local = LS.get(pendKey(), []).filter(p => noticed.indexOf(p.n) < 0 && new Date(p.at).getTime() > week);
    LS.set(pendKey(), local);
    const map = {};
    local.forEach(p => { map[p.n] = p; });
    remoteOrders.forEach(o => {
      if (noticed.indexOf(o.n) >= 0 || map[o.n]) return;
      const it = (data.items || []).find(x => x.id === o.i);
      if (it) map[o.n] = { n: o.n, i: o.i, at: o.at, price: it.price, es: it.es, va: it.va, icon: it.icon || null, kind: it.kind, slot: it.slot || null, art: it.art || null };
    });
    return Object.keys(map).map(k => map[k]).sort((a, b) => String(a.at).localeCompare(String(b.at)));
  }
  async function loadRemote(key) {
    if (!data || !data.shopUrl) return;
    const k = fid;
    try {
      const r = await fetch(String(data.shopUrl).replace(/\/+$/, '') + '/q/' + fid, { cache: 'no-store' });
      if (!r.ok) return;
      const j = await r.json();
      const out = [];
      for (const c of (j.items || [])) { try { const o = await decrypt(key, fromB64url(c).buffer); if (o && o.n && o.i) out.push(o); } catch (e) { /* no es de esta familia */ } }
      if (k !== fid) return;
      const before = JSON.stringify(remoteOrders.map(o => o.n).sort());
      remoteOrders = out; remoteFor = k;
      if (JSON.stringify(out.map(o => o.n).sort()) !== before) { const y = window.scrollY; render(key); window.scrollTo(0, y); }
    } catch (e) { /* sin buzón nuevo: solo cuenta lo de este móvil */ }
  }

  // ---------- Pantallas ----------
  function header() {
    return `<header class="top"><div class="brand">${window.Monsters ? Monsters.xispa({ size: 44 }) : ''}<span>Monstruitos</span></div>
      <div class="lang"><button data-l="es" class="${lang === 'es' ? 'on' : ''}">ES</button><button data-l="va" class="${lang === 'va' ? 'on' : ''}">VA</button></div></header>`;
  }
  function bindHeader() {
    $app.querySelectorAll('.lang [data-l]').forEach(b => b.onclick = () => { lang = b.dataset.l; langChosen = true; try { localStorage.setItem('monstruitos-lang', lang); } catch (e) { /* nada */ } route(); });
  }
  function message(text, withRetry) {
    $app.innerHTML = header() + `<main class="msg"><div class="msg-art">${window.Monsters ? Monsters.xispa({ size: 150, sleeping: !withRetry }) : ''}</div><p>${esc(text)}</p>${withRetry ? `<button class="btn" id="retry">${esc(t('retry'))}</button>` : ''}</main>`;
    bindHeader();
    const r = document.getElementById('retry'); if (r) r.onclick = route;
  }
  function welcome() {
    const list = savedList();
    $app.innerHTML = header() + `<main class="msg"><div class="msg-art">${window.Monsters ? Monsters.xispa({ size: 170 }) : ''}</div><h1>${esc(t('hello'))}</h1><p>${esc(t('welcome'))}</p>
      ${list.length ? `<h2>${esc(t('saved'))}</h2><div class="saved">${list.map(s => `<a class="saved-kid" href="#${esc(s.key)}">${esc(s.name || t('yourMonster'))}</a>`).join('')}</div>` : ''}</main>`;
    bindHeader();
  }

  let data = null, loadedKey = '', filter = 'can', expanded = {}, shownKey = '', shownCoins = null;
  const CAP = 6;
  async function route() {
    const key = (location.hash || '').replace(/^#/, '').trim();
    if (!key) return welcome();
    if (!/^[A-Za-z0-9_-]{43}$/.test(key)) return message(t('badKey'));
    if (data && loadedKey === key) return render(key);
    if (!window.crypto || !crypto.subtle || !window.TextEncoder) return message(t('oldPhone'));
    $app.innerHTML = header() + `<main class="msg"><div class="msg-art pulse">${window.Monsters ? Monsters.xispa({ size: 120 }) : ''}</div><p>${esc(t('loading'))}</p></main>`;
    bindHeader();
    let res;
    try { res = await fetch('d/' + (await fileId(key)) + '.bin', { cache: 'no-store' }); } catch (e) { return message(t('netError'), true); }
    if (res.status === 404) return message(t('notFound'));
    if (!res.ok) return message(t('netError'), true);
    try { data = await decrypt(key, await res.arrayBuffer()); } catch (e) { return message(t('notFound')); }
    fid = await fileId(key);
    if (remoteFor !== fid) remoteOrders = [];
    if (!langChosen && (data.lang === 'va' || data.lang === 'es')) lang = data.lang;
    loadedKey = key;
    window.Drawings = { get: (f) => (data.drawings && data.drawings[f]) || null };
    render(key);
    news();
    loadRemote(key);
  }

  // ---------- Tablero de novedades (desde la última visita en este móvil) ----------
  function news() {
    const d = data, seen = LS.get(seenKey(), null);
    const P = d.phases || ['huevo', 'cria', 'joven', 'adulto', 'heroico', 'legendario', 'mitico'];
    const mark = () => LS.set(seenKey(), { at: d.updated, phase: d.phase });
    if (!seen || !seen.at) return mark(); // primera visita: no hay «novedades»
    if (seen.at >= d.updated) return;
    const after = (x) => x && x > seen.at;
    const rows = [];
    const hist = (d.history || []).filter(h => after(h.at));
    const plus = hist.filter(h => h.v > 0 && h.k !== 'adjust').reduce((a, h) => a + h.v, 0), negs = hist.filter(h => h.k === 'neg').length;
    if (seen.phase && seen.phase !== d.phase) rows.push(P.indexOf(d.phase) > P.indexOf(seen.phase) ? ['🎉', t('n_up', { phase: t('phases')[d.phase] }), 'up'] : ['↘️', t('n_down', { phase: t('phases')[d.phase] }), 'down']);
    if (plus) rows.push(['⭐', t('n_stars', { n: plus }), 'up']);
    if (negs) rows.push(['📝', t('n_neg', { n: negs }), 'neg']);
    (d.notices || []).filter(n => after(n.at)).forEach(n => rows.push(n.ok ? [n.icon || '🛍️', t('n_orderOk', { item: nm(n) }), 'up'] : ['⚠️', t('n_orderNo', { item: nm(n), why: t('why_' + (n.reason || 'error')) }), 'neg']));
    (d.buys || []).forEach(b => {
      if (b.k === 'coins') { if (after(b.at)) rows.push(['🪙', t('n_coins', { d: (b.d > 0 ? '+' : '−') + Math.abs(b.d) + (b.note ? ' (' + b.note + ')' : '') }), b.d > 0 ? 'up' : 'neg']); return; }
      if (after(b.at) && b.from !== 'casa') rows.push([b.icon || '🛍️', t('n_bought', { item: nm(b) }) + ' · ' + b.cost + ' 🪙', '']);
      if (after(b.redeemedAt)) rows.push([b.icon || '🎟️', t('n_redeemed', { item: nm(b) }), 'up']);
    });
    if (!rows.length) return mark();
    const ov = document.createElement('div');
    ov.className = 'news-ov';
    ov.innerHTML = `<div class="news"><h2>🔔 ${esc(t('newsTitle'))}</h2><ul>${rows.map(r => `<li class="${r[2]}"><span class="emo">${esc(r[0])}</span><span>${esc(r[1])}</span></li>`).join('')}</ul><button class="btn" id="newsOk">${esc(t('newsOk'))}</button></div>`;
    document.body.appendChild(ov);
    ov.querySelector('#newsOk').onclick = () => { mark(); ov.remove(); };
  }

  // ---------- Comprar desde casa ----------
  function askBuy(key, it) {
    const ov = document.createElement('div');
    ov.className = 'news-ov';
    ov.innerHTML = `<div class="news buyq"><div class="art">${itemArt(it)}</div><h2>${esc(t('buyQ', { item: nm(it), n: it.price }))}</h2><p class="soft">${esc(t('buyNote'))}</p>
      <div class="row"><button class="btn ghost" data-a="no">${esc(t('cancel'))}</button><button class="btn" data-a="yes">${esc(t('buyYes'))}</button></div><p class="buymsg"></p></div>`;
    document.body.appendChild(ov);
    ov.querySelector('[data-a=no]').onclick = () => ov.remove();
    const yes = ov.querySelector('[data-a=yes]'), msg = ov.querySelector('.buymsg');
    yes.onclick = async () => {
      yes.disabled = true; msg.textContent = t('sending');
      const order = { n: rid(), i: it.id, at: new Date().toISOString() };
      try {
        const c = await encryptMsg(key, order);
        const r = await fetch(String(data.shopUrl).replace(/\/+$/, '') + '/p', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ f: fid, c }) });
        if (!r.ok) throw new Error('http ' + r.status);
        const list = LS.get(pendKey(), []); list.push({ n: order.n, i: it.id, at: order.at, price: it.price, es: it.es, va: it.va, icon: it.icon || null, kind: it.kind, slot: it.slot || null, art: it.art || null });
        LS.set(pendKey(), list);
        const box = ov.querySelector('.news');
        box.classList.add('done');
        box.innerHTML = `<div class="art pop">${itemArt(it, true)}</div><h2>🎉 ${esc(t('bought'))}</h2><p class="soft">${esc(it.kind === 'cosmetic' ? t('boughtCos') : t('boughtPriv'))}</p><button class="btn" data-a="ok">${esc(t('newsOk'))}</button>${confetti()}`;
        const y = window.scrollY; render(key); window.scrollTo(0, y);
        box.querySelector('[data-a=ok]').onclick = () => ov.remove();
        setTimeout(() => { if (ov.parentNode) ov.remove(); }, 6000);
      } catch (e) { yes.disabled = false; msg.textContent = t('sendErr'); }
    };
  }

  const reduceMotion = () => window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  function countTo(el, from, to) {
    const t0 = performance.now(), dur = 700;
    el.parentNode.classList.add('bump');
    const step = (now) => { const k = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - k, 3); el.textContent = Math.round(from + (to - from) * e); if (k < 1) requestAnimationFrame(step); else el.parentNode.classList.remove('bump'); };
    requestAnimationFrame(step);
  }
  function confetti() {
    const C = ['#ff6fae', '#ffc83d', '#2fcf95', '#3fa9ff', '#7b5cff', '#ff8a3c'];
    return `<div class="confetti">${Array.from({ length: 26 }, (_, i) => `<i style="left:${4 + (i * 37) % 92}%;background:${C[i % C.length]};animation-delay:${(i % 7) * 60}ms;--dx:${((i * 53) % 120) - 60}px;--r:${(i * 97) % 360}deg"></i>`).join('')}</div>`;
  }

  // ---------- Historial ----------
  let histAll = false;
  function dayLabel(iso) {
    const d = new Date(iso), n = new Date(); const k = (x) => x.getFullYear() + '-' + x.getMonth() + '-' + x.getDate();
    if (k(d) === k(n)) return t('today');
    const y = new Date(n.getTime() - 864e5); if (k(d) === k(y)) return t('yesterday');
    const m = t('months')[d.getMonth()]; const de = lang === 'va' && /^[aeiou]/.test(m) ? "d'" : 'de ';
    return t('days')[d.getDay()] + ' ' + d.getDate() + ' ' + de + m;
  }
  function historyHtml() {
    const ev = (data.history || []).map(h => ({ at: h.at, icon: h.k === 'bonus' ? '🌟' : h.k === 'adjust' ? '⚡' : h.icon, text: h.k === 'bonus' ? t('h_bonus') : h.k === 'adjust' ? t('h_adjust') : nm(h), v: (h.v > 0 ? '+' : h.v < 0 ? '−' : '') + Math.abs(h.v) + ' ⭐', cls: h.v < 0 ? 'neg' : 'pos' }))
      .concat((data.buys || []).map(b => b.k === 'coins'
        ? { at: b.at, icon: '🪙', text: t('h_coins') + (b.note ? ' · ' + b.note : ''), v: (b.d > 0 ? '+' : '−') + Math.abs(b.d) + ' 🪙', cls: b.d > 0 ? 'pos' : 'neg' }
        : { at: b.at, icon: b.icon || '🛍️', text: (b.mystery ? t('h_mystery', { item: nm(b) }) : t('h_buy') + ': ' + nm(b)) + (b.from === 'casa' ? ' (' + t('h_home') + ')' : ''), v: '−' + b.cost + ' 🪙', cls: 'buy' }))
      .concat((data.shopUrl ? pendingOrders() : []).map(p => ({ at: p.at, icon: p.icon || (p.kind === 'cosmetic' ? '✨' : '🎟️'), text: t('h_buy') + ': ' + nm(p) + ' (' + t('h_home') + ')', v: '−' + p.price + ' 🪙', cls: 'buy' })))
      .sort((a, b) => b.at.localeCompare(a.at));
    if (!ev.length) return `<p class="soft">${esc(t('histNone'))}</p>`;
    const shown = histAll ? ev : ev.slice(0, 25);
    let out = '', last = '';
    shown.forEach(e => {
      const dl = dayLabel(e.at);
      if (dl !== last) { out += `<li class="hday">${esc(dl)}</li>`; last = dl; }
      out += `<li class="${e.cls}"><span class="emo">${esc(e.icon || '⭐')}</span><span class="ht">${esc(e.text)}</span><b>${esc(e.v)}</b></li>`;
    });
    return `<ul class="hist">${out}</ul>${!histAll && ev.length > shown.length ? `<button class="more" id="histMore">${esc(t('histMore'))}</button>` : ''}`;
  }

  function itemArt(it, big) {
    if (it.kind === 'privilege') return `<span class="emo">${esc(it.icon || '🎟️')}</span>`;
    const eq = {}; eq[it.slot] = it.art;
    const m = Object.assign({}, data.monster, { equip: big ? Object.assign({}, (data.monster || {}).equip, eq) : eq });
    const cls = window.Cosmetics ? Cosmetics.cardClasses(eq) : '';
    return `<div class="mini-card${cls}"><div class="mwrap">${Monsters.render(m, { phase: data.phase === 'huevo' ? 'cria' : data.phase, size: 78, shadow: false })}</div></div>`;
  }
  function stateChip(it) {
    const s = it.state;
    if (s === 'ok') return `<span class="chip ok">${esc(t('st_ok'))}</span>`;
    if (s === 'coins') return `<span class="chip">${esc(t('st_coins', { n: it.missing }))}</span>`;
    if (s === 'phase') return `<span class="chip">${esc(t('st_phase', { phase: t('phases')[it.minPhase] || '' }))}</span>`;
    if (s === 'owned') return `<span class="chip own">✓ ${esc(t('st_owned'))}</span>`;
    if (s === 'soldout') return `<span class="chip">${esc(t('st_soldout'))}</span>`;
    if (s === 'weekly') return `<span class="chip">${esc(t('st_weekly'))}</span>`;
    return '';
  }

  function render(key) {
    const d = data;
    const pendAll = d.shopUrl ? pendingOrders() : [];
    // Lo comprado desde casa se ve ya puesto en su monstruo
    const m = Object.assign({}, d.monster || {});
    pendAll.filter(p => p.kind === 'cosmetic' && p.slot && p.art).forEach(p => { m.equip = Object.assign({}, m.equip); m.equip[p.slot] = p.art; });
    const P = d.phases || ['huevo', 'cria', 'joven', 'adulto', 'heroico', 'legendario', 'mitico'];
    const ci = P.indexOf(d.phase);
    const name = d.name ? esc(d.name) : '';
    const cardCls = window.Cosmetics && m.equip ? Cosmetics.cardClasses(m.equip) : '';
    const saved = savedList().some(s => s.key === key);
    const items = (d.items || []).filter(it => filter === 'all' || it.state === 'ok');
    const cos = items.filter(it => it.kind === 'cosmetic'), priv = items.filter(it => it.kind === 'privilege');
    const pendList = pendAll;
    const reserved = pendList.reduce((a, p) => a + (Number(p.price) || 0), 0), avail = Math.max(0, (Number(d.coins) || 0) - reserved);
    const isPend = (it) => pendList.some(p => p.i === it.id);
    const buyBtn = (it) => !d.shopUrl || !it.id ? '' : isPend(it) ? `<span class="chip own">✓ ${esc(it.kind === 'cosmetic' ? t('mine') : t('bought'))}</span>` : it.state === 'ok' && it.price <= avail ? `<button class="buy" data-buy="${esc(it.id)}">🛒 ${esc(t('buy'))}</button>` : '';
    const shopGrid = (list, g) => { const all = expanded[g] || list.length <= CAP + 1; const shown = all ? list : list.slice(0, CAP); return `<div class="items">${shown.map(it => `<div class="item st-${esc(it.state)}"><div class="art">${itemArt(it)}</div><div class="iname">${esc(nm(it))}</div><div class="price">🪙 ${Number(it.price) || 0}</div>${isPend(it) || (d.shopUrl && it.state === 'ok' && it.price <= avail) ? '' : stateChip(it)}${buyBtn(it)}</div>`).join('')}</div>${all ? '' : `<button class="more" data-more="${g}">${esc(t('seeAll', { n: list.length }))}</button>`}`; };
    const homeV = pendAll.filter(p => p.kind === 'privilege').map(p => ({ icon: p.icon, es: p.es, va: p.va, status: 'pending', home: true }));
    const pend = homeV.concat((d.vouchers || []).filter(v => v.status === 'pending')), done = (d.vouchers || []).filter(v => v.status !== 'pending');
    const howExtra = [];
    if (d.bonus && d.bonus.on) howExtra.push(t('howBonus', { time: d.bonus.time, n: d.bonus.points }));
    if (m.drawing) howExtra.push(t('howDraw'));

    const firstPaint = shownKey !== key; shownKey = key;
    $app.innerHTML = header() + `<main class="kid${firstPaint ? ' enter' : ''}">
      <section class="hero"><div class="mini-card big${cardCls}"><div class="mwrap">${Monsters.render(m, { phase: d.phase, size: 250 })}</div>${name ? `<div class="name">${name}</div>` : ''}</div>
        <h1>${name ? esc(t('monsterOf', { name: d.name })) : esc(t('yourMonster'))}</h1><span class="phase-chip">${esc(t('phases')[d.phase] || '')}</span></section>
      <section class="stats"><div class="stat"><b>⭐ ${Number(d.stars) || 0}</b><span>${esc(t('stars'))}</span></div><div class="stat coin"><b>🪙 <span class="cnt" data-to="${avail}">${avail}</span></b><span>${esc(t('coins'))}${reserved ? `<br><small>🏠 ${esc(t('spentHome', { n: reserved }))}</small>` : ''}</span></div></section>
      <section class="box next">${d.next ? `<div class="bar"><i style="width:${Math.round((d.next.progress || 0) * 100)}%"></i></div><p>${esc(t('toNext', { n: d.next.missing, phase: t('phases')[d.next.phase] || '' }))}</p>` : `<p class="max">🏆 ${esc(t('maxPhase'))}</p>`}</section>
      <section class="box"><h2>${esc(t('path'))}</h2><div class="track-scroll"><div class="track">${P.map((p, i) => `<div class="tr-step ${i < ci ? 'done' : ''} ${i === ci ? 'now' : ''} ${i > ci ? 'todo' : ''}">${Monsters.render(m, { phase: p, size: 64, shadow: false })}<small>${esc(t('phases')[p])}</small></div>`).join('')}</div></div></section>
      <section class="box week"><h2>${esc(t('week'))}</h2>${d.week && (d.week.stars || d.week.bonusDays) ? `<p><b>${esc(t('weekStars', { n: d.week.stars || 0 }))}</b>${d.week.bonusDays ? ` · 🌟 ${esc(t('bonusDays', { n: d.week.bonusDays }))}` : ''}</p>` : `<p class="soft">${esc(t('weekNone'))}</p>`}</section>
      ${d.goal ? `<section class="box goal"><h2>🐷 ${esc(t('saving'))}</h2><p><b>${esc(nm(d.goal))}</b> · 🪙 ${Math.min(d.coins, d.goal.price)}/${d.goal.price}</p><div class="bar"><i style="width:${Math.min(100, Math.round(100 * (d.coins || 0) / Math.max(1, d.goal.price)))}%"></i></div></section>` : ''}
      <section class="box shop"><h2>🛍️ ${esc(t('shop'))}</h2><p class="soft">${esc(d.shopUrl ? t('shopNoteHome') : t('shopNote'))}</p>${pendList.length ? `<p class="homenote">${esc(t('homeNote'))}</p>` : ''}
        <div class="filters"><button data-f="can" class="${filter === 'can' ? 'on' : ''}">${esc(t('filterCan'))}</button><button data-f="all" class="${filter === 'all' ? 'on' : ''}">${esc(t('filterAll'))}</button></div>
        ${cos.length ? `<h3>${esc(t('cos'))}</h3>${shopGrid(cos, 'cos')}` : ''}${priv.length ? `<h3>${esc(t('priv'))}</h3>${shopGrid(priv, 'priv')}` : ''}
        ${d.mystery ? `<div class="mystery">🎁 <b>${esc(t('mystery'))}</b> <span class="soft">(${esc(t('mysteryNote'))})</span> · 🪙 ${d.mystery} ${(d.coins || 0) >= d.mystery ? `<span class="chip ok">${esc(t('st_ok'))}</span>` : ''}</div>` : ''}</section>
      <section class="box"><h2>🎟️ ${esc(t('vouchers'))}</h2>${pend.length + done.length ? `<ul class="vlist">${pend.concat(done).map(v => `<li><span class="emo">${esc(v.icon || '🎟️')}</span><span class="vn">${esc(nm(v))}${v.home ? ' 🏠' : ''}</span><span class="chip ${v.status === 'pending' ? 'pend' : 'own'}">${esc(v.status === 'pending' ? t('vPending') : t('vRedeemed'))}</span></li>`).join('')}</ul>` : `<p class="soft">${esc(t('noVouchers'))}</p>`}</section>
      <section class="box"><h2>📜 ${esc(t('history'))}</h2>${historyHtml()}</section>
      ${(d.goals || []).length ? `<section class="box"><h2>👥 ${esc(t('goals'))}</h2>${d.goals.map(g => `<div class="goalrow"><div><span class="emo">${esc(g.icon || '🎉')}</span> <b>${esc(nm(g))}</b> ${g.status === 'done' || g.total >= g.target ? `<span class="chip ok">${esc(t('goalDone'))}</span>` : ''}</div><div class="bar"><i style="width:${Math.min(100, Math.round(100 * g.total / Math.max(1, g.target)))}%"></i></div><small>🪙 ${g.total}/${g.target}${g.mine ? ' · ' + esc(t('goalMine', { n: g.mine })) : ''}</small></div>`).join('')}</section>` : ''}
      <section class="box how"><details><summary>${esc(t('how'))}</summary><ul>${t('howText').concat(howExtra).map(x => `<li>${esc(x)}</li>`).join('')}</ul></details></section>
      <footer class="foot"><p>${esc(t('updated', { date: fmtDate(d.updated) }))}</p><p class="soft">🔒 ${esc(t('privacy'))}</p>
        <button class="btn ${saved ? 'ghost' : ''}" id="save">${esc(saved ? t('forget') : t('remember'))}</button>${saved ? `<p class="soft">✓ ${esc(t('remembered'))}</p>` : ''}<p class="soft small">${esc(t('homeHint'))}</p></footer>
    </main>`;
    bindHeader();
    $app.querySelectorAll('.filters [data-f]').forEach(b => b.onclick = () => { filter = b.dataset.f; expanded = {}; render(key); });
    $app.querySelectorAll('[data-more]').forEach(b => b.onclick = () => { expanded[b.dataset.more] = true; const y = window.scrollY; render(key); window.scrollTo(0, y); });
    $app.querySelectorAll('[data-buy]').forEach(b => b.onclick = () => { const it = (d.items || []).find(x => x.id === b.dataset.buy); if (it) askBuy(key, it); });
    // Las monedas bajan contando cuando se compra algo
    const cnt = $app.querySelector('.stat.coin .cnt');
    if (cnt) { const to = Number(cnt.dataset.to) || 0; if (shownCoins !== null && shownCoins !== to && !reduceMotion()) countTo(cnt, shownCoins, to); shownCoins = to; }
    const hm = document.getElementById('histMore'); if (hm) hm.onclick = () => { histAll = true; const y = window.scrollY; render(key); window.scrollTo(0, y); };
    const sc = $app.querySelector('.track-scroll'), now = sc && sc.querySelector('.tr-step.now');
    if (sc && now) sc.scrollLeft = Math.max(0, now.offsetLeft - sc.clientWidth / 2 + now.offsetWidth / 2);
    document.getElementById('save').onclick = () => {
      let list = savedList();
      if (list.some(s => s.key === key)) list = list.filter(s => s.key !== key);
      else list.push({ key, name: d.name || '' });
      setSaved(list); render(key);
    };
    document.title = (d.name ? d.name + ' · ' : '') + 'Monstruitos';
  }

  window.addEventListener('hashchange', route);
  route();
})();
