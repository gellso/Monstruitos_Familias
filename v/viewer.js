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
      notFound: 'Este código ya no funciona. Puede que el tutor lo haya renovado: pídele uno nuevo.', netError: 'No se ha podido conectar. Revisa la conexión a internet e inténtalo de nuevo.', oldPhone: 'Este navegador es demasiado antiguo para abrir la ficha cifrada. Prueba con otro navegador o actualiza el móvil.',
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
      phases: { huevo: 'Huevo', cria: 'Cría', joven: 'Joven', adulto: 'Adulto', heroico: 'Heroico', legendario: 'Legendario', mitico: 'Mítico' }
    },
    va: {
      loading: 'Obrint el monstre…', hello: 'Hola!', welcome: 'Escaneja amb la càmera del mòbil el codi QR que t’ha donat el tutor o la tutora i veuràs ací el monstre del teu fill o filla.',
      saved: 'Guardats en aquest mòbil', badKey: 'Aquest enllaç no està complet. Torna a escanejar el codi QR o demana’n un de nou al tutor.',
      notFound: 'Aquest codi ja no funciona. Pot ser que el tutor l’haja renovat: demana-li’n un de nou.', netError: 'No s’ha pogut connectar. Revisa la connexió a internet i torna-ho a provar.', oldPhone: 'Aquest navegador és massa antic per a obrir la fitxa xifrada. Prova amb un altre navegador o actualitza el mòbil.',
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
      phases: { huevo: 'Ou', cria: 'Cria', joven: 'Jove', adulto: 'Adult', heroico: 'Heroic', legendario: 'Llegendari', mitico: 'Mític' }
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

  let data = null, loadedKey = '', filter = 'can', expanded = {};
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
    if (!langChosen && (data.lang === 'va' || data.lang === 'es')) lang = data.lang;
    loadedKey = key;
    window.Drawings = { get: (f) => (data.drawings && data.drawings[f]) || null };
    render(key);
  }

  function itemArt(it) {
    if (it.kind === 'privilege') return `<span class="emo">${esc(it.icon || '🎟️')}</span>`;
    const eq = {}; eq[it.slot] = it.art;
    const m = Object.assign({}, data.monster, { equip: eq });
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
    const d = data, m = d.monster || {};
    const P = d.phases || ['huevo', 'cria', 'joven', 'adulto', 'heroico', 'legendario', 'mitico'];
    const ci = P.indexOf(d.phase);
    const name = d.name ? esc(d.name) : '';
    const cardCls = window.Cosmetics && m.equip ? Cosmetics.cardClasses(m.equip) : '';
    const saved = savedList().some(s => s.key === key);
    const items = (d.items || []).filter(it => filter === 'all' || it.state === 'ok');
    const cos = items.filter(it => it.kind === 'cosmetic'), priv = items.filter(it => it.kind === 'privilege');
    const shopGrid = (list, g) => { const all = expanded[g] || list.length <= CAP + 1; const shown = all ? list : list.slice(0, CAP); return `<div class="items">${shown.map(it => `<div class="item st-${esc(it.state)}"><div class="art">${itemArt(it)}</div><div class="iname">${esc(nm(it))}</div><div class="price">🪙 ${Number(it.price) || 0}</div>${stateChip(it)}</div>`).join('')}</div>${all ? '' : `<button class="more" data-more="${g}">${esc(t('seeAll', { n: list.length }))}</button>`}`; };
    const pend = (d.vouchers || []).filter(v => v.status === 'pending'), done = (d.vouchers || []).filter(v => v.status !== 'pending');
    const howExtra = [];
    if (d.bonus && d.bonus.on) howExtra.push(t('howBonus', { time: d.bonus.time, n: d.bonus.points }));
    if (m.drawing) howExtra.push(t('howDraw'));

    $app.innerHTML = header() + `<main class="kid">
      <section class="hero"><div class="mini-card big${cardCls}"><div class="mwrap">${Monsters.render(m, { phase: d.phase, size: 250 })}</div>${name ? `<div class="name">${name}</div>` : ''}</div>
        <h1>${name ? esc(t('monsterOf', { name: d.name })) : esc(t('yourMonster'))}</h1><span class="phase-chip">${esc(t('phases')[d.phase] || '')}</span></section>
      <section class="stats"><div class="stat"><b>⭐ ${Number(d.stars) || 0}</b><span>${esc(t('stars'))}</span></div><div class="stat coin"><b>🪙 ${Number(d.coins) || 0}</b><span>${esc(t('coins'))}</span></div></section>
      <section class="box next">${d.next ? `<div class="bar"><i style="width:${Math.round((d.next.progress || 0) * 100)}%"></i></div><p>${esc(t('toNext', { n: d.next.missing, phase: t('phases')[d.next.phase] || '' }))}</p>` : `<p class="max">🏆 ${esc(t('maxPhase'))}</p>`}</section>
      <section class="box"><h2>${esc(t('path'))}</h2><div class="track-scroll"><div class="track">${P.map((p, i) => `<div class="tr-step ${i < ci ? 'done' : ''} ${i === ci ? 'now' : ''} ${i > ci ? 'todo' : ''}">${Monsters.render(m, { phase: p, size: 64, shadow: false })}<small>${esc(t('phases')[p])}</small></div>`).join('')}</div></div></section>
      <section class="box week"><h2>${esc(t('week'))}</h2>${d.week && (d.week.stars || d.week.bonusDays) ? `<p><b>${esc(t('weekStars', { n: d.week.stars || 0 }))}</b>${d.week.bonusDays ? ` · 🌟 ${esc(t('bonusDays', { n: d.week.bonusDays }))}` : ''}</p>` : `<p class="soft">${esc(t('weekNone'))}</p>`}</section>
      ${d.goal ? `<section class="box goal"><h2>🐷 ${esc(t('saving'))}</h2><p><b>${esc(nm(d.goal))}</b> · 🪙 ${Math.min(d.coins, d.goal.price)}/${d.goal.price}</p><div class="bar"><i style="width:${Math.min(100, Math.round(100 * (d.coins || 0) / Math.max(1, d.goal.price)))}%"></i></div></section>` : ''}
      <section class="box shop"><h2>🛍️ ${esc(t('shop'))}</h2><p class="soft">${esc(t('shopNote'))}</p>
        <div class="filters"><button data-f="can" class="${filter === 'can' ? 'on' : ''}">${esc(t('filterCan'))}</button><button data-f="all" class="${filter === 'all' ? 'on' : ''}">${esc(t('filterAll'))}</button></div>
        ${cos.length ? `<h3>${esc(t('cos'))}</h3>${shopGrid(cos, 'cos')}` : ''}${priv.length ? `<h3>${esc(t('priv'))}</h3>${shopGrid(priv, 'priv')}` : ''}
        ${d.mystery ? `<div class="mystery">🎁 <b>${esc(t('mystery'))}</b> <span class="soft">(${esc(t('mysteryNote'))})</span> · 🪙 ${d.mystery} ${(d.coins || 0) >= d.mystery ? `<span class="chip ok">${esc(t('st_ok'))}</span>` : ''}</div>` : ''}</section>
      <section class="box"><h2>🎟️ ${esc(t('vouchers'))}</h2>${(d.vouchers || []).length ? `<ul class="vlist">${pend.concat(done).map(v => `<li><span class="emo">${esc(v.icon || '🎟️')}</span><span class="vn">${esc(nm(v))}</span><span class="chip ${v.status === 'pending' ? 'pend' : 'own'}">${esc(v.status === 'pending' ? t('vPending') : t('vRedeemed'))}</span></li>`).join('')}</ul>` : `<p class="soft">${esc(t('noVouchers'))}</p>`}</section>
      ${(d.goals || []).length ? `<section class="box"><h2>👥 ${esc(t('goals'))}</h2>${d.goals.map(g => `<div class="goalrow"><div><span class="emo">${esc(g.icon || '🎉')}</span> <b>${esc(nm(g))}</b> ${g.status === 'done' || g.total >= g.target ? `<span class="chip ok">${esc(t('goalDone'))}</span>` : ''}</div><div class="bar"><i style="width:${Math.min(100, Math.round(100 * g.total / Math.max(1, g.target)))}%"></i></div><small>🪙 ${g.total}/${g.target}${g.mine ? ' · ' + esc(t('goalMine', { n: g.mine })) : ''}</small></div>`).join('')}</section>` : ''}
      <section class="box how"><details><summary>${esc(t('how'))}</summary><ul>${t('howText').concat(howExtra).map(x => `<li>${esc(x)}</li>`).join('')}</ul></details></section>
      <footer class="foot"><p>${esc(t('updated', { date: fmtDate(d.updated) }))}</p><p class="soft">🔒 ${esc(t('privacy'))}</p>
        <button class="btn ${saved ? 'ghost' : ''}" id="save">${esc(saved ? t('forget') : t('remember'))}</button>${saved ? `<p class="soft">✓ ${esc(t('remembered'))}</p>` : ''}<p class="soft small">${esc(t('homeHint'))}</p></footer>
    </main>`;
    bindHeader();
    $app.querySelectorAll('.filters [data-f]').forEach(b => b.onclick = () => { filter = b.dataset.f; expanded = {}; render(key); });
    $app.querySelectorAll('[data-more]').forEach(b => b.onclick = () => { expanded[b.dataset.more] = true; const y = window.scrollY; render(key); window.scrollTo(0, y); });
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
