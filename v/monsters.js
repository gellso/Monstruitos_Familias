/* Monstruitos — generador de monstruos en SVG (diseño original por piezas) */
(function () {
  'use strict';
  let uid = 0;

  // ---------- Utilidades de color ----------
  function hexToRgb(h) {
    h = h.replace('#', '');
    if (h.length === 3) h = h.split('').map(c => c + c).join('');
    const n = parseInt(h, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  function rgbToHex(r, g, b) {
    return '#' + [r, g, b].map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');
  }
  // amt > 0 aclara hacia blanco, amt < 0 oscurece hacia negro (0..1)
  function shade(hex, amt) {
    const [r, g, b] = hexToRgb(hex);
    if (amt >= 0) return rgbToHex(r + (255 - r) * amt, g + (255 - g) * amt, b + (255 - b) * amt);
    return rgbToHex(r * (1 + amt), g * (1 + amt), b * (1 + amt));
  }

  // ---------- Catálogos ----------
  const COLORS = [
    { id: 'menta', hex: '#5fd3a8' },
    { id: 'cielo', hex: '#5ab8f0' },
    { id: 'lila', hex: '#a98bf0' },
    { id: 'rosa', hex: '#f38bb8' },
    { id: 'naranja', hex: '#ffa25a' },
    { id: 'limon', hex: '#f5d34a' },
    { id: 'coral', hex: '#f47a6e' },
    { id: 'turquesa', hex: '#3fc6c9' },
    { id: 'pistacho', hex: '#a5d65a' },
    { id: 'azul', hex: '#6f86f2' },
    { id: 'uva', hex: '#c46fd8' },
    { id: 'arena', hex: '#d9b07a' }
  ];
  const SPECIES = ['gota', 'bola', 'cubo', 'pera'];
  const EYES = ['redondos', 'grandes', 'felices', 'puntos', 'ciclope'];
  const MOUTHS = ['sonrisa', 'abierta', 'diente', 'lengua', 'o'];
  const ACCESSORIES = ['ninguno', 'lazo', 'gorro', 'gafas', 'flor', 'pajarita'];
  const PHASES = ['huevo', 'cria', 'joven', 'adulto', 'heroico', 'legendario', 'mitico'];

  const INK = '#2d2440';

  // Geometría de cada especie (coordenadas con el suelo en y=182)
  const BODY = {
    gota: {
      path: 'M100 34 C 120 62 168 100 168 136 C 168 166 140 182 100 182 C 60 182 32 166 32 136 C 32 100 80 62 100 34 Z',
      face: [100, 128], top: [100, 52], belly: [100, 156, 40, 22], arms: [[36, 136], [164, 136]]
    },
    bola: {
      path: 'M100 42 C 140 42 170 72 170 112 C 170 152 140 182 100 182 C 60 182 30 152 30 112 C 30 72 60 42 100 42 Z',
      face: [100, 106], top: [100, 46], belly: [100, 150, 42, 24], arms: [[32, 122], [168, 122]]
    },
    cubo: {
      path: 'M76 50 L124 50 C 148 50 162 64 162 88 L162 150 C 162 170 150 182 128 182 L72 182 C 50 182 38 170 38 150 L38 88 C 38 64 52 50 76 50 Z',
      face: [100, 106], top: [100, 50], belly: [100, 152, 40, 22], arms: [[39, 128], [161, 128]]
    },
    pera: {
      path: 'M100 44 C 126 44 138 68 134 96 C 158 112 170 138 162 160 C 154 178 128 182 100 182 C 72 182 46 178 38 160 C 30 138 42 112 66 96 C 62 68 74 44 100 44 Z',
      face: [100, 112], top: [100, 46], belly: [100, 156, 42, 20], arms: [[44, 138], [156, 138]]
    }
  };

  const PHASE_CFG = {
    cria: { scale: 0.6, eye: 1.3, arms: false, feet: true, extras: false, belly: false },
    joven: { scale: 0.72, eye: 1.15, arms: true, feet: true, extras: false, belly: true },
    adulto: { scale: 0.84, eye: 1.05, arms: true, feet: true, extras: true, belly: true },
    heroico: { scale: 0.92, eye: 1.0, arms: true, feet: true, extras: true, belly: true, gear: true },
    legendario: { scale: 0.97, eye: 1.0, arms: true, feet: true, extras: true, belly: true, gear: true, legend: true },
    mitico: { scale: 1.0, eye: 1.0, arms: true, feet: true, extras: true, belly: true, gear: true, mythic: true }
  };
  // Medidas para colocar cosméticos: ancho de cabeza y de cuello por especie
  const FIT = { gota: { head: 50, neck: 118 }, bola: { head: 96, neck: 132 }, cubo: { head: 108, neck: 124 }, pera: { head: 66, neck: 108 } };
  const SPARK = 'M0 -10 L3 -3 L10 0 L3 3 L0 10 L-3 3 L-10 0 L-3 -3 Z';

  const blinkDelay = () => `style="animation-delay:-${(Math.random() * 6).toFixed(2)}s"`;
  // ---------- Piezas ----------
  function eyesSvg(type, cx, cy, sleeping, k) {
    const gap = 25 * k;
    if (sleeping) {
      const one = x => `<path d="M${x - 9 * k} ${cy} Q ${x} ${cy + 8 * k} ${x + 9 * k} ${cy}" fill="none" stroke="${INK}" stroke-width="${4 * k}" stroke-linecap="round"/>`;
      return type === 'ciclope' ? one(cx) : one(cx - gap) + one(cx + gap);
    }
    const ball = (x, r, pr, sparkle) => `
      <circle cx="${x}" cy="${cy}" r="${r}" fill="#fff" stroke="${INK}" stroke-width="${3 * k}"/>
      <circle class="pupil" cx="${x + 1.5 * k}" cy="${cy + 1.5 * k}" r="${pr}" fill="${INK}"/>
      <circle cx="${x + pr * 0.35}" cy="${cy - pr * 0.25}" r="${pr * 0.38}" fill="#fff"/>
      ${sparkle ? `<circle cx="${x - pr * 0.4}" cy="${cy + pr * 0.45}" r="${pr * 0.18}" fill="#fff"/>` : ''}`;
    switch (type) {
      case 'grandes':
        return `<g class="eyes" ${blinkDelay()}>${ball(cx - gap, 15 * k, 9.5 * k, true)}${ball(cx + gap, 15 * k, 9.5 * k, true)}</g>`;
      case 'felices': {
        const arc = x => `<path d="M${x - 10 * k} ${cy + 3 * k} Q ${x} ${cy - 10 * k} ${x + 10 * k} ${cy + 3 * k}" fill="none" stroke="${INK}" stroke-width="${4.5 * k}" stroke-linecap="round"/>`;
        return `<g class="eyes" ${blinkDelay()}>${arc(cx - gap)}${arc(cx + gap)}</g>`;
      }
      case 'puntos': {
        const dot = x => `<circle class="pupil" cx="${x}" cy="${cy}" r="${6.5 * k}" fill="${INK}"/><circle cx="${x + 2 * k}" cy="${cy - 2 * k}" r="${2.2 * k}" fill="#fff"/>`;
        return `<g class="eyes" ${blinkDelay()}>${dot(cx - gap)}${dot(cx + gap)}</g>`;
      }
      case 'ciclope':
        return `<g class="eyes" ${blinkDelay()}>${ball(cx, 20 * k, 11 * k, true)}</g>`;
      default:
        return `<g class="eyes" ${blinkDelay()}>${ball(cx - gap, 12 * k, 7 * k)}${ball(cx + gap, 12 * k, 7 * k)}</g>`;
    }
  }

  function mouthSvg(type, cx, cy, k, sleeping) {
    const s = (v) => v * k;
    if (sleeping) return `<ellipse cx="${cx}" cy="${cy + s(2)}" rx="${s(5)}" ry="${s(4)}" fill="${INK}" opacity=".85"/>`;
    switch (type) {
      case 'abierta':
        return `<path d="M${cx - s(16)} ${cy - s(2)} Q ${cx} ${cy - s(4)} ${cx + s(16)} ${cy - s(2)} Q ${cx + s(14)} ${cy + s(20)} ${cx} ${cy + s(20)} Q ${cx - s(14)} ${cy + s(20)} ${cx - s(16)} ${cy - s(2)} Z" fill="${INK}"/>
                <ellipse cx="${cx}" cy="${cy + s(14)}" rx="${s(8)}" ry="${s(4.5)}" fill="#ff7a93"/>`;
      case 'diente':
        return `<path d="M${cx - s(16)} ${cy} Q ${cx} ${cy + s(16)} ${cx + s(16)} ${cy}" fill="none" stroke="${INK}" stroke-width="${s(4)}" stroke-linecap="round"/>
                <rect x="${cx - s(4.5)}" y="${cy + s(5)}" width="${s(9)}" height="${s(8)}" rx="${s(2)}" fill="#fff" stroke="${INK}" stroke-width="${s(2)}"/>`;
      case 'lengua':
        return `<path d="M${cx - s(16)} ${cy} Q ${cx} ${cy + s(16)} ${cx + s(16)} ${cy}" fill="none" stroke="${INK}" stroke-width="${s(4)}" stroke-linecap="round"/>
                <path d="M${cx + s(1)} ${cy + s(7)} q ${s(1)} ${s(12)} ${s(8)} ${s(11)} q ${s(6)} ${s(-1)} ${s(4)} ${s(-12)}" fill="#ff7a93" stroke="${INK}" stroke-width="${s(2.5)}"/>`;
      case 'o':
        return `<ellipse cx="${cx}" cy="${cy + s(5)}" rx="${s(7)}" ry="${s(8)}" fill="${INK}"/><ellipse cx="${cx}" cy="${cy + s(8)}" rx="${s(4)}" ry="${s(3)}" fill="#ff7a93"/>`;
      default:
        return `<path d="M${cx - s(15)} ${cy} Q ${cx} ${cy + s(15)} ${cx + s(15)} ${cy}" fill="none" stroke="${INK}" stroke-width="${s(4.5)}" stroke-linecap="round"/>`;
    }
  }

  function extrasSvg(sp, c, dark) {
    const st = `stroke="${dark}" stroke-width="4" stroke-linejoin="round"`;
    switch (sp) {
      case 'bola':
        return `<path d="M62 62 L54 26 L84 48 Z" fill="${shade(c, 0.35)}" ${st}/><path d="M138 62 L146 26 L116 48 Z" fill="${shade(c, 0.35)}" ${st}/>`;
      case 'cubo':
        return `<path d="M100 50 L100 22" stroke="${dark}" stroke-width="5" stroke-linecap="round"/><circle cx="100" cy="18" r="9" fill="${shade(c, 0.4)}" ${st}/>`;
      case 'pera':
        return `<ellipse cx="70" cy="56" rx="12" ry="24" transform="rotate(-25 70 56)" fill="${c}" ${st}/><ellipse cx="70" cy="58" rx="5" ry="14" transform="rotate(-25 70 58)" fill="${shade(c, 0.45)}"/>
                <ellipse cx="130" cy="56" rx="12" ry="24" transform="rotate(25 130 56)" fill="${c}" ${st}/><ellipse cx="130" cy="58" rx="5" ry="14" transform="rotate(25 130 58)" fill="${shade(c, 0.45)}"/>`;
      case 'gota':
        return `<path d="M100 34 C 92 22 96 12 104 8 C 104 18 112 22 108 32" fill="${shade(c, 0.3)}" ${st}/>`;
      default: return '';
    }
  }

  function eggSvg(m, id, eq) {
    let c = colorHex(m.color);
    const skin = window.Cosmetics && window.Cosmetics.eggSkin ? window.Cosmetics.eggSkin(eq, { base: c }) : null;
    if (skin && skin.base) c = skin.base;
    const dark = shade(c, -0.42), light = shade(c, 0.55);
    let pattern = '';
    switch (m.species) {
      case 'gota': pattern = `<circle cx="78" cy="96" r="9" fill="${light}"/><circle cx="118" cy="82" r="6" fill="${light}"/><circle cx="124" cy="134" r="11" fill="${light}"/><circle cx="84" cy="150" r="7" fill="${light}"/><circle cx="104" cy="118" r="5" fill="${light}"/>`; break;
      case 'bola': pattern = `<path d="M50 122 L62 110 L74 122 L86 110 L98 122 L110 110 L122 122 L134 110 L146 122 L152 116" fill="none" stroke="${light}" stroke-width="9" stroke-linejoin="round" stroke-linecap="round"/>`; break;
      case 'cubo': pattern = `<path d="M54 100 Q100 88 146 100 M50 128 Q100 116 150 128 M56 156 Q100 144 144 156" fill="none" stroke="${light}" stroke-width="8" stroke-linecap="round"/>`; break;
      default: pattern = [[80, 92], [120, 100], [96, 130], [128, 146], [72, 148]].map(([x, y]) => `<path transform="translate(${x} ${y}) scale(.9)" d="M0 -10 L3 -3 L10 -3 L4 2 L6 10 L0 5 L-6 10 L-4 2 L-10 -3 L-3 -3 Z" fill="${light}"/>`).join('');
    }
    return `<defs><clipPath id="egg${id}"><ellipse cx="100" cy="120" rx="54" ry="64"/></clipPath>
        <radialGradient id="eg${id}" cx="35%" cy="30%" r="80%"><stop offset="0" stop-color="${shade(c, 0.25)}"/><stop offset="1" stop-color="${c}"/></radialGradient></defs>
      <g class="egg-body">
        <ellipse cx="100" cy="120" rx="54" ry="64" fill="url(#eg${id})"/>
        <g clip-path="url(#egg${id})"${skin && skin.cls ? ` class="${skin.cls}"` : ''}>${skin ? skin.pat : pattern}</g>
        <ellipse cx="100" cy="120" rx="54" ry="64" fill="none" stroke="${dark}" stroke-width="4.5"/>
        <ellipse cx="78" cy="84" rx="10" ry="16" transform="rotate(25 78 84)" fill="#fff" opacity=".55"/>
        ${m.eggCrack ? `<path d="M64 112 L76 102 L86 114 L98 100 L110 114 L122 102 L136 112" fill="none" stroke="${dark}" stroke-width="4" stroke-linejoin="round"/>` : ''}
      </g>`;
  }

  // Qué imagen toca en cada fase. Si falta alguna (packs antiguos), se usa la más cercana
  const PH_ORDER = ['cria', 'joven', 'adulto', 'heroico', 'legendario', 'mitico'];
  function drawingStage(dr, phase) {
    if (!dr.files) return { file: dr.file, w: dr.w, h: dr.h, box: dr.box };
    if (dr.files[phase]) return dr.files[phase];
    const i = PH_ORDER.indexOf(phase);
    for (let d = 1; d < 6; d++) {
      const a = PH_ORDER[i - d], b = PH_ORDER[i + d];
      if (a && dr.files[a]) return dr.files[a];
      if (b && dr.files[b]) return dr.files[b];
    }
    return dr.files.legendario || Object.values(dr.files)[0];
  }

  // Convierte un punto del cuerpo (sin escalar) a coordenadas del dibujo final
  const toWorld = (x, y, s) => [100 + (x - 100) * s, 184 + (y - 184) * s];

  // ---------- Cuerpo: monstruo de la app ----------
  function appBody(m, phase, sleeping, id, eq) {
    const cfg = PHASE_CFG[phase] || PHASE_CFG.cria;
    const sp = BODY[m.species] ? m.species : 'bola';
    const b = BODY[sp];
    const c = colorHex(m.color);
    const dark = shade(c, -0.45);
    const k = cfg.eye;
    const [fx, fy] = b.face;
    const eyeY = fy - 8;
    const mouthY = fy + 16 * (k > 1.1 ? 1.05 : 1);
    const st = `stroke="${dark}" stroke-width="4.5" stroke-linejoin="round"`;
    const arms = cfg.arms ? b.arms.map(([x, y], i) => `<ellipse class="arm arm-${i ? 'r' : 'l'}" cx="${x}" cy="${y}" rx="11" ry="20" transform="rotate(${i ? -28 : 28} ${x} ${y})" fill="${shade(c, -0.08)}" ${st}/>` +
      (cfg.gear ? `<ellipse cx="${x + (i ? 4 : -4)}" cy="${y + 9}" rx="11.5" ry="5" transform="rotate(${i ? -28 : 28} ${x} ${y})" fill="#ffcf3a" stroke="${INK}" stroke-width="2.5"/>` : '')).join('') : '';
    const feet = cfg.feet ? `<ellipse cx="76" cy="180" rx="17" ry="9" fill="${shade(c, -0.15)}" ${st}/><ellipse cx="124" cy="180" rx="17" ry="9" fill="${shade(c, -0.15)}" ${st}/>` : '';
    const [bx, by, brx, bry] = b.belly;
    const belly = cfg.belly ? `<ellipse cx="${bx}" cy="${by}" rx="${brx}" ry="${bry}" fill="${shade(c, 0.45)}" opacity=".9"/>` : '';
    const extras = cfg.extras ? extrasSvg(sp, c, dark) : '';
    const s = cfg.scale;
    // anclajes en coordenadas del dibujo final
    const head = toWorld(b.top[0], b.top[1], s), face = toWorld(fx, eyeY, s), neck = toWorld(100, fy + 36, s);
    const anchors = {
      head: { x: head[0], y: head[1], w: FIT[sp].head * s }, face: { x: face[0], y: face[1], w: 50 * k * s },
      neck: { x: neck[0], y: neck[1], w: FIT[sp].neck * s }, ground: 184, scale: s
    };
    // equipo heroico: capa de serie (si no lleva una capa comprada) y emblema
    const capeColor = colorHex(COLORS[(COLORS.findIndex(x => x.id === m.color) + 6) % COLORS.length].id);
    const heroCape = cfg.gear && !(eq && eq.cape) && window.Cosmetics ? `<g class="hero-cape">${heroCapeSvg(anchors, capeColor)}</g>` : '';
    const emblem = cfg.gear ? `<g transform="translate(${bx} ${by - 4})"><circle r="9" fill="#ffcf3a" stroke="${INK}" stroke-width="2.5"/><path transform="scale(.62)" d="${SPARK}" fill="#fff3b0"/></g>` : '';
    const hy = b.top[1] - (sp === 'cubo' ? 40 : 24);
    const halo = cfg.legend && !(eq && eq.hat) ? `<ellipse cx="${b.top[0]}" cy="${hy}" rx="30" ry="8" fill="none" stroke="#ffcf3a" stroke-width="6"/><ellipse cx="${b.top[0]}" cy="${hy}" rx="30" ry="8" fill="none" stroke="#fff3b0" stroke-width="2"/>` : '';
    const shine = cfg.mythic ? `<g clip-path="url(#cl${id})"><rect class="m-shine" x="0" y="0" width="34" height="220" fill="#fff" opacity=".35" transform="skewX(-20)"/></g>` : '';
    // 2.4: ropa recortada con la silueta del cuerpo (en coordenadas del cuerpo, antes de escalar)
    const wear = eq && window.Cosmetics && window.Cosmetics.clothes && (eq.shirt || eq.legs || eq.shoes)
      ? window.Cosmetics.clothes(eq, { x0: bx - brx * 1.75, x1: bx + brx * 1.75, y0: fy + 32, y1: by + bry * 0.45, ly0: by + bry * 0.45, ly1: 186, cx: 100, nw: brx * 1.6, u: 1,
        feet: [{ x: 76, y: 181, w: 40 }, { x: 124, y: 181, w: 40 }], clip: `clip-path="url(#cb${id})"` })
      : { under: '', shoes: '' };
    const body = `
      <defs><radialGradient id="bg${id}" cx="38%" cy="28%" r="85%"><stop offset="0" stop-color="${shade(c, 0.28)}"/><stop offset=".7" stop-color="${c}"/><stop offset="1" stop-color="${shade(c, -0.08)}"/></radialGradient>
      ${cfg.mythic ? `<clipPath id="cl${id}"><path d="${b.path}"/></clipPath>` : ''}${wear.under ? `<clipPath id="cb${id}"><path d="${b.path}"/></clipPath>` : ''}</defs>
      <g transform="translate(100 184) scale(${s}) translate(-100 -184)">
        ${extras}${arms}${feet}
        <path class="m-body" d="${b.path}" fill="url(#bg${id})" ${st}/>
        ${belly}${shine}${emblem}${wear.under}
        <ellipse cx="${fx - 46 * Math.min(k, 1.1)}" cy="${fy + 12}" rx="10" ry="6" fill="#ff7aa0" opacity=".45"/>
        <ellipse cx="${fx + 46 * Math.min(k, 1.1)}" cy="${fy + 12}" rx="10" ry="6" fill="#ff7aa0" opacity=".45"/>
        ${eyesSvg(m.eyes, fx, eyeY, sleeping, k)}
        ${mouthSvg(m.mouth, fx, mouthY, Math.min(k, 1.15), sleeping)}
        ${halo}${wear.shoes}
      </g>`;
    return { back: heroCape, main: body, anchors, color: c };
  }
  function heroCapeSvg(a, c) {
    const n = a.neck, w = n.w * 0.42, x = n.x, y = n.y - 22 * (a.scale || 1), g = 184;
    return `<path d="M${x - w} ${y} Q${x - w * 1.45} ${(y + g) / 2} ${x - w * 1.55} ${g - 4} Q${x} ${g + 6} ${x + w * 1.55} ${g - 4} Q${x + w * 1.45} ${(y + g) / 2} ${x + w} ${y} Z" fill="${c}" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>
      <path d="M${x - w * .7} ${y + 8} Q${x - w * 1.1} ${(y + g) / 2} ${x - w * 1.2} ${g - 10}" fill="none" stroke="${shade(c, -0.25)}" stroke-width="4" opacity=".6"/>`;
  }

  // ---------- Cuerpo: dibujo procesado por la app o pack diseñado ----------
  /* 2.4: puntos donde va la ropa en un dibujo, a partir de su silueta medida (dst.box: bordes y anchura por
     filas, en proporción de la imagen) y de cómo está colocada la imagen (px, py: de proporción a coordenadas). */
  function drawingGeom(box, px, py, an) {
    const t = box ? box.t : 0.08, b = box ? box.b : 0.98, H = b - t;
    const rows = box && box.rows && box.rows.length ? box.rows : null;
    const at = (f) => { if (!rows) return [0.22, 0.78]; const i = Math.max(0, Math.min(rows.length - 1, Math.round(f * (rows.length - 1)))); for (let d = 0; d < rows.length; d++) { const r = rows[i + d] || rows[i - d]; if (r) return r; } return [0.22, 0.78]; };
    const X = (f) => { const r = at(f); return { l: px(r[0]), r: px(r[1]), c: px((r[0] + r[1]) / 2), w: px(r[1]) - px(r[0]) }; };
    const Y = (f) => py(t + H * f);
    const a = {};
    if (an && an.head) a.head = { x: an.head[0], y: an.head[1], w: an.head[2] || 60 }; else { const r = X(0.12); a.head = { x: r.c, y: Y(0.02) + 2, w: Math.max(30, r.w * 0.9) }; }
    if (an && an.face) a.face = { x: an.face[0], y: an.face[1], w: an.face[2] || 46 }; else { const r = X(0.32); a.face = { x: r.c, y: Y(0.32), w: Math.max(24, r.w * 0.45) }; }
    if (an && an.neck) a.neck = { x: an.neck[0], y: an.neck[1], w: an.neck[2] || 90 }; else { const r = X(0.48); a.neck = { x: r.c, y: Y(0.48), w: Math.max(40, r.w * 0.85) }; }
    a.ground = an && an.ground ? an.ground : py(b);
    // tronco y piernas (lo que no sea dibujo queda fuera por la máscara de la silueta)
    const mid = X(0.75), y0 = an && an.neck ? an.neck[1] + 6 : Y(0.64), y1 = an && an.neck ? an.neck[1] + (a.ground - an.neck[1]) * 0.6 : Y(0.87);
    const foot = X(0.97), fw = Math.max(18, Math.min(44, foot.w * 0.34));
    const g = { x0: mid.l, x1: mid.r, cx: (mid.l + mid.r) / 2, y0, y1, ly0: y1, ly1: a.ground + 2, nw: Math.max(30, a.neck.w * 0.7), u: Math.max(0.5, Math.min(1.3, (mid.r - mid.l) / 140)),
      feet: [{ x: foot.l + fw * 0.55, y: a.ground - 3, w: fw }, { x: foot.r - fw * 0.55, y: a.ground - 3, w: fw }] };
    return { anchors: a, geom: g };
  }
  function drawingBody(m, phase, sleeping, id, src, dst, eq) {
    const cfg = PHASE_CFG[phase] || PHASE_CFG.cria;
    let img, place;
    if (m.drawing.pack) {
      img = `<g id="dw${id}"><image class="m-drawing" href="${src}" x="-10" y="-18" width="220" height="220"/></g>`;
      place = { px: (x) => -10 + x * 220, py: (y) => -18 + y * 220 };
    } else {
      const box = 158;
      const ar = (dst.w || 1) / (dst.h || 1);
      const dw = ar >= 1 ? box : box * ar, dh = ar >= 1 ? box / ar : box;
      const top = 186 - dh;
      const s = cfg.scale;
      img = `<g id="dw${id}" transform="translate(100 186) scale(${s}) translate(-100 -186)"><image class="m-drawing" href="${src}" x="${100 - dw / 2}" y="${top}" width="${dw}" height="${dh}" preserveAspectRatio="xMidYMax meet"/></g>`;
      place = { px: (x) => 100 + ((100 - dw / 2 + x * dw) - 100) * s, py: (y) => 186 + ((top + y * dh) - 186) * s };
    }
    // sin medidas todavía: valores aproximados (se miden al cargar los dibujos)
    const box = dst.box || (m.drawing.pack ? { t: 0.1, b: 0.9, rows: null } : { t: 0, b: 1, rows: null });
    const G = drawingGeom(box, place.px, place.py, m.drawing.pack ? dst.anchors : null);
    const anchors = Object.assign(G.anchors, { scale: m.drawing.pack ? 1 : cfg.scale });
    let wear = { under: '', shoes: '' }, defs = '';
    if (eq && window.Cosmetics && window.Cosmetics.clothes && (eq.shirt || eq.legs || eq.shoes)) {
      wear = window.Cosmetics.clothes(eq, Object.assign(G.geom, { clip: `mask="url(#mk${id})"` }));
      if (wear.under) defs = `<defs><mask id="mk${id}" maskUnits="userSpaceOnUse" x="-40" y="-40" width="280" height="280" mask-type="alpha" style="mask-type:alpha"><use href="#dw${id}"/></mask></defs>`;
    }
    return { back: '', main: defs + img + wear.under + wear.shoes, anchors, color: colorHex(m.color), pack: !!m.drawing.pack };
  }

  // ---------- Efectos de las fases altas ----------
  function phaseFx(phase, color, id, anchors, pack) {
    const cfg = PHASE_CFG[phase] || {};
    let behind = '', front = '';
    if (cfg.legend) {
      behind = `<defs><radialGradient id="au${id}"><stop offset="0" stop-color="#fff6b8" stop-opacity=".95"/><stop offset=".6" stop-color="#ffd76a" stop-opacity=".35"/><stop offset="1" stop-color="#ffd76a" stop-opacity="0"/></radialGradient></defs>
        <g class="m-aura"><circle cx="100" cy="110" r="94" fill="url(#au${id})"/></g>`;
      front = `<g class="m-sparkles" fill="#ffd54a" stroke="${INK}" stroke-width="2">
          <g transform="translate(22 50) scale(1.1)"><path d="${SPARK}"/></g><g transform="translate(180 70) scale(.9)"><path d="${SPARK}"/></g>
          <g transform="translate(176 160) scale(.7)"><path d="${SPARK}"/></g><g transform="translate(24 150) scale(.75)"><path d="${SPARK}"/></g></g>`;
    }
    if (cfg.mythic) {
      const c2 = shade(color, 0.35);
      behind = `<defs><radialGradient id="au${id}"><stop offset="0" stop-color="#fff" stop-opacity=".95"/><stop offset=".45" stop-color="${c2}" stop-opacity=".75"/><stop offset=".75" stop-color="${color}" stop-opacity=".3"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></radialGradient></defs>
        <g class="m-aura"><circle cx="100" cy="110" r="100" fill="url(#au${id})"/></g>
        <g class="m-rays" opacity=".5">${[0, 45, 90, 135, 180, 225, 270, 315].map(r => `<path transform="rotate(${r} 100 110)" d="M96 20 L100 2 L104 20 Z" fill="${c2}"/>`).join('')}</g>`;
      const hx = anchors.head ? anchors.head.x : 100, hy = anchors.head ? anchors.head.y : 40;
      front = `<g class="m-orbit">${[0, 120, 240].map(r => `<g transform="rotate(${r} 100 112)"><circle cx="100" cy="18" r="6" fill="#fff" stroke="${color}" stroke-width="3"/><circle cx="100" cy="18" r="10" fill="${c2}" opacity=".35"/></g>`).join('')}</g>
        ${pack ? '' : `<g class="m-crown">${[-22, 0, 22].map((dx, i) => `<path transform="translate(${hx + dx} ${hy - 22 - (i === 1 ? 10 : 0)})" d="M0 -10 L6 0 L0 10 L-6 0 Z" fill="${i === 1 ? '#fff3b0' : c2}" stroke="${INK}" stroke-width="2"/>`).join('')}</g>`}
        <g class="m-sparkles" fill="${c2}" stroke="${INK}" stroke-width="2"><g transform="translate(22 50) scale(1.1)"><path d="${SPARK}"/></g><g transform="translate(180 70) scale(.9)"><path d="${SPARK}"/></g><g transform="translate(176 160) scale(.7)"><path d="${SPARK}"/></g><g transform="translate(24 150) scale(.75)"><path d="${SPARK}"/></g></g>`;
    }
    return { behind, front };
  }

  function colorHex(id) {
    const f = COLORS.find(c => c.id === id);
    return f ? f.hex : (id && id[0] === '#' ? id : COLORS[0].hex);
  }

  /**
   * Dibuja un monstruo.
   * m: { species, color, eyes, mouth, drawing?, equip? }
   * opts: { phase, sleeping, size, cls, shadow:boolean, viewBox, noCosmetics }
   */
  function render(m, opts) {
    opts = opts || {};
    const id = ++uid;
    const phase = opts.phase || 'cria';
    const sleeping = !!opts.sleeping;
    const size = opts.size || 160;
    const eq = opts.noCosmetics ? null : (opts.equip || m.equip || null);
    const cls = 'monster phase-' + phase + (m.drawing ? ' is-drawing' : '') + (sleeping ? ' is-sleeping' : '') + (opts.cls ? ' ' + opts.cls : '');
    const zzz = sleeping ? `<g class="m-zzz" fill="${INK}" font-family="Nunito, sans-serif" font-weight="900"><text x="152" y="58" font-size="22">z</text><text x="168" y="38" font-size="16">z</text><text x="180" y="22" font-size="12">z</text></g>` : '';
    const bob = `style="animation-delay:-${(Math.random() * 4).toFixed(2)}s"`;
    let body;
    if (phase === 'huevo') {
      body = { back: '', main: eggSvg(m, id, eq), anchors: { head: { x: 100, y: 60, w: 64 }, face: { x: 100, y: 112, w: 40 }, ground: 184, scale: 1 }, color: colorHex(m.color), egg: true };
    } else {
      const dst = m.drawing ? drawingStage(m.drawing, phase) : null;
      const drawSrc = dst && window.Drawings ? window.Drawings.get(dst.file) : null;
      body = drawSrc ? drawingBody(m, phase, sleeping, id, drawSrc, dst, eq) : appBody(m, phase, sleeping, id, eq);
    }
    const anchorsForWear = body.anchors;
    const cos = window.Cosmetics ? window.Cosmetics.layers(eq, anchorsForWear, id) : { aura: '', pedestal: '', back: '', front: '', pet: '', particles: '' };
    const fx = body.egg ? { behind: '', front: '' } : phaseFx(phase, body.color, id, body.anchors, body.pack);
    const shadowRx = phase === 'huevo' ? 44 : 56 * (PHASE_CFG[phase] ? PHASE_CFG[phase].scale : 1);
    const nest = body.egg && window.Cosmetics && window.Cosmetics.nest ? window.Cosmetics.nest(eq) : '';
    const shadow = opts.shadow === false || cos.hasPedestal || body.pack || nest ? '' : `<ellipse class="m-shadow" cx="100" cy="186" rx="${shadowRx}" ry="7" fill="${INK}" opacity=".13"/>`;
    const inner = `${cos.aura}${fx.behind}${cos.pedestal}${shadow}<g class="m-anim" ${bob}>${cos.back}${body.back}${body.main}${cos.front}</g>${nest}${cos.pet}${cos.particles}${fx.front}${zzz}`;
    return `<svg class="${cls}" viewBox="${opts.viewBox || '0 0 200 200'}" width="${size}" height="${size}" aria-hidden="true">${inner}</svg>`;
  }

  /** Xispa: el monstruo de la clase */
  function xispa(opts) {
    opts = opts || {};
    const id = ++uid;
    const size = opts.size || 140;
    const sleeping = !!opts.sleeping;
    const mood = opts.mood || 'happy'; // happy | munch | cheer
    const c = '#ffb43c', dark = '#b8650d';
    const st = `stroke="${dark}" stroke-width="4.5" stroke-linejoin="round"`;
    let eyes, mouth;
    if (sleeping) {
      eyes = `<path d="M70 104 Q80 112 90 104 M110 104 Q120 112 130 104" fill="none" stroke="${INK}" stroke-width="4.5" stroke-linecap="round"/>`;
      mouth = `<ellipse cx="100" cy="130" rx="5" ry="4" fill="${INK}"/>`;
    } else {
      eyes = `<circle cx="80" cy="102" r="14" fill="#fff" stroke="${INK}" stroke-width="3"/><circle class="pupil" cx="82" cy="104" r="8.5" fill="${INK}"/><circle cx="85" cy="100" r="3.2" fill="#fff"/>
              <circle cx="120" cy="102" r="14" fill="#fff" stroke="${INK}" stroke-width="3"/><circle class="pupil" cx="122" cy="104" r="8.5" fill="${INK}"/><circle cx="125" cy="100" r="3.2" fill="#fff"/>`;
      mouth = mood === 'munch'
        ? `<g class="x-munch"><path d="M82 124 Q100 122 118 124 Q116 148 100 148 Q84 148 82 124 Z" fill="${INK}"/><ellipse cx="100" cy="141" rx="8" ry="4" fill="#ff7a93"/></g>`
        : `<path d="M82 124 Q100 144 118 124" fill="${mood === 'cheer' ? INK : 'none'}" stroke="${INK}" stroke-width="4.5" stroke-linecap="round"/>`;
    }
    const zzz = sleeping ? `<g class="m-zzz" fill="${INK}" font-family="Nunito, sans-serif" font-weight="900"><text x="148" y="66" font-size="22">z</text><text x="164" y="46" font-size="16">z</text><text x="176" y="30" font-size="12">z</text></g>` : '';
    return `<svg class="monster xispa${sleeping ? ' is-sleeping' : ''} mood-${mood}" viewBox="0 0 200 200" width="${size}" height="${size}" aria-hidden="true">
      <defs><radialGradient id="xb${id}" cx="38%" cy="30%" r="85%"><stop offset="0" stop-color="#ffe08a"/><stop offset=".7" stop-color="${c}"/><stop offset="1" stop-color="#f39a22"/></radialGradient>
      <linearGradient id="xf${id}" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#ff7a3c"/><stop offset="1" stop-color="#ffd23f"/></linearGradient></defs>
      <ellipse class="m-shadow" cx="100" cy="186" rx="50" ry="7" fill="${INK}" opacity=".13"/>
      <g class="m-anim">
        <path class="x-flame" d="M100 58 C 84 50 80 30 92 12 C 94 26 102 30 106 22 C 112 34 124 30 122 14 C 136 32 128 52 112 60 Z" fill="url(#xf${id})" ${st}/>
        <ellipse cx="62" cy="168" rx="16" ry="9" fill="#f39a22" ${st}/><ellipse cx="138" cy="168" rx="16" ry="9" fill="#f39a22" ${st}/>
        <ellipse class="arm arm-l" cx="40" cy="120" rx="11" ry="19" transform="rotate(30 40 120)" fill="#f7a631" ${st}/>
        <ellipse class="arm arm-r" cx="160" cy="120" rx="11" ry="19" transform="rotate(-30 160 120)" fill="#f7a631" ${st}/>
        <path class="m-body" d="M100 54 C 146 54 170 84 168 118 C 166 154 138 176 100 176 C 62 176 34 154 32 118 C 30 84 54 54 100 54 Z" fill="url(#xb${id})" ${st}/>
        <ellipse cx="100" cy="150" rx="38" ry="18" fill="#fff1c4" opacity=".9"/>
        <ellipse cx="58" cy="122" rx="10" ry="6" fill="#ff7aa0" opacity=".5"/><ellipse cx="142" cy="122" rx="10" ry="6" fill="#ff7aa0" opacity=".5"/>
        ${eyes}${mouth}
      </g>${zzz}</svg>`;
  }

  function randomMonster() {
    const pick = a => a[Math.floor(Math.random() * a.length)];
    return { species: pick(SPECIES), color: pick(COLORS).id, eyes: pick(EYES.slice(0, 4)), mouth: pick(MOUTHS.slice(0, 3)) };
  }

  window.Monsters = { PHASE_CFG, PH_ORDER, render, xispa, drawingStage, randomMonster, colorHex, shade, COLORS, SPECIES, EYES, MOUTHS, ACCESSORIES, PHASES };
})();
