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

  window.Cosmetics = { DEFS, ART, SLOTS, BODY_SLOTS, SLOT_ICON, layers, cardClasses, inSeason };
})();
