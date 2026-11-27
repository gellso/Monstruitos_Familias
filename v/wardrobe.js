/* Monstruitos 2.4 — ropa, zapatos y cosméticos para huevos (diseño original, todo en SVG).
   Ranuras nuevas:
     shirt (camisetas y uniforme), legs (pantalones y faldas), shoes (zapatos),
     eggskin (cáscaras) y nest (nidos): estas dos solo se ven mientras el monstruo es huevo.
   La ropa se «pinta» sobre el cuerpo y se recorta con su silueta (la del monstruo de la app o la del
   dibujo del niño), así queda bien en cualquier forma y en todas las fases.
   Nada de escudos, marcas ni grupos reales: equipos y grupos inventados. El emblema del uniforme es el
   del Colegio Sagrada Familia de Alzira, redibujado. */
(function () {
  'use strict';
  const C = window.Cosmetics; if (!C) return;
  const INK = '#2d2440';
  const NEW_SLOTS = ['shirt', 'legs', 'shoes', 'eggskin', 'nest'];
  // las ranuras nuevas van justo después de las de cuerpo (orden de las pestañas del Taller)
  const at = C.SLOTS.indexOf('cape') + 1;
  C.SLOTS.splice(at, 0, 'shirt', 'legs', 'shoes');
  C.SLOTS.push('eggskin', 'nest');
  Array.prototype.push.apply(C.BODY_SLOTS, ['shirt', 'legs', 'shoes']);
  Object.assign(C.SLOT_ICON, { shirt: '👕', legs: '👖', shoes: '👟', eggskin: '🥚', nest: '🐣' });
  const EGG_SLOTS = ['eggskin', 'nest'];

  // ---------- Catálogo ----------
  const D = (slot, es, va, price, minPhase, season) => ({ slot, es, va, price, minPhase: minPhase || '', season: season || null });
  Object.assign(C.DEFS, {
    // Camisetas y camisas
    uniforme_cole: D('shirt', 'Camisa del cole', 'Camisa del col·le', 20),
    fut_rayas_rojas: D('shirt', 'Fútbol: rayas rojas y blancas', 'Futbol: ratlles roges i blanques', 25),
    fut_azul: D('shirt', 'Fútbol: azul con banda', 'Futbol: blava amb banda', 20),
    fut_verde: D('shirt', 'Fútbol: verde y blanca', 'Futbol: verda i blanca', 20),
    fut_naranja: D('shirt', 'Fútbol: naranja del 10', 'Futbol: taronja del 10', 30),
    fut_franjas: D('shirt', 'Fútbol: franjas moradas', 'Futbol: franges morades', 25),
    fut_portero: D('shirt', 'Fútbol: camiseta de portero', 'Futbol: samarreta de porter', 30),
    basket_amarilla: D('shirt', 'Baloncesto: amarilla', 'Bàsquet: groga', 25),
    basket_roja: D('shirt', 'Baloncesto: roja', 'Bàsquet: roja', 25),
    basket_azul: D('shirt', 'Baloncesto: azul del 7', 'Bàsquet: blava del 7', 30),
    grupo_truenos: D('shirt', 'Grupo «Los Truenos»', 'Grup «Els Trons»', 30),
    grupo_galaxia: D('shirt', 'Grupo «Galaxia Pop»', 'Grup «Galàxia Pop»', 30),
    grupo_rock: D('shirt', 'Grupo «Monstruo Rock»', 'Grup «Monstre Rock»', 35),
    grupo_notas: D('shirt', 'Grupo «Las Notas Locas»', 'Grup «Les Notes Boges»', 30),
    marinera: D('shirt', 'Camiseta marinera', 'Samarreta mariner', 15),
    estrellas_cam: D('shirt', 'Camiseta de estrellas', 'Samarreta d’estreles', 15),
    arcoiris_cam: D('shirt', 'Camiseta arcoíris', 'Samarreta arc de Sant Martí', 20),
    hawaiana: D('shirt', 'Camisa hawaiana', 'Camisa hawaiana', 25),
    sudadera: D('shirt', 'Sudadera con bolsillo', 'Dessuadora amb butxaca', 30),
    chubasquero: D('shirt', 'Chubasquero amarillo', 'Impermeable groc', 25),
    pijama: D('shirt', 'Pijama de lunas', 'Pijama de llunes', 20),
    jersey_navidad: D('shirt', 'Jersey de Navidad', 'Jersei de Nadal', 25, '', ['12-01', '01-07']),
    traje_gala: D('shirt', 'Traje de gala', 'Vestit de gala', 60, 'adulto'),
    astronauta: D('shirt', 'Traje de astronauta', 'Vestit d’astronauta', 70, 'adulto'),
    superheroe: D('shirt', 'Traje de superhéroe', 'Vestit de superheroi', 80, 'heroico'),
    armadura: D('shirt', 'Armadura de caballero', 'Armadura de cavaller', 90, 'heroico'),
    camiseta_oro: D('shirt', 'Camiseta dorada de campeón', 'Samarreta daurada de campió', 120, 'mitico'),
    // Pantalones y faldas
    pantalon_gris: D('legs', 'Pantalón gris del cole', 'Pantaló gris del col·le', 15),
    falda_gris: D('legs', 'Falda gris del cole', 'Falda grisa del col·le', 15),
    vaqueros: D('legs', 'Vaqueros', 'Texans', 15),
    pantalon_corto: D('legs', 'Pantalón corto deportivo', 'Pantaló curt esportiu', 12),
    chandal: D('legs', 'Pantalón de chándal', 'Pantaló de xandall', 15),
    falda_flores: D('legs', 'Falda de flores', 'Falda de flors', 18),
    tutu: D('legs', 'Tutú rosa', 'Tutú rosa', 25),
    pantalon_pirata: D('legs', 'Pantalón pirata de rayas', 'Pantaló pirata de ratlles', 20),
    pantalon_oro: D('legs', 'Pantalón dorado de campeón', 'Pantaló daurat de campió', 90, 'legendario'),
    // Zapatos
    deportivas_blancas: D('shoes', 'Deportivas blancas', 'Esportives blanques', 10),
    deportivas_rojas: D('shoes', 'Deportivas rojas', 'Esportives roges', 12),
    deportivas_azules: D('shoes', 'Deportivas azules', 'Esportives blaves', 12),
    zapatos_cole: D('shoes', 'Zapatos del cole', 'Sabates del col·le', 12),
    botas_agua: D('shoes', 'Botas de agua', 'Botes d’aigua', 15),
    sandalias: D('shoes', 'Sandalias', 'Sandàlies', 10),
    botas_vaquero: D('shoes', 'Botas de vaquero', 'Botes de vaquer', 25),
    zapatos_fiesta: D('shoes', 'Zapatos de fiesta', 'Sabates de festa', 20),
    zapatos_payaso: D('shoes', 'Zapatones de payaso', 'Sabatots de pallasso', 20),
    zapatillas_conejo: D('shoes', 'Zapatillas de conejito', 'Sabatilles de conillet', 25),
    zapatillas_luces: D('shoes', 'Zapatillas con luces', 'Sabatilles amb llums', 40, 'adulto'),
    botas_astronauta: D('shoes', 'Botas de astronauta', 'Botes d’astronauta', 45, 'adulto'),
    botas_oro: D('shoes', 'Botas doradas', 'Botes daurades', 90, 'legendario'),
    // Huevos: cáscaras
    huevo_lunares: D('eggskin', 'Cáscara de lunares', 'Closca de pigues', 5),
    huevo_rayas: D('eggskin', 'Cáscara de rayas', 'Closca de ratlles', 5),
    huevo_estrellas: D('eggskin', 'Cáscara de estrellas', 'Closca d’estreles', 8),
    huevo_corazones: D('eggskin', 'Cáscara de corazones', 'Closca de cors', 8),
    huevo_arcoiris: D('eggskin', 'Cáscara arcoíris', 'Closca arc de Sant Martí', 10),
    huevo_dino: D('eggskin', 'Cáscara de dinosaurio', 'Closca de dinosaure', 10),
    huevo_galaxia: D('eggskin', 'Cáscara galáctica', 'Closca galàctica', 12),
    huevo_dorado: D('eggskin', 'Cáscara dorada brillante', 'Closca daurada brillant', 15),
    // Huevos: nidos
    nido_ramas: D('nest', 'Nido de ramitas', 'Niu de branquetes', 5),
    nido_cesta: D('nest', 'Cesta de mimbre', 'Cistella de vímet', 8),
    nido_cojin: D('nest', 'Cojín real', 'Coixí reial', 10),
    nido_flores: D('nest', 'Nido de flores', 'Niu de flors', 8),
    nido_nube: D('nest', 'Nube blandita', 'Núvol tou', 12)
  });

  // ---------- Utilidades de dibujo ----------
  const sw = (u, k) => (k || 3) * u;
  const star = (x, y, r, fill, u) => `<path transform="translate(${x} ${y}) scale(${r / 10})" d="M0 -10 L3 -3 L10 -3 L4.5 1.5 L6.5 9 L0 4.5 L-6.5 9 L-4.5 1.5 L-10 -3 L-3 -3 Z" fill="${fill}" stroke="${INK}" stroke-width="${1.6 / (r / 10) * u}"/>`;
  const heart = (x, y, r, fill) => `<path transform="translate(${x} ${y}) scale(${r / 10})" d="M0 6 C -12 -2 -12 -12 -5 -12 C -2 -12 0 -9 0 -8 C 0 -9 2 -12 5 -12 C 12 -12 12 -2 0 6 Z" fill="${fill}"/>`;
  const txt = (x, y, size, str, fill, stroke, u) => `<text x="${x}" y="${y}" font-family="Nunito, 'Arial Rounded MT Bold', Arial, sans-serif" font-weight="900" font-size="${size}" text-anchor="middle" fill="${fill}"${stroke ? ` stroke="${stroke}" stroke-width="${sw(u, 1.4)}" paint-order="stroke"` : ''}>${str}</text>`;

  /* Geometría que recibe cada prenda (coordenadas del dibujo):
     g.x0..g.x1 / g.y0..g.y1: zona del tronco · g.ly0..g.ly1: zona de las piernas · g.cx: centro
     g.u: unidad de grosor · g.feet: [{x, y, w}] (izquierdo y derecho) */
  const W = (g) => g.x1 - g.x0, H = (g) => g.y1 - g.y0;
  const hem = (g, fill, extra) => `<path d="M${g.x0 - 30 * g.u} ${g.y0 - 40 * g.u} H${g.x1 + 30 * g.u} V${g.y1} Q${g.cx} ${g.y1 + 7 * g.u} ${g.x0 - 30 * g.u} ${g.y1} Z" fill="${fill}" ${extra || ''}/>`;
  const hemLine = (g, col) => `<path d="M${g.x0 - 30 * g.u} ${g.y1} Q${g.cx} ${g.y1 + 7 * g.u} ${g.x1 + 30 * g.u} ${g.y1}" fill="none" stroke="${col || INK}" stroke-width="${sw(g.u, 2.6)}"/>`;
  const collarRound = (g, col) => `<path d="M${g.cx - g.nw * .28} ${g.y0 - 2 * g.u} Q${g.cx} ${g.y0 + 11 * g.u} ${g.cx + g.nw * .28} ${g.y0 - 2 * g.u}" fill="none" stroke="${col}" stroke-width="${sw(g.u, 4.5)}" stroke-linecap="round"/>`;
  const collarV = (g, col) => `<path d="M${g.cx - g.nw * .26} ${g.y0 - 3 * g.u} L${g.cx} ${g.y0 + 14 * g.u} L${g.cx + g.nw * .26} ${g.y0 - 3 * g.u}" fill="none" stroke="${col}" stroke-width="${sw(g.u, 4.5)}" stroke-linejoin="round" stroke-linecap="round"/>`;
  const stripesV = (g, col, n) => { let s = ''; const w = W(g) + 60 * g.u, step = w / n; for (let i = 0; i < n; i += 2) s += `<rect x="${g.x0 - 30 * g.u + i * step}" y="${g.y0 - 40 * g.u}" width="${step}" height="${H(g) + 48 * g.u}" fill="${col}"/>`; return s; };
  const stripesH = (g, col, n, from) => { let s = ''; const h = (g.y1 - g.y0) / n; for (let i = from || 0; i < n; i += 2) s += `<rect x="${g.x0 - 30 * g.u}" y="${g.y0 + i * h}" width="${W(g) + 60 * g.u}" height="${h}" fill="${col}"/>`; return s; };
  const num = (g, n, fill, stroke) => txt(g.cx, g.y0 + H(g) * .72, Math.max(9, H(g) * .55), n, fill, stroke, g.u);
  const shine = (g) => `<g class="cos-sheen"><rect x="${g.x0 - 20 * g.u}" y="${g.y0 - 40 * g.u}" width="${12 * g.u}" height="${H(g) + 60 * g.u}" fill="#fff" opacity=".45" transform="skewX(-18)"/></g>`;
  // Emblema del colegio (círculo verde de tres piezas, redibujado)
  const emblem = (x, y, r) => `<g transform="translate(${x} ${y})"><circle r="${r}" fill="#fff" stroke="#5a9a2e" stroke-width="${r * .18}"/>
    ${[0, 120, 240].map(a => `<path transform="rotate(${a})" d="M${-r * .78} ${-r * .12} A${r * .8} ${r * .8} 0 0 1 ${r * .18} ${-r * .78} L${r * .1} ${-r * .38} A${r * .42} ${r * .42} 0 0 0 ${-r * .38} ${-r * .08} Z" fill="#6aa83a"/>`).join('')}</g>`;

  const SHIRT = {
    uniforme_cole: (g) => `${hem(g, '#ffffff')}<path d="M${g.cx} ${g.y0 + 4 * g.u} V${g.y1}" stroke="#d9dde6" stroke-width="${sw(g.u, 2)}"/>
      ${[.35, .6, .85].map(k => `<circle cx="${g.cx}" cy="${g.y0 + H(g) * k}" r="${1.8 * g.u}" fill="#c3c8d4"/>`).join('')}
      <path d="M${g.cx - g.nw * .3} ${g.y0 - 4 * g.u} L${g.cx - 2 * g.u} ${g.y0 + 9 * g.u} L${g.cx - g.nw * .2} ${g.y0 + 10 * g.u} Z M${g.cx + g.nw * .3} ${g.y0 - 4 * g.u} L${g.cx + 2 * g.u} ${g.y0 + 9 * g.u} L${g.cx + g.nw * .2} ${g.y0 + 10 * g.u} Z" fill="#fff" stroke="#b7bdca" stroke-width="${sw(g.u, 1.6)}" stroke-linejoin="round"/>
      ${emblem(g.cx + W(g) * .2, g.y0 + H(g) * .4, Math.max(4, H(g) * .17))}${hemLine(g, '#b7bdca')}`,
    fut_rayas_rojas: (g) => `${hem(g, '#fff')}${stripesV(g, '#e8413c', 9)}${collarRound(g, '#e8413c')}${num(g, '9', '#fff', INK)}${hemLine(g)}`,
    fut_azul: (g) => `${hem(g, '#2f7de1')}<path d="M${g.x0 - 10 * g.u} ${g.y0 - 6 * g.u} L${g.x0 + 8 * g.u} ${g.y0 - 6 * g.u} L${g.x1 + 10 * g.u} ${g.y1 + 4 * g.u} L${g.x1 - 8 * g.u} ${g.y1 + 4 * g.u} Z" fill="#fff"/>${collarV(g, '#fff')}${hemLine(g)}`,
    fut_verde: (g) => `${hem(g, '#fff')}<rect x="${g.x0 - 30 * g.u}" y="${g.y0 - 40 * g.u}" width="${W(g) / 2 + 30 * g.u}" height="${H(g) + 48 * g.u}" fill="#2fb36b"/>${collarRound(g, '#1d8a50')}${star(g.cx + W(g) * .22, g.y0 + H(g) * .4, Math.max(3, H(g) * .14), '#ffd23f', g.u)}${hemLine(g)}`,
    fut_naranja: (g) => `${hem(g, '#ff8a2c')}${collarV(g, INK)}<path d="M${g.x0 - 30 * g.u} ${g.y1 - 5 * g.u} H${g.x1 + 30 * g.u}" stroke="${INK}" stroke-width="${sw(g.u, 3)}"/>${num(g, '10', INK, '#fff')}${hemLine(g)}`,
    fut_franjas: (g) => `${hem(g, '#fff')}${stripesH(g, '#7b5cff', 6, 1)}${collarRound(g, '#5b3fe0')}${hemLine(g)}`,
    fut_portero: (g) => `${hem(g, '#c6f03c')}<path d="${Array.from({ length: 8 }, (_, i) => `M${g.x0 - 30 * g.u + i * (W(g) + 60 * g.u) / 7} ${g.y0 + H(g) * .55} l${(W(g) + 60 * g.u) / 14} ${-H(g) * .18} l${(W(g) + 60 * g.u) / 14} ${H(g) * .18}`).join(' ')}" fill="none" stroke="${INK}" stroke-width="${sw(g.u, 2.4)}"/>${collarRound(g, INK)}${num(g, '1', INK)}${hemLine(g)}`,
    basket_amarilla: (g) => basket(g, '#ffd23f', '#7b5cff', '5'),
    basket_roja: (g) => basket(g, '#e8413c', '#fff', '3'),
    basket_azul: (g) => basket(g, '#2f5fd0', '#ffd23f', '7'),
    grupo_truenos: (g) => `${hem(g, '#2d2440')}<path transform="translate(${g.cx} ${g.y0 + H(g) * .5}) scale(${H(g) / 40})" d="M3 -16 L-8 2 L-1 2 L-4 16 L8 -3 L1 -3 Z" fill="#ffd23f" stroke="#fff" stroke-width="1.4" stroke-linejoin="round"/>${collarRound(g, '#555')}${hemLine(g, '#000')}`,
    grupo_galaxia: (g) => `${hem(g, '#5b3fe0')}<circle cx="${g.cx}" cy="${g.y0 + H(g) * .52}" r="${H(g) * .24}" fill="#ff9cc0" stroke="#fff" stroke-width="${sw(g.u, 1.6)}"/><ellipse cx="${g.cx}" cy="${g.y0 + H(g) * .52}" rx="${H(g) * .42}" ry="${H(g) * .1}" fill="none" stroke="#ffd23f" stroke-width="${sw(g.u, 2)}"/>${star(g.cx - W(g) * .3, g.y0 + H(g) * .3, Math.max(2, H(g) * .08), '#fff', g.u)}${star(g.cx + W(g) * .3, g.y0 + H(g) * .7, Math.max(2, H(g) * .07), '#fff', g.u)}${collarRound(g, '#3d2aa8')}${hemLine(g)}`,
    grupo_rock: (g) => `${hem(g, '#1c1a24')}<g transform="translate(${g.cx} ${g.y0 + H(g) * .52}) scale(${H(g) / 44}) rotate(-30)"><path d="M-3 -18 H3 V6 H-3 Z" fill="#c98d0b"/><path d="M0 4 C-9 2 -12 10 -8 15 C-4 19 4 19 8 15 C12 10 9 2 0 4 Z" fill="#e8413c" stroke="#fff" stroke-width="1.2"/><circle cy="10" r="2.6" fill="#1c1a24"/><rect x="-4" y="-22" width="8" height="5" rx="1.5" fill="#c98d0b"/></g>${collarV(g, '#e8413c')}${hemLine(g, '#000')}`,
    grupo_notas: (g) => `${hem(g, '#fff')}${[[-.25, .38, '#7b5cff'], [.05, .62, '#ff6fae'], [.28, .34, '#2fcf95']].map(([dx, dy, c]) => `<g transform="translate(${g.cx + W(g) * dx} ${g.y0 + H(g) * dy}) scale(${H(g) / 46})"><path d="M3 -10 V5" stroke="${INK}" stroke-width="2.4"/><path d="M3 -10 Q9 -8 10 -2" fill="none" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/><ellipse cx="-1" cy="6" rx="5" ry="4" fill="${c}" stroke="${INK}" stroke-width="1.6"/></g>`).join('')}${collarRound(g, '#7b5cff')}${hemLine(g)}`,
    marinera: (g) => `${hem(g, '#fff')}${stripesH(g, '#2f5fd0', 9, 1)}${collarRound(g, '#2f5fd0')}${hemLine(g)}`,
    estrellas_cam: (g) => `${hem(g, '#3fa9ff')}${[[-.3, .35], [.25, .3], [0, .65], [-.2, .8], [.32, .75]].map(([dx, dy], i) => star(g.cx + W(g) * dx, g.y0 + H(g) * dy, Math.max(2, H(g) * (i % 2 ? .1 : .13)), '#ffd23f', g.u)).join('')}${collarRound(g, '#1f7fd0')}${hemLine(g)}`,
    arcoiris_cam: (g) => { const cols = ['#ff6fae', '#ffc83d', '#2fcf95', '#3fa9ff', '#7b5cff'], h = (H(g) + 40 * g.u) / cols.length; return `${hem(g, '#fff')}${cols.map((c, i) => `<rect x="${g.x0 - 30 * g.u}" y="${g.y0 - 40 * g.u + i * h}" width="${W(g) + 60 * g.u}" height="${h + .5}" fill="${c}"/>`).join('')}${collarRound(g, '#fff')}${hemLine(g)}`; },
    hawaiana: (g) => `${hem(g, '#2fcfc0')}${[[-.3, .35, '#ff6fae'], [.2, .28, '#ffd23f'], [-.05, .7, '#ff8a3c'], [.32, .72, '#ff6fae']].map(([dx, dy, c]) => flower(g.cx + W(g) * dx, g.y0 + H(g) * dy, Math.max(2, H(g) * .09), c)).join('')}${collarV(g, '#1d9c90')}<path d="M${g.cx} ${g.y0 + 12 * g.u} V${g.y1}" stroke="#1d9c90" stroke-width="${sw(g.u, 1.6)}"/>${hemLine(g)}`,
    sudadera: (g) => `${hem(g, '#8e7cc3')}<path d="M${g.cx - W(g) * .25} ${g.y0 + H(g) * .58} H${g.cx + W(g) * .25} L${g.cx + W(g) * .2} ${g.y1 - 2 * g.u} H${g.cx - W(g) * .2} Z" fill="#7a68b0" stroke="${INK}" stroke-width="${sw(g.u, 1.6)}"/><path d="M${g.cx - 4 * g.u} ${g.y0 + 2 * g.u} V${g.y0 + H(g) * .4} M${g.cx + 4 * g.u} ${g.y0 + 2 * g.u} V${g.y0 + H(g) * .45}" stroke="#fff" stroke-width="${sw(g.u, 1.8)}" stroke-linecap="round"/>${collarRound(g, '#6d5aa8')}${hemLine(g)}`,
    chubasquero: (g) => `${hem(g, '#ffd23f')}<path d="M${g.cx} ${g.y0 + 2 * g.u} V${g.y1}" stroke="#e0a800" stroke-width="${sw(g.u, 2.4)}"/>${[.3, .55, .8].map(k => `<rect x="${g.cx - 4 * g.u}" y="${g.y0 + H(g) * k - 1.5 * g.u}" width="${8 * g.u}" height="${3 * g.u}" rx="${1.5 * g.u}" fill="#fff" stroke="${INK}" stroke-width="${sw(g.u, 1)}"/>`).join('')}${collarRound(g, '#e0a800')}${hemLine(g)}`,
    pijama: (g) => `${hem(g, '#bfe3ff')}${[[-.28, .35], [.22, .32], [0, .7], [-.3, .78], [.3, .75]].map(([dx, dy]) => `<path transform="translate(${g.cx + W(g) * dx} ${g.y0 + H(g) * dy}) scale(${H(g) / 60})" d="M2 -6 A6 6 0 1 0 2 6 A4.5 4.5 0 1 1 2 -6 Z" fill="#ffe58a"/>`).join('')}${collarRound(g, '#8fc9ff')}${hemLine(g)}`,
    jersey_navidad: (g) => `${hem(g, '#c62f2b')}${stripesH(g, '#fff', 10, 7)}<path d="M${g.cx} ${g.y0 + H(g) * .2} l${H(g) * .16} ${H(g) * .3} h${-H(g) * .32} Z" fill="#2fa860" stroke="#fff" stroke-width="${sw(g.u, 1.2)}"/>${star(g.cx, g.y0 + H(g) * .2, Math.max(2, H(g) * .07), '#ffd23f', g.u)}${collarRound(g, '#2fa860')}${hemLine(g)}`,
    traje_gala: (g) => `${hem(g, '#2d2440')}<path d="M${g.cx - g.nw * .2} ${g.y0 - 4 * g.u} L${g.cx} ${g.y1} L${g.cx + g.nw * .2} ${g.y0 - 4 * g.u} Z" fill="#fff"/><path d="M${g.cx - g.nw * .2} ${g.y0 - 4 * g.u} L${g.cx - 3 * g.u} ${g.y0 + H(g) * .7} M${g.cx + g.nw * .2} ${g.y0 - 4 * g.u} L${g.cx + 3 * g.u} ${g.y0 + H(g) * .7}" stroke="#4a3f66" stroke-width="${sw(g.u, 3)}"/><g transform="translate(${g.cx} ${g.y0 + 4 * g.u}) scale(${g.u * .7})"><path d="M0 0 L-12 -7 L-12 7 Z M0 0 L12 -7 L12 7 Z" fill="#e8413c" stroke="${INK}" stroke-width="2"/><circle r="3.5" fill="#ff6b6b" stroke="${INK}" stroke-width="2"/></g>${[.45, .65].map(k => `<circle cx="${g.cx}" cy="${g.y0 + H(g) * k}" r="${1.6 * g.u}" fill="${INK}"/>`).join('')}${hemLine(g, '#000')}`,
    astronauta: (g) => `${hem(g, '#f3f5fb')}<rect x="${g.cx - W(g) * .2}" y="${g.y0 + H(g) * .32}" width="${W(g) * .4}" height="${H(g) * .34}" rx="${3 * g.u}" fill="#d9dee6" stroke="${INK}" stroke-width="${sw(g.u, 1.6)}"/>${['#e8413c', '#2fcf95', '#ffd23f'].map((c, i) => `<circle cx="${g.cx - W(g) * .11 + i * W(g) * .11}" cy="${g.y0 + H(g) * .49}" r="${H(g) * .05}" fill="${c}"/>`).join('')}<path d="M${g.x0 - 30 * g.u} ${g.y0 + H(g) * .15} H${g.x1 + 30 * g.u}" stroke="#ff8a2c" stroke-width="${sw(g.u, 3)}"/>${collarRound(g, '#9aa4b2')}${hemLine(g)}`,
    superheroe: (g) => `${hem(g, '#2f5fd0')}<path d="M${g.cx} ${g.y0 + H(g) * .18} L${g.cx + H(g) * .3} ${g.y0 + H(g) * .38} L${g.cx} ${g.y0 + H(g) * .82} L${g.cx - H(g) * .3} ${g.y0 + H(g) * .38} Z" fill="#ffd23f" stroke="#e8413c" stroke-width="${sw(g.u, 2.4)}" stroke-linejoin="round"/>${star(g.cx, g.y0 + H(g) * .46, Math.max(2.5, H(g) * .14), '#e8413c', g.u)}<path d="M${g.x0 - 30 * g.u} ${g.y1 - 4 * g.u} H${g.x1 + 30 * g.u}" stroke="#e8413c" stroke-width="${sw(g.u, 4)}"/>${hemLine(g)}`,
    armadura: (g) => `${hem(g, '#c3cad6')}${stripesH(g, '#aab3c2', 6, 1)}<path d="M${g.cx} ${g.y0 + H(g) * .15} V${g.y1}" stroke="#8a93a3" stroke-width="${sw(g.u, 2)}"/>${[.25, .5, .75].map(k => `<circle cx="${g.cx - W(g) * .28}" cy="${g.y0 + H(g) * k}" r="${1.4 * g.u}" fill="#6b7383"/><circle cx="${g.cx + W(g) * .28}" cy="${g.y0 + H(g) * k}" r="${1.4 * g.u}" fill="#6b7383"/>`).join('')}<path d="M${g.cx - H(g) * .2} ${g.y0 + H(g) * .3} H${g.cx + H(g) * .2} V${g.y0 + H(g) * .55} Q${g.cx} ${g.y0 + H(g) * .8} ${g.cx - H(g) * .2} ${g.y0 + H(g) * .55} Z" fill="#e8413c" stroke="${INK}" stroke-width="${sw(g.u, 1.6)}"/>${shine(g)}${hemLine(g)}`,
    camiseta_oro: (g) => `${hem(g, '#ffcf3a')}<path d="M${g.x0 - 30 * g.u} ${g.y0 + H(g) * .2} H${g.x1 + 30 * g.u}" stroke="#fff3b0" stroke-width="${sw(g.u, 3)}"/>${star(g.cx, g.y0 + H(g) * .55, Math.max(3, H(g) * .2), '#fff3b0', g.u)}${collarV(g, '#e0a10f')}${shine(g)}${hemLine(g, '#c98d0b')}`
  };
  function basket(g, c1, c2, n) {
    const ax = W(g) * .16;
    return `<path d="M${g.x0 - 30 * g.u} ${g.y0 - 40 * g.u} H${g.x1 + 30 * g.u} V${g.y1} Q${g.cx} ${g.y1 + 7 * g.u} ${g.x0 - 30 * g.u} ${g.y1} Z" fill="${c1}"/>
      <path d="M${g.x0 + ax} ${g.y0 + H(g) * .45} Q${g.x0 + ax} ${g.y0 + H(g) * .1} ${g.x0 - 4 * g.u} ${g.y0 - 2 * g.u} M${g.x1 - ax} ${g.y0 + H(g) * .45} Q${g.x1 - ax} ${g.y0 + H(g) * .1} ${g.x1 + 4 * g.u} ${g.y0 - 2 * g.u}" fill="none" stroke="${c2}" stroke-width="${sw(g.u, 3.5)}"/>
      ${collarV(g, c2)}${num(g, n, c2, INK)}${hemLine(g)}`;
  }
  const flower = (x, y, r, c) => `<g transform="translate(${x} ${y})">${[0, 72, 144, 216, 288].map(a => `<circle r="${r}" transform="rotate(${a}) translate(0 ${-r})" fill="${c}"/>`).join('')}<circle r="${r * .7}" fill="#fff3b0"/></g>`;

  // ---------- Pantalones y faldas ----------
  const LW = (g) => g.x1 - g.x0, LH = (g) => g.ly1 - g.ly0;
  function trousers(g, fill, seam, extra) {
    const x0 = g.x0 - 30 * g.u, x1 = g.x1 + 30 * g.u;
    return `<rect x="${x0}" y="${g.ly0}" width="${x1 - x0}" height="${LH(g) + 20 * g.u}" fill="${fill}"/>
      <path d="M${g.cx} ${g.ly0 + LH(g) * .32} V${g.ly1 + 10 * g.u}" stroke="${seam}" stroke-width="${sw(g.u, 3.2)}"/>
      <path d="M${x0} ${g.ly0 + 1 * g.u} H${x1}" stroke="${seam}" stroke-width="${sw(g.u, 2.6)}"/>${extra || ''}`;
  }
  function skirt(g, fill, line, extra, short) {
    const x0 = g.x0 - 30 * g.u, x1 = g.x1 + 30 * g.u, y1 = g.ly0 + LH(g) * (short ? .55 : .72);
    let pleats = ''; for (let i = 1; i < 8; i++) { const x = g.x0 + LW(g) * i / 8; pleats += `<path d="M${x} ${g.ly0 + 3 * g.u} L${x + (x - g.cx) * .08} ${y1}" stroke="${line}" stroke-width="${sw(g.u, 1.4)}"/>`; }
    return `<path d="M${x0} ${g.ly0} H${x1} V${y1} Q${g.cx} ${y1 + 6 * g.u} ${x0} ${y1} Z" fill="${fill}"/>${pleats}
      <path d="M${x0} ${y1} Q${g.cx} ${y1 + 6 * g.u} ${x1} ${y1}" fill="none" stroke="${INK}" stroke-width="${sw(g.u, 2.4)}"/><path d="M${x0} ${g.ly0 + 1 * g.u} H${x1}" stroke="${line}" stroke-width="${sw(g.u, 2.6)}"/>${extra || ''}`;
  }
  const LEGS = {
    pantalon_gris: (g) => trousers(g, '#8a8f99', '#6b707a'),
    falda_gris: (g) => skirt(g, '#8a8f99', '#6b707a'),
    vaqueros: (g) => trousers(g, '#3f6fb5', '#f2b44a', `<path d="M${g.x0} ${g.ly0 + LH(g) * .22} Q${g.x0 + LW(g) * .2} ${g.ly0 + LH(g) * .3} ${g.x0 + LW(g) * .3} ${g.ly0 + 2 * g.u} M${g.x1} ${g.ly0 + LH(g) * .22} Q${g.x1 - LW(g) * .2} ${g.ly0 + LH(g) * .3} ${g.x1 - LW(g) * .3} ${g.ly0 + 2 * g.u}" fill="none" stroke="#f2b44a" stroke-width="${sw(g.u, 1.4)}" stroke-dasharray="${2 * g.u} ${2 * g.u}"/>`),
    pantalon_corto: (g) => skirt(g, '#2f5fd0', '#2f5fd0', `<path d="M${g.cx} ${g.ly0 + LH(g) * .25} V${g.ly0 + LH(g) * .55}" stroke="#1f3f99" stroke-width="${sw(g.u, 2.6)}"/><path d="M${g.x0 + 2 * g.u} ${g.ly0} V${g.ly0 + LH(g) * .55} M${g.x1 - 2 * g.u} ${g.ly0} V${g.ly0 + LH(g) * .55}" stroke="#fff" stroke-width="${sw(g.u, 2.4)}"/>`, true),
    chandal: (g) => trousers(g, '#2d2440', '#1a1526', `<path d="M${g.x0 + 3 * g.u} ${g.ly0} V${g.ly1 + 10 * g.u} M${g.x1 - 3 * g.u} ${g.ly0} V${g.ly1 + 10 * g.u}" stroke="#fff" stroke-width="${sw(g.u, 2.4)}"/>`),
    falda_flores: (g) => skirt(g, '#ffb3cf', '#ff8fb8', [[-.3, .3], [0, .5], [.3, .32], [-.15, .62], [.2, .6]].map(([dx, dy]) => flower(g.cx + LW(g) * dx, g.ly0 + LH(g) * dy, Math.max(1.6, LH(g) * .06), '#fff')).join('')),
    tutu: (g) => { const y1 = g.ly0 + LH(g) * .5; let f = ''; for (let i = 0; i < 9; i++) { const x = g.x0 - 20 * g.u + (LW(g) + 40 * g.u) * i / 8; f += `<path d="M${x} ${g.ly0} Q${x + 8 * g.u} ${y1 + 6 * g.u} ${x + (LW(g) + 40 * g.u) / 8} ${g.ly0}" fill="#ffc6dc" stroke="#ff8fb8" stroke-width="${sw(g.u, 1.2)}"/>`; } return `<rect x="${g.x0 - 30 * g.u}" y="${g.ly0 - 2 * g.u}" width="${LW(g) + 60 * g.u}" height="${LH(g) * .14}" fill="#ff8fb8"/>${f}`; },
    pantalon_pirata: (g) => trousers(g, '#fff', '#c62f2b', Array.from({ length: 5 }, (_, i) => `<rect x="${g.x0 - 30 * g.u}" y="${g.ly0 + LH(g) * (.1 + i * .2)}" width="${LW(g) + 60 * g.u}" height="${LH(g) * .09}" fill="#c62f2b"/>`).join('')),
    pantalon_oro: (g) => trousers(g, '#ffcf3a', '#e0a10f', `<g class="cos-sheen"><rect x="${g.x0}" y="${g.ly0}" width="${8 * g.u}" height="${LH(g) + 20 * g.u}" fill="#fff" opacity=".45" transform="skewX(-18)"/></g>`)
  };

  // ---------- Zapatos ----------
  // un zapato mirando hacia fuera (dir = -1 izquierda, 1 derecha); w = ancho del pie
  function shoe(x, y, w, dir, o) {
    const h = w * .42, k = w / 40;
    const body = `M${-w * .42} ${h * .35} Q${-w * .48} ${-h * .55} ${-w * .12} ${-h * .62} Q${w * .3} ${-h * .62} ${w * .5} ${-h * .05} Q${w * .6} ${h * .32} ${w * .44} ${h * .4} Z`;
    return `<g transform="translate(${x} ${y}) scale(${dir} 1)">
      <path d="${body}" fill="${o.c}" stroke="${INK}" stroke-width="${2.6 * k}" stroke-linejoin="round"/>
      <path d="M${-w * .44} ${h * .22} Q${0} ${h * .44} ${w * .5} ${h * .2}" fill="none" stroke="${o.sole || '#fff'}" stroke-width="${3.4 * k}" stroke-linecap="round"/>
      ${o.lace ? `<path d="M${-w * .08} ${-h * .5} L${w * .14} ${-h * .1} M${w * .06} ${-h * .55} L${-w * .06} ${-h * .12}" stroke="${o.lace}" stroke-width="${1.8 * k}" stroke-linecap="round"/>` : ''}
      ${o.extra ? o.extra(w, h, k) : ''}</g>`;
  }
  const pair = (o) => (f) => f.map((p, i) => shoe(p.x, p.y, p.w, i ? 1 : -1, o)).join('');
  const SHOES = {
    deportivas_blancas: pair({ c: '#fbfbff', sole: '#d6d9e3', lace: '#3fa9ff', extra: (w, h, k) => `<path d="M${-w * .3} ${-h * .1} Q0 ${h * .1} ${w * .3} ${-h * .05}" fill="none" stroke="#3fa9ff" stroke-width="${2 * k}"/>` }),
    deportivas_rojas: pair({ c: '#e8413c', sole: '#fff', lace: '#fff' }),
    deportivas_azules: pair({ c: '#2f7de1', sole: '#fff', lace: '#ffd23f' }),
    zapatos_cole: pair({ c: '#2d2440', sole: '#5b5470', extra: (w, h, k) => `<path d="M${-w * .1} ${-h * .5} L${w * .25} ${-h * .2}" stroke="#8a8199" stroke-width="${2.2 * k}"/>` }),
    botas_agua: (f) => f.map((p, i) => `<g transform="translate(${p.x} ${p.y}) scale(${i ? 1 : -1} 1)"><path d="M${-p.w * .32} ${-p.w * .7} H${p.w * .2} V${-p.w * .1} Q${p.w * .55} ${-p.w * .08} ${p.w * .5} ${p.w * .16} H${-p.w * .4} Z" fill="#ffd23f" stroke="${INK}" stroke-width="${2.6 * p.w / 40}" stroke-linejoin="round"/><path d="M${-p.w * .32} ${-p.w * .58} H${p.w * .2}" stroke="#e0a800" stroke-width="${3 * p.w / 40}"/></g>`).join(''),
    sandalias: pair({ c: '#f2c79a', sole: '#a0753f', extra: (w, h, k) => `<path d="M${-w * .2} ${-h * .55} L${-w * .05} ${h * .3} M${w * .15} ${-h * .5} L${w * .2} ${h * .3}" stroke="#a0753f" stroke-width="${3 * k}"/>` }),
    botas_vaquero: (f) => f.map((p, i) => `<g transform="translate(${p.x} ${p.y}) scale(${i ? 1 : -1} 1)"><path d="M${-p.w * .3} ${-p.w * .72} L${p.w * .18} ${-p.w * .72} L${p.w * .12} ${-p.w * .12} Q${p.w * .6} ${-p.w * .1} ${p.w * .58} ${p.w * .16} H${-p.w * .42} Z" fill="#a0602b" stroke="${INK}" stroke-width="${2.6 * p.w / 40}" stroke-linejoin="round"/>${star(-p.w * .06, -p.w * .42, p.w * .12, '#ffd23f', p.w / 40)}</g>`).join(''),
    zapatos_fiesta: pair({ c: '#1c1a24', sole: '#5b5470', extra: (w, h, k) => `<ellipse cx="${w * .1}" cy="${-h * .38}" rx="${w * .12}" ry="${h * .1}" fill="#fff" opacity=".6"/>` }),
    zapatos_payaso: (f) => f.map((p, i) => shoe(p.x + (i ? 1 : -1) * p.w * .25, p.y, p.w * 1.5, i ? 1 : -1, { c: '#e8413c', sole: '#ffd23f', extra: (w, h, k) => `<circle cx="${w * .1}" cy="${-h * .3}" r="${w * .07}" fill="#ffd23f" stroke="${INK}" stroke-width="${1.6 * k}"/>` })).join(''),
    zapatillas_conejo: pair({ c: '#ffd6e6', sole: '#ffb3cf', extra: (w, h, k) => `<ellipse cx="${-w * .12}" cy="${-h * 1.05}" rx="${w * .07}" ry="${h * .5}" fill="#fff" stroke="${INK}" stroke-width="${1.8 * k}"/><ellipse cx="${w * .08}" cy="${-h * 1.05}" rx="${w * .07}" ry="${h * .5}" fill="#fff" stroke="${INK}" stroke-width="${1.8 * k}"/><circle cx="${w * .3}" cy="${-h * .2}" r="${w * .04}" fill="${INK}"/>` }),
    zapatillas_luces: pair({ c: '#fbfbff', sole: '#7b5cff', lace: '#ff6fae', extra: (w, h, k) => `<g class="cos-lights">${['#ff6fae', '#ffd23f', '#2fcf95', '#3fa9ff'].map((c, i) => `<circle cx="${-w * .3 + i * w * .22}" cy="${h * .3}" r="${w * .05}" fill="${c}"/>`).join('')}</g>` }),
    botas_astronauta: (f) => f.map((p, i) => `<g transform="translate(${p.x} ${p.y}) scale(${i ? 1 : -1} 1)"><path d="M${-p.w * .36} ${-p.w * .6} H${p.w * .24} V${-p.w * .14} Q${p.w * .56} ${-p.w * .1} ${p.w * .52} ${p.w * .16} H${-p.w * .44} Z" fill="#f3f5fb" stroke="${INK}" stroke-width="${2.6 * p.w / 40}" stroke-linejoin="round"/><path d="M${-p.w * .36} ${-p.w * .3} H${p.w * .24}" stroke="#ff8a2c" stroke-width="${3.4 * p.w / 40}"/><path d="M${-p.w * .44} ${p.w * .1} H${p.w * .52}" stroke="#9aa4b2" stroke-width="${3 * p.w / 40}"/></g>`).join(''),
    botas_oro: (f) => `<g class="cos-twinkle">${f.map((p, i) => `<g transform="translate(${p.x} ${p.y}) scale(${i ? 1 : -1} 1)"><path d="M${-p.w * .32} ${-p.w * .62} H${p.w * .2} V${-p.w * .1} Q${p.w * .56} ${-p.w * .08} ${p.w * .52} ${p.w * .16} H${-p.w * .42} Z" fill="#ffcf3a" stroke="${INK}" stroke-width="${2.6 * p.w / 40}" stroke-linejoin="round"/>${star(-p.w * .05, -p.w * .35, p.w * .11, '#fff3b0', p.w / 40)}</g>`).join('')}</g>`
  };

  /* Ropa del monstruo. g: geometría (ver arriba) + g.clip: atributo de recorte con la silueta.
     Devuelve { under: camiseta y pantalones (recortados), shoes: zapatos (encima) } */
  function clothes(eq, g) {
    const out = { under: '', shoes: '' };
    if (!eq || !g) return out;
    let inner = '';
    if (eq.legs && LEGS[eq.legs] && g.ly1 > g.ly0) inner += LEGS[eq.legs](g);
    if (eq.shirt && SHIRT[eq.shirt] && g.y1 > g.y0) inner += SHIRT[eq.shirt](g);
    if (inner) out.under = `<g class="cos-clothes" ${g.clip || ''}>${inner}</g>`;
    if (eq.shoes && SHOES[eq.shoes] && g.feet && g.feet.length === 2) out.shoes = `<g class="cos-shoes">${SHOES[eq.shoes](g.feet)}</g>`;
    return out;
  }

  // ---------- Huevos: cáscaras y nidos ----------
  // (huevo: elipse de centro 100,120 y radios 54 x 64)
  const EGG = {
    huevo_lunares: (c) => ({ base: c.base, pat: [[78, 92, 10], [122, 84, 7], [126, 136, 12], [84, 150, 9], [104, 116, 6], [62, 124, 6], [140, 108, 5], [106, 170, 7]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" opacity=".85"/>`).join('') }),
    huevo_rayas: (c) => ({ base: c.base, pat: [78, 106, 134, 162].map(y => `<path d="M40 ${y} Q100 ${y - 14} 160 ${y}" fill="none" stroke="#fff" stroke-width="9" opacity=".85"/>`).join('') }),
    huevo_estrellas: () => ({ base: '#3d4fa8', pat: [[80, 90, 9], [124, 82, 6], [118, 128, 11], [78, 146, 7], [104, 168, 6], [140, 150, 5], [96, 112, 4]].map(([x, y, r]) => star(x, y, r, '#ffd23f', 1)).join('') }),
    huevo_corazones: () => ({ base: '#ffc0d6', pat: [[80, 96, 10], [122, 88, 8], [110, 134, 12], [76, 150, 8], [130, 160, 7]].map(([x, y, r]) => heart(x, y, r, '#ff4f8b')).join('') }),
    huevo_arcoiris: () => ({ base: '#fff', pat: ['#ff6fae', '#ffc83d', '#2fcf95', '#3fa9ff', '#7b5cff'].map((c, i) => `<rect x="40" y="${56 + i * 26}" width="120" height="27" fill="${c}"/>`).join('') }),
    huevo_dino: () => ({ base: '#7fd35a', pat: [[78, 96, 12, 8], [122, 90, 9, 6], [114, 140, 14, 9], [74, 152, 9, 6], [132, 168, 7, 5]].map(([x, y, rx, ry]) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#4fa83a"/>`).join('') + '<path d="M84 60 l6 -10 l6 10 l6 -10 l6 10 l6 -10 l6 10" fill="#ffd23f" stroke="#2d2440" stroke-width="2.5" stroke-linejoin="round"/>' }),
    huevo_galaxia: () => ({ base: '#2b2366', pat: '<circle cx="80" cy="140" r="30" fill="#7b3fa8" opacity=".6"/><circle cx="126" cy="96" r="24" fill="#3f6fd0" opacity=".5"/>' + [[70, 90, 4], [120, 70, 3], [134, 130, 5], [96, 160, 3], [112, 110, 2.5], [84, 120, 2]].map(([x, y, r]) => star(x, y, r * 2, '#fff', 1)).join('') }),
    huevo_dorado: () => ({ base: '#ffcf3a', pat: '<g class="cos-sheen"><rect x="58" y="40" width="18" height="170" fill="#fff" opacity=".55" transform="skewX(-18)"/></g>' + [[82, 92, 5], [124, 120, 7], [96, 152, 4]].map(([x, y, r]) => star(x, y, r * 2, '#fff3b0', 1)).join(''), cls: 'cos-twinkle-soft' })
  };
  function eggSkin(eq, c) {
    if (!eq || !eq.eggskin || !EGG[eq.eggskin]) return null;
    return EGG[eq.eggskin](c);
  }
  const NEST = {
    nido_ramas: () => `<path d="M38 176 Q100 214 162 176 Q154 196 100 198 Q46 196 38 176 Z" fill="#a0753f" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>${[[50, 182, 74, 192], [66, 190, 102, 194], [96, 194, 134, 188], [124, 190, 152, 180], [58, 178, 92, 188], [108, 188, 146, 178]].map(([a, b, c, d]) => `<path d="M${a} ${b} Q${(a + c) / 2} ${(b + d) / 2 + 5} ${c} ${d}" fill="none" stroke="#6e4d24" stroke-width="3" stroke-linecap="round"/>`).join('')}`,
    nido_cesta: () => `<path d="M42 172 H158 L150 198 H50 Z" fill="#e8b46a" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>${[56, 74, 92, 110, 128, 146].map(x => `<path d="M${x} 174 L${x - 2} 196" stroke="#c9904a" stroke-width="3"/>`).join('')}<path d="M44 182 H156 M46 190 H154" stroke="#c9904a" stroke-width="2.5"/><path d="M40 172 Q100 166 160 172" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>`,
    nido_cojin: () => `<path d="M34 178 Q30 168 46 166 Q100 160 154 166 Q170 168 166 178 Q170 196 150 196 Q100 202 50 196 Q30 196 34 178 Z" fill="#7b5cff" stroke="${INK}" stroke-width="3.5"/><path d="M46 172 Q100 166 154 172" fill="none" stroke="#a48bff" stroke-width="3"/>${[[40, 168], [160, 168], [40, 194], [160, 194]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="#ffd23f" stroke="${INK}" stroke-width="2"/>`).join('')}`,
    nido_flores: () => `<path d="M40 178 Q100 206 160 178 Q154 198 100 198 Q46 198 40 178 Z" fill="#7fd35a" stroke="${INK}" stroke-width="3.5"/>${[[52, 182, '#ff8fb8'], [78, 192, '#ffd23f'], [104, 195, '#fff'], [128, 191, '#ff8fb8'], [150, 182, '#c9a7ff']].map(([x, y, c]) => flower(x, y, 4, c)).join('')}`,
    nido_nube: () => `<path d="M30 190 Q22 172 44 170 Q50 158 70 166 Q84 156 100 166 Q116 156 130 166 Q150 158 156 170 Q178 172 170 190 Q100 204 30 190 Z" fill="#fff" stroke="#9fc4e8" stroke-width="3.5" stroke-linejoin="round"/>`
  };
  const nest = (eq) => eq && eq.nest && NEST[eq.nest] ? `<g class="cos-nest">${NEST[eq.nest]()}</g>` : '';

  // ---------- Rareza (para que se note qué es especial) ----------
  const PI = ['', 'cria', 'joven', 'adulto', 'heroico', 'legendario', 'mitico'];
  function rarity(it) {
    const ph = PI.indexOf(it.minPhase || '');
    if ((it.price || 0) >= 70 || ph >= 4) return 'legend';
    if ((it.price || 0) >= 35 || ph >= 3) return 'epic';
    if ((it.price || 0) >= 18) return 'rare';
    return 'common';
  }

  Object.assign(C, { clothes, eggSkin, nest, EGG_SLOTS, NEW_SLOTS, rarity, SHIRT, LEGS, SHOES, EGG, NEST });
})();
