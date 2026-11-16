/* Monstruitos — cosméticos para los monstruos (diseño original, todo en SVG) */
(function () {
  'use strict';
  const INK = '#2d2440';
  const ST = `stroke="${INK}" stroke-width="3" stroke-linejoin="round"`;
  const star = (x, y, s, fill) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 -10 L3 -3 L10 0 L3 3 L0 10 L-3 3 L-10 0 L-3 -3 Z" fill="${fill || '#ffd54a'}" stroke="${INK}" stroke-width="${2 / s}"/></g>`;
  const heart = (x, y, s, fill) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 4 C -8 -2 -10 -8 -5 -10 C -2 -11 0 -9 0 -7 C 0 -9 2 -11 5 -10 C 10 -8 8 -2 0 4 Z" fill="${fill || '#ff6fae'}" stroke="${INK}" stroke-width="${1.6 / s}"/></g>`;

  /*
   * Ranuras (slot):
   *  sobre el cuerpo (necesitan anclajes): hat, bow, glasses, neck, cape
   *  para cualquier monstruo: aura, pedestal, pet, particles, bg, frame, banner, dance
   */
  const SLOTS = ['hat', 'bow', 'glasses', 'neck', 'cape', 'aura', 'pedestal', 'pet', 'particles', 'bg', 'frame', 'banner', 'dance'];
  const BODY_SLOTS = ['hat', 'bow', 'glasses', 'neck', 'cape'];
  const SLOT_ICON = { hat: '🎩', bow: '🎀', glasses: '👓', neck: '🎗️', cape: '🧥', aura: '🌈', pedestal: '🏝️', pet: '🐣', particles: '✨', bg: '🖼️', frame: '🔲', banner: '🏷️', dance: '💃' };

  // Catálogo base de cosméticos (precio orientativo; el maestro lo cambia en la tienda)
  const DEFS = {
    gorro: { slot: 'hat', es: 'Gorro de fiesta', va: 'Barret de festa', price: 10 },
    gorra: { slot: 'hat', es: 'Gorra', va: 'Gorra', price: 10 },
    mago: { slot: 'hat', es: 'Sombrero de mago', va: 'Barret de mag', price: 30 },
    corona: { slot: 'hat', es: 'Corona', va: 'Corona', price: 70, minPhase: 'legendario' },
    gorro_navidad: { slot: 'hat', es: 'Gorro de Navidad', va: 'Barret de Nadal', price: 15, season: ['12-01', '01-07'] },
    gorro_calabaza: { slot: 'hat', es: 'Sombrero calabaza', va: 'Barret carabassa', price: 15, season: ['10-15', '11-15'] },
    lazo: { slot: 'bow', es: 'Lazo', va: 'Llaç', price: 5 },
    flor: { slot: 'bow', es: 'Flor', va: 'Flor', price: 5 },
    gafas: { slot: 'glasses', es: 'Gafas', va: 'Ulleres', price: 8 },
    gafas_sol: { slot: 'glasses', es: 'Gafas de sol', va: 'Ulleres de sol', price: 15 },
    gafas_estrella: { slot: 'glasses', es: 'Gafas de estrella', va: 'Ulleres d’estrela', price: 25 },
    pajarita: { slot: 'neck', es: 'Pajarita', va: 'Corbatí', price: 8 },
    medalla: { slot: 'neck', es: 'Medalla', va: 'Medalla', price: 40 },
    capa_roja: { slot: 'cape', es: 'Capa roja', va: 'Capa roja', price: 30 },
    capa_dorada: { slot: 'cape', es: 'Capa dorada', va: 'Capa daurada', price: 80, minPhase: 'heroico' },
    aura_arcoiris: { slot: 'aura', es: 'Aura arcoíris', va: 'Aura arc de Sant Martí', price: 60 },
    aura_fuego: { slot: 'aura', es: 'Aura de fuego', va: 'Aura de foc', price: 60 },
    peana_hierba: { slot: 'pedestal', es: 'Isla de hierba', va: 'Illa d’herba', price: 15 },
    peana_oro: { slot: 'pedestal', es: 'Pedestal de oro', va: 'Pedestal d’or', price: 90, minPhase: 'legendario' },
    pet_pollito: { slot: 'pet', es: 'Pollito amigo', va: 'Pollet amic', price: 40 },
    pet_gusi: { slot: 'pet', es: 'Gusi, el blandito', va: 'Gusi, el bovet', price: 40 },
    chispas: { slot: 'particles', es: 'Chispas', va: 'Espurnes', price: 20 },
    corazones: { slot: 'particles', es: 'Corazones', va: 'Cors', price: 20 },
    fondo_espacio: { slot: 'bg', es: 'Fondo del espacio', va: 'Fons de l’espai', price: 25 },
    fondo_selva: { slot: 'bg', es: 'Fondo de selva', va: 'Fons de selva', price: 20 },
    fondo_mar: { slot: 'bg', es: 'Fondo del mar', va: 'Fons de la mar', price: 20 },
    marco_oro: { slot: 'frame', es: 'Marco de oro', va: 'Marc d’or', price: 30 },
    marco_arcoiris: { slot: 'frame', es: 'Marco arcoíris', va: 'Marc arc de Sant Martí', price: 30 },
    cartel_oro: { slot: 'banner', es: 'Nombre dorado', va: 'Nom daurat', price: 15 },
    baile_giro: { slot: 'dance', es: 'Baile: vuelta', va: 'Ball: volta', price: 20 },
    baile_salto: { slot: 'dance', es: 'Baile: supersalto', va: 'Ball: supersalt', price: 15 }
  };

  // ---------- Dibujos (a: anclaje en coordenadas del monstruo, s: escala) ----------
  const ART = {
    gorro: (a, s) => `<g transform="translate(${a.x - 4 * s} ${a.y + 6 * s}) scale(${s}) rotate(-10)">
      <path d="M-22 0 L0 -46 L22 0 Z" fill="#6f86f2" ${ST}/><path d="M-14 -16 L14 -16 M-7 -31 L7 -31" stroke="#f5d34a" stroke-width="5" stroke-linecap="round"/>
      <circle cy="-48" r="7" fill="#f5d34a" ${ST}/></g>`,
    gorra: (a, s) => `<g transform="translate(${a.x} ${a.y + 8 * s}) scale(${s})">
      <path d="M-26 0 Q-26 -26 0 -26 Q26 -26 26 0 Z" fill="#ff6b6b" ${ST}/><path d="M18 -2 Q40 -4 44 4 Q30 6 18 4 Z" fill="#e14d4d" ${ST}/>
      <circle cy="-26" r="4" fill="#fff" ${ST}/><path d="M-10 -10 L10 -10" stroke="#fff" stroke-width="4" stroke-linecap="round"/></g>`,
    mago: (a, s) => `<g transform="translate(${a.x} ${a.y + 8 * s}) scale(${s})">
      <ellipse rx="36" ry="9" fill="#5b3fe0" ${ST}/><path d="M-22 -4 Q-6 -40 6 -64 Q12 -50 22 -4 Z" fill="#7b5cff" ${ST}/>
      ${star(-4, -26, .8)}${star(8, -44, .55)}<path d="M-20 -8 Q0 -2 20 -8" fill="none" stroke="#ffd54a" stroke-width="4"/></g>`,
    corona: (a, s) => `<g transform="translate(${a.x} ${a.y + 6 * s}) scale(${s})" class="cos-twinkle">
      <path d="M-26 0 L-28 -26 L-14 -12 L0 -32 L14 -12 L28 -26 L26 0 Z" fill="#ffd23f" ${ST}/>
      <circle cx="0" cy="-10" r="5" fill="#ff4f8b" ${ST}/><circle cx="-16" cy="-6" r="3" fill="#3fa9ff"/><circle cx="16" cy="-6" r="3" fill="#2fcf95"/></g>`,
    gorro_navidad: (a, s) => `<g transform="translate(${a.x} ${a.y + 6 * s}) scale(${s})">
      <path d="M-24 0 Q-10 -44 20 -40 Q34 -36 34 -18 L24 -22 Q14 -26 20 0 Z" fill="#e8413c" ${ST}/>
      <rect x="-28" y="-6" width="52" height="12" rx="6" fill="#fff" ${ST}/><circle cx="34" cy="-16" r="7" fill="#fff" ${ST}/></g>`,
    gorro_calabaza: (a, s) => `<g transform="translate(${a.x} ${a.y + 4 * s}) scale(${s})">
      <ellipse cy="-14" rx="26" ry="18" fill="#ff8a3c" ${ST}/><path d="M-9 -30 Q-12 -14 -9 2 M9 -30 Q12 -14 9 2" fill="none" stroke="#d96a1c" stroke-width="3"/>
      <path d="M0 -32 Q2 -40 8 -42" fill="none" stroke="#2fa860" stroke-width="5" stroke-linecap="round"/></g>`,
    lazo: (a, s) => `<g transform="translate(${a.x + (a.w || 60) * 0.32} ${a.y + 10 * s}) scale(${s}) rotate(18)">
      <path d="M0 0 L-20 -12 Q-25 0 -20 12 Z" fill="#ff5d8f" ${ST}/><path d="M0 0 L20 -12 Q25 0 20 12 Z" fill="#ff5d8f" ${ST}/><circle r="6" fill="#ff86aa" ${ST}/></g>`,
    flor: (a, s) => `<g transform="translate(${a.x - (a.w || 60) * 0.32} ${a.y + 12 * s}) scale(${s})">
      ${[0, 72, 144, 216, 288].map(r => `<ellipse rx="7" ry="11" transform="rotate(${r}) translate(0 -10)" fill="#fff" stroke="${INK}" stroke-width="2.5"/>`).join('')}<circle r="7" fill="#f5d34a" stroke="${INK}" stroke-width="2.5"/></g>`,
    gafas: (a, s) => { const g = (a.w || 50) / 2, r = 14 * s; return `<g fill="rgba(255,255,255,.25)" stroke="${INK}" stroke-width="${3.5 * s}"><circle cx="${a.x - g}" cy="${a.y}" r="${r}"/><circle cx="${a.x + g}" cy="${a.y}" r="${r}"/><path d="M${a.x - g + r} ${a.y} Q${a.x} ${a.y - 6 * s} ${a.x + g - r} ${a.y}" fill="none"/></g>`; },
    gafas_sol: (a, s) => { const g = (a.w || 50) / 2, r = 15 * s; return `<g stroke="${INK}" stroke-width="${3.5 * s}"><path d="M${a.x - g - r} ${a.y - r * .6} H${a.x - g + r} Q${a.x - g + r} ${a.y + r} ${a.x - g} ${a.y + r} Q${a.x - g - r} ${a.y + r} ${a.x - g - r} ${a.y - r * .6} Z" fill="#2d2440"/><path d="M${a.x + g - r} ${a.y - r * .6} H${a.x + g + r} Q${a.x + g + r} ${a.y + r} ${a.x + g} ${a.y + r} Q${a.x + g - r} ${a.y + r} ${a.x + g - r} ${a.y - r * .6} Z" fill="#2d2440"/><path d="M${a.x - g + r} ${a.y - r * .5} H${a.x + g - r}" fill="none"/></g><path d="M${a.x - g - r * .5} ${a.y - r * .2} l${r * .5} 0" stroke="#fff" stroke-width="${3 * s}" stroke-linecap="round" opacity=".7"/>`; },
    gafas_estrella: (a, s) => { const g = (a.w || 50) / 2; return `<g>${star(a.x - g, a.y, 1.9 * s, '#ff6fae')}${star(a.x + g, a.y, 1.9 * s, '#ff6fae')}<path d="M${a.x - g + 12 * s} ${a.y} H${a.x + g - 12 * s}" stroke="${INK}" stroke-width="${3 * s}"/></g>`; },
    pajarita: (a, s) => `<g transform="translate(${a.x} ${a.y}) scale(${s})"><path d="M0 0 L-20 -11 L-20 11 Z" fill="#f47a6e" ${ST}/><path d="M0 0 L20 -11 L20 11 Z" fill="#f47a6e" ${ST}/><rect x="-6" y="-6" width="12" height="12" rx="3" fill="#ff9d8f" ${ST}/></g>`,
    medalla: (a, s) => `<g transform="translate(${a.x} ${a.y - 6 * s}) scale(${s})"><path d="M-14 -8 L-4 18 L4 18 L14 -8" fill="#3fa9ff" ${ST}/><circle cy="26" r="11" fill="#ffd23f" ${ST}/>${star(0, 26, .7, '#fff3b0')}</g>`,
    capa_roja: (a, s) => cape(a, s, '#e8413c', '#b8282a'),
    capa_dorada: (a, s) => cape(a, s, '#ffcf3a', '#e0a10f', true),
    aura_arcoiris: (a, s, id) => `<defs><radialGradient id="ar${id}"><stop offset=".55" stop-color="#fff" stop-opacity="0"/><stop offset=".68" stop-color="#ff6fae" stop-opacity=".35"/><stop offset=".76" stop-color="#ffc83d" stop-opacity=".35"/><stop offset=".84" stop-color="#2fcf95" stop-opacity=".35"/><stop offset=".92" stop-color="#3fa9ff" stop-opacity=".35"/><stop offset="1" stop-color="#7b5cff" stop-opacity="0"/></radialGradient></defs><g class="cos-aura"><circle cx="100" cy="112" r="98" fill="url(#ar${id})"/></g>`,
    aura_fuego: (a, s, id) => `<defs><radialGradient id="af${id}"><stop offset=".45" stop-color="#ffd23f" stop-opacity=".5"/><stop offset=".75" stop-color="#ff7a2c" stop-opacity=".35"/><stop offset="1" stop-color="#ff3a1c" stop-opacity="0"/></radialGradient></defs><g class="cos-fire"><path d="M100 4 C120 30 150 20 156 50 C176 60 186 90 178 120 C190 150 168 186 100 188 C32 186 10 150 22 120 C14 90 24 60 44 50 C50 20 80 30 100 4 Z" fill="url(#af${id})"/></g>`,
    peana_hierba: (a) => `<g><ellipse cx="100" cy="${a.ground + 4}" rx="70" ry="14" fill="#7fd35a" stroke="${INK}" stroke-width="3"/><ellipse cx="100" cy="${a.ground + 10}" rx="64" ry="9" fill="#a0753f" opacity=".5"/>${[46, 62, 140, 154].map(x => `<path d="M${x} ${a.ground + 2} l3 -9 l3 9 l3 -7 l2 7" fill="#4fb33a" stroke="${INK}" stroke-width="1.5"/>`).join('')}</g>`,
    peana_oro: (a) => `<g><rect x="36" y="${a.ground - 2}" width="128" height="12" rx="6" fill="#ffd23f" stroke="${INK}" stroke-width="3"/><rect x="28" y="${a.ground + 8}" width="144" height="10" rx="5" fill="#f0b21c" stroke="${INK}" stroke-width="3"/>${star(100, a.ground + 4, .5, '#fff3b0')}</g>`,
    pet_pollito: (a) => `<g transform="translate(172 ${a.ground - 4})"><g class="cos-pet"><ellipse cy="2" rx="12" ry="3" fill="${INK}" opacity=".15"/><ellipse cy="-12" rx="13" ry="12" fill="#ffd23f" ${ST}/><circle cx="-4" cy="-14" r="2.5" fill="${INK}"/><circle cx="4" cy="-14" r="2.5" fill="${INK}"/><path d="M-3 -9 L0 -5 L3 -9 Z" fill="#ff8a3c" stroke="${INK}" stroke-width="1.5"/><path d="M-2 -24 q2 -6 4 0" fill="none" stroke="${INK}" stroke-width="2"/></g></g>`,
    pet_gusi: (a) => `<g transform="translate(172 ${a.ground - 2})"><g class="cos-pet"><ellipse cy="2" rx="13" ry="3" fill="${INK}" opacity=".15"/><path d="M-14 0 Q-16 -22 0 -24 Q16 -22 14 0 Z" fill="#a98bf0" ${ST}/><circle cx="-5" cy="-12" r="3.5" fill="#fff" stroke="${INK}" stroke-width="1.5"/><circle cx="5" cy="-12" r="3.5" fill="#fff" stroke="${INK}" stroke-width="1.5"/><circle cx="-4.5" cy="-11.5" r="1.8" fill="${INK}"/><circle cx="5.5" cy="-11.5" r="1.8" fill="${INK}"/><path d="M-3 -5 Q0 -2 3 -5" fill="none" stroke="${INK}" stroke-width="1.5"/></g></g>`,
    chispas: () => `<g class="cos-particles">${star(30, 60, .7)}${star(170, 40, .6)}${star(176, 120, .5)}${star(22, 130, .55)}${star(150, 170, .4)}</g>`,
    corazones: () => `<g class="cos-hearts">${heart(28, 120, 1)}${heart(172, 100, .9)}${heart(40, 60, .8)}${heart(162, 160, .7)}</g>`
  };
  function cape(a, s, c1, c2, gold) {
    const w = (a.w || 100) * 0.42, x = a.x, y = a.y - 22 * s, g = a.ground || 184;
    return `<path d="M${x - w} ${y} Q${x - w * 1.5} ${(y + g) / 2} ${x - w * 1.65} ${g - 4} Q${x - w * .8} ${g + 4} ${x} ${g - 6} Q${x + w * .8} ${g + 4} ${x + w * 1.65} ${g - 4} Q${x + w * 1.5} ${(y + g) / 2} ${x + w} ${y} Z" fill="${c1}" stroke="${INK}" stroke-width="${3.5 * s}" stroke-linejoin="round"/>
      <path d="M${x - w * .6} ${y + 10} Q${x - w} ${(y + g) / 2} ${x - w * 1.1} ${g - 10}" fill="none" stroke="${c2}" stroke-width="${4 * s}" opacity=".7"/>
      ${gold ? star(x - w * 1.1, (y + g) / 2 + 10, .6 * s, '#fff3b0') + star(x + w * 1.05, (y + g) / 2 + 22, .5 * s, '#fff3b0') : ''}`;
  }

  const MONTH_DAY = (d) => String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  function inSeason(season, date) {
    if (!season) return true;
    const md = MONTH_DAY(date || new Date());
    const [a, b] = season;
    return a <= b ? (md >= a && md <= b) : (md >= a || md <= b);
  }

  /** Capas de cosméticos para un monstruo. eq: { slot: claveCosmético } */
  function layers(eq, anchors, id) {
    const out = { aura: '', pedestal: '', back: '', front: '', pet: '', particles: '', hasPedestal: false };
    if (!eq) return out;
    const draw = (slot, where) => {
      const key = eq[slot]; if (!key || !ART[key]) return;
      const a = slot === 'hat' || slot === 'bow' ? anchors.head : slot === 'glasses' ? anchors.face : slot === 'neck' || slot === 'cape' ? anchors.neck : { x: 100, y: 110, ground: anchors.ground || 184 };
      if (!a) return;
      const s = anchors.scale || 1;
      out[where] += ART[key](Object.assign({ ground: anchors.ground || 184 }, a), s, id + slot);
    };
    draw('aura', 'aura'); draw('pedestal', 'pedestal'); if (eq.pedestal && ART[eq.pedestal]) out.hasPedestal = true;
    if (anchors.neck) draw('cape', 'back');
    if (anchors.neck) draw('neck', 'front');
    if (anchors.head) { draw('bow', 'front'); draw('hat', 'front'); }
    if (anchors.face) draw('glasses', 'front');
    draw('pet', 'pet'); draw('particles', 'particles');
    return out;
  }

  // Clases de tarjeta (fondo, marco, cartel) y baile
  function cardClasses(eq) {
    if (!eq) return '';
    return ['bg', 'frame', 'banner'].map(sl => eq[sl] ? ' cos-' + eq[sl] : '').join('');
  }


  // =====================================================================
  // 1.7.5 — Catálogo ampliado (todo dibujado aquí, diseño original)
  // =====================================================================
  const flower = (x, y, r, c, mid) => `<g transform="translate(${x} ${y})">${[0, 72, 144, 216, 288].map(a => `<circle r="${r}" transform="rotate(${a}) translate(0 ${-r * 1.05})" fill="${c}" stroke="${INK}" stroke-width="1.4"/>`).join('')}<circle r="${r * .8}" fill="${mid || '#ffd23f'}" stroke="${INK}" stroke-width="1.4"/></g>`;
  const ell = (cx, cy, rx, ry) => `M${cx - rx} ${cy} a${rx} ${ry} 0 1 0 ${2 * rx} 0 a${rx} ${ry} 0 1 0 ${-2 * rx} 0 Z`;
  const bowArt = (c1, c2) => (a, s) => `<g transform="translate(${a.x + (a.w || 60) * 0.32} ${a.y + 10 * s}) scale(${s}) rotate(18)">
      <path d="M0 0 L-20 -12 Q-25 0 -20 12 Z" fill="${c1}" ${ST}/><path d="M0 0 L20 -12 Q25 0 20 12 Z" fill="${c1}" ${ST}/><circle r="6" fill="${c2}" ${ST}/></g>`;
  const clip = (inner, rot) => (a, s) => `<g transform="translate(${a.x + (a.w || 60) * 0.32} ${a.y + 10 * s}) scale(${s}) rotate(${rot || 0})">${inner}</g>`;
  const medalArt = (disc, ribbon, shine) => (a, s) => `<g transform="translate(${a.x} ${a.y - 6 * s}) scale(${s})"><path d="M-14 -8 L-4 18 L4 18 L14 -8" fill="${ribbon}" ${ST}/><circle cy="26" r="11" fill="${disc}" ${ST}/>${star(0, 26, .7, shine)}</g>`;
  const neckG = (inner) => (a, s) => `<g transform="translate(${a.x} ${a.y}) scale(${s})">${inner}</g>`;
  const hatG = (inner, dy) => (a, s) => `<g transform="translate(${a.x} ${a.y + (dy === undefined ? 8 : dy) * s}) scale(${s})">${inner}</g>`;
  // (la animación va en un <g> interior: si se animara el que lleva transform, se perdería la posición)
  const wings = (left, cls) => (a, s) => { const w = (a.w || 100) * 0.36, y = a.y - 22 * s; return `<g class="${cls || ''}"><g transform="translate(${a.x - w} ${y}) scale(${s})"><g class="wl">${left}</g></g><g transform="translate(${a.x + w} ${y}) scale(${-s} ${s})"><g class="wl">${left}</g></g></g>`; };
  const pet = (inner, dy) => (a) => `<g transform="translate(172 ${a.ground - (dy || 2)})"><g class="cos-pet">${inner}</g></g>`;
  const shadow = (rx) => `<ellipse cy="2" rx="${rx}" ry="3" fill="${INK}" opacity=".15"/>`;
  const eyes2 = (dx, y, r) => `<circle cx="${-dx}" cy="${y}" r="${r}" fill="${INK}"/><circle cx="${dx}" cy="${y}" r="${r}" fill="${INK}"/>`;
  const ring = (n, r, fn) => Array.from({ length: n }, (_, i) => { const t = i / n * Math.PI * 2; return fn(100 + Math.cos(t) * r, 112 + Math.sin(t) * r, i); }).join('');
  const floaty = (items) => `<g class="cos-floaty">${items.map(x => `<g>${x}</g>`).join('')}</g>`;
  const snow = (x, y, k) => `<g transform="translate(${x} ${y}) scale(${k})"><path d="M0 -8 V8 M-7 -4 L7 4 M-7 4 L7 -4 M-2 -6 L0 -4 L2 -6 M-2 6 L0 4 L2 6" stroke="#8fc9ff" stroke-width="2" stroke-linecap="round" fill="none"/></g>`;
  const note = (x, y, k, c) => `<g transform="translate(${x} ${y}) scale(${k})"><path d="M4 -12 V4" stroke="${INK}" stroke-width="2.4"/><path d="M4 -12 Q10 -10 11 -4" fill="none" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/><ellipse cx="0" cy="5" rx="5" ry="4" fill="${c}" stroke="${INK}" stroke-width="1.8" transform="rotate(-20 0 5)"/></g>`;
  const leaf = (x, y, k, c, r) => `<g transform="translate(${x} ${y}) scale(${k}) rotate(${r})"><path d="M0 -9 Q8 -2 0 9 Q-8 -2 0 -9 Z" fill="${c}" stroke="${INK}" stroke-width="1.5"/><path d="M0 -7 V8" stroke="${INK}" stroke-width="1" opacity=".5"/></g>`;
  const bfly = (x, y, k, c) => `<g transform="translate(${x} ${y}) scale(${k})"><path d="M0 0 Q-9 -10 -11 -2 Q-10 4 0 0 Z M0 0 Q9 -10 11 -2 Q10 4 0 0 Z" fill="${c}" stroke="${INK}" stroke-width="1.4"/><path d="M0 0 Q-6 7 -3 8 Q0 6 0 0 Z M0 0 Q6 7 3 8 Q0 6 0 0 Z" fill="${c}" stroke="${INK}" stroke-width="1.2" opacity=".85"/><path d="M0 -4 V5" stroke="${INK}" stroke-width="2" stroke-linecap="round"/></g>`;

  Object.assign(DEFS, {
    // Gorros y sombreros
    vaquero: { slot: 'hat', es: 'Sombrero vaquero', va: 'Barret de vaquer', price: 20 },
    pirata: { slot: 'hat', es: 'Sombrero pirata', va: 'Barret pirata', price: 25 },
    chef: { slot: 'hat', es: 'Gorro de chef', va: 'Barret de xef', price: 15 },
    antenas: { slot: 'hat', es: 'Antenas alienígenas', va: 'Antenes alienígenes', price: 15 },
    orejas_gato: { slot: 'hat', es: 'Orejas de gato', va: 'Orelles de gat', price: 12 },
    vikingo: { slot: 'hat', es: 'Casco vikingo', va: 'Casc víking', price: 35 },
    bruja: { slot: 'hat', es: 'Sombrero de bruja', va: 'Barret de bruixa', price: 25 },
    birrete: { slot: 'hat', es: 'Birrete de graduado', va: 'Birret de graduat', price: 50, minPhase: 'heroico' },
    helice: { slot: 'hat', es: 'Gorro con hélice', va: 'Barret amb hèlix', price: 20 },
    corona_flores: { slot: 'hat', es: 'Corona de flores', va: 'Corona de flors', price: 18 },
    tiara: { slot: 'hat', es: 'Tiara brillante', va: 'Tiara brillant', price: 35 },
    gorro_lana: { slot: 'hat', es: 'Gorro de lana', va: 'Gorro de llana', price: 10 },
    cuerno_unicornio: { slot: 'hat', es: 'Cuerno de unicornio', va: 'Banya d’unicorn', price: 40 },
    auriculares: { slot: 'hat', es: 'Auriculares', va: 'Auriculars', price: 25 },
    casco_bombero: { slot: 'hat', es: 'Casco de bombero', va: 'Casc de bomber', price: 25 },
    chistera: { slot: 'hat', es: 'Chistera', va: 'Barret de copa', price: 30, minPhase: 'adulto' },
    laurel: { slot: 'hat', es: 'Laurel dorado', va: 'Llorer daurat', price: 70, minPhase: 'legendario' },
    // Adornos del pelo
    mariposa: { slot: 'bow', es: 'Pinza mariposa', va: 'Pinça papallona', price: 8 },
    estrella_pelo: { slot: 'bow', es: 'Pinza estrella', va: 'Pinça estrela', price: 8 },
    corazon_pelo: { slot: 'bow', es: 'Pinza corazón', va: 'Pinça cor', price: 8 },
    pluma: { slot: 'bow', es: 'Pluma', va: 'Ploma', price: 10 },
    lazo_azul: { slot: 'bow', es: 'Lazo azul', va: 'Llaç blau', price: 5 },
    lazo_dorado: { slot: 'bow', es: 'Lazo dorado', va: 'Llaç daurat', price: 20 },
    girasol: { slot: 'bow', es: 'Girasol', va: 'Gira-sol', price: 10 },
    // Cara
    gafas_corazon: { slot: 'glasses', es: 'Gafas de corazón', va: 'Ulleres de cor', price: 18 },
    antifaz: { slot: 'glasses', es: 'Antifaz de superhéroe', va: 'Antifaç de superheroi', price: 25 },
    monoculo: { slot: 'glasses', es: 'Monóculo', va: 'Monocle', price: 20 },
    gafas_buceo: { slot: 'glasses', es: 'Gafas de bucear', va: 'Ulleres de bussejar', price: 20 },
    gafas_3d: { slot: 'glasses', es: 'Gafas 3D', va: 'Ulleres 3D', price: 15 },
    gafas_sabio: { slot: 'glasses', es: 'Gafas de sabio', va: 'Ulleres de savi', price: 15 },
    bigote: { slot: 'glasses', es: 'Bigote', va: 'Bigoti', price: 10 },
    nariz_payaso: { slot: 'glasses', es: 'Nariz de payaso', va: 'Nas de pallasso', price: 8 },
    // Cuello
    bufanda: { slot: 'neck', es: 'Bufanda', va: 'Bufanda', price: 12 },
    collar_perlas: { slot: 'neck', es: 'Collar de perlas', va: 'Collaret de perles', price: 25 },
    corbata: { slot: 'neck', es: 'Corbata', va: 'Corbata', price: 12 },
    panuelo: { slot: 'neck', es: 'Pañuelo', va: 'Mocador', price: 8 },
    collar_flores: { slot: 'neck', es: 'Collar de flores', va: 'Collaret de flors', price: 15 },
    cascabel: { slot: 'neck', es: 'Cascabel', va: 'Picarol', price: 10 },
    medalla_plata: { slot: 'neck', es: 'Medalla de plata', va: 'Medalla de plata', price: 25 },
    collar_corazon: { slot: 'neck', es: 'Colgante de corazón', va: 'Penjoll de cor', price: 18 },
    // Capas y alas
    capa_azul: { slot: 'cape', es: 'Capa azul', va: 'Capa blava', price: 30 },
    capa_morada: { slot: 'cape', es: 'Capa morada', va: 'Capa morada', price: 30 },
    capa_verde: { slot: 'cape', es: 'Capa verde', va: 'Capa verda', price: 30 },
    capa_estrellas: { slot: 'cape', es: 'Capa de estrellas', va: 'Capa d’estreles', price: 60, minPhase: 'heroico' },
    alas_mariposa: { slot: 'cape', es: 'Alas de mariposa', va: 'Ales de papallona', price: 45 },
    alas_angel: { slot: 'cape', es: 'Alas de ángel', va: 'Ales d’àngel', price: 80, minPhase: 'legendario' },
    alas_dragon: { slot: 'cape', es: 'Alas de dragón', va: 'Ales de drac', price: 70, minPhase: 'heroico' },
    // Auras
    aura_hielo: { slot: 'aura', es: 'Aura de hielo', va: 'Aura de gel', price: 60 },
    aura_estrellas: { slot: 'aura', es: 'Anillo de estrellas', va: 'Anell d’estreles', price: 65 },
    aura_rayos: { slot: 'aura', es: 'Rayos de sol', va: 'Raigs de sol', price: 55 },
    aura_corazones: { slot: 'aura', es: 'Anillo de corazones', va: 'Anell de cors', price: 55 },
    aura_galaxia: { slot: 'aura', es: 'Aura galáctica', va: 'Aura galàctica', price: 100, minPhase: 'mitico' },
    // Peanas
    peana_nube: { slot: 'pedestal', es: 'Nube', va: 'Núvol', price: 25 },
    peana_nieve: { slot: 'pedestal', es: 'Montaña de nieve', va: 'Muntanya de neu', price: 18 },
    peana_playa: { slot: 'pedestal', es: 'Arena de playa', va: 'Arena de platja', price: 18 },
    peana_flores: { slot: 'pedestal', es: 'Jardín de flores', va: 'Jardí de flors', price: 20 },
    peana_piedra: { slot: 'pedestal', es: 'Roca', va: 'Roca', price: 12 },
    peana_arcoiris: { slot: 'pedestal', es: 'Pedestal arcoíris', va: 'Pedestal arc de Sant Martí', price: 80, minPhase: 'legendario' },
    // Mascotas
    pet_perrito: { slot: 'pet', es: 'Perrito', va: 'Gosset', price: 40 },
    pet_gatito: { slot: 'pet', es: 'Gatito', va: 'Gatet', price: 40 },
    pet_pez: { slot: 'pet', es: 'Pececito en pecera', va: 'Peixet en peixera', price: 35 },
    pet_mariquita: { slot: 'pet', es: 'Mariquita', va: 'Marieta', price: 30 },
    pet_rana: { slot: 'pet', es: 'Ranita', va: 'Graneta', price: 35 },
    pet_pulpo: { slot: 'pet', es: 'Pulpito', va: 'Polpet', price: 40 },
    pet_conejo: { slot: 'pet', es: 'Conejito', va: 'Conillet', price: 40 },
    pet_abeja: { slot: 'pet', es: 'Abejita', va: 'Abelleta', price: 35 },
    pet_tortuga: { slot: 'pet', es: 'Tortuguita', va: 'Tortugueta', price: 35 },
    pet_pinguino: { slot: 'pet', es: 'Pingüino', va: 'Pingüí', price: 45 },
    pet_buho: { slot: 'pet', es: 'Búho sabio', va: 'Mussol savi', price: 50, minPhase: 'adulto' },
    pet_dragon: { slot: 'pet', es: 'Dragoncito', va: 'Dragonet', price: 80, minPhase: 'heroico' },
    // Partículas
    burbujas: { slot: 'particles', es: 'Burbujas', va: 'Bombolles', price: 20 },
    notas: { slot: 'particles', es: 'Notas musicales', va: 'Notes musicals', price: 20 },
    copos: { slot: 'particles', es: 'Copos de nieve', va: 'Flocs de neu', price: 20, season: ['12-01', '02-28'] },
    hojas: { slot: 'particles', es: 'Hojas de otoño', va: 'Fulles de tardor', price: 20, season: ['09-15', '11-30'] },
    confeti: { slot: 'particles', es: 'Confeti', va: 'Confeti', price: 25 },
    mariposas: { slot: 'particles', es: 'Mariposas', va: 'Papallones', price: 25 },
    rayos: { slot: 'particles', es: 'Rayos', va: 'Llamps', price: 30, minPhase: 'adulto' },
    // Fondos de tarjeta
    fondo_nieve: { slot: 'bg', es: 'Fondo nevado', va: 'Fons nevat', price: 20 },
    fondo_desierto: { slot: 'bg', es: 'Fondo de desierto', va: 'Fons de desert', price: 20 },
    fondo_noche: { slot: 'bg', es: 'Fondo de noche', va: 'Fons de nit', price: 25 },
    fondo_arcoiris: { slot: 'bg', es: 'Fondo arcoíris', va: 'Fons arc de Sant Martí', price: 25 },
    fondo_playa: { slot: 'bg', es: 'Fondo de playa', va: 'Fons de platja', price: 20 },
    fondo_otono: { slot: 'bg', es: 'Fondo de otoño', va: 'Fons de tardor', price: 20 },
    fondo_caramelo: { slot: 'bg', es: 'Fondo de caramelo', va: 'Fons de caramel', price: 20 },
    fondo_bosque: { slot: 'bg', es: 'Fondo de bosque', va: 'Fons de bosc', price: 20 },
    fondo_cielo: { slot: 'bg', es: 'Fondo de cielo', va: 'Fons de cel', price: 15 },
    fondo_volcan: { slot: 'bg', es: 'Fondo de volcán', va: 'Fons de volcà', price: 45, minPhase: 'heroico' },
    // Marcos
    marco_plata: { slot: 'frame', es: 'Marco de plata', va: 'Marc de plata', price: 20 },
    marco_madera: { slot: 'frame', es: 'Marco de madera', va: 'Marc de fusta', price: 15 },
    marco_caramelo: { slot: 'frame', es: 'Marco de caramelo', va: 'Marc de caramel', price: 25 },
    marco_neon: { slot: 'frame', es: 'Marco de neón', va: 'Marc de neó', price: 35 },
    marco_rosa: { slot: 'frame', es: 'Marco pastel', va: 'Marc pastel', price: 15 },
    // Nombre
    cartel_plata: { slot: 'banner', es: 'Nombre plateado', va: 'Nom platejat', price: 12 },
    cartel_arcoiris: { slot: 'banner', es: 'Nombre arcoíris', va: 'Nom arc de Sant Martí', price: 20 },
    cartel_neon: { slot: 'banner', es: 'Nombre de neón', va: 'Nom de neó', price: 25 },
    cartel_rosa: { slot: 'banner', es: 'Nombre rosa', va: 'Nom rosa', price: 10 },
    cartel_madera: { slot: 'banner', es: 'Nombre de madera', va: 'Nom de fusta', price: 10 },
    // Bailes
    baile_meneo: { slot: 'dance', es: 'Baile: meneo', va: 'Ball: meneig', price: 15 },
    baile_volteo: { slot: 'dance', es: 'Baile: voltereta', va: 'Ball: tombarella', price: 25 },
    baile_rebote: { slot: 'dance', es: 'Baile: rebote', va: 'Ball: rebot', price: 15 },
    baile_temblor: { slot: 'dance', es: 'Baile: tembleque', va: 'Ball: tremolor', price: 15 },
    baile_estrella: { slot: 'dance', es: 'Baile: estrella', va: 'Ball: estrela', price: 35, minPhase: 'adulto' }
  });

  Object.assign(ART, {
    vaquero: hatG(`<path d="M-22 -6 Q-24 -30 -12 -34 Q0 -28 12 -34 Q24 -30 22 -6 Q0 0 -22 -6 Z" fill="#b5763a" ${ST}/><path d="M-21 -11 Q0 -5 21 -11" fill="none" stroke="#6b3f1d" stroke-width="5"/><path d="M-42 -6 Q-46 -14 -36 -10 Q0 2 36 -10 Q46 -14 42 -6 Q0 12 -42 -6 Z" fill="#c98a4b" ${ST}/>`),
    pirata: hatG(`<path d="M-36 -2 Q-32 -30 0 -36 Q32 -30 36 -2 Q20 -10 0 -6 Q-20 -10 -36 -2 Z" fill="#2d2440" ${ST}/><path d="M-36 -2 Q-20 -10 0 -6 Q20 -10 36 -2" fill="none" stroke="#ffd23f" stroke-width="4"/><path d="M-7 -12 L7 -6 M7 -12 L-7 -6" stroke="#fff" stroke-width="3" stroke-linecap="round"/><circle cy="-21" r="6.5" fill="#fff"/><circle cx="-2.4" cy="-21.5" r="1.7" fill="${INK}"/><circle cx="2.4" cy="-21.5" r="1.7" fill="${INK}"/>`),
    chef: hatG(`<circle cx="-14" cy="-34" r="13" fill="#fff" ${ST}/><circle cx="14" cy="-34" r="13" fill="#fff" ${ST}/><circle cy="-42" r="15" fill="#fff" ${ST}/><rect x="-20" y="-26" width="40" height="24" rx="4" fill="#fff" ${ST}/><path d="M-8 -24 V-6 M8 -24 V-6" stroke="#e3dbcf" stroke-width="3"/>`),
    antenas: hatG(`<path d="M-28 4 Q0 -16 28 4" fill="none" stroke="#7b5cff" stroke-width="6" stroke-linecap="round"/><path d="M-12 -6 Q-18 -26 -22 -36 M12 -6 Q18 -26 22 -36" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round"/><circle cx="-22" cy="-38" r="7" fill="#2fcf95" ${ST}/><circle cx="22" cy="-38" r="7" fill="#2fcf95" ${ST}/><circle cx="-24" cy="-40" r="2" fill="#fff"/><circle cx="20" cy="-40" r="2" fill="#fff"/>`, 6),
    orejas_gato: hatG(`<path d="M-24 -2 L-30 -32 L-6 -14 Z" fill="#2d2440" ${ST}/><path d="M24 -2 L30 -32 L6 -14 Z" fill="#2d2440" ${ST}/><path d="M-22 -9 L-26 -25 L-13 -15 Z M22 -9 L26 -25 L13 -15 Z" fill="#ff9cc0"/><path d="M-30 6 Q0 -18 30 6" fill="none" stroke="#2d2440" stroke-width="6" stroke-linecap="round"/>`, 6),
    vikingo: hatG(`<path d="M-26 -10 Q-46 -14 -44 -42 Q-36 -22 -22 -22 Z" fill="#fff3d6" ${ST}/><path d="M26 -10 Q46 -14 44 -42 Q36 -22 22 -22 Z" fill="#fff3d6" ${ST}/><path d="M-28 0 Q-28 -32 0 -32 Q28 -32 28 0 Z" fill="#b9c3cf" ${ST}/><rect x="-29" y="-8" width="58" height="10" rx="4" fill="#8a95a3" ${ST}/><path d="M0 -32 V-8" stroke="#8a95a3" stroke-width="5"/><circle cx="-18" cy="-3" r="2" fill="#fff"/><circle cx="18" cy="-3" r="2" fill="#fff"/>`),
    bruja: hatG(`<ellipse rx="40" ry="9" fill="#4a2f8f" ${ST}/><path d="M-20 -4 Q-10 -30 6 -60 Q12 -66 20 -60 Q10 -52 12 -36 Q16 -18 20 -4 Z" fill="#6f4bb0" ${ST}/><path d="M-19 -9 Q0 -3 19 -9" fill="none" stroke="#ff8a3c" stroke-width="5"/>${star(9, -32, .45, '#ffd23f')}`),
    birrete: hatG(`<path d="M-18 -16 L-18 -2 Q0 6 18 -2 L18 -16" fill="#3b3054" ${ST}/><path d="M-36 -20 L0 -33 L36 -20 L0 -7 Z" fill="#2d2440" ${ST}/><path d="M0 -20 L26 -16 L28 2" fill="none" stroke="#ffd23f" stroke-width="2.5"/><path d="M24 2 L32 2 L30 10 L26 10 Z" fill="#ffd23f" stroke="${INK}" stroke-width="1.5"/><circle cy="-20" r="3" fill="#ffd23f"/>`),
    helice: hatG(`<path d="M-26 0 Q-26 -26 0 -26 L0 0 Z" fill="#ff6b6b" ${ST}/><path d="M0 -26 Q26 -26 26 0 L0 0 Z" fill="#3fa9ff" ${ST}/><ellipse rx="28" ry="5" fill="#ffd23f" ${ST}/><path d="M0 -26 V-34" stroke="${INK}" stroke-width="3"/><g class="cos-prop"><ellipse cx="-12" cy="-36" rx="13" ry="4" fill="#ffd23f" stroke="${INK}" stroke-width="2"/><ellipse cx="12" cy="-36" rx="13" ry="4" fill="#2fcf95" stroke="${INK}" stroke-width="2"/></g><circle cy="-36" r="3" fill="${INK}"/>`),
    corona_flores: hatG(`<path d="M-30 4 Q0 -12 30 4" fill="none" stroke="#4fb33a" stroke-width="5" stroke-linecap="round"/>${flower(-25, 1, 4.2, '#ff8fb8')}${flower(-12, -3.5, 4.6, '#fff')}${flower(0, -5, 5, '#c9a7ff')}${flower(12, -3.5, 4.6, '#fff')}${flower(25, 1, 4.2, '#ffd23f', '#ff8a3c')}`, 6),
    tiara: hatG(`<path d="M-24 0 Q0 -10 24 0" fill="none" stroke="#d9dbe8" stroke-width="5" stroke-linecap="round"/><path d="M-18 -4 L-14 -17 L-8 -8 L0 -26 L8 -8 L14 -17 L18 -4 Q0 -10 -18 -4 Z" fill="#f4f4ff" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/><circle cy="-13" r="4.5" fill="#ff6fae" stroke="${INK}" stroke-width="1.6"/><circle cx="-12" cy="-8" r="2.4" fill="#3fa9ff"/><circle cx="12" cy="-8" r="2.4" fill="#3fa9ff"/>`, 6),
    gorro_lana: hatG(`<path d="M-27 0 Q-28 -32 0 -34 Q28 -32 27 0 Z" fill="#2fcf95" ${ST}/><path d="M-24 -16 Q0 -22 24 -16" fill="none" stroke="#fff" stroke-width="4"/><rect x="-30" y="-8" width="60" height="13" rx="6" fill="#23a97a" ${ST}/><circle cy="-38" r="8" fill="#fff" ${ST}/>`),
    cuerno_unicornio: hatG(`<path d="M-7 0 L0 -42 L7 0 Z" fill="#ffe58a" ${ST}/><path d="M-5 -7 L5 -11 M-4 -17 L4 -21 M-2 -27 L3 -30" stroke="#f0b21c" stroke-width="2.5" stroke-linecap="round"/>${flower(-11, -2, 3.4, '#ff8fb8')}${flower(11, -2, 3.4, '#c9a7ff')}`, 6),
    auriculares: (a, s) => { const hw = (a.w || 60) * 0.5 + 6 * s, y = a.y; return `<path d="M${a.x - hw} ${y + 22 * s} Q${a.x - hw} ${y - 24 * s} ${a.x} ${y - 24 * s} Q${a.x + hw} ${y - 24 * s} ${a.x + hw} ${y + 22 * s}" fill="none" stroke="${INK}" stroke-width="${6 * s}" stroke-linecap="round"/><rect x="${a.x - hw - 9 * s}" y="${y + 10 * s}" width="${16 * s}" height="${26 * s}" rx="${7 * s}" fill="#ff6b6b" stroke="${INK}" stroke-width="${3 * s}"/><rect x="${a.x + hw - 7 * s}" y="${y + 10 * s}" width="${16 * s}" height="${26 * s}" rx="${7 * s}" fill="#ff6b6b" stroke="${INK}" stroke-width="${3 * s}"/>`; },
    casco_bombero: hatG(`<path d="M-26 0 Q-26 -28 0 -30 Q26 -28 26 0 Z" fill="#e8413c" ${ST}/><path d="M0 -30 V-2" stroke="#c62f2b" stroke-width="5"/><path d="M-36 0 Q0 8 36 0 Q38 7 26 9 Q0 14 -26 9 Q-38 7 -36 0 Z" fill="#c62f2b" ${ST}/><path d="M-7 -20 L7 -20 L6 -10 L0 -6 L-6 -10 Z" fill="#ffd23f" stroke="${INK}" stroke-width="1.8"/>`),
    chistera: hatG(`<rect x="-20" y="-42" width="40" height="40" rx="3" fill="#3b3054" ${ST}/><rect x="-20" y="-12" width="40" height="8" fill="#e8413c" stroke="${INK}" stroke-width="2"/><ellipse cy="-1" rx="32" ry="7" fill="#2d2440" ${ST}/>`),
    laurel: hatG(`<g class="cos-twinkle">${[-1, 1].map(d => [0, 1, 2, 3, 4].map(i => { const t = i / 4, x = d * (28 - 22 * t), y = 4 - 22 * t + 8 * t * t; return `<ellipse cx="${x}" cy="${y}" rx="4.5" ry="9" transform="rotate(${d * (60 - 50 * t)} ${x} ${y})" fill="${i % 2 ? '#f0b21c' : '#ffd23f'}" stroke="${INK}" stroke-width="1.8"/>`; }).join('')).join('')}</g>`, 6),

    mariposa: clip(`<path d="M0 0 Q-16 -20 -21 -5 Q-19 5 0 0 Z M0 0 Q16 -20 21 -5 Q19 5 0 0 Z" fill="#7b5cff" ${ST}/><path d="M0 0 Q-12 12 -6 15 Q0 11 0 0 Z M0 0 Q12 12 6 15 Q0 11 0 0 Z" fill="#ff6fae" stroke="${INK}" stroke-width="2.4"/><ellipse rx="2.6" ry="8" fill="${INK}"/>`, 10),
    estrella_pelo: clip(star(0, 0, 1.5, '#ffd23f'), -12),
    corazon_pelo: clip(heart(0, 2, 2, '#ff4f8b'), 12),
    pluma: clip(`<path d="M0 6 Q-9 -24 4 -44 Q14 -22 0 6 Z" fill="#3fa9ff" ${ST}/><path d="M0 6 Q2 -18 4 -40" fill="none" stroke="#1f7fd0" stroke-width="2"/><path d="M-3 -12 L2 -16 M-4 -22 L3 -26" stroke="#1f7fd0" stroke-width="1.6"/>`, 24),
    lazo_azul: bowArt('#3fa9ff', '#8fd0ff'),
    lazo_dorado: bowArt('#ffd23f', '#fff3b0'),
    girasol: clip(`${Array.from({ length: 10 }, (_, i) => `<ellipse rx="4" ry="9" transform="rotate(${i * 36}) translate(0 -11)" fill="#ffd23f" stroke="${INK}" stroke-width="1.6"/>`).join('')}<circle r="8" fill="#8a5a2b" stroke="${INK}" stroke-width="2"/><circle cx="-2" cy="-2" r="1.4" fill="#5a3a1a"/><circle cx="2.5" cy="1.5" r="1.4" fill="#5a3a1a"/>`),

    gafas_corazon: (a, s) => { const g = (a.w || 50) / 2; return `<g>${heart(a.x - g, a.y + 2 * s, 2.1 * s, '#ff4f8b')}${heart(a.x + g, a.y + 2 * s, 2.1 * s, '#ff4f8b')}<path d="M${a.x - g + 13 * s} ${a.y - 4 * s} Q${a.x} ${a.y - 10 * s} ${a.x + g - 13 * s} ${a.y - 4 * s}" fill="none" stroke="${INK}" stroke-width="${3 * s}"/></g>`; },
    antifaz: (a, s) => { const g = (a.w || 50) / 2, x = a.x, y = a.y; return `<path d="M${x - g - 22 * s} ${y - 8 * s} Q${x} ${y - 16 * s} ${x + g + 22 * s} ${y - 8 * s} Q${x + g + 24 * s} ${y + 12 * s} ${x + g} ${y + 13 * s} Q${x} ${y + 4 * s} ${x - g} ${y + 13 * s} Q${x - g - 24 * s} ${y + 12 * s} ${x - g - 22 * s} ${y - 8 * s} Z ${ell(x - g, y, 9.5 * s, 7.5 * s)} ${ell(x + g, y, 9.5 * s, 7.5 * s)}" fill="#e8413c" fill-rule="evenodd" stroke="${INK}" stroke-width="${3 * s}" stroke-linejoin="round"/><path d="M${x - g - 22 * s} ${y - 4 * s} l${-10 * s} ${6 * s} M${x + g + 22 * s} ${y - 4 * s} l${10 * s} ${6 * s}" stroke="#e8413c" stroke-width="${4 * s}" stroke-linecap="round"/>`; },
    monoculo: (a, s) => { const g = (a.w || 50) / 2, r = 14 * s, x = a.x + g, y = a.y; return `<circle cx="${x}" cy="${y}" r="${r}" fill="rgba(255,255,255,.25)" stroke="#f0b21c" stroke-width="${4 * s}"/><path d="M${x + r * .7} ${y + r * .7} Q${x + r * 1.6} ${y + r * 2.2} ${x + r * .9} ${y + r * 3.4}" fill="none" stroke="#f0b21c" stroke-width="${2 * s}" stroke-dasharray="${3 * s} ${2 * s}"/>`; },
    gafas_buceo: (a, s) => { const g = (a.w || 50) / 2, x = a.x, y = a.y; return `<path d="M${x + g + 20 * s} ${y + 2 * s} Q${x + g + 30 * s} ${y} ${x + g + 28 * s} ${y - 44 * s}" fill="none" stroke="#ff8a3c" stroke-width="${7 * s}" stroke-linecap="round"/><rect x="${x - g - 19 * s}" y="${y - 14 * s}" width="${2 * g + 38 * s}" height="${28 * s}" rx="${12 * s}" fill="rgba(150,220,255,.45)" stroke="#ff8a3c" stroke-width="${5 * s}"/><rect x="${x - g - 19 * s}" y="${y - 14 * s}" width="${2 * g + 38 * s}" height="${28 * s}" rx="${12 * s}" fill="none" stroke="${INK}" stroke-width="${1.6 * s}"/><path d="M${x - g - 10 * s} ${y - 6 * s} l${8 * s} ${-3 * s}" stroke="#fff" stroke-width="${3 * s}" stroke-linecap="round"/>`; },
    gafas_3d: (a, s) => { const g = (a.w || 50) / 2, x = a.x, y = a.y, w = 26 * s, h = 20 * s; return `<rect x="${x - g - w / 2}" y="${y - h / 2}" width="${w}" height="${h}" rx="${4 * s}" fill="rgba(255,70,70,.6)" stroke="${INK}" stroke-width="${3.5 * s}"/><rect x="${x + g - w / 2}" y="${y - h / 2}" width="${w}" height="${h}" rx="${4 * s}" fill="rgba(60,140,255,.6)" stroke="${INK}" stroke-width="${3.5 * s}"/><path d="M${x - g + w / 2} ${y - 3 * s} H${x + g - w / 2}" stroke="${INK}" stroke-width="${3.5 * s}"/>`; },
    gafas_sabio: (a, s) => { const g = (a.w || 50) / 2, r = 12 * s; return `<g fill="rgba(255,255,255,.2)" stroke="#c98d0b" stroke-width="${3 * s}"><circle cx="${a.x - g}" cy="${a.y}" r="${r}"/><circle cx="${a.x + g}" cy="${a.y}" r="${r}"/><path d="M${a.x - g + r} ${a.y - 2 * s} Q${a.x} ${a.y - 8 * s} ${a.x + g - r} ${a.y - 2 * s}" fill="none"/></g>`; },
    bigote: (a, s) => `<g transform="translate(${a.x} ${a.y + 21 * s}) scale(${s})"><path d="M0 0 Q-10 -8 -20 -2 Q-28 2 -30 -6 Q-27 9 -14 7 Q-6 6 0 2 Q6 6 14 7 Q27 9 30 -6 Q28 2 20 -2 Q10 -8 0 0 Z" fill="#6b3f1d" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/></g>`,
    nariz_payaso: (a, s) => `<circle cx="${a.x}" cy="${a.y + 13 * s}" r="${8 * s}" fill="#e8413c" stroke="${INK}" stroke-width="${2.5 * s}"/><circle cx="${a.x - 2.5 * s}" cy="${a.y + 10.5 * s}" r="${2.2 * s}" fill="#fff" opacity=".8"/>`,

    bufanda: neckG(`<path d="M10 4 L13 34 L24 32 L21 2 Z" fill="#c62f2b" ${ST}/><path d="M12 22 L23 21 M13 28 L23 27" stroke="#fff" stroke-width="2.5"/><path d="M-28 -7 Q0 6 28 -7 L28 6 Q0 19 -28 6 Z" fill="#e8413c" ${ST}/><path d="M-12 -2 L-12 11 M0 0 L0 13 M12 -2 L12 11" stroke="#fff" stroke-width="2.5" opacity=".9"/>`),
    collar_perlas: neckG(Array.from({ length: 11 }, (_, i) => { const t = i / 10, x = -22 + 44 * t, y = -4 + 40 * t * (1 - t); return `<circle cx="${x}" cy="${y}" r="3.4" fill="#fffaf0" stroke="${INK}" stroke-width="1.4"/>`; }).join('')),
    corbata: neckG(`<path d="M-4 6 L4 6 L9 30 L0 40 L-9 30 Z" fill="#3fa9ff" ${ST}/><path d="M-6 16 L7 12 M-8 26 L8 21" stroke="#1f7fd0" stroke-width="3"/><path d="M-7 -4 L7 -4 L4 7 L-4 7 Z" fill="#3fa9ff" ${ST}/>`),
    panuelo: neckG(`<path d="M-27 -6 Q0 4 27 -6 L0 26 Z" fill="#ff6b6b" ${ST}/><circle cx="-10" cy="2" r="2" fill="#fff"/><circle cx="8" cy="3" r="2" fill="#fff"/><circle cx="0" cy="13" r="2" fill="#fff"/><circle cx="-2" cy="-1" r="1.5" fill="#fff"/>`),
    collar_flores: neckG(Array.from({ length: 7 }, (_, i) => { const t = i / 6, x = -24 + 48 * t, y = -5 + 44 * t * (1 - t); return flower(x, y, 3.4, ['#ff8fb8', '#ffd23f', '#fff', '#c9a7ff'][i % 4], i % 4 === 1 ? '#ff8a3c' : '#ffd23f'); }).join('')),
    cascabel: neckG(`<path d="M-24 -5 Q0 10 24 -5" fill="none" stroke="#e8413c" stroke-width="6" stroke-linecap="round"/><circle cy="11" r="7.5" fill="#ffd23f" ${ST}/><path d="M-4 13 H4" stroke="${INK}" stroke-width="2"/><circle cx="-2.5" cy="8" r="1.6" fill="#fff"/>`),
    medalla_plata: medalArt('#d9dee6', '#e8413c', '#ffffff'),
    collar_corazon: neckG(`<path d="M-22 -5 Q0 14 22 -5" fill="none" stroke="#c98d0b" stroke-width="2" stroke-dasharray="2 2"/>${heart(0, 14, 1.3, '#ff4f8b')}`),

    capa_azul: (a, s) => cape(a, s, '#3fa9ff', '#1f7fd0'),
    capa_morada: (a, s) => cape(a, s, '#7b5cff', '#5b3fe0'),
    capa_verde: (a, s) => cape(a, s, '#2fcf95', '#1ea474'),
    capa_estrellas: (a, s) => cape(a, s, '#2b2366', '#4a3fa8', true),
    alas_mariposa: wings(`<path d="M0 0 Q-34 -54 -56 -24 Q-62 2 0 2 Z" fill="#ff9cc0" ${ST}/><path d="M0 4 Q-36 18 -32 42 Q-14 46 0 6 Z" fill="#c9a7ff" ${ST}/><circle cx="-34" cy="-16" r="6" fill="#fff" opacity=".7"/>`, 'cos-wing'),
    alas_angel: wings(`<path d="M0 -2 Q-26 -46 -62 -36 Q-56 -26 -64 -18 Q-54 -12 -60 -2 Q-48 -2 -50 8 Q-32 8 0 6 Z" fill="#fff" ${ST}/><path d="M-20 -22 Q-36 -26 -50 -22 M-20 -10 Q-36 -12 -48 -8" fill="none" stroke="#d9d4f0" stroke-width="2.5"/>`, 'cos-wing'),
    alas_dragon: wings(`<path d="M0 0 L-18 -32 L-60 -38 L-50 -22 L-60 -8 L-42 -12 L-44 4 L-26 -2 Z" fill="#2fcf95" ${ST}/><path d="M-18 -32 L-30 -4 M-18 -32 L-48 -18" stroke="#1ea474" stroke-width="2.5"/>`, 'cos-wing'),

    aura_hielo: (a, s, id) => `<defs><radialGradient id="ah${id}"><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset=".72" stop-color="#bff0ff" stop-opacity=".55"/><stop offset=".88" stop-color="#7fd6ff" stop-opacity=".35"/><stop offset="1" stop-color="#3fa9ff" stop-opacity="0"/></radialGradient></defs><g class="cos-aura"><circle cx="100" cy="112" r="98" fill="url(#ah${id})"/>${ring(6, 86, (x, y) => snow(x, y, .8))}</g>`,
    aura_estrellas: () => `<g class="cos-aura">${ring(10, 88, (x, y, i) => star(x, y, i % 2 ? .45 : .65, i % 3 ? '#ffd54a' : '#fff3b0'))}</g>`,
    aura_rayos: () => `<g class="cos-aura">${Array.from({ length: 16 }, (_, i) => `<path d="M100 112 L${100 + Math.cos(i / 8 * Math.PI - .09) * 98} ${112 + Math.sin(i / 8 * Math.PI - .09) * 98} L${100 + Math.cos(i / 8 * Math.PI + .09) * 98} ${112 + Math.sin(i / 8 * Math.PI + .09) * 98} Z" fill="#ffd23f" opacity=".28"/>`).join('')}</g>`,
    aura_corazones: () => `<g class="cos-aura">${ring(8, 86, (x, y, i) => heart(x, y, .9, i % 2 ? '#ff6fae' : '#ff9cc0'))}</g>`,
    aura_galaxia: (a, s, id) => `<defs><radialGradient id="ag${id}"><stop offset=".45" stop-color="#fff" stop-opacity="0"/><stop offset=".65" stop-color="#ff6fae" stop-opacity=".3"/><stop offset=".82" stop-color="#7b5cff" stop-opacity=".45"/><stop offset="1" stop-color="#2b2366" stop-opacity="0"/></radialGradient></defs><g class="cos-aura"><circle cx="100" cy="112" r="99" fill="url(#ag${id})"/>${ring(12, 80, (x, y, i) => `<circle cx="${x}" cy="${y}" r="${i % 3 ? 1.6 : 2.6}" fill="#fff"/>`)}${star(30, 50, .5, '#fff3b0')}${star(170, 170, .45, '#fff3b0')}</g>`,

    peana_nube: (a) => `<g><path d="M30 ${a.ground + 14} Q24 ${a.ground + 2} 38 ${a.ground - 2} Q42 ${a.ground - 14} 58 ${a.ground - 8} Q66 ${a.ground - 18} 82 ${a.ground - 10} Q100 ${a.ground - 20} 118 ${a.ground - 10} Q134 ${a.ground - 18} 142 ${a.ground - 8} Q158 ${a.ground - 14} 162 ${a.ground - 2} Q176 ${a.ground + 2} 170 ${a.ground + 14} Z" fill="#fff" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/><path d="M48 ${a.ground + 8} Q70 ${a.ground + 12} 92 ${a.ground + 9}" fill="none" stroke="#d6ecff" stroke-width="3" stroke-linecap="round"/></g>`,
    peana_nieve: (a) => `<g><path d="M28 ${a.ground + 14} Q50 ${a.ground - 8} 100 ${a.ground - 4} Q150 ${a.ground - 8} 172 ${a.ground + 14} Z" fill="#f4fbff" stroke="${INK}" stroke-width="3"/><path d="M50 ${a.ground + 8} Q70 ${a.ground + 2} 88 ${a.ground + 6}" stroke="#bfe3ff" stroke-width="3" fill="none"/>${snow(150, a.ground + 4, .5)}</g>`,
    peana_playa: (a) => `<g><ellipse cx="100" cy="${a.ground + 6}" rx="72" ry="13" fill="#f6dc9b" stroke="${INK}" stroke-width="3"/>${star(52, a.ground + 6, .45, '#ff8a3c')}<path d="M144 ${a.ground + 9} q6 -10 12 0 Z" fill="#ffb3c7" stroke="${INK}" stroke-width="1.6"/><circle cx="76" cy="${a.ground + 11}" r="1.6" fill="#c9a24f"/><circle cx="128" cy="${a.ground + 3}" r="1.6" fill="#c9a24f"/></g>`,
    peana_flores: (a) => `<g><ellipse cx="100" cy="${a.ground + 5}" rx="70" ry="13" fill="#7fd35a" stroke="${INK}" stroke-width="3"/>${flower(46, a.ground + 2, 3, '#ff8fb8')}${flower(64, a.ground + 9, 3, '#fff')}${flower(138, a.ground + 9, 3, '#c9a7ff')}${flower(156, a.ground + 2, 3, '#ffd23f', '#ff8a3c')}</g>`,
    peana_piedra: (a) => `<g><path d="M34 ${a.ground + 12} Q36 ${a.ground - 6} 70 ${a.ground - 6} L130 ${a.ground - 6} Q166 ${a.ground - 6} 166 ${a.ground + 12} Z" fill="#b6b2c2" stroke="${INK}" stroke-width="3"/><path d="M60 ${a.ground + 2} l8 6 l-4 5 M132 ${a.ground} l-6 7" stroke="#8a8599" stroke-width="2" fill="none"/></g>`,
    peana_arcoiris: (a) => `<g class="cos-twinkle">${['#ff6fae', '#ffc83d', '#2fcf95', '#3fa9ff', '#7b5cff'].map((c, i) => `<ellipse cx="100" cy="${a.ground + 6}" rx="${76 - i * 7}" ry="${15 - i * 2}" fill="${c}" stroke="${INK}" stroke-width="${i ? 1 : 3}"/>`).join('')}</g>`,

    pet_perrito: pet(`${shadow(13)}<ellipse cy="-11" rx="13" ry="11" fill="#d9a066" ${ST}/><path d="M-12 -18 Q-20 -12 -15 -2 Q-10 -8 -9 -14 Z M12 -18 Q20 -12 15 -2 Q10 -8 9 -14 Z" fill="#8a5a2b" stroke="${INK}" stroke-width="2"/>${eyes2(4.5, -13, 2.2)}<ellipse cy="-8" rx="3" ry="2.2" fill="${INK}"/><path d="M-2 -4 Q0 -2 2 -4" fill="none" stroke="${INK}" stroke-width="1.5"/>`),
    pet_gatito: pet(`${shadow(12)}<path d="M-12 -18 L-11 -30 L-3 -21 Z M12 -18 L11 -30 L3 -21 Z" fill="#9aa4b2" stroke="${INK}" stroke-width="2"/><ellipse cy="-12" rx="13" ry="11" fill="#b9c1cc" ${ST}/>${eyes2(4.5, -13, 2.2)}<path d="M-1.5 -9 L1.5 -9 L0 -7 Z" fill="#ff8fb8"/><path d="M-16 -9 L-8 -8 M-16 -6 L-8 -7 M16 -9 L8 -8 M16 -6 L8 -7" stroke="${INK}" stroke-width="1"/>`),
    pet_pez: pet(`${shadow(14)}<path d="M-14 -2 Q-18 -30 0 -32 Q18 -30 14 -2 Z" fill="rgba(160,220,255,.55)" ${ST}/><path d="M-13 -22 H13" stroke="#7fc6f0" stroke-width="2"/><g class="cos-swim"><ellipse cx="-1" cy="-13" rx="6" ry="4" fill="#ff8a3c" stroke="${INK}" stroke-width="1.5"/><path d="M5 -13 L10 -17 L10 -9 Z" fill="#ff8a3c" stroke="${INK}" stroke-width="1.5"/><circle cx="-4" cy="-14" r="1" fill="${INK}"/></g>`),
    pet_mariquita: pet(`${shadow(10)}<path d="M-10 -2 Q-10 -18 0 -18 Q10 -18 10 -2 Z" fill="#e8413c" ${ST}/><path d="M0 -18 V-2" stroke="${INK}" stroke-width="2"/><circle cx="-5" cy="-10" r="2.2" fill="${INK}"/><circle cx="5" cy="-8" r="2.2" fill="${INK}"/><circle cx="-4" cy="-4" r="1.6" fill="${INK}"/><circle cx="12" cy="-6" r="5" fill="${INK}"/><circle cx="13" cy="-7" r="1.3" fill="#fff"/>`),
    pet_rana: pet(`${shadow(13)}<ellipse cy="-9" rx="14" ry="9" fill="#6dcf55" ${ST}/><circle cx="-7" cy="-17" r="5" fill="#6dcf55" ${ST}/><circle cx="7" cy="-17" r="5" fill="#6dcf55" ${ST}/><circle cx="-7" cy="-17" r="2" fill="${INK}"/><circle cx="7" cy="-17" r="2" fill="${INK}"/><path d="M-6 -8 Q0 -4 6 -8" fill="none" stroke="${INK}" stroke-width="1.6"/>`),
    pet_pulpo: pet(`${shadow(13)}<path d="M-12 -4 Q-15 2 -10 2 M-5 -3 Q-7 3 -2 2 M3 -3 Q2 3 6 2 M10 -4 Q14 2 12 3" fill="none" stroke="#e86fb0" stroke-width="4" stroke-linecap="round"/><path d="M-13 -4 Q-15 -28 0 -28 Q15 -28 13 -4 Z" fill="#ff8fc8" ${ST}/>${eyes2(4.5, -15, 2.2)}<circle cx="-8" cy="-9" r="2" fill="#ff5fa0" opacity=".6"/><circle cx="8" cy="-9" r="2" fill="#ff5fa0" opacity=".6"/>`),
    pet_conejo: pet(`${shadow(12)}<ellipse cx="-5" cy="-28" rx="3.5" ry="9" fill="#fff" ${ST}/><ellipse cx="5" cy="-28" rx="3.5" ry="9" fill="#fff" ${ST}/><ellipse cy="-11" rx="12" ry="11" fill="#fff" ${ST}/>${eyes2(4, -13, 2)}<path d="M-1.6 -9 L1.6 -9 L0 -7 Z" fill="#ff8fb8"/>`),
    pet_abeja: (a) => `<g transform="translate(176 72)"><g class="cos-pet"><ellipse cx="-5" cy="-8" rx="6" ry="4" fill="rgba(255,255,255,.8)" stroke="${INK}" stroke-width="1.5"/><ellipse cx="5" cy="-8" rx="6" ry="4" fill="rgba(255,255,255,.8)" stroke="${INK}" stroke-width="1.5"/><ellipse rx="11" ry="8" fill="#ffd23f" ${ST}/><path d="M-3 -7 V7 M4 -7 V7" stroke="${INK}" stroke-width="3"/><circle cx="-7" cy="-1" r="1.6" fill="${INK}"/></g></g>`,
    pet_tortuga: pet(`${shadow(15)}<ellipse cx="15" cy="-5" rx="5" ry="4.5" fill="#8ad06b" ${ST}/><circle cx="16" cy="-6" r="1.2" fill="${INK}"/><path d="M-14 -2 Q-14 -20 0 -20 Q14 -20 14 -2 Z" fill="#4fb33a" ${ST}/><path d="M-7 -4 L-4 -14 L4 -14 L7 -4" fill="none" stroke="#2f8a24" stroke-width="2"/>`),
    pet_pinguino: pet(`${shadow(11)}<ellipse cy="-14" rx="11" ry="14" fill="#2d2440" ${ST}/><ellipse cy="-11" rx="7" ry="10" fill="#fff"/><circle cx="-3" cy="-19" r="1.8" fill="#fff"/><circle cx="3" cy="-19" r="1.8" fill="#fff"/><circle cx="-3" cy="-19" r="1" fill="${INK}"/><circle cx="3" cy="-19" r="1" fill="${INK}"/><path d="M-2.5 -16 L2.5 -16 L0 -13 Z" fill="#ff8a3c"/><path d="M-5 0 h4 M1 0 h4" stroke="#ff8a3c" stroke-width="3" stroke-linecap="round"/>`),
    pet_buho: pet(`${shadow(12)}<path d="M-11 -24 L-8 -30 L-4 -24 Z M11 -24 L8 -30 L4 -24 Z" fill="#8a5a2b" stroke="${INK}" stroke-width="1.6"/><ellipse cy="-13" rx="12" ry="14" fill="#a8733c" ${ST}/><circle cx="-5" cy="-17" r="5" fill="#fff" stroke="${INK}" stroke-width="1.5"/><circle cx="5" cy="-17" r="5" fill="#fff" stroke="${INK}" stroke-width="1.5"/><circle cx="-5" cy="-17" r="2.2" fill="${INK}"/><circle cx="5" cy="-17" r="2.2" fill="${INK}"/><path d="M-2 -12 L2 -12 L0 -9 Z" fill="#ffd23f"/><path d="M-6 -4 Q0 0 6 -4" fill="none" stroke="#8a5a2b" stroke-width="2"/>`),
    pet_dragon: pet(`${shadow(14)}<path d="M8 -14 L20 -24 L18 -10 Z" fill="#7fd6a8" stroke="${INK}" stroke-width="1.8"/><path d="M-12 -4 Q-20 2 -24 -6" fill="none" stroke="#2fcf95" stroke-width="4" stroke-linecap="round"/><ellipse cy="-12" rx="13" ry="11" fill="#2fcf95" ${ST}/><path d="M-6 -22 L-4 -28 L-1 -22 M2 -22 L5 -28 L7 -21" fill="#ffd23f" stroke="${INK}" stroke-width="1.4"/>${eyes2(4.5, -14, 2.2)}<path d="M-3 -8 Q0 -6 3 -8" fill="none" stroke="${INK}" stroke-width="1.5"/>`),

    burbujas: () => floaty([[30, 70, 7], [170, 54, 9], [176, 132, 6], [24, 140, 8], [150, 172, 5], [46, 36, 5]].map(([x, y, r]) => `<g><circle cx="${x}" cy="${y}" r="${r}" fill="rgba(170,225,255,.45)" stroke="#5ab8f0" stroke-width="2"/><circle cx="${x - r * .35}" cy="${y - r * .35}" r="${r * .25}" fill="#fff"/></g>`)),
    notas: () => floaty([note(28, 70, 1, '#7b5cff'), note(170, 50, .9, '#ff6fae'), note(176, 128, .8, '#2fcf95'), note(26, 142, .85, '#ffc83d')]),
    copos: () => floaty([snow(30, 60, 1.1), snow(168, 44, .9), snow(176, 126, 1), snow(24, 136, .8), snow(148, 168, .7), snow(52, 30, .7)]),
    hojas: () => floaty([leaf(30, 64, 1.2, '#ff8a3c', 20), leaf(170, 48, 1.1, '#e8413c', -30), leaf(176, 128, 1, '#ffc83d', 50), leaf(24, 140, 1, '#c96a2b', -10)]),
    confeti: () => floaty([[28, 60, '#ff6fae', 20], [44, 34, '#3fa9ff', -30], [170, 46, '#ffc83d', 45], [178, 100, '#2fcf95', 10], [168, 150, '#7b5cff', -20], [22, 120, '#ff8a3c', 60], [40, 168, '#3fa9ff', 30], [150, 172, '#ff6fae', -45]].map(([x, y, c, r]) => `<g><rect x="${x - 4}" y="${y - 2}" width="8" height="4" rx="1" fill="${c}" transform="rotate(${r} ${x} ${y})"/></g>`)),
    mariposas: () => floaty([bfly(30, 62, 1, '#ffc83d'), bfly(168, 46, .9, '#ff6fae'), bfly(174, 132, .8, '#3fa9ff'), bfly(26, 140, .85, '#c9a7ff')]),
    rayos: () => floaty([[30, 60, 1], [170, 50, .9], [174, 130, .8], [26, 138, .85]].map(([x, y, k]) => `<g transform="translate(${x} ${y}) scale(${k})"><path d="M2 -14 L-7 2 L0 2 L-3 14 L8 -3 L1 -3 Z" fill="#ffd23f" stroke="${INK}" stroke-width="1.8" stroke-linejoin="round"/></g>`))
  });

  window.Cosmetics = { DEFS, ART, SLOTS, BODY_SLOTS, SLOT_ICON, layers, cardClasses, inSeason };
})();
