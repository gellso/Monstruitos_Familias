/* Monstruitos — visor para familias.
   Esta página no contiene datos: lee la clave que va tras el # del enlace (que el navegador nunca
   envía al servidor), descarga el archivo cifrado de ese niño y lo descifra aquí mismo. */
(function () {
  'use strict';
  const $app = document.getElementById('app');
  // 2.5.1: en iPhone no se enlaza el manifiesto: así, al añadir la página a la pantalla de inicio, el icono
  // guarda el enlace entero (con la llave de detrás de «#»). En Android sí se enlaza (para instalarla bonita).
  const IOS = /iP(hone|od|ad)/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  // 2.5.4: el icono se abre SIEMPRE en «./» (sin la llave tras «#»): en iPhone, una dirección de icono con «#» se quedaba
  // en negro y luego en blanco. La llave la guarda el propio móvil (la primera vez se pega el enlace o se escanea el QR).
  const MOBILE = IOS || /Android/i.test(navigator.userAgent);
  // 2.5.1: el buzón del tutor guarda la ficha cifrada al momento; GitHub, una copia que llega unos minutos después
  const BOX = (() => { const m = document.querySelector('meta[name="monstruitos-box"]'); const v = m && m.getAttribute('content'); return v && /^https?:\/\//.test(v) ? v.replace(/\/+$/, '') : ''; })();
  const ID_SALT = 'monstruitos-familias:';
  const VV = '2.5.4'; // versión de esta página (se ve abajo del todo)
  const SAVE_KEY = 'monstruitos-guardados';

  // ---------- Textos ----------
  const L = {
    es: {
      loading: 'Abriendo el monstruo…', hello: '¡Hola!', welcome: 'Escanea con la cámara del móvil el código QR que te ha dado el tutor o la tutora y verás aquí el monstruo de tu hijo o hija.',
      saved: 'Guardados en este móvil', badKey: 'Este enlace no está completo. Vuelve a escanear el código QR o pide uno nuevo al tutor.',
      notFound: 'Todavía no hay ninguna ficha para este código. Si te lo acaban de dar, vuelve a probar dentro de unos minutos. Si antes funcionaba, puede que el tutor lo haya renovado: pídele uno nuevo.', netError: 'No se ha podido conectar. Revisa la conexión a internet e inténtalo de nuevo.', oldPhone: 'Este navegador es demasiado antiguo para abrir la ficha cifrada. Prueba con otro navegador o actualiza el móvil.',
      retry: 'Reintentar', trackNote: 'El tutor puede ver cuándo y cuánto rato se abre esta página.', monsterOf: 'El monstruo de {name}', yourMonster: 'Su monstruo', stars: 'estrellas', coins: 'energía',
      toNext: 'Le faltan {n} ⭐ para llegar a {phase}', maxPhase: '¡Ha llegado a Mítico, la fase más alta!', path: 'Su camino', week: 'Esta semana', weekStars: '+{n} ⭐', bonusDays: '{n} días sin incidencias', weekNone: 'Todavía no hay estrellas esta semana',
      shop: 'Taller de la clase', shopNote: 'Lo consigue en clase, el «Día del Taller», con su energía. Usar energía nunca le quita estrellas.', filterCan: 'Puede conseguir', filterAll: 'Todo', cos: 'Para su monstruo', priv: 'Superpoderes',
      seeAll: 'Ver todos ({n})', st_ok: '¡Le llega!', st_egg: 'Solo para huevos', st_coins: 'Falta {n} 🪙', st_phase: 'Desde {phase}', st_owned: 'Ya lo tiene', st_soldout: 'Agotado hoy', st_weekly: 'Ya lo usó esta semana', mystery: 'Regalo sorpresa', mysteryNote: 'un adorno al azar',
      saving: 'Está cargando energía para', vouchers: 'Sus pases', vPending: 'Por usar', vRedeemed: 'Disfrutado', noVouchers: 'Todavía no ha conseguido ningún superpoder.', goals: 'Premios de la clase', goalMine: 'ha aportado {n} 🪙', goalDone: '¡Conseguido!',
      v_title: 'Vales', v_hint: 'Vales que le ha dado su tutor. Pulsa «Canjear» y la energía, las estrellas o el pase le llegarán en clase.', v_hintClass: 'Vales que le ha dado su tutor. Se canjean en clase.', v_none: 'Todavía no tiene vales.', v_redeem: 'Canjear', v_unitE: 'de energía', v_unitP: 'pase del Taller', v_unitS: 'estrellas', v_unitS1: 'estrella', v_title2: 'VALE', v_stampDone: 'CANJEADO', v_stampExp: 'CADUCADO', v_exp: 'Caduca el {date}', v_expired: 'Caducó el {date}', v_done: 'Canjeado', v_doneHome: 'Canjeado desde casa', v_way: 'En camino a clase', v_q: '¿Canjear este vale ahora?', v_qNote: 'Se sumará a su monstruo en cuanto el tutor recoja el buzón en clase.', v_qNoteP: 'El pase quedará guardado para usarlo en clase en cuanto el tutor recoja el buzón.', v_yes: 'Sí, canjear', v_sent: '¡Vale canjeado!', v_sentNote: 'Ya va de camino a clase. En la próxima actualización verás «Canjeado».', v_given: 'Le han dado {n}', v_why: 'Motivo', v_class: 'Se canjea en clase', v_old: 'Canjeados y caducados',
      h_vale: 'Vale canjeado', n_vale: 'Vale canjeado: {d}', n_valeNew: 'Tiene un vale nuevo: {d}', n_valeNo: 'No se pudo canjear el vale ({why})', why_done: 'ya estaba canjeado', why_expired: 'había caducado',
      p_title: 'Avisos en el móvil', p_intro: 'Recibe un aviso, como el de una app, que cuenta lo que ha pasado: estrellas, «a mejorar», evolución, vales…',
      p_now: 'Al momento', p_daily: 'Un resumen al día (17:00)', p_on: 'Activar avisos', p_off: 'Desactivar avisos', p_active: 'Avisos activados en este móvil', p_pending: 'Se confirmarán en cuanto el tutor abra Monstruitos en clase (te llegará un aviso de bienvenida).',
      p_rules: 'Solo de lunes a viernes, de 8 a 20 h.', p_denied: 'Este móvil tiene los avisos bloqueados para esta página. Actívalos en los ajustes del navegador o del móvil y vuelve aquí.',
      p_noBrowser: 'Este navegador no puede recibir avisos. En Android, abre el enlace con Chrome.', p_oldIos: 'Este iPhone no puede recibir avisos de páginas web: hace falta iOS 16.4 o posterior.',
      p_iosTitle: 'En iPhone, primero añade la página a la pantalla de inicio:', p_ios1: 'Pulsa aquí abajo «Copiar el enlace de mi hijo/a».', p_ios2: 'Pulsa el botón Compartir (el cuadrado con la flecha), elige «Añadir a pantalla de inicio» y después «Añadir».', p_ios3: 'Abre Monstruitos desde el icono nuevo y pulsa «Pegar el enlace» (o escanea el QR de la tarjeta). Solo hace falta la primera vez.', p_ios4: 'Dentro del icono, pulsa «Activar avisos» y después «Probar un aviso».',
      p_test: 'Probar un aviso en este móvil', p_testOk: 'Aviso enviado: te llegará en unos segundos.', p_testWait: 'Espera unos segundos antes de volver a probar.', p_testNoKey: 'El tutor todavía no ha activado los avisos en su Mac.', p_testOld: 'Para probar, el tutor tiene que actualizar el buzón.', p_testErr: 'No se ha podido enviar el aviso de prueba ({s}). Desactiva y vuelve a activar los avisos.',
      p_testSign: 'El servicio de avisos ha rechazado la firma ({s}). Pulsa «Desactivar», vuelve a activar los avisos y prueba otra vez. Si sigue igual, díselo al tutor.', p_testNet: 'No se ha podido hablar con el buzón ({s}). Revisa la conexión.', p_resync: 'Los avisos se han puesto al día con la nueva llave del tutor ✓', p_redo: 'El tutor ha cambiado la llave de avisos: vuelve a activarlos aquí.',
      slow: 'Está tardando mucho en abrirse. Revisa la conexión y vuelve a probar.', failOpen: 'No se ha podido abrir la ficha en este móvil.', detail: 'Detalle para el tutor', st_key: 'preparando la llave', st_box: 'buscando en el buzón', st_gh: 'descargando de GitHub', st_dec: 'descifrando', st_draw: 'dibujando',
      w_scan: 'Escanear el código QR', w_scanHint: 'Apunta la cámara al código QR de la tarjeta del tutor.', w_scanNo: 'No se ha podido abrir la cámara. Revisa el permiso de la cámara o pega el enlace.', w_scanBad: 'Ese código QR no es de Monstruitos.', w_standalone: 'Primera vez desde el icono: pulsa «Pegar el enlace» (si lo copiaste antes en Safari) o escanea el código QR de la tarjeta. Después se abrirá solo.', w_clip: 'Pegar el enlace', w_clipNo: 'No hay ningún enlace de Monstruitos copiado. En Safari, abre la ficha y pulsa «Copiar el enlace de mi hijo/a».', close: 'Cerrar',
      p_copy: 'Copiar el enlace de mi hijo/a', p_copied: 'Enlace copiado. Si al abrir el icono no sale el monstruo, pégalo allí.', p_err: 'No se han podido activar los avisos. Inténtalo de nuevo.', p_sending: 'Activando…',
      w_paste: '¿Ya tienes el enlace? Pégalo aquí:', w_pasteBtn: 'Abrir', w_pasteBad: 'Ese enlace no es de una ficha de Monstruitos.', dg_title: 'Diagnóstico (para el tutor)', dg_hint: 'Haz una captura de esta pantalla y envíasela al tutor. No contiene la llave ni datos del niño.', dg_close: 'Cerrar', dg_tapVer: 'Toca la versión para ver el diagnóstico',
      how: '¿Cómo funciona?', noticeTitle: 'Mensaje del tutor', n_notice: 'Hay un mensaje nuevo del tutor',
      howText: ['Cada buen comportamiento en clase le da estrellas ⭐.', 'Con las estrellas su monstruo evoluciona: Cría, Joven, Adulto, Heroico, Legendario y Mítico.', 'Cada estrella también le carga energía 🪙 para el Taller de la clase. Usar energía nunca le quita estrellas ni fases.'],
      howBonus: 'Si un día no tiene ningún «a mejorar», a las {time} recibe {n} ⭐ extra.', howDraw: 'La forma Mítica es su propio dibujo, convertido en monstruo.',
      updated: 'Actualizado el {date}', ago_now: 'ahora mismo', ago_min: 'hace {n} min', ago_h: 'hace {n} h', privacy: 'Estos datos van cifrados: solo se pueden abrir con este código. No lo compartas fuera de la familia.',
      remember: 'Guardar en este móvil', remembered: 'Guardado en este móvil', forget: 'Quitar de este móvil', homeHint: 'Consejo: añade esta página a la pantalla de inicio para abrirla como una app.',
      days: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'], months: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
      phases: { huevo: 'Huevo', cria: 'Cría', joven: 'Joven', adulto: 'Adulto', heroico: 'Heroico', legendario: 'Legendario', mitico: 'Mítico' },
      whyNoHome: 'Esto lo consigue en clase, el «Día del Taller». Elegir desde casa no está activado.', whyNo: 'Ahora no se puede conseguir.',
      buy: 'Conseguir', buyQ: '¿Conseguir «{item}» con {n} 🪙?', buyNote: 'Se descuenta ahora mismo de su energía y ya es suyo. Lo verá en clase.', bought: '¡Conseguido!', boughtCos: 'Ya es suyo: póntelo cuando quieras en el Armario.', w2_title: 'Armario', w2_hint: 'Toca una prenda para ponértela o quitártela. Se verá en clase en cuanto el tutor recoja los cambios.', w2_noBox: 'Esto es lo que tiene en su armario. Para vestirse desde casa, el tutor tiene que activar el buzón.', w2_empty: 'Todavía no tiene nada en el armario. Lo que consiga en el Taller aparecerá aquí.', w2_on: 'Puesto', w2_put: 'Ponérmelo', w2_sent: 'Enviado a clase ✓', slots: { hat: 'Gorros', bow: 'Lazos', glasses: 'Gafas', neck: 'Cuello', cape: 'Capas', shirt: 'Camisetas', legs: 'Pantalones y faldas', shoes: 'Zapatos', aura: 'Auras', pedestal: 'Peanas', pet: 'Mascotas', particles: 'Efectos', bg: 'Fondos', frame: 'Marcos', banner: 'Nombre', dance: 'Bailes', eggskin: 'Cáscaras', nest: 'Nidos' }, boughtPriv: 'Podrá usar su superpoder en clase.', mine: 'Ya es suyo', homeNote: '🏠 Elegido desde casa: se anotará en clase en cuanto se abra Monstruitos.', spentHome: '{n} usada desde casa', buyYes: 'Sí, conseguir', cancel: 'Cancelar', sending: 'Enviando…', sent: '¡Pedido enviado!', sendErr: 'No se ha podido enviar. Revisa la conexión e inténtalo otra vez.', pendingTitle: 'Pedidos en camino', pendingChip: 'En camino', reserved: '{n} reservadas en pedidos', shopNoteHome: 'Podéis elegir desde aquí con su energía: el pedido llega a clase y lo verá allí. Usar energía nunca le quita estrellas.', available: 'disponibles',
      history: 'Historial', histMore: 'Ver más', histNone: 'Todavía no hay movimientos.', h_bonus: 'Día sin incidencias', h_adjust: 'Ajuste del tutor', h_coins: 'Ajuste de energía del tutor', h_buy: 'Conseguido', h_home: 'desde casa', h_mystery: 'Regalo sorpresa: {item}', today: 'Hoy', yesterday: 'Ayer', histStars: 'Historial de estrellas', histStarsSub: 'Qué ha hecho en clase y cuántas estrellas suma o resta cada cosa.', histCoins: 'Energía: lo conseguido y ajustes', h_noted: 'anotado', h_notedHint: 'Los «a mejorar» marcados como «anotado» no restan estrellas.', h_day: '{n} ⭐ este día', coinsNone: 'Todavía no ha usado energía.',
      w_title: 'Monstrópolis', w_planet: 'Planeta {n} de {t}', w_now: 'Ahora está aprendiendo', w_help: 'Cómo ayudar en casa', w_done: 'Planetas conquistados: {n}', w_stages: ['Acaba de llegar', 'Despegando', 'En órbita', 'Aterrizando', '¡Conquistado!'], w_what: 'Cada planeta es un hábito. Cuando lo hace solo, sin que se lo recuerden, lo conquista y viaja al siguiente.', w_summit: '¡Ha llegado a la cumbre de Monstrópolis!', n_planet: '¡Ha conquistado el planeta {p}! Ahora viaja al planeta {q}', h_title: 'Esta semana en casa', h_text: 'Un toque por semana nos ayuda mucho. ¿Cómo ha ido?', h_si: 'Sí', h_aveces: 'A veces', h_no: 'Todavía no', h_send: 'Enviar', h_sent: '¡Gracias! Ya lo tiene el tutor.', h_sentWait: '¡Gracias! Le llegará al tutor en cuanto abra Monstruitos.', h_missing: 'Responde las cuatro, por favor.',
      newsTitle: 'Novedades desde tu última visita', newsOk: 'Entendido', n_stars: 'Ha ganado {n} ⭐', n_neg: '{n} «a mejorar»', n_up: '¡Ha evolucionado a {phase}!', n_down: 'Ha vuelto a la fase {phase}', n_bought: 'Ha conseguido {item}', n_boughtHome: 'Elegido desde casa: {item}', n_redeemed: 'Ha usado su superpoder: {item}', n_coins: 'El tutor ha cambiado su energía: {d}', n_orderOk: 'Lo que elegisteis, «{item}», ya está anotado en clase', n_orderNo: 'Al final no se pudo conseguir «{item}» ({why}): su energía sigue ahí',
      why_nocoins: 'no tenía energía suficiente', why_phase: 'aún no ha llegado a la fase necesaria', why_owned: 'ya lo tenía', why_soldout: 'se agotó por hoy', why_weekly: 'ya lo usó esta semana', why_season: 'ya no es temporada', why_gone: 'ya no está en el Taller', why_error: 'hubo un problema'
    },
    va: {
      loading: 'Obrint el monstre…', hello: 'Hola!', welcome: 'Escaneja amb la càmera del mòbil el codi QR que t’ha donat el tutor o la tutora i veuràs ací el monstre del teu fill o filla.',
      saved: 'Guardats en aquest mòbil', badKey: 'Aquest enllaç no està complet. Torna a escanejar el codi QR o demana’n un de nou al tutor.',
      notFound: 'Encara no hi ha cap fitxa per a aquest codi. Si te l’acaben de donar, torna a provar d’ací a uns minuts. Si abans funcionava, pot ser que el tutor l’haja renovat: demana-li’n un de nou.', netError: 'No s’ha pogut connectar. Revisa la connexió a internet i torna-ho a provar.', oldPhone: 'Aquest navegador és massa antic per a obrir la fitxa xifrada. Prova amb un altre navegador o actualitza el mòbil.',
      retry: 'Tornar a provar', trackNote: 'El tutor pot veure quan i quanta estona s’obri aquesta pàgina.', monsterOf: 'El monstre de {name}', yourMonster: 'El seu monstre', stars: 'estreles', coins: 'energia',
      toNext: 'Li falten {n} ⭐ per a arribar a {phase}', maxPhase: 'Ha arribat a Mític, la fase més alta!', path: 'El seu camí', week: 'Aquesta setmana', weekStars: '+{n} ⭐', bonusDays: '{n} dies sense incidències', weekNone: 'Encara no hi ha estreles aquesta setmana',
      shop: 'Taller de la classe', shopNote: 'Ho aconsegueix a classe, el «Dia del Taller», amb la seua energia. Usar energia mai li lleva estreles.', filterCan: 'Pot aconseguir', filterAll: 'Tot', cos: 'Per al seu monstre', priv: 'Superpoders',
      seeAll: 'Veure’ls tots ({n})', st_ok: 'Li arriba!', st_egg: 'Només per a ous', st_coins: 'Falta {n} 🪙', st_phase: 'Des de {phase}', st_owned: 'Ja el té', st_soldout: 'Esgotat hui', st_weekly: 'Ja l’ha usat aquesta setmana', mystery: 'Regal sorpresa', mysteryNote: 'un adorn a l’atzar',
      saving: 'Està carregant energia per a', vouchers: 'Els seus passis', vPending: 'Per usar', vRedeemed: 'Gaudit', noVouchers: 'Encara no ha aconseguit cap superpoder.', goals: 'Premis de la classe', goalMine: 'ha aportat {n} 🪙', goalDone: 'Aconseguit!',
      v_title: 'Vals', v_hint: 'Vals que li ha donat el seu tutor. Prem «Bescanviar» i l’energia, les estreles o el passi li arribaran a classe.', v_hintClass: 'Vals que li ha donat el seu tutor. Es bescanvien a classe.', v_none: 'Encara no té cap val.', v_redeem: 'Bescanviar', v_unitE: 'd’energia', v_unitP: 'passi del Taller', v_unitS: 'estreles', v_unitS1: 'estrela', v_title2: 'VAL', v_stampDone: 'BESCANVIAT', v_stampExp: 'CADUCAT', v_exp: 'Caduca el {date}', v_expired: 'Va caducar el {date}', v_done: 'Bescanviat', v_doneHome: 'Bescanviat des de casa', v_way: 'De camí a classe', v_q: 'Vols bescanviar aquest val ara?', v_qNote: 'Se sumarà al seu monstre quan el tutor arreplegue la bústia a classe.', v_qNoteP: 'El passi quedarà guardat per a usar-lo a classe quan el tutor arreplegue la bústia.', v_yes: 'Sí, bescanviar', v_sent: 'Val bescanviat!', v_sentNote: 'Ja va de camí a classe. En la pròxima actualització veuràs «Bescanviat».', v_given: 'Li han donat {n}', v_why: 'Motiu', v_class: 'Es bescanvia a classe', v_old: 'Bescanviats i caducats',
      h_vale: 'Val bescanviat', n_vale: 'Val bescanviat: {d}', n_valeNew: 'Té un val nou: {d}', n_valeNo: 'No s’ha pogut bescanviar el val ({why})', why_done: 'ja estava bescanviat', why_expired: 'havia caducat',
      p_title: 'Avisos al mòbil', p_intro: 'Rep un avís, com el d’una app, que conta el que ha passat: estreles, «a millorar», evolució, vals…',
      p_now: 'Al moment', p_daily: 'Un resum al dia (17:00)', p_on: 'Activar avisos', p_off: 'Desactivar avisos', p_active: 'Avisos activats en aquest mòbil', p_pending: 'Es confirmaran quan el tutor òbriga Monstruitos a classe (rebràs un avís de benvinguda).',
      p_rules: 'Només de dilluns a divendres, de 8 a 20 h.', p_denied: 'Aquest mòbil té els avisos bloquejats per a aquesta pàgina. Activa’ls en els ajustos del navegador o del mòbil i torna ací.',
      p_noBrowser: 'Aquest navegador no pot rebre avisos. En Android, obri l’enllaç amb Chrome.', p_oldIos: 'Aquest iPhone no pot rebre avisos de pàgines web: cal iOS 16.4 o posterior.',
      p_iosTitle: 'En iPhone, primer afig la pàgina a la pantalla d’inici:', p_ios1: 'Prem ací baix «Copiar l’enllaç del meu fill/a».', p_ios2: 'Prem el botó Compartir (el quadrat amb la fletxa), tria «Afegir a la pantalla d’inici» i després «Afegir».', p_ios3: 'Obri Monstrets des de la icona nova i prem «Apegar l’enllaç» (o escaneja el QR de la targeta). Només cal la primera vegada.', p_ios4: 'Dins de la icona, prem «Activar avisos» i després «Provar un avís».',
      p_test: 'Provar un avís en aquest mòbil', p_testOk: 'Avís enviat: et arribarà en uns segons.', p_testWait: 'Espera uns segons abans de tornar a provar.', p_testNoKey: 'El tutor encara no ha activat els avisos en el seu Mac.', p_testOld: 'Per a provar, el tutor ha d’actualitzar la bústia.', p_testErr: 'No s’ha pogut enviar l’avís de prova ({s}). Desactiva i torna a activar els avisos.',
      p_testSign: 'El servei d’avisos ha rebutjat la signatura ({s}). Prem «Desactivar», torna a activar els avisos i prova una altra vegada. Si continua igual, diga-li-ho al tutor.', p_testNet: 'No s’ha pogut parlar amb la bústia ({s}). Revisa la connexió.', p_resync: 'Els avisos s’han posat al dia amb la nova clau del tutor ✓', p_redo: 'El tutor ha canviat la clau d’avisos: torna a activar-los ací.',
      slow: 'Està tardant molt a obrir-se. Revisa la connexió i torna a provar.', failOpen: 'No s’ha pogut obrir la fitxa en aquest mòbil.', detail: 'Detall per al tutor', st_key: 'preparant la clau', st_box: 'buscant en la bústia', st_gh: 'baixant de GitHub', st_dec: 'desxifrant', st_draw: 'dibuixant',
      w_scan: 'Escanejar el codi QR', w_scanHint: 'Apunta la càmera al codi QR de la targeta del tutor.', w_scanNo: 'No s’ha pogut obrir la càmera. Revisa el permís de la càmera o apega l’enllaç.', w_scanBad: 'Aquest codi QR no és de Monstruitos.', w_standalone: 'Primera vegada des de la icona: prem «Apegar l’enllaç» (si el vas copiar abans en Safari) o escaneja el codi QR de la targeta. Després s’obrirà sol.', w_clip: 'Apegar l’enllaç', w_clipNo: 'No hi ha cap enllaç de Monstrets copiat. En Safari, obri la fitxa i prem «Copiar l’enllaç del meu fill/a».', close: 'Tancar',
      p_copy: 'Copiar l’enllaç del meu fill/a', p_copied: 'Enllaç copiat. Si en obrir la icona no ix el monstre, apega’l allí.', p_err: 'No s’han pogut activar els avisos. Torna-ho a provar.', p_sending: 'Activant…',
      w_paste: 'Ja tens l’enllaç? Apega’l ací:', w_pasteBtn: 'Obrir', w_pasteBad: 'Aquest enllaç no és d’una fitxa de Monstruitos.', dg_title: 'Diagnòstic (per al tutor)', dg_hint: 'Fes una captura d’aquesta pantalla i envia-li-la al tutor. No conté la clau ni dades del xiquet.', dg_close: 'Tancar', dg_tapVer: 'Toca la versió per a veure el diagnòstic',
      how: 'Com funciona?', noticeTitle: 'Missatge del tutor', n_notice: 'Hi ha un missatge nou del tutor',
      howText: ['Cada bon comportament a classe li dona estreles ⭐.', 'Amb les estreles el seu monstre evoluciona: Cria, Jove, Adult, Heroic, Llegendari i Mític.', 'Cada estrela també li carrega energia 🪙 per al Taller de la classe. Usar energia mai li lleva estreles ni fases.'],
      howBonus: 'Si un dia no té cap «a millorar», a les {time} rep {n} ⭐ extra.', howDraw: 'La forma Mítica és el seu propi dibuix, convertit en monstre.',
      updated: 'Actualitzat el {date}', ago_now: 'ara mateix', ago_min: 'fa {n} min', ago_h: 'fa {n} h', privacy: 'Aquestes dades van xifrades: només es poden obrir amb aquest codi. No el compartisques fora de la família.',
      remember: 'Guardar en aquest mòbil', remembered: 'Guardat en aquest mòbil', forget: 'Llevar d’aquest mòbil', homeHint: 'Consell: afig aquesta pàgina a la pantalla d’inici per a obrir-la com una app.',
      days: ['diumenge', 'dilluns', 'dimarts', 'dimecres', 'dijous', 'divendres', 'dissabte'], months: ['gener', 'febrer', 'març', 'abril', 'maig', 'juny', 'juliol', 'agost', 'setembre', 'octubre', 'novembre', 'desembre'],
      phases: { huevo: 'Ou', cria: 'Cria', joven: 'Jove', adulto: 'Adult', heroico: 'Heroic', legendario: 'Llegendari', mitico: 'Mític' },
      whyNoHome: 'Això ho aconsegueix a classe, el «Dia del Taller». Triar des de casa no està activat.', whyNo: 'Ara no es pot aconseguir.',
      buy: 'Aconseguir', buyQ: 'Aconseguir «{item}» amb {n} 🪙?', buyNote: 'Es descompta ara mateix de la seua energia i ja és seu. Ho veurà a classe.', bought: 'Aconseguit!', boughtCos: 'Ja és seu: posa-te’l quan vulgues en l’Armari.', w2_title: 'Armari', w2_hint: 'Toca una peça per a posar-te-la o llevar-te-la. Es veurà a classe tan prompte com el tutor arreplegue els canvis.', w2_noBox: 'Això és el que té en el seu armari. Per a vestir-se des de casa, el tutor ha d’activar la bústia.', w2_empty: 'Encara no té res en l’armari. El que aconseguisca en el Taller apareixerà ací.', w2_on: 'Posat', w2_put: 'Posar-me’l', w2_sent: 'Enviat a classe ✓', slots: { hat: 'Barrets', bow: 'Llaços', glasses: 'Ulleres', neck: 'Coll', cape: 'Capes', shirt: 'Samarretes', legs: 'Pantalons i faldes', shoes: 'Sabates', aura: 'Aures', pedestal: 'Peanes', pet: 'Mascotes', particles: 'Efectes', bg: 'Fons', frame: 'Marcs', banner: 'Nom', dance: 'Balls', eggskin: 'Closques', nest: 'Nius' }, boughtPriv: 'Podrà usar el seu superpoder a classe.', mine: 'Ja és seu', homeNote: '🏠 Triat des de casa: s’anotarà a classe tan prompte com s’òbriga Monstrets.', spentHome: '{n} usada des de casa', buyYes: 'Sí, aconseguir', cancel: 'Cancel·lar', sending: 'Enviant…', sent: 'Comanda enviada!', sendErr: 'No s’ha pogut enviar. Revisa la connexió i torna-ho a provar.', pendingTitle: 'Comandes en camí', pendingChip: 'En camí', reserved: '{n} reservades en comandes', shopNoteHome: 'Podeu triar des d’ací amb la seua energia: la comanda arriba a classe i ho veurà allí. Usar energia mai li lleva estreles.', available: 'disponibles',
      history: 'Historial', histMore: 'Veure’n més', histNone: 'Encara no hi ha moviments.', h_bonus: 'Dia sense incidències', h_adjust: 'Ajust del tutor', h_coins: 'Ajust d’energia del tutor', h_buy: 'Aconseguit', h_home: 'des de casa', h_mystery: 'Regal sorpresa: {item}', today: 'Hui', yesterday: 'Ahir', histStars: 'Historial d’estreles', histStarsSub: 'Què ha fet a classe i quantes estreles suma o resta cada cosa.', histCoins: 'Energia: el que ha aconseguit i ajustos', h_noted: 'anotat', h_notedHint: 'Els «a millorar» marcats com a «anotat» no resten estreles.', h_day: '{n} ⭐ aquest dia', coinsNone: 'Encara no ha usat energia.',
      w_title: 'Monstròpolis', w_planet: 'Planeta {n} de {t}', w_now: 'Ara està aprenent', w_help: 'Com ajudar a casa', w_done: 'Planetes conquistats: {n}', w_stages: ['Acaba d’arribar', 'Enlairant-se', 'En òrbita', 'Aterrant', 'Conquistat!'], w_what: 'Cada planeta és un hàbit. Quan el fa a soles, sense que li ho recorden, el conquista i viatja al següent.', w_summit: 'Ha arribat al cim de Monstròpolis!', n_planet: 'Ha conquistat el planeta {p}! Ara viatja al planeta {q}', h_title: 'Aquesta setmana a casa', h_text: 'Un toc per setmana ens ajuda molt. Com ha anat?', h_si: 'Sí', h_aveces: 'A vegades', h_no: 'Encara no', h_send: 'Enviar', h_sent: 'Gràcies! Ja ho té el tutor.', h_sentWait: 'Gràcies! Li arribarà al tutor tan prompte com òbriga Monstrets.', h_missing: 'Respon les quatre, per favor.',
      newsTitle: 'Novetats des de la teua última visita', newsOk: 'D’acord', n_stars: 'Ha guanyat {n} ⭐', n_neg: '{n} «a millorar»', n_up: 'Ha evolucionat a {phase}!', n_down: 'Ha tornat a la fase {phase}', n_bought: 'Ha aconseguit {item}', n_boughtHome: 'Triat des de casa: {item}', n_redeemed: 'Ha usat el seu superpoder: {item}', n_coins: 'El tutor ha canviat la seua energia: {d}', n_orderOk: 'El que vau triar, «{item}», ja està anotat a classe', n_orderNo: 'Al final no s’ha pogut aconseguir «{item}» ({why}): la seua energia continua ahí',
      why_nocoins: 'no tenia prou energia', why_phase: 'encara no ha arribat a la fase necessària', why_owned: 'ja el tenia', why_soldout: 's’ha esgotat per hui', why_weekly: 'ja l’ha usat aquesta setmana', why_season: 'ja no és temporada', why_gone: 'ja no està al Taller', why_error: 'hi ha hagut un problema'
    }
  };
  let lang = 'es', langChosen = false;
  try { const s0 = localStorage.getItem('monstruitos-lang'); if (s0 === 'es' || s0 === 'va') { lang = s0; langChosen = true; } } catch (e) { /* sin almacenamiento */ }
  if (!langChosen && /^(ca|va)/i.test(navigator.language || '')) lang = 'va';
  const t = (k, p) => { let s = (L[lang] || L.es)[k]; if (s === undefined) s = L.es[k]; if (typeof s === 'string' && p) Object.keys(p).forEach(x => { s = s.split('{' + x + '}').join(p[x]); }); return s; };
  const esc = (s) => String(s === undefined || s === null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const nm = (o) => (o && (o[lang] || o.es)) || '';
  // Apartados que el tutor ha decidido mostrar (las fichas antiguas no lo dicen: se ve todo)
  const on = (k) => !data || !data.show || data.show[k] !== false;
  const fmtDate = (iso) => { const d = new Date(iso); const m = t('months')[d.getMonth()]; const de = lang === 'va' && /^[aeiou]/.test(m) ? "d'" : 'de '; return t('days')[d.getDay()] + ' ' + d.getDate() + ' ' + de + m + ', ' + String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0'); };

  function ago(iso) {
    const m = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
    if (!(m >= 0) || m >= 24 * 60) return '';
    return ' (' + (m < 1 ? t('ago_now') : m < 60 ? t('ago_min', { n: m }) : t('ago_h', { n: Math.floor(m / 60) })) + ')';
  }

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
  function message(text, withRetry, detail) {
    loading = 0;
    $app.innerHTML = header() + `<main class="msg"><div class="msg-art">${window.Monsters ? Monsters.xispa({ size: 150, sleeping: !withRetry }) : ''}</div><p>${esc(text)}</p>${withRetry ? `<button class="btn" id="retry">${esc(t('retry'))}</button>` : ''}${detail ? `<p class="soft small diag">${esc(t('detail'))}: ${esc(detail)}</p>` : ''}<p class="soft small ver">v${VV}</p></main>`;
    bindHeader();
    const r = document.getElementById('retry'); if (r) r.onclick = () => { data = null; loadedKey = ''; route(); };
  }
  // 2.5.3: diagnóstico sin datos personales (al tocar la versión): qué ve este móvil, para saber qué falla
  async function diagLines() {
    const yes = (b) => (b ? '✅' : '❌');
    const L = [];
    const h = (location.hash || '').replace(/^#/, '');
    let standalone = false; try { standalone = navigator.standalone === true || matchMedia('(display-mode: standalone)').matches; } catch (e) { /* nada */ }
    L.push('Versión: ' + VV + ' · ' + (IOS ? 'iPhone/iPad' : 'otro') + (standalone ? ' · abierta desde el ICONO' : ' · abierta en el NAVEGADOR'));
    const ua = navigator.userAgent.match(/OS (\d+)[_\d]* like Mac|Android [\d.]+|Version\/[\d.]+/g); L.push('Sistema: ' + (ua ? ua.join(' · ') : '?'));
    L.push('Llave en el enlace: ' + yes(/^[A-Za-z0-9_-]{43}$/.test(h)) + (h && !/^[A-Za-z0-9_-]{43}$/.test(h) ? ' (hay algo raro: ' + h.length + ' letras)' : ''));
    let saved = 0; try { saved = savedList().length; } catch (e) { saved = -1; }
    L.push('Monstruos guardados en esta app: ' + saved);
    let ls = false; try { localStorage.setItem('mn-dg', '1'); ls = localStorage.getItem('mn-dg') === '1'; localStorage.removeItem('mn-dg'); } catch (e) { ls = false; }
    L.push('Memoria del navegador: ' + yes(ls) + ' · Cifrado: ' + yes(!!(window.crypto && crypto.subtle)));
    L.push('Ficha abierta: ' + yes(!!data) + (data && data.updated ? ' · actualizada ' + fmtDate(data.updated) : '') + (step ? ' · paso: ' + stepTxt() : ''));
    const t0 = Date.now();
    if (BOX) { try { const r = await fetchT(BOX + '/ping', 8000); const j = await r.json(); L.push('Buzón: ' + yes(r.ok) + ' v' + (j.v || '?') + (j.r ? '.' + j.r : '') + ' (' + (Date.now() - t0) + ' ms)'); } catch (e) { L.push('Buzón: ❌ ' + (e && e.name || '')); } } else L.push('Buzón: no configurado');
    try { const r = await fetchT('index.html', 10000, 'no-store'); const txt = await r.text(); const m = txt.match(/viewer\.js\?v=([0-9a-f]+)/); const mine = [].map.call(document.scripts, (x) => x.getAttribute('src') || '').filter((x) => /viewer\.js/.test(x))[0] || '';
      L.push('GitHub: ' + yes(r.ok) + ' ' + r.status + ' · página ' + (m && mine.indexOf(m[1]) >= 0 ? 'al día ✅' : 'DISTINTA a la publicada ⚠️ (' + (mine.split('?v=')[1] || 'sin huella') + ' / ' + (m ? m[1] : '?') + ')')); } catch (e) { L.push('GitHub: ❌ ' + (e && e.name || '')); }
    L.push('Avisos posibles aquí: ' + yes(CAN_PUSH) + (window.Notification ? ' · permiso: ' + Notification.permission : ''));
    if (CAN_PUSH) {
      try {
        const regs = await navigator.serviceWorker.getRegistrations();
        const reg = regs[0]; const sub = reg && await reg.pushManager.getSubscription();
        L.push('Ayudante de avisos: ' + yes(!!reg) + (reg && reg.active ? ' activo' : '') + ' · apuntado: ' + yes(!!sub) + (sub ? ' (' + (String(sub.endpoint).match(/^https:\/\/([^/]+)/) || ['', '?'])[1] + ')' : ''));
        if (sub && data && data.push && data.push.key) L.push('Llave de avisos igual que la del Mac: ' + yes(sameKey(sub, b64ToU8(data.push.key))));
        const loc = fid ? LS.get('mn-push-' + fid, null) : null; if (loc) L.push('Estado guardado: ' + (loc.st || '?') + ' · ' + (loc.pref || ''));
      } catch (e) { L.push('Ayudante de avisos: ❌ ' + (e && e.name || '')); }
    }
    return L;
  }
  async function showDiag() {
    if (document.querySelector('.dg-ov')) return;
    const ov = document.createElement('div'); ov.className = 'news-ov dg-ov';
    ov.innerHTML = `<div class="news dg"><h2>🩺 ${esc(t('dg_title'))}</h2><p class="soft small">${esc(t('dg_hint'))}</p><pre class="dg-out">…</pre><button class="btn" data-a="ok">${esc(t('dg_close'))}</button></div>`;
    document.body.appendChild(ov);
    ov.querySelector('[data-a=ok]').onclick = () => ov.remove();
    let lines; try { lines = await diagLines(); } catch (e) { lines = ['Error: ' + (e && e.message)]; }
    ov.querySelector('.dg-out').textContent = lines.join('\n');
  }
  document.addEventListener('click', (e) => { const v = e.target && e.target.closest && e.target.closest('.ver'); if (v) showDiag(); });

  // 2.5.2: nunca se queda colgada en «Abriendo el monstruo…»: si algo falla o tarda, lo dice (y en qué paso)
  let loading = 0, step = '';
  const stepTxt = () => (step ? t('st_' + step) : '');
  function failOpen(e) {
    if (!loading) return;
    const what = e && (e.name || '') + (e && e.message ? ': ' + e.message : '');
    message(t('failOpen'), true, stepTxt() + (what ? ' · ' + String(what).slice(0, 140) : ''));
  }
  window.addEventListener('error', (e) => { if (loading) failOpen(e.error || { name: 'Error', message: (e.message || '') + (e.filename ? ' (' + String(e.filename).split('/').pop().split('?')[0] + ':' + e.lineno + ')' : '') }); });
  window.addEventListener('unhandledrejection', (e) => { if (loading) failOpen(e.reason); });
  function welcome() {
    const list = savedList();
    const canScan = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
    $app.innerHTML = header() + `<main class="msg"><div class="msg-art">${window.Monsters ? Monsters.xispa({ size: 170 }) : ''}</div><h1>${esc(t('hello'))}</h1><p>${esc(STANDALONE ? t('w_standalone') : t('welcome'))}</p>
      ${STANDALONE && navigator.clipboard && navigator.clipboard.readText ? `<button class="btn" id="clipGo">📋 ${esc(t('w_clip'))}</button>` : ''}
      ${canScan ? `<button class="btn${STANDALONE ? ' ghost' : ''}" id="scanQr">📷 ${esc(t('w_scan'))}</button>` : ''}
      ${list.length ? `<h2>${esc(t('saved'))}</h2><div class="saved">${list.map(s => `<a class="saved-kid" href="#${esc(s.key)}">${esc(s.name || t('yourMonster'))}</a>`).join('')}</div>` : ''}
      <div class="paste"><label>${esc(t('w_paste'))}<input type="url" id="pasteLink" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="https://…#…"></label><button class="btn" id="pasteGo">${esc(t('w_pasteBtn'))}</button><p class="soft" id="pasteMsg"></p></div><p class="soft small ver">v${VV}</p></main>`;
    bindHeader();
    // 2.5: en la web instalada en el iPhone puede no llegar la llave del enlace: se puede pegar aquí
    const go = () => { const v = String(document.getElementById('pasteLink').value || '').trim(); const k = v.indexOf('#') >= 0 ? v.slice(v.indexOf('#') + 1) : v; if (/^[A-Za-z0-9_-]{43}$/.test(k)) location.hash = k; else document.getElementById('pasteMsg').textContent = t('w_pasteBad'); };
    document.getElementById('pasteGo').onclick = go;
    const sq = document.getElementById('scanQr'); if (sq) sq.onclick = scanQr;
    // 2.5.4: pegar con un toque el enlace copiado en Safari (iOS pide confirmar «Pegar»)
    const cg = document.getElementById('clipGo');
    if (cg) cg.onclick = async () => {
      let v = ''; try { v = String(await navigator.clipboard.readText() || '').trim(); } catch (e) { v = ''; }
      const k = v.indexOf('#') >= 0 ? v.slice(v.indexOf('#') + 1) : v;
      if (/^[A-Za-z0-9_-]{43}$/.test(k)) location.hash = k; else document.getElementById('pasteMsg').textContent = t('w_clipNo');
    };
    document.getElementById('pasteLink').onkeydown = (e) => { if (e.key === 'Enter') go(); };
  }

  let data = null, loadedKey = '', filter = 'can', expanded = {}, shownKey = '', shownCoins = null;
  const CAP = 6;
  function route() {
    const me = ++routeN;
    return route0(me).catch((e) => { if (me === routeN) failOpen(e); });
  }
  let routeN = 0;
  async function route0(me) {
    loading = 0;
    let key = (location.hash || '').replace(/^#/, '').trim();
    try { if (navigator.clearAppBadge) navigator.clearAppBadge().catch(() => {}); } catch (e) { /* sin globo */ }
    // 2.5: al tocar un aviso se abre «#f=…» (el nombre del archivo, no la llave): se busca entre los guardados
    if (/^f=[A-Za-z0-9_-]{22}$/.test(key)) { const k2 = await savedKeyFor(key.slice(2)); if (k2) { history.replaceState(null, '', '#' + k2); key = k2; } else key = ''; }
    if (!key) { const list = savedList(); if (list.length === 1 && /^[A-Za-z0-9_-]{43}$/.test(list[0].key)) { history.replaceState(null, '', '#' + list[0].key); key = list[0].key; } }
    if (!key) return welcome();
    if (!/^[A-Za-z0-9_-]{43}$/.test(key)) return message(t('badKey'));
    if (data && loadedKey === key) return render(key);
    if (!window.crypto || !crypto.subtle || !window.TextEncoder) return message(t('oldPhone'));
    $app.innerHTML = header() + `<main class="msg"><div class="msg-art pulse">${window.Monsters ? Monsters.xispa({ size: 120 }) : ''}</div><p>${esc(t('loading'))}</p><p class="soft small diag" id="lstep"></p><p class="soft small ver">v${VV}</p></main>`;
    bindHeader();
    loading = me;
    const setStep = (s) => { step = s; const el = document.getElementById('lstep'); if (el) el.textContent = stepTxt() + '…'; };
    // vigilante: si en 25 s no se ha abierto, se dice y se puede reintentar
    setTimeout(() => { if (loading === me) message(t('slow'), true, stepTxt()); }, 25000);
    setStep('key');
    const id = await fileId(key);
    let d0 = null; boxV = '';
    if (BOX) { setStep('box'); try { const b = await fetchBox(id, ''); if (b && b.buf) { d0 = await decrypt(key, b.buf); boxV = b.v; } } catch (e) { d0 = null; } }
    if (loading !== me) return;
    if (!d0) {
      setStep('gh');
      let res;
      try { res = await fetchT('d/' + id + '.bin', 15000); } catch (e) { return loading === me && message(t('netError'), true, stepTxt() + ' · ' + (e && e.name || '')); }
      if (loading !== me) return;
      if (res.status === 404) return message(t('notFound'));
      if (!res.ok) return message(t('netError'), true, 'GitHub ' + res.status);
      setStep('dec');
      try { d0 = await decrypt(key, await res.arrayBuffer()); } catch (e) { return message(t('notFound')); }
      lastEtag = res.headers.get('etag') || '';
    } else setTimeout(() => checkGh(), 1500); // por si la copia de GitHub fuera más reciente
    if (loading !== me) return;
    setStep('draw');
    data = d0; lastCheck = Date.now();
    fid = id;
    if (remoteFor !== fid) remoteOrders = [];
    if (!langChosen && (data.lang === 'va' || data.lang === 'es')) lang = data.lang;
    loadedKey = key;
    window.Drawings = { get: (f) => (data.drawings && data.drawings[f]) || null };
    // 2.5.3: abierta desde el icono, se guarda sola en este móvil: así el icono la abre aunque iOS pierda el «#…» del enlace
    if (STANDALONE || MOBILE) { try { rememberHere(key); } catch (e) { /* nada */ } }
    render(key);
    loading = 0; step = '';
    visStart();
    news();
    loadRemote(key);
    startPoll();
  }

  // ---------- 2.8: visitas (si el tutor lo tiene activado) ----------
  // Solo se anota cuándo se abre la página y cuánto rato está a la vista, con el código de la ficha (sin nombres).
  // Se manda al ocultarse la página; si el móvil la cerró de golpe, se manda al volver a abrirla.
  const VISKEY = () => 'mn-visita-' + fid;
  let vis = null, visT = null;
  const visOn = () => !!(BOX && data && data.track && fid);
  function visDev() { const ua = navigator.userAgent; return /iPad/.test(ua) || (IOS && !/iPhone/.test(ua)) ? 'ipad' : /iPhone|iPod/.test(ua) ? 'iphone' : /Android/i.test(ua) ? 'android' : 'pc'; }
  function visSend(v, beacon) {
    if (!BOX || !v || v.act < 3000) return;
    const body = JSON.stringify({ f: v.f, id: v.id, s: v.s, e: new Date(v.last).toISOString(), a: Math.round(v.act / 1000), dv: v.dv, ic: v.ic });
    v.sent = v.last;
    try { if (beacon && navigator.sendBeacon && navigator.sendBeacon(BOX + '/v', body)) return; } catch (e) { /* nada */ }
    try { fetch(BOX + '/v', { method: 'POST', body, keepalive: true, headers: { 'Content-Type': 'text/plain' } }).catch(() => {}); } catch (e) { /* nada */ }
  }
  function visSave() { if (vis) { try { localStorage.setItem('mn-visita-' + vis.f, JSON.stringify(vis)); } catch (e) { /* nada */ } } }
  function visTick() { if (!vis) return; const now = Date.now(); if (!document.hidden && vis.vs) { vis.act += now - vis.vs; vis.vs = now; vis.last = now; } visSave(); }
  function visStart() {
    if (vis && vis.f !== fid) { visPause(); vis = null; }
    if (!visOn()) return;
    if (vis) { visResume(); return; }
    const prev = LS.get(VISKEY(), null), now = Date.now();
    if (prev && prev.f === fid && now - prev.last < 10 * 60000) { vis = prev; vis.vs = now; vis.last = now; } // sigue la misma visita
    else {
      if (prev && prev.f && !(prev.sent >= prev.last)) visSend(prev, false); // la anterior se cerró de golpe
      vis = { f: fid, id: rid().slice(0, 12), s: new Date(now).toISOString(), last: now, act: 0, vs: now, dv: visDev(), ic: STANDALONE ? 1 : 0 };
    }
    visSave();
    clearInterval(visT); visT = setInterval(visTick, 20000);
  }
  function visPause() { if (!vis || !vis.vs) return; visTick(); vis.vs = 0; visSave(); visSend(vis, true); }
  function visResume() {
    if (!vis || !visOn()) return;
    const now = Date.now();
    if (now - vis.last > 10 * 60000) { vis = null; visStart(); return; } // ha pasado un rato: visita nueva
    vis.vs = now; vis.last = now; visSave();
  }
  document.addEventListener('visibilitychange', () => { if (document.hidden) visPause(); else visResume(); });
  window.addEventListener('pagehide', visPause);

  // ---------- 2.5: novedades sin recargar ----------
  // Mientras la página está a la vista se mira cada 2 minutos (y al volver a ella) si el tutor ha publicado algo nuevo.
  // Si el archivo no ha cambiado, el servidor solo responde «igual» y no se descarga nada.
  // 2.5.1: con el buzón se mira cada 20 segundos (casi al instante); GitHub, cada 2 minutos.
  let pollT = null, pollG = null, lastEtag = '', lastCheck = 0, checking = false, boxV = '';
  function fetchT(url, ms, cache, extra) {
    const ac = window.AbortController ? new AbortController() : null;
    const tm = ac ? setTimeout(() => ac.abort(), ms || 8000) : null;
    const o = Object.assign({ cache: cache || 'no-store' }, extra || {}); if (ac) o.signal = ac.signal;
    return fetch(url, o).finally(() => { if (tm) clearTimeout(tm); });
  }
  /** Ficha del buzón: { buf, v } · { same: true } si no ha cambiado · null si no hay */
  async function fetchBox(id, have) {
    const r = await fetchT(BOX + '/f/' + id + (have ? '?have=' + encodeURIComponent(have) : ''), 8000);
    if (r.status === 204) return { same: true };
    if (r.status === 404) return null;
    if (!r.ok) throw new Error('http ' + r.status);
    return { buf: await r.arrayBuffer(), v: r.headers.get('X-V') || '' };
  }
  function startPoll() {
    clearInterval(pollT); clearInterval(pollG);
    if (BOX) pollT = setInterval(() => { if (!document.hidden) checkBox(); }, 20000);
    pollG = setInterval(() => { if (!document.hidden) checkGh(); }, 120000);
  }
  document.addEventListener('visibilitychange', () => { if (!document.hidden && loadedKey && Date.now() - lastCheck > 10000) { lastCheck = Date.now(); checkNew(); } });
  function checkNew() { if (BOX) checkBox(); checkGh(); }
  /** Se queda con la ficha más reciente (la del buzón o la de GitHub) */
  function apply(key, d2) {
    if (key !== loadedKey || !d2 || (data && String(d2.updated) <= String(data.updated))) return;
    data = d2;
    window.Drawings = { get: (f) => (data.drawings && data.drawings[f]) || null };
    const y = window.scrollY; render(key); window.scrollTo(0, y);
    news();
    loadRemote(key);
  }
  async function checkBox() {
    const key = loadedKey;
    if (!key || !fid || !BOX || checking || document.querySelector('.news-ov')) return;
    checking = true;
    try {
      const b = await fetchBox(fid, boxV);
      if (!b || b.same || !b.buf) return;
      const d2 = await decrypt(key, b.buf);
      boxV = b.v;
      apply(key, d2);
    } catch (e) { /* sin conexión: se vuelve a mirar más tarde */ }
    finally { checking = false; }
  }
  async function checkGh() {
    const key = loadedKey;
    if (!key || !fid || document.querySelector('.news-ov')) return;
    try {
      const r = await fetchT('d/' + fid + '.bin', 20000, 'no-cache');
      if (!r.ok) return;
      const et = r.headers.get('etag') || '';
      if (et && et === lastEtag) return;
      const d2 = await decrypt(key, await r.arrayBuffer());
      lastEtag = et;
      apply(key, d2);
    } catch (e) { /* sin conexión */ }
  }

  // ---------- Tablero de novedades (desde la última visita en este móvil) ----------
  function news() {
    const d = data, seen = LS.get(seenKey(), null);
    const P = d.phases || ['huevo', 'cria', 'joven', 'adulto', 'heroico', 'legendario', 'mitico'];
    const mark = () => LS.set(seenKey(), { at: d.updated, phase: d.phase, planet: d.world ? d.world.cur : 0 });
    if (!seen || !seen.at) return mark(); // primera visita: no hay «novedades»
    if (seen.at >= d.updated) return;
    if (!on('news')) return mark();
    const after = (x) => x && x > seen.at;
    const rows = [];
    const hist = (d.history || []).filter(h => after(h.at));
    const plus = hist.filter(h => h.v > 0 && h.k !== 'adjust' && h.k !== 'vale').reduce((a, h) => a + h.v, 0), negs = hist.filter(h => h.k === 'neg').length;
    if (seen.phase && seen.phase !== d.phase) rows.push(P.indexOf(d.phase) > P.indexOf(seen.phase) ? ['🎉', t('n_up', { phase: t('phases')[d.phase] }), 'up'] : ['↘️', t('n_down', { phase: t('phases')[d.phase] }), 'down']);
    if (d.world && window.Planets && seen.planet && d.world.cur > seen.planet) for (let n = seen.planet; n < d.world.cur; n++) rows.push(['🪐', t('n_planet', { p: Planets.tx(Planets.get(n).name, lang), q: Planets.tx(Planets.get(n + 1).name, lang) }), 'up']);
    if (d.notice && after(d.notice.at)) rows.unshift(['📌', t('n_notice'), 'up']);
    if (plus) rows.push(['⭐', t('n_stars', { n: plus }), 'up']);
    if (negs) rows.push(['📝', t('n_neg', { n: negs }), 'neg']);
    hist.filter(h => h.k === 'vale').forEach(h => rows.push(['🎫', t('n_vale', { d: '+' + h.v + ' ⭐' }), 'up']));
    (d.vales || []).filter(v => after(v.at) && v.st === 'pend').forEach(v => rows.push(['🎫', t('n_valeNew', { d: valeD(v) }) + (v.why ? ' · ' + v.why : ''), 'up']));
    (d.notices || []).filter(n => n.vale && !n.ok && after(n.at)).forEach(n => rows.push(['⚠️', t('n_valeNo', { why: t('why_' + (n.reason || 'error')) }), 'neg']));
    (d.notices || []).filter(n => !n.quiet && after(n.at)).forEach(n => rows.push(n.ok ? [n.icon || '🔧', t('n_orderOk', { item: nm(n) }), 'up'] : ['⚠️', t('n_orderNo', { item: nm(n), why: t('why_' + (n.reason || 'error')) }), 'neg']));
    (d.buys || []).forEach(b => {
      if (b.k === 'coins' && b.vale) { if (after(b.at)) rows.push(['🎫', t('n_vale', { d: '+' + b.d + ' 🪙' }), 'up']); return; }
      if (b.k === 'coins') { if (after(b.at)) rows.push(['🪙', t('n_coins', { d: (b.d > 0 ? '+' : '−') + Math.abs(b.d) + (b.note ? ' (' + b.note + ')' : '') }), b.d > 0 ? 'up' : 'neg']); return; }
      if (after(b.at) && b.from !== 'casa') rows.push([b.icon || '🔧', t('n_bought', { item: nm(b) }) + (b.cost ? ' · ' + b.cost + ' 🪙' : ' 🎁'), '']);
      if (after(b.redeemedAt)) rows.push([b.icon || '🎟️', t('n_redeemed', { item: nm(b) }), 'up']);
    });
    if (!rows.length) return mark();
    const ov = document.createElement('div');
    ov.className = 'news-ov';
    ov.innerHTML = `<div class="news"><h2>🔔 ${esc(t('newsTitle'))}</h2><ul>${rows.map(r => `<li class="${r[2]}"><span class="emo">${esc(r[0])}</span><span>${esc(r[1])}</span></li>`).join('')}</ul><button class="btn" id="newsOk">${esc(t('newsOk'))}</button></div>`;
    document.body.appendChild(ov);
    ov.querySelector('#newsOk').onclick = () => { mark(); ov.remove(); };
  }

  function infoSheet(it, why) {
    const ov = document.createElement('div');
    ov.className = 'news-ov';
    ov.innerHTML = `<div class="news buyq"><div class="art">${itemArt(it, true)}</div><h2>${esc(nm(it))}</h2><p class="price">🪙 ${Number(it.price) || 0}</p><p class="why">${esc(why)}</p><button class="btn" data-a="ok">${esc(t('newsOk'))}</button></div>`;
    document.body.appendChild(ov);
    ov.onclick = (e) => { if (e.target === ov || e.target.closest('[data-a=ok]')) ov.remove(); };
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

  // ---------- 2.4: Armario (vestirse desde casa) ----------
  const WKEY = () => 'mn-wear-' + fid;
  let wearT = null, sendingN = '';
  function wears() {
    const noticed = (data && data.notices || []).map(n => n.n), old = Date.now() - 14 * 864e5;
    const list = LS.get(WKEY(), []).filter(p => p && p.wr && noticed.indexOf(p.n) < 0 && new Date(p.at).getTime() > old);
    LS.set(WKEY(), list);
    return list;
  }
  /** Lo que lleva puesto, con los cambios de este móvil que aún no ha recogido el Mac */
  function wearEquip(base) {
    const eq = Object.assign({}, base.equip || {}), at = base.equipAt || {};
    wears().slice().sort((a, b) => String(a.at).localeCompare(String(b.at))).forEach(p => Object.keys(p.wr).forEach(sl => {
      if (at[sl] && String(p.at) <= at[sl]) return;
      if (p.wr[sl]) eq[sl] = p.wr[sl]; else delete eq[sl];
    }));
    return eq;
  }
  function wearSet(key, slot, art) {
    const list = LS.get(WKEY(), []);
    let p = list.find(x => !x.sent && x.n !== sendingN);
    if (!p) { p = { n: rid(), wr: {}, sent: false }; list.push(p); }
    p.wr[slot] = art; p.at = new Date().toISOString();
    LS.set(WKEY(), list);
    const y = window.scrollY; render(key); window.scrollTo(0, y);
    clearTimeout(wearT); wearT = setTimeout(() => wearSend(key), 2500); // se juntan los cambios seguidos en un solo envío
  }
  async function wearSend(key) {
    if (!data || !data.shopUrl || sendingN) return;
    const p = LS.get(WKEY(), []).find(x => !x.sent); if (!p) return;
    sendingN = p.n;
    const msg = () => document.querySelector('.box.wardrobe .wmsg');
    try {
      const c = await encryptMsg(key, { n: p.n, wr: p.wr, at: p.at });
      const r = await fetch(String(data.shopUrl).replace(/\/+$/, '') + '/p', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ f: fid, c }) });
      if (!r.ok) throw new Error('http ' + r.status);
      const l2 = LS.get(WKEY(), []), q = l2.find(x => x.n === p.n); if (q) { q.sent = true; LS.set(WKEY(), l2); }
      if (msg()) msg().textContent = t('w2_sent');
    } catch (e) { if (msg()) msg().textContent = t('sendErr'); }
    finally { sendingN = ''; if (LS.get(WKEY(), []).some(x => !x.sent)) { clearTimeout(wearT); wearT = setTimeout(() => wearSend(key), 1500); } }
  }
  function wardrobeHtml(eq, pendAll) {
    const own = (data.wardrobe || []).slice();
    pendAll.filter(p => p.kind === 'cosmetic' && p.art && p.slot).forEach(p => { if (!own.some(o => o.a === p.art)) own.push({ a: p.art, s: p.slot, es: p.es, va: p.va }); });
    if (!own.length) return `<section class="box wardrobe"><h2>👕 ${esc(t('w2_title'))}</h2><p class="soft">${esc(t('w2_empty'))}</p></section>`;
    const SL = window.Cosmetics ? Cosmetics.SLOTS : [];
    const groups = SL.map(sl => [sl, own.filter(o => o.s === sl)]).filter(g => g[1].length);
    const can = !!data.shopUrl;
    return `<section class="box wardrobe"><h2>👕 ${esc(t('w2_title'))}</h2><p class="soft">${esc(can ? t('w2_hint') : t('w2_noBox'))}</p>
      ${groups.map(([sl, list]) => `<h3>${esc((t('slots') || {})[sl] || sl)}</h3><div class="items">${list.map(o => { const on = eq[sl] === o.a; return `<button class="item wr-it${on ? ' on' : ''}" data-wr="${esc(sl)}|${esc(o.a)}" ${can ? '' : 'disabled'}><div class="art">${itemArt({ kind: 'cosmetic', slot: sl, art: o.a })}</div><div class="iname">${esc(nm(o))}</div><span class="chip ${on ? 'ok' : ''}">${esc(on ? t('w2_on') : t('w2_put'))}</span></button>`; }).join('')}</div>`).join('')}
      <p class="soft small wmsg"></p></section>`;
  }

  // ---------- 2.5.1: escanear el QR con la cámara (en la web instalada en el iPhone) ----------
  function loadJsQr() {
    if (window.jsQR) return Promise.resolve();
    return new Promise((res, rej) => { const sc = document.createElement('script'); sc.src = 'v/jsqr.js'; sc.onload = () => res(); sc.onerror = rej; document.head.appendChild(sc); });
  }
  async function scanQr() {
    const ov = document.createElement('div');
    ov.className = 'news-ov scan-ov';
    ov.innerHTML = `<div class="news scanbox"><h2>📷 ${esc(t('w_scan'))}</h2><div class="scan-v"><video playsinline muted autoplay></video><i class="scan-frame"></i></div><p class="soft">${esc(t('w_scanHint'))}</p><p class="scanmsg"></p><button class="btn ghost" data-a="x">${esc(t('close'))}</button></div>`;
    document.body.appendChild(ov);
    const video = ov.querySelector('video'), msg = ov.querySelector('.scanmsg');
    let stream = null, alive = true;
    const stop = () => { alive = false; if (stream) stream.getTracks().forEach(tr => tr.stop()); if (ov.parentNode) ov.remove(); };
    ov.querySelector('[data-a=x]').onclick = stop;
    try {
      await loadJsQr();
      stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false });
      if (!alive) { stream.getTracks().forEach(tr => tr.stop()); return; }
      video.srcObject = stream; await video.play();
    } catch (e) { msg.textContent = t('w_scanNo'); return; }
    const c = document.createElement('canvas'), g = c.getContext('2d');
    const loop = () => {
      if (!alive) return;
      if (video.readyState >= 2 && video.videoWidth) {
        const k = Math.min(1, 640 / Math.max(video.videoWidth, video.videoHeight));
        c.width = Math.round(video.videoWidth * k); c.height = Math.round(video.videoHeight * k);
        g.drawImage(video, 0, 0, c.width, c.height);
        const code = window.jsQR(g.getImageData(0, 0, c.width, c.height).data, c.width, c.height, { inversionAttempts: 'dontInvert' });
        if (code && code.data) {
          const v = String(code.data), key = v.indexOf('#') >= 0 ? v.slice(v.indexOf('#') + 1) : '';
          if (/^[A-Za-z0-9_-]{43}$/.test(key)) {
            const list = savedList(); if (!list.some(x => x.key === key)) { list.push({ key, name: '' }); setSaved(list); }
            stop(); location.hash = key; return;
          }
          msg.textContent = t('w_scanBad');
        }
      }
      setTimeout(loop, 250);
    };
    loop();
  }

  // ---------- 2.5: Avisos en el móvil (Web Push) ----------
  async function savedKeyFor(f) { for (const s of savedList()) { try { if (await fileId(s.key) === f) return s.key; } catch (e) { /* nada */ } } return ''; }
  const PKEY = () => 'mn-push-' + fid;
  const IS_IOS = IOS;
  const STANDALONE = navigator.standalone === true || !!(window.matchMedia && matchMedia('(display-mode: standalone)').matches);
  const CAN_PUSH = 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window && window.isSecureContext !== false;
  let swReg = null;
  function swReady() { if (!swReg && CAN_PUSH) swReg = navigator.serviceWorker.register('sw.js').then(() => navigator.serviceWorker.ready).catch(() => null); return swReg || Promise.resolve(null); }
  if ('serviceWorker' in navigator) navigator.serviceWorker.addEventListener('message', async (e) => { const f = e.data && e.data.open; if (!f) return; const k = await savedKeyFor(f); if (k && k !== loadedKey) location.hash = k; else if (k) checkNew(); });
  function pushLocal() {
    const p = LS.get(PKEY(), null); if (!p || !p.ep) return null;
    if (p.st === 'pending' && (data.notices || []).some(n => n.n === p.n)) { p.st = 'on'; LS.set(PKEY(), p); }
    return p;
  }
  function pushHtml() {
    if (!data.push || !data.push.key || !data.shopUrl) return '';
    let body = '';
    if (!CAN_PUSH) {
      if (IS_IOS && !STANDALONE) body = `<p class="soft">${esc(t('p_iosTitle'))}</p><ol class="steps"><li>${esc(t('p_ios1'))}</li><li>${esc(t('p_ios2'))}</li><li>${esc(t('p_ios3'))}</li><li>${esc(t('p_ios4'))}</li></ol><button class="btn ghost" id="pCopy">📋 ${esc(t('p_copy'))}</button>`;
      else body = `<p class="soft">${esc(IS_IOS ? t('p_oldIos') : t('p_noBrowser'))}</p>`;
    } else if (Notification.permission === 'denied') body = `<p class="soft">${esc(t('p_denied'))}</p>`;
    else {
      const loc = pushLocal(), pref = loc ? loc.pref : 'now';
      const radios = `<div class="seg pseg"><button data-pp="now" class="${pref === 'now' ? 'on' : ''}">${esc(t('p_now'))}</button><button data-pp="daily" class="${pref === 'daily' ? 'on' : ''}">${esc(t('p_daily'))}</button></div>`;
      body = loc ? `<p class="pon">✅ ${esc(t('p_active'))}</p>${loc.st === 'pending' ? `<p class="soft small">${esc(t('p_pending'))}</p>` : ''}${BOX ? `<button class="btn" id="pTest">🔔 ${esc(t('p_test'))}</button>` : ''}${radios}<button class="btn ghost" id="pOff">${esc(t('p_off'))}</button>`
        : `${radios}<button class="btn" id="pOn">🔔 ${esc(t('p_on'))}</button>`;
      body += `<p class="soft small">${esc(t('p_rules'))}</p>`;
    }
    return `<section class="box pushbox"><h2>🔔 ${esc(t('p_title'))}</h2><p class="soft">${esc(t('p_intro'))}</p>${body}<p class="small pmsg"></p></section>`;
  }
  const b64ToU8 = (s) => fromB64url(s);
  async function pushMsg(key, ps) {
    if (!ps.off && data.push && data.push.key) ps.sk = data.push.key; // 2.5.2: con qué llave se ha apuntado este móvil
    const m = { n: rid(), ps, at: new Date().toISOString() };
    const c = await encryptMsg(key, m);
    const r = await fetch(String(data.shopUrl).replace(/\/+$/, '') + '/p', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ f: fid, c }) });
    if (!r.ok) throw new Error('http ' + r.status);
    return m.n;
  }
  function rememberHere(key) { const list = savedList(); if (!list.some(s => s.key === key)) { list.push({ key, name: data.name || '' }); setSaved(list); } }
  // 2.5.2: si el tutor cambió la llave de avisos (otro Mac, reinstalación…), el móvil se vuelve a apuntar solo con la nueva
  const sameKey = (sub, want) => { try { const o = sub && sub.options && sub.options.applicationServerKey; if (!o) return true; const have = new Uint8Array(o); return have.length === want.length && !have.some((v, i) => v !== want[i]); } catch (e) { return true; } };
  let pushNote = '', pushNoteAt = 0, syncedFor = '';
  async function pushSync(key, force) {
    const loc = pushLocal();
    if (!CAN_PUSH || !data.push || !data.push.key || !loc || Notification.permission !== 'granted') return 'skip';
    const tag = fid + '|' + data.push.key; if (!force && syncedFor === tag) return 'skip';
    syncedFor = tag;
    const reg = await swReady(); if (!reg) return 'skip';
    let sub = await reg.pushManager.getSubscription();
    const want = b64ToU8(data.push.key);
    if (sub && sameKey(sub, want)) return 'ok';
    try {
      if (sub) await sub.unsubscribe();
      sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: want });
      const j = sub.toJSON();
      if (loc.ep && loc.ep !== j.endpoint) { try { await pushMsg(key, { ep: loc.ep, off: 1 }); } catch (e) { /* nada */ } }
      const n = await pushMsg(key, { ep: j.endpoint, k: j.keys.p256dh, a: j.keys.auth, pref: loc.pref || 'now', lang });
      LS.set(PKEY(), { ep: j.endpoint, pref: loc.pref || 'now', n, st: 'pending' });
      pushNote = t('p_resync'); pushNoteAt = Date.now();
    } catch (e) {
      // sin un toque de la familia no siempre se puede: se le pide que los vuelva a activar
      try { localStorage.removeItem(PKEY()); } catch (er) { /* nada */ }
      pushNote = t('p_redo'); pushNoteAt = Date.now();
    }
    if (key === loadedKey) { const y = window.scrollY; render(key); window.scrollTo(0, y); }
    return 'redone';
  }
  function bindPush(key) {
    const box = $app.querySelector('.pushbox'); if (!box) return;
    const msg = box.querySelector('.pmsg');
    if (pushNote && Date.now() - pushNoteAt < 20000) msg.textContent = pushNote;
    // 2.5.4: el ayudante de avisos solo se instala si la familia ha activado los avisos (no en cada visita)
    if (CAN_PUSH && data.push && pushLocal()) setTimeout(() => { pushSync(key).catch(() => {}); }, 400);
    let pref = (pushLocal() || {}).pref || 'now';
    const cp = box.querySelector('#pCopy');
    if (cp) cp.onclick = async () => { rememberHere(key); try { await navigator.clipboard.writeText(location.href); msg.textContent = t('p_copied'); } catch (e) { msg.textContent = location.href; } };
    box.querySelectorAll('[data-pp]').forEach(b => b.onclick = async () => {
      pref = b.dataset.pp; box.querySelectorAll('[data-pp]').forEach(x => x.classList.toggle('on', x === b));
      const loc = pushLocal(); if (!loc) return;
      try {
        const reg = await swReady(); const sub = reg && await reg.pushManager.getSubscription(); if (!sub) return;
        const j = sub.toJSON(); const n = await pushMsg(key, { ep: j.endpoint, k: j.keys.p256dh, a: j.keys.auth, pref, lang });
        LS.set(PKEY(), { ep: j.endpoint, pref, n, st: loc.st === 'on' ? 'on' : 'pending' });
      } catch (e) { msg.textContent = t('sendErr'); }
    });
    const on = box.querySelector('#pOn');
    if (on) on.onclick = async () => {
      on.disabled = true; msg.textContent = t('p_sending');
      try {
        rememberHere(key);
        const perm = await Notification.requestPermission();
        if (perm !== 'granted') { msg.textContent = t('p_denied'); on.disabled = false; return; }
        const reg = await swReady(); if (!reg) throw new Error('sw');
        let sub = await reg.pushManager.getSubscription();
        const want = b64ToU8(data.push.key);
        if (sub && sub.options && sub.options.applicationServerKey) {
          const have = new Uint8Array(sub.options.applicationServerKey);
          if (have.length !== want.length || have.some((v, i) => v !== want[i])) { await sub.unsubscribe(); sub = null; }
        }
        if (!sub) sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: want });
        const j = sub.toJSON();
        const n = await pushMsg(key, { ep: j.endpoint, k: j.keys.p256dh, a: j.keys.auth, pref, lang });
        LS.set(PKEY(), { ep: j.endpoint, pref, n, st: 'pending' });
        const y = window.scrollY; render(key); window.scrollTo(0, y);
      } catch (e) { on.disabled = false; msg.textContent = t('p_err'); }
    };
    const tb = box.querySelector('#pTest');
    if (tb) tb.onclick = async () => {
      tb.disabled = true; msg.textContent = t('sending');
      try {
        if ((await pushSync(key, true)) === 'redone') return; // se ha tenido que poner al día: el mensaje ya lo explica
        const reg = await swReady(); const sub = reg && await reg.pushManager.getSubscription();
        if (!sub) { msg.textContent = t('p_testErr', { s: 'sub' }); return; }
        const j = sub.toJSON();
        let r;
        try { r = await fetchT(BOX + '/push-test', 25000, 'no-store', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ ep: j.endpoint, k: j.keys.p256dh, a: j.keys.auth, lang }) }); }
        catch (e) { msg.textContent = t('p_testNet', { s: (e && e.name) || 'red' }); return; }
        let o = {}; try { o = await r.json(); } catch (e) { o = {}; }
        const code = o.status ? o.status + (o.reason ? ' · ' + o.reason : '') : (o.error || r.status);
        msg.textContent = o.ok ? t('p_testOk') : o.error === 'wait' ? t('p_testWait') : o.error === 'nokey' ? t('p_testNoKey')
          : (o.status === 401 || o.status === 403) ? t('p_testSign', { s: code })
          : o.status ? t('p_testErr', { s: code })
          : (r.status === 404 || r.status === 401) ? t('p_testOld') : t('p_testErr', { s: code });
      } catch (e) { msg.textContent = t('p_testErr', { s: (e && (e.name + ' ' + (e.message || ''))).slice(0, 60) || '?' }); }
      finally { setTimeout(() => { tb.disabled = false; }, 3000); }
    };
    const off = box.querySelector('#pOff');
    if (off) off.onclick = async () => {
      off.disabled = true;
      const loc = pushLocal();
      try {
        const reg = await swReady(); const sub = reg && await reg.pushManager.getSubscription();
        if (loc) await pushMsg(key, { ep: loc.ep, off: 1 });
        if (sub) await sub.unsubscribe();
      } catch (e) { /* se borra igualmente aquí */ }
      try { localStorage.removeItem(PKEY()); } catch (e) { /* nada */ }
      const y = window.scrollY; render(key); window.scrollTo(0, y);
    };
  }

  // ---------- 2.4: Vales del tutor (se canjean desde casa) ----------
  const VKEY = () => 'mn-vale-' + fid;
  // 2.7: vale de pase (k 'p'): da un pase del Taller en vez de estrellas o energía
  const passN = (v) => (v.pn && (v.pn[lang] || v.pn.es)) || '';
  const valeD = (v) => v.k === 'p' ? '🎟️ ' + passN(v) : '+' + v.n + (v.k === 's' ? ' ⭐' : ' 🪙');
  const valeUnit = (v) => v.k === 'p' ? t('v_unitP') : v.k === 's' ? (v.n === 1 ? t('v_unitS1') : t('v_unitS')) : t('v_unitE');
  const valeArt = (v, st, extra) => window.Vales ? Vales.art({ k: v.k, n: v.n, st }, Object.assign({ unit: valeUnit(v), title: t('v_title2'), name: passN(v), icon: v.pi || '' }, extra || {})) : `<b>${esc(valeD(v))}</b>`;
  const todayKey = () => { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
  const shortDate = (key) => { const p = String(key).split('-'); return Number(p[2]) + ' ' + (lang === 'va' && /^[aeiou]/.test(t('months')[Number(p[1]) - 1]) ? "d'" : 'de ') + t('months')[Number(p[1]) - 1]; };
  /** Canjes de este móvil que el Mac aún no ha recogido */
  function valeSent() {
    const noticed = (data && data.notices || []).map(n => n.n), old = Date.now() - 30 * 864e5;
    const done = (data && data.vales || []).filter(v => v.st !== 'pend').map(v => v.id);
    const list = LS.get(VKEY(), []).filter(p => p && p.v && noticed.indexOf(p.n) < 0 && done.indexOf(p.v) < 0 && new Date(p.at).getTime() > old);
    LS.set(VKEY(), list);
    return list;
  }
  function valeState(v) { return v.st === 'pend' && v.exp && todayKey() > v.exp ? 'exp' : v.st; }
  function valeCard(v, sentIds) {
    const st = valeState(v), way = st === 'pend' && sentIds.indexOf(v.id) >= 0;
    const art = valeArt(v, way ? 'pend' : st, { stamp: st === 'done' ? t('v_stampDone') : t('v_stampExp') });
    let foot = '';
    if (st === 'pend' && way) foot = `<span class="chip pend">⏳ ${esc(t('v_way'))}</span>`;
    else if (st === 'pend' && data.shopUrl) foot = `<button class="buy vbtn" data-vale="${esc(v.id)}">🎫 ${esc(t('v_redeem'))}</button>`;
    else if (st === 'pend') foot = `<span class="chip">${esc(t('v_class'))}</span>`;
    else if (st === 'done') foot = `<span class="chip own">✓ ${esc(v.from === 'casa' ? t('v_doneHome') : t('v_done'))}</span>`;
    const meta = st === 'pend' && v.exp ? t('v_exp', { date: shortDate(v.exp) }) : st === 'exp' && v.exp ? t('v_expired', { date: shortDate(v.exp) }) : '';
    return `<div class="vcard st-${esc(st)}${way ? ' way' : ''}"><div class="vart">${art}</div>${v.why ? `<p class="vwhy">💬 ${esc(v.why)}</p>` : ''}${meta ? `<p class="vmeta">${esc(meta)}</p>` : ''}<div class="vfoot">${foot}</div></div>`;
  }
  function valesHtml() {
    const list = (data.vales || []).filter(v => v.st !== 'void');
    const sentIds = valeSent().map(p => p.v);
    const live = list.filter(v => valeState(v) === 'pend'), old = list.filter(v => valeState(v) !== 'pend');
    return `<section class="box valesbox"><h2>🎫 ${esc(t('v_title'))}</h2>${list.length ? `<p class="soft">${esc(data.shopUrl ? t('v_hint') : t('v_hintClass'))}</p>` : `<p class="soft">${esc(t('v_none'))}</p>`}
      ${live.length ? `<div class="vgrid">${live.map(v => valeCard(v, sentIds)).join('')}</div>` : ''}
      ${old.length ? `<details class="vold"${live.length ? '' : ' open'}><summary>${esc(t('v_old'))} (${old.length})</summary><div class="vgrid">${old.slice(0, 12).map(v => valeCard(v, sentIds)).join('')}</div></details>` : ''}</section>`;
  }
  function askVale(key, v) {
    const ov = document.createElement('div');
    ov.className = 'news-ov';
    const art = valeArt(v, 'pend');
    ov.innerHTML = `<div class="news buyq valeq"><div class="vart">${art}</div><h2>${esc(t('v_q'))}</h2>${v.why ? `<p class="vwhy">💬 ${esc(v.why)}</p>` : ''}<p class="soft">${esc(t(v.k === 'p' ? 'v_qNoteP' : 'v_qNote'))}</p>
      <div class="row"><button class="btn ghost" data-a="no">${esc(t('cancel'))}</button><button class="btn" data-a="yes">${esc(t('v_yes'))}</button></div><p class="buymsg"></p></div>`;
    document.body.appendChild(ov);
    ov.querySelector('[data-a=no]').onclick = () => ov.remove();
    const yes = ov.querySelector('[data-a=yes]'), msg = ov.querySelector('.buymsg');
    yes.onclick = async () => {
      yes.disabled = true; msg.textContent = t('sending');
      const m = { n: rid(), v: v.id, at: new Date().toISOString() };
      try {
        const c = await encryptMsg(key, m);
        const r = await fetch(String(data.shopUrl).replace(/\/+$/, '') + '/p', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ f: fid, c }) });
        if (!r.ok) throw new Error('http ' + r.status);
        const list = LS.get(VKEY(), []); list.push({ n: m.n, v: v.id, at: m.at }); LS.set(VKEY(), list);
        const box = ov.querySelector('.news');
        box.classList.add('done');
        box.innerHTML = `<div class="vart pop">${art}</div><h2>🎉 ${esc(t('v_sent'))}</h2><p class="soft">${esc(t('v_sentNote'))}</p><button class="btn" data-a="ok">${esc(t('newsOk'))}</button>${reduceMotion() ? '' : confetti()}`;
        const y = window.scrollY; render(key); window.scrollTo(0, y);
        box.querySelector('[data-a=ok]').onclick = () => ov.remove();
        setTimeout(() => { if (ov.parentNode) ov.remove(); }, 7000);
      } catch (e) { yes.disabled = false; msg.textContent = t('sendErr'); }
    };
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
  // ---------- Monstrópolis ----------
  function worldHtml(m) {
    const w = data.world; if (!w || !window.Planets) return '';
    const p = Planets.get(w.cur), sys = Planets.SYSTEMS[p.sys], summit = w.done.some(x => x.n === Planets.COUNT);
    const dots = Planets.PLANETS.map(q => `<i class="${q.n < w.cur || summit ? 'done' : q.n === w.cur ? 'now' : ''}"></i>`).join('');
    return `<section class="box world"><h2>🪐 ${esc(t('w_title'))}</h2>
      <div class="wcard"><div class="wpl">${Planets.planetSvg(w.cur, 150)}<div class="wmon">${Monsters.render(m, { phase: data.phase === 'huevo' ? 'cria' : data.phase, size: 92, shadow: false })}</div></div>
        <div class="wtx"><small style="background:${sys.color}">${esc(Planets.tx(sys.sun, lang))} · ${esc(Planets.tx(sys, lang))}</small>
          <b class="wn">${esc(t('w_planet', { n: w.cur, t: Planets.COUNT }))} · ${esc(p.emoji)} ${esc(Planets.tx(p.name, lang))}</b>
          <span class="wlab">${esc(t('w_now'))}:</span><b class="wh">${esc(Planets.tx(p.habit, lang))}</b>
          <span class="wst">${esc(summit ? t('w_summit') : (t('w_stages')[w.stage] || ''))}</span></div></div>
      <div class="wpath">${dots}</div><p class="soft">${esc(t('w_done', { n: w.done.length }))}</p>
      <div class="whelp"><b>🏠 ${esc(t('w_help'))}</b><p>${esc(Planets.tx(p.home, lang))}</p></div>
      <p class="soft small">${esc(t('w_what'))}</p></section>`;
  }
  const HKEY = () => 'mn-home-' + fid;
  function homeHtml() {
    if (!data.shopUrl || !data.home || !window.Planets) return '';
    const sent = LS.get(HKEY(), null);
    const done = data.home.done || (sent && sent.w === data.home.week);
    if (done) return `<section class="box home done"><h2>🏠 ${esc(t('h_title'))}</h2><p class="soft">${esc(data.home.done ? t('h_sent') : t('h_sentWait'))}</p></section>`;
    return `<section class="box home"><h2>🏠 ${esc(t('h_title'))}</h2><p class="soft">${esc(t('h_text'))}</p>
      ${Planets.HOME.map(hh => `<div class="hq" data-h="${hh.id}"><span class="hqt">${esc(hh.emoji)} ${esc(Planets.tx(hh, lang))}</span><span class="hqb">${['si', 'aveces', 'no'].map(v => `<button data-v="${v}">${esc(t('h_' + v))}</button>`).join('')}</span></div>`).join('')}
      <button class="btn" id="homeSend">${esc(t('h_send'))}</button><p class="hmsg"></p></section>`;
  }
  function bindHome(key) {
    const box = $app.querySelector('.box.home:not(.done)'); if (!box) return;
    const ans = {};
    box.querySelectorAll('.hq').forEach(q => q.querySelectorAll('[data-v]').forEach(b => b.onclick = () => { ans[q.dataset.h] = b.dataset.v; q.querySelectorAll('[data-v]').forEach(x => x.classList.toggle('on', x === b)); }));
    const btn = box.querySelector('#homeSend'), msg = box.querySelector('.hmsg');
    btn.onclick = async () => {
      if (Object.keys(ans).length < Planets.HOME.length) { msg.textContent = t('h_missing'); return; }
      btn.disabled = true; msg.textContent = t('sending');
      try {
        const c = await encryptMsg(key, { n: rid(), h: ans, w: data.home.week, at: new Date().toISOString() });
        const r = await fetch(String(data.shopUrl).replace(/\/+$/, '') + '/p', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ f: fid, c }) });
        if (!r.ok) throw new Error('http ' + r.status);
        LS.set(HKEY(), { w: data.home.week, at: new Date().toISOString() });
        box.classList.add('done');
        box.innerHTML = `<h2>🏠 ${esc(t('h_title'))}</h2><p class="soft">🎉 ${esc(t('h_sentWait'))}</p>${confetti()}`;
      } catch (e) { btn.disabled = false; msg.textContent = t('sendErr'); }
    };
  }

  // Estrellas: concepto y cuánto suma o resta, agrupado por días con el total de cada día
  let starsAll = false;
  function starsHtml() {
    const ev = (data.history || []).map(h => {
      const counts = h.c !== false;
      const v = h.v > 0 ? '+' + h.v + ' ⭐' : h.v < 0 ? (counts ? '−' + Math.abs(h.v) + ' ⭐' : t('h_noted')) : '0';
      return { at: h.at, icon: h.k === 'bonus' ? '🌟' : h.k === 'adjust' ? '🌱' : h.k === 'vale' ? '🎫' : h.icon, text: h.k === 'bonus' ? t('h_bonus') : h.k === 'adjust' ? t('h_adjust') : h.k === 'vale' ? t('h_vale') : nm(h), note: h.note || '', v, n: counts ? h.v : 0, cls: h.v < 0 ? (counts ? 'neg' : 'note') : 'pos' };
    }).sort((a, b) => b.at.localeCompare(a.at));
    if (!ev.length) return `<p class="soft">${esc(t('histNone'))}</p>`;
    const shown = starsAll ? ev : ev.slice(0, 30);
    const sums = {}; ev.forEach(e => { const d = dayLabel(e.at); sums[d] = (sums[d] || 0) + e.n; });
    let out = '', last = '', anyNote = false;
    shown.forEach(e => {
      const dl = dayLabel(e.at);
      if (dl !== last) { const n = sums[dl]; out += `<li class="hday"><span>${esc(dl)}</span><span class="dsum ${n < 0 ? 'neg' : ''}">${esc(t('h_day', { n: (n > 0 ? '+' : n < 0 ? '−' : '') + Math.abs(n) }))}</span></li>`; last = dl; }
      if (e.cls === 'note') anyNote = true;
      out += `<li class="${e.cls}"><span class="emo">${esc(e.icon || '⭐')}</span><span class="ht">${esc(e.text)}${e.note ? `<small class="hnote">${esc(e.note)}</small>` : ''}</span><b>${esc(e.v)}</b></li>`;
    });
    return `<ul class="hist stars">${out}</ul>${anyNote ? `<p class="soft small">${esc(t('h_notedHint'))}</p>` : ''}${!starsAll && ev.length > shown.length ? `<button class="more" id="starsMore">${esc(t('histMore'))}</button>` : ''}`;
  }
  function historyHtml() {
    const ev = [].concat((data.buys || []).map(b => b.k === 'coins' && b.vale
        ? { at: b.at, icon: '🎫', text: t('h_vale') + (b.note ? ' · ' + b.note : ''), v: '+' + b.d + ' 🪙', cls: 'pos' }
        : b.k === 'coins'
        ? { at: b.at, icon: '🪙', text: t('h_coins') + (b.note ? ' · ' + b.note : ''), v: (b.d > 0 ? '+' : '−') + Math.abs(b.d) + ' 🪙', cls: b.d > 0 ? 'pos' : 'neg' }
        : { at: b.at, icon: b.icon || '🔧', text: (b.mystery ? t('h_mystery', { item: nm(b) }) : t('h_buy') + ': ' + nm(b)) + (b.from === 'casa' ? ' (' + t('h_home') + ')' : ''), v: b.cost ? '−' + b.cost + ' 🪙' : '🎁', cls: 'buy' }))
      .concat((data.shopUrl ? pendingOrders() : []).map(p => ({ at: p.at, icon: p.icon || (p.kind === 'cosmetic' ? '✨' : '🎟️'), text: t('h_buy') + ': ' + nm(p) + ' (' + t('h_home') + ')', v: '−' + p.price + ' 🪙', cls: 'buy' })))
      .sort((a, b) => b.at.localeCompare(a.at));
    if (!ev.length) return `<p class="soft">${esc(t('coinsNone'))}</p>`;
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
    const egg = window.Cosmetics && Cosmetics.EGG_SLOTS && Cosmetics.EGG_SLOTS.indexOf(it.slot) >= 0;
    return `<div class="mini-card${cls}"><div class="mwrap">${Monsters.render(m, { phase: egg ? 'huevo' : data.phase === 'huevo' ? 'cria' : data.phase, size: 78, shadow: false })}</div></div>`;
  }
  function stateChip(it) {
    const s = it.state;
    if (s === 'ok') return `<span class="chip ok">${esc(t('st_ok'))}</span>`;
    if (s === 'coins') return `<span class="chip">${esc(t('st_coins', { n: it.missing }))}</span>`;
    if (s === 'egg') return `<span class="chip">${esc(t('st_egg'))}</span>`;
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
    m.equip = wearEquip(d.monster || {}); // 2.4: lo conseguido no se pone solo; lo que se cambia en el Armario se ve al momento
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
    const shopGrid = (list, g) => { const all = expanded[g] || list.length <= CAP + 1; const shown = all ? list : list.slice(0, CAP); return `<div class="items">${shown.map(it => `<div class="item st-${esc(it.state)} r-${it.kind === 'cosmetic' && window.Cosmetics && Cosmetics.rarity ? Cosmetics.rarity(it) : 'common'}${d.shopUrl && it.id && !isPend(it) && it.state === 'ok' && it.price <= avail ? ' can' : ''}" data-item="${esc(it.id || '')}" role="button" tabindex="0"><div class="art">${itemArt(it)}</div><div class="iname">${esc(nm(it))}</div><div class="price">🪙 ${Number(it.price) || 0}</div>${isPend(it) || (d.shopUrl && it.state === 'ok' && it.price <= avail) ? '' : stateChip(it)}${buyBtn(it)}</div>`).join('')}</div>${all ? '' : `<button class="more" data-more="${g}">${esc(t('seeAll', { n: list.length }))}</button>`}`; };
    const homeV = pendAll.filter(p => p.kind === 'privilege').map(p => ({ icon: p.icon, es: p.es, va: p.va, status: 'pending', home: true }));
    const pend = homeV.concat((d.vouchers || []).filter(v => v.status === 'pending')), done = (d.vouchers || []).filter(v => v.status !== 'pending');
    const howExtra = [];
    if (d.bonus && d.bonus.on) howExtra.push(t('howBonus', { time: d.bonus.time, n: d.bonus.points }));
    if (m.drawing) howExtra.push(t('howDraw'));

    const firstPaint = shownKey !== key; shownKey = key;
    $app.innerHTML = header() + `<main class="kid${firstPaint ? ' enter' : ''}">
      <section class="hero"><div class="mini-card big${cardCls}"><div class="mwrap">${Monsters.render(m, { phase: d.phase, size: 250 })}</div>${name ? `<div class="name">${name}</div>` : ''}</div>
        <h1>${name ? esc(t('monsterOf', { name: d.name })) : esc(t('yourMonster'))}</h1><span class="phase-chip">${esc(t('phases')[d.phase] || '')}</span></section>
      ${d.notice ? `<section class="box notice"><h2>📌 ${esc(t('noticeTitle'))}</h2><p>${esc(nm(d.notice))}</p></section>` : ''}
      ${on('stats') ? `<section class="stats"><div class="stat"><b>⭐ ${Number(d.stars) || 0}</b><span>${esc(t('stars'))}</span></div><div class="stat coin"><b>🪙 <span class="cnt" data-to="${avail}">${avail}</span></b><span>${esc(t('coins'))}${reserved ? `<br><small>🏠 ${esc(t('spentHome', { n: reserved }))}</small>` : ''}</span></div></section>` : ''}
      ${on('next') ? `<section class="box next">${d.next ? `<div class="bar"><i style="width:${Math.round((d.next.progress || 0) * 100)}%"></i></div><p>${esc(t('toNext', { n: d.next.missing, phase: t('phases')[d.next.phase] || '' }))}</p>` : `<p class="max">🏆 ${esc(t('maxPhase'))}</p>`}</section>` : ''}
      ${on('path') ? `<section class="box"><h2>${esc(t('path'))}</h2><div class="track-scroll"><div class="track">${P.map((p, i) => `<div class="tr-step ${i < ci ? 'done' : ''} ${i === ci ? 'now' : ''} ${i > ci ? 'todo' : ''}">${Monsters.render(m, { phase: p, size: 64, shadow: false })}<small>${esc(t('phases')[p])}</small></div>`).join('')}</div></div></section>` : ''}
      ${on('week') && d.week ? `<section class="box week"><h2>${esc(t('week'))}</h2>${d.week && (d.week.stars || d.week.bonusDays) ? `<p><b>${esc(t('weekStars', { n: d.week.stars || 0 }))}</b>${d.week.bonusDays ? ` · 🌟 ${esc(t('bonusDays', { n: d.week.bonusDays }))}` : ''}</p>` : `<p class="soft">${esc(t('weekNone'))}</p>`}</section>` : ''}
      ${on('world') ? worldHtml(m) : ''}${on('home') ? homeHtml() : ''}
      ${on('starsHist') ? `<section class="box starsbox"><h2>⭐ ${esc(t('histStars'))}</h2><p class="soft">${esc(t('histStarsSub'))}</p>${starsHtml()}</section>` : ''}
      ${d.goal ? `<section class="box goal"><h2>🐷 ${esc(t('saving'))}</h2><p><b>${esc(nm(d.goal))}</b> · 🪙 ${Math.min(d.coins, d.goal.price)}/${d.goal.price}</p><div class="bar"><i style="width:${Math.min(100, Math.round(100 * (d.coins || 0) / Math.max(1, d.goal.price)))}%"></i></div></section>` : ''}
      ${pushHtml()}
      ${on('vales') && (d.vales || []).some(v => v.st !== 'void') ? valesHtml() : ''}
      ${on('wardrobe') ? wardrobeHtml(m.equip, pendAll) : ''}
      ${on('shop') ? `<section class="box shop"><h2>🔧 ${esc(t('shop'))}</h2><p class="soft">${esc(d.shopUrl ? t('shopNoteHome') : t('shopNote'))}</p>${pendList.length ? `<p class="homenote">${esc(t('homeNote'))}</p>` : ''}
        <div class="filters"><button data-f="can" class="${filter === 'can' ? 'on' : ''}">${esc(t('filterCan'))}</button><button data-f="all" class="${filter === 'all' ? 'on' : ''}">${esc(t('filterAll'))}</button></div>
        ${cos.length ? `<h3>${esc(t('cos'))}</h3>${shopGrid(cos, 'cos')}` : ''}${priv.length ? `<h3>${esc(t('priv'))}</h3>${shopGrid(priv, 'priv')}` : ''}
        ${d.mystery ? `<div class="mystery">🎁 <b>${esc(t('mystery'))}</b> <span class="soft">(${esc(t('mysteryNote'))})</span> · 🪙 ${d.mystery} ${(d.coins || 0) >= d.mystery ? `<span class="chip ok">${esc(t('st_ok'))}</span>` : ''}</div>` : ''}</section>` : ''}
      ${on('vouchers') ? `<section class="box"><h2>🎟️ ${esc(t('vouchers'))}</h2>${pend.length + done.length ? `<ul class="vlist">${pend.concat(done).map(v => `<li><span class="emo">${esc(v.icon || '🎟️')}</span><span class="vn">${esc(nm(v))}${v.home ? ' 🏠' : ''}</span><span class="chip ${v.status === 'pending' ? 'pend' : 'own'}">${esc(v.status === 'pending' ? t('vPending') : t('vRedeemed'))}</span></li>`).join('')}</ul>` : `<p class="soft">${esc(t('noVouchers'))}</p>`}</section>` : ''}
      ${on('coinsHist') ? `<section class="box"><h2>🪙 ${esc(t('histCoins'))}</h2>${historyHtml()}</section>` : ''}
      ${on('goals') && (d.goals || []).length ? `<section class="box"><h2>👥 ${esc(t('goals'))}</h2>${d.goals.map(g => `<div class="goalrow"><div><span class="emo">${esc(g.icon || '🎉')}</span> <b>${esc(nm(g))}</b> ${g.status === 'done' || g.total >= g.target ? `<span class="chip ok">${esc(t('goalDone'))}</span>` : ''}</div><div class="bar"><i style="width:${Math.min(100, Math.round(100 * g.total / Math.max(1, g.target)))}%"></i></div><small>🪙 ${g.total}/${g.target}${g.mine ? ' · ' + esc(t('goalMine', { n: g.mine })) : ''}</small></div>`).join('')}</section>` : ''}
      ${on('how') ? `<section class="box how"><details><summary>${esc(t('how'))}</summary><ul>${t('howText').concat(howExtra).map(x => `<li>${esc(x)}</li>`).join('')}</ul></details></section>` : ''}
      <footer class="foot"><p>${esc(t('updated', { date: fmtDate(d.updated) }))}${ago(d.updated)}</p><p class="soft">🔒 ${esc(t('privacy'))}${d.track ? ' ' + esc(t('trackNote')) : ''}</p>
        <button class="btn ${saved ? 'ghost' : ''}" id="save">${esc(saved ? t('forget') : t('remember'))}</button>${saved ? `<p class="soft">✓ ${esc(t('remembered'))}</p>` : ''}<p class="soft small">${esc(t('homeHint'))}</p><p class="soft small ver">v${VV}</p></footer>
    </main>`;
    bindHeader();
    $app.querySelectorAll('.filters [data-f]').forEach(b => b.onclick = () => { filter = b.dataset.f; expanded = {}; render(key); });
    $app.querySelectorAll('[data-more]').forEach(b => b.onclick = () => { expanded[b.dataset.more] = true; const y = window.scrollY; render(key); window.scrollTo(0, y); });
    $app.querySelectorAll('[data-buy]').forEach(b => b.onclick = (e) => { e.stopPropagation(); const it = (d.items || []).find(x => x.id === b.dataset.buy); if (it) askBuy(key, it); });
    // Tocar en cualquier parte del artículo: si se puede, se compra; si no, se explica por qué
    $app.querySelectorAll('[data-item]').forEach(el => el.onclick = () => {
      const it = (d.items || []).find(x => x.id === el.dataset.item); if (!it) return;
      if (d.shopUrl && !isPend(it) && it.state === 'ok' && it.price <= avail) return askBuy(key, it);
      let why;
      if (isPend(it)) why = it.kind === 'cosmetic' ? t('mine') : t('bought');
      else if (!d.shopUrl) why = t('whyNoHome');
      else if (it.state === 'ok' || it.state === 'coins') why = t('st_coins', { n: Math.max(1, it.price - avail) });
      else why = (stateChip(it).replace(/<[^>]+>/g, '').trim()) || t('whyNo');
      infoSheet(it, why);
    });
    // Las monedas bajan contando cuando se compra algo
    const cnt = $app.querySelector('.stat.coin .cnt');
    if (cnt) { const to = Number(cnt.dataset.to) || 0; if (shownCoins !== null && shownCoins !== to && !reduceMotion()) countTo(cnt, shownCoins, to); shownCoins = to; }
    bindHome(key);
    bindPush(key);
    $app.querySelectorAll('[data-vale]').forEach(b => b.onclick = () => { const v = (d.vales || []).find(x => x.id === b.dataset.vale); if (v && d.shopUrl) askVale(key, v); });
    $app.querySelectorAll('[data-wr]').forEach(b => b.onclick = () => { const p = b.dataset.wr.split('|'); const cur = wearEquip(d.monster || {}); wearSet(key, p[0], cur[p[0]] === p[1] ? null : p[1]); });
    const sm = document.getElementById('starsMore'); if (sm) sm.onclick = () => { starsAll = true; const y = window.scrollY; render(key); window.scrollTo(0, y); };
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
