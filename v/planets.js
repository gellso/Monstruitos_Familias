/* Monstrópolis 2.0 — la galaxia de los hábitos.
   45 planetas, uno por hábito, en una sola ruta del más básico (1) al más complejo (45).
   Base pedagógica: informe «Hábitos del primer ciclo de Primaria» (LOMLOE, Decreto 106/2022 CV,
   desarrollo evolutivo 6-8 años, CASEL, formación de hábitos). Se usa en el Mac, en el iPad
   (como imagen) y en la página de las familias. */
(function () {
  'use strict';

  const SYSTEMS = {
    s1: { color: '#4fc79a', es: 'Me cuido', va: 'Em cuide', sun: { es: 'Sol Burbuja', va: 'Sol Bombolla' } },
    s2: { color: '#ff9f55', es: 'Mis cosas', va: 'Les meues coses', sun: { es: 'Sol Mochila', va: 'Sol Motxilla' } },
    s3: { color: '#a98bf0', es: 'Rutinas de clase', va: 'Rutines de classe', sun: { es: 'Sol Campana', va: 'Sol Campana' } },
    s4: { color: '#4fb0ee', es: 'Escucho y hablo', va: 'Escolte i parle', sun: { es: 'Sol Orejita', va: 'Sol Orelleta' } },
    s5: { color: '#f286b6', es: 'Mis emociones', va: 'Les meues emocions', sun: { es: 'Sol Corazón', va: 'Sol Cor' } },
    s6: { color: '#f27466', es: 'Convivimos', va: 'Convivim', sun: { es: 'Sol Abrazo', va: 'Sol Abraçada' } },
    s7: { color: '#f2bf2f', es: 'Trabajo y aprendo', va: 'Treballe i aprenc', sun: { es: 'Sol Lápiz', va: 'Sol Llapis' } },
    s8: { color: '#6f86f2', es: 'Leo', va: 'Llig', sun: { es: 'Sol Libro', va: 'Sol Llibre' } },
    s9: { color: '#86c443', es: 'Me protejo y cuido el mundo', va: 'Em protegisc i cuide el món', sun: { es: 'Sol Tierra', va: 'Sol Terra' } }
  };

  // ring: 0 Infantil · 1 1º (1.er trimestre) · 2 resto de 1º · 3 2º · 4 final de 2º
  // home: el hábito se ve sobre todo en casa (la familia lo confirma cada semana)
  const P = [
    [1, 's1', 0, '🛁', 'Jabón', 'Sabó', 'Higiene básica', 'Higiene bàsica',
      'Va al baño solo, se lava las manos con jabón y se suena la nariz sin ayuda.', 'Va al bany a soles, es llava les mans amb sabó i es moca sense ajuda.',
      ['Va y vuelve del baño sin ayuda', 'Se lava y seca las manos sin que se lo recuerden', 'Se suena y tira el pañuelo'], ['Va i torna del bany sense ajuda', 'Es llava i eixuga les mans sense recordatori', 'Es moca i tira el mocador'],
      'Antes de comer y al volver del baño, que se lave las manos solo: vosotros solo miráis.', 'Abans de menjar i en tornar del bany, que es llave les mans a soles: vosaltres només mireu.'],
    [2, 's1', 0, '👕', 'Botón', 'Botó', 'Me visto y me abrigo solo', 'Em vestisc i m’abrigue a soles',
      'Se pone y se quita el abrigo y el babi, abrocha cremalleras y botones y cuelga la ropa.', 'Es posa i es lleva l’abric i el baby, corda cremalleres i botons i penja la roba.',
      ['Se pone y abrocha el abrigo solo', 'Lo cuelga en su percha', 'Practica la lazada'], ['Es posa i es corda l’abric a soles', 'El penja en la seua percha', 'Practica el nuc de les sabates'],
      'Por la mañana dejadle tiempo para vestirse solo, aunque tarde un poco más.', 'Pel matí deixeu-li temps per a vestir-se a soles, encara que tarde una mica més.'],
    [3, 's1', 0, '🥪', 'Bocadillo', 'Entrepà', 'Almuerzo solo y agua', 'Esmorze a soles i bec aigua',
      'Abre su táper y su botella, almuerza en su sitio, bebe agua y recoge lo que usa.', 'Obri el seu tàper i la botella, esmorza al seu lloc, beu aigua i recull el que usa.',
      ['Abre y cierra el táper y la botella', 'Almuerza sentado en su sitio', 'Tira los restos donde toca'], ['Obri i tanca el tàper i la botella', 'Esmorza assegut al seu lloc', 'Tira les restes on toca'],
      'Elegid juntos un táper y una botella que pueda abrir solo y preparad el almuerzo con él.', 'Trieu junts un tàper i una botella que puga obrir a soles i prepareu l’esmorzar amb ell.'],
    [4, 's4', 0, '👋', 'Gracias', 'Gràcies', 'Saludo y palabras amables', 'Salude i dic paraules amables',
      'Saluda al llegar, se despide y pide las cosas por favor y da las gracias.', 'Saluda en arribar, s’acomiada, demana les coses per favor i dona les gràcies.',
      ['Devuelve el saludo en la puerta', 'Dice «por favor» y «gracias» solo', 'Habla al volumen adecuado'], ['Torna la salutació a la porta', 'Diu «per favor» i «gràcies» a soles', 'Parla al volum adequat'],
      'Saludad y dad las gracias delante de él: lo que más copia es lo que ve.', 'Saludeu i doneu les gràcies davant d’ell: el que més copia és el que veu.'],
    [5, 's4', 1, '🔔', 'Silbato', 'Xiulet', 'Respondo a la señal', 'Responc al senyal',
      'Cuando suena la señal de la clase, para, deja lo que tiene en las manos y mira al maestro.', 'Quan sona el senyal de la classe, para, deixa el que té a les mans i mira el mestre.',
      ['Para y mira en unos 5 segundos', 'Guarda silencio hasta la instrucción', 'Responde igual con los especialistas'], ['Para i mira en uns 5 segons', 'Calla fins a la instrucció', 'Respon igual amb els especialistes'],
      'Jugad en casa a «¡estatua!»: a vuestra señal, se queda quieto y os mira.', 'Jugueu a casa a «estàtua!»: al vostre senyal, es queda quiet i us mira.'],
    [6, 's3', 1, '🏫', 'Buenos días', 'Bon dia', 'Rutina de entrada', 'Rutina d’entrada',
      'Al llegar cuelga mochila y abrigo, deja sus cosas en su sitio y empieza la actividad de bienvenida.', 'En arribar penja la motxilla i l’abric, deixa les coses al seu lloc i comença l’activitat de benvinguda.',
      ['Cuelga y coloca sus cosas solo', 'Saca el material del panel', 'Está sentado al sonar la señal'], ['Penja i col·loca les coses a soles', 'Trau el material del panell', 'Està assegut quan sona el senyal'],
      'Llegad con unos minutos de margen: entrar sin prisa le ayuda a hacer la rutina solo.', 'Arribeu amb uns minuts de marge: entrar sense pressa l’ajuda a fer la rutina a soles.'],
    [7, 's3', 1, '🚂', 'Trenecito', 'Trenet', 'Fila y desplazamientos', 'Fila i desplaçaments',
      'A la señal se pone en la fila y va andando, sin empujar y en silencio.', 'Al senyal es posa en la fila i va caminant, sense empényer i en silenci.',
      ['Ocupa su lugar a la señal', 'Va andando y sin empujar', 'No se separa del grupo'], ['Ocupa el seu lloc al senyal', 'Va caminant i sense empényer', 'No se separa del grup'],
      'Por la calle, que vaya a vuestro lado sin correr: es la misma fila del cole.', 'Pel carrer, que vaja al vostre costat sense córrer: és la mateixa fila de l’escola.'],
    [8, 's6', 1, '🎲', 'Turno', 'Torn', 'Espero mi turno y respeto el juego', 'Espere el meu torn i respecte el joc',
      'Espera su turno en la fuente, el baño y los juegos, y acepta las reglas aunque pierda.', 'Espera el torn a la font, al bany i als jocs, i accepta les regles encara que perda.',
      ['No se cuela en las esperas', 'Espera su jugada', 'Acepta perder sin abandonar'], ['No es cola en les esperes', 'Espera la seua jugada', 'Accepta perdre sense abandonar'],
      'Jugad a un juego de mesa y no le dejéis ganar siempre: aprender a perder también se entrena.', 'Jugueu a un joc de taula i no el deixeu guanyar sempre: aprendre a perdre també s’entrena.'],
    [9, 's4', 1, '✋', 'Manita', 'Maneta', 'Levanto la mano', 'Alce la mà',
      'En la asamblea y en las explicaciones pide la palabra y espera a que se la den.', 'En l’assemblea i en les explicacions demana la paraula i espera que li la donen.',
      ['Levanta la mano y espera', 'No interrumpe a quien habla', 'Respeta el objeto de palabra'], ['Alça la mà i espera', 'No interromp qui parla', 'Respecta l’objecte de paraula'],
      'En la mesa, practicad hablar por turnos: el que tiene la palabra termina antes de que hable otro.', 'A taula, practiqueu parlar per torns: qui té la paraula acaba abans que parle un altre.'],
    [10, 's4', 1, '📡', 'Antena', 'Antena', 'Escucho y cumplo', 'Escolte i complisc',
      'Cumple instrucciones de uno o dos pasos y, si no las entiende, pide que se las repitan.', 'Compleix instruccions d’un o dos passos i, si no les entén, demana que les hi repetisquen.',
      ['Cumple a la primera 1-2 pasos', 'Pregunta «¿me lo repites?»', 'Explica qué hay que hacer'], ['Compleix a la primera 1-2 passos', 'Pregunta «m’ho repeteixes?»', 'Explica què cal fer'],
      'Dadle encargos de dos pasos («coge el pan y ponlo en la mesa») y que os los repita antes.', 'Doneu-li encàrrecs de dos passos («agafa el pa i posa’l a taula») i que us els repetisca abans.'],
    [11, 's2', 1, '✏️', 'Estuche', 'Estoig', 'Saco, recojo y cuido el material', 'Trac, recull i cuide el material',
      'Guarda su material al acabar, devuelve el material común y no lo estropea.', 'Guarda el material en acabar, torna el material comú i no el fa malbé.',
      ['Recoge lo suyo antes de seguir', 'Devuelve el material común', 'Deja la mesa despejada'], ['Recull el seu abans de seguir', 'Torna el material comú', 'Deixa la taula neta'],
      'Que cada cosa de su cuarto tenga su caja: al terminar de jugar, todo vuelve a su sitio.', 'Que cada cosa de la seua habitació tinga la seua caixa: en acabar de jugar, tot torna al seu lloc.'],
    [12, 's5', 1, '🌈', 'Arcoíris', 'Arc de Sant Martí', 'Digo cómo me siento', 'Dic com em sent',
      'Nombra su emoción (alegría, tristeza, enfado, miedo) y dice qué la ha causado.', 'Anomena la seua emoció (alegria, tristesa, enuig, por) i diu què l’ha causada.',
      ['Elige su emoción en el panel', 'Completa «estoy… porque…»', 'Usa la palabra y no el golpe'], ['Tria la seua emoció al panell', 'Completa «estic… perquè…»', 'Usa la paraula i no el colp'],
      'Cada noche, preguntad «¿cómo te has sentido hoy y por qué?» y contad también cómo os sentís vosotros.', 'Cada nit, pregunteu «com t’has sentit hui i per què?» i conteu també com us sentiu vosaltres.'],
    [13, 's5', 1, '🔦', 'Faro', 'Far', 'Pido ayuda a un adulto', 'Demane ajuda a un adult',
      'Sabe a qué adultos del colegio puede acudir y lo hace cuando se hace daño, está triste o tiene un problema.', 'Sap a quins adults de l’escola pot acudir i ho fa quan es fa mal, està trist o té un problema.',
      ['Nombra a sus adultos de confianza', 'Acude a ellos cuando lo necesita', 'Dice «¿me ayudas con…?»'], ['Anomena els seus adults de confiança', 'Hi acudix quan ho necessita', 'Diu «m’ajudes amb…?»'],
      'Repasad juntos a qué adultos puede acudir en el cole y en casa, y celebrad cuando pide ayuda.', 'Repasseu junts a quins adults pot acudir a l’escola i a casa, i celebreu quan demana ajuda.'],
    [14, 's9', 1, '🚨', 'Simulacro', 'Simulacre', 'Normas de evacuación', 'Normes d’evacuació',
      'En el simulacro espera la orden, sale sin correr ni coger cosas y se queda en el punto de reunión.', 'En el simulacre espera l’ordre, ix sense córrer ni agafar coses i es queda al punt de reunió.',
      ['Sale sin correr ni empujar', 'No vuelve a por sus cosas', 'Se queda en el punto de reunión'], ['Ix sense córrer ni empényer', 'No torna a per les seues coses', 'Es queda al punt de reunió'],
      'Decidid en familia un punto de encuentro si os perdéis en un sitio con mucha gente.', 'Decidiu en família un punt de trobada si us perdeu en un lloc amb molta gent.'],
    [15, 's9', 1, '🚦', 'Semáforo', 'Semàfor', 'Peatón seguro', 'Vianant segur',
      'En la calle va de la mano o por dentro de la acera, se para en el bordillo y mira antes de cruzar acompañado.', 'Al carrer va de la mà o per dins de la vorera, es para al vorell i mira abans de creuar acompanyat.',
      ['Va por el lado interior', 'Se para en el bordillo', 'Dice «izquierda, derecha, izquierda»'], ['Va pel costat interior', 'Es para al vorell', 'Diu «esquerra, dreta, esquerra»'],
      'De camino al cole, que sea él quien diga cuándo se puede cruzar (siempre con vosotros).', 'De camí a l’escola, que siga ell qui diga quan es pot creuar (sempre amb vosaltres).'],
    [16, 's7', 2, '🎯', 'Foco', 'Focus', 'Trabajo sin distraer', 'Treballe sense distraure',
      'En el trabajo individual se queda en su sitio, habla bajito y empieza en cuanto recibe la instrucción.', 'En el treball individual es queda al seu lloc, parla baixet i comença tan bon punt rep la instrucció.',
      ['Se queda sentado', 'Usa voz baja', 'Empieza sin segunda llamada'], ['Es queda assegut', 'Usa veu baixa', 'Comença sense segona crida'],
      'Para las tareas de casa, un sitio sin tele ni móvil cerca ayuda a concentrarse.', 'Per a les tasques de casa, un lloc sense tele ni mòbil a prop ajuda a concentrar-se.'],
    [17, 's7', 2, '🏁', 'Meta', 'Meta', 'Termino la tarea a tiempo', 'Acabe la tasca a temps',
      'Acaba la tarea en el tiempo marcado y sabe qué hacer cuando termina.', 'Acaba la tasca en el temps marcat i sap què fer quan acaba.',
      ['Termina con el reloj visual', 'Al acabar no molesta', 'Termina antes del recreo'], ['Acaba amb el rellotge visual', 'En acabar no molesta', 'Acaba abans del pati'],
      'Usad un reloj de arena o un temporizador para los ratitos de tarea: ver el tiempo ayuda mucho.', 'Useu un rellotge d’arena o un temporitzador per a les estones de tasca: veure el temps ajuda molt.'],
    [18, 's4', 2, '👣', 'Escalera', 'Escala', 'Varios pasos con apoyo', 'Diversos passos amb suport',
      'Hace secuencias de tres o más pasos mirando un panel o pictogramas y diciéndose los pasos.', 'Fa seqüències de tres o més passos mirant un panell o pictogrames i dient-se els passos.',
      ['Completa 3 pasos mirando el panel', 'Vuelve al panel si se pierde', 'Se dice «primero…, después…»'], ['Completa 3 passos mirant el panell', 'Torna al panell si es perd', 'Es diu «primer…, després…»'],
      'Haced juntos una lista con dibujos para la rutina de la noche (pijama, dientes, cuento) y que la siga solo.', 'Feu junts una llista amb dibuixos per a la rutina de la nit (pijama, dents, conte) i que la seguisca a soles.'],
    [19, 's3', 2, '⏰', 'Reloj', 'Rellotge', 'Cambio de actividad', 'Canvi d’activitat',
      'A la señal de cambio recoge, prepara lo siguiente y acepta dejar algo que le gusta.', 'Al senyal de canvi recull, prepara el següent i accepta deixar una cosa que li agrada.',
      ['Cambia dentro del tiempo marcado', 'Deja lo que le gusta sin protestar mucho', 'Acepta los cambios imprevistos'], ['Canvia dins del temps marcat', 'Deixa el que li agrada sense protestar molt', 'Accepta els canvis imprevistos'],
      'Avisad antes de acabar algo («en cinco minutos, a la ducha»): los cambios anunciados cuestan menos.', 'Aviseu abans d’acabar una cosa («d’ací a cinc minuts, a la dutxa»): els canvis anunciats costen menys.'],
    [20, 's5', 2, '🍃', 'Calma', 'Calma', 'Me calmo con mi estrategia', 'Em calme amb la meua estratègia',
      'Ante el enfado usa su estrategia (respirar, contar, ir al rincón de la calma) y luego vuelve a la actividad.', 'Davant l’enuig usa la seua estratègia (respirar, comptar, anar al racó de la calma) i després torna a l’activitat.',
      ['Practica la estrategia tranquilo', 'La usa en el momento', 'Vuelve a la actividad'], ['Practica l’estratègia tranquil', 'La usa en el moment', 'Torna a l’activitat'],
      'Practicad juntos la «respiración del globo» cuando estéis tranquilos, para que salga sola cuando haga falta.', 'Practiqueu junts la «respiració del globus» quan estigueu tranquils, perquè isca a soles quan faça falta.'],
    [21, 's6', 2, '🍕', 'Mitad', 'Meitat', 'Comparto de forma justa', 'Compartisc de manera justa',
      'Comparte el material común y, cuando reparte, lo hace a partes iguales, también con quien no es su amigo.', 'Comparteix el material comú i, quan reparteix, ho fa a parts iguals, també amb qui no és amic seu.',
      ['No acapara el material', 'Reparte a partes iguales', 'Respeta los turnos de uso'], ['No acapara el material', 'Reparteix a parts iguals', 'Respecta els torns d’ús'],
      'Que sea él quien reparta la merienda o el postre entre todos: repartir justo se aprende repartiendo.', 'Que siga ell qui repartisca el berenar o les postres entre tots: repartir just s’aprén repartint.'],
    [22, 's6', 2, '🤗', 'Tirita', 'Tireta', 'Consuelo al otro', 'Console l’altre',
      'Se da cuenta de cómo se siente un compañero y le consuela o le ofrece ayuda.', 'S’adona de com se sent un company i el consola o li oferix ajuda.',
      ['Nombra la emoción del otro', 'Consuela o se ofrece a ayudar', 'Da la bienvenida al que llega'], ['Anomena l’emoció de l’altre', 'Consola o s’oferix a ajudar', 'Dona la benvinguda a qui arriba'],
      'Al leer un cuento, preguntad «¿cómo crees que se siente?» y «¿qué podrías hacer para ayudarle?».', 'En llegir un conte, pregunteu «com creus que se sent?» i «què podries fer per a ajudar-lo?».'],
    [23, 's6', 2, '👫', 'Corro', 'Rotgle', 'Juego con todos', 'Jugue amb tots',
      'No deja a nadie fuera del juego ni del trabajo e invita a quien está solo.', 'No deixa ningú fora del joc ni del treball i convida qui està a soles.',
      ['Acepta a quien pide jugar', 'Invita a quien está solo', 'Trabaja con cualquier pareja'], ['Accepta qui demana jugar', 'Convida qui està a soles', 'Treballa amb qualsevol parella'],
      'En el parque, animadle a invitar a jugar a algún niño que esté solo.', 'Al parc, animeu-lo a convidar a jugar algun xiquet que estiga a soles.'],
    [24, 's8', 2, '📖', 'Cuento', 'Conte', 'Leo cada día', 'Llig cada dia',
      'Aprovecha la lectura de clase y lee cada día en casa unos 15 minutos con un adulto.', 'Aprofita la lectura de classe i llig cada dia a casa uns 15 minuts amb un adult.',
      ['Está con su libro en la lectura de clase', 'Lee en casa unos 15 minutos', 'Lee en voz alta por turnos'], ['Està amb el llibre en la lectura de classe', 'Llig a casa uns 15 minuts', 'Llig en veu alta per torns'],
      'Leed juntos 15 minutos al día: si se atasca, esperad un poco, dadle una pista y felicitadle.', 'Llegiu junts 15 minuts al dia: si s’encalla, espereu una mica, doneu-li una pista i feliciteu-lo.', true],
    [25, 's2', 2, '📬', 'Cartero', 'Carter', 'Llevo y traigo avisos', 'Porte i torne avisos',
      'Sabe qué se lleva a casa, entrega los avisos y devuelve a tiempo lo que tiene que volver.', 'Sap què s’endú a casa, entrega els avisos i torna a temps el que ha de tornar.',
      ['Dice qué lleva hoy a casa', 'Devuelve las circulares firmadas', 'Trae el libro de préstamo a tiempo'], ['Diu què s’endú hui a casa', 'Torna les circulars signades', 'Porta el llibre de préstec a temps'],
      'Al llegar a casa, preguntadle «¿traes algún aviso?» y que sea él quien os lo dé.', 'En arribar a casa, pregunteu-li «portes algun avís?» i que siga ell qui us el done.'],
    [26, 's3', 2, '🔑', 'Encargado', 'Encarregat', 'Cumplo mi encargo', 'Complisc el meu encàrrec',
      'Recuerda su encargo semanal de clase y lo cumple en su momento.', 'Recorda el seu encàrrec setmanal de classe i el compleix en el seu moment.',
      ['Dice qué encargo tiene', 'Lo cumple sin recordatorio', 'Hace encargos de varios pasos (2º)'], ['Diu quin encàrrec té', 'El compleix sense recordatori', 'Fa encàrrecs de diversos passos (2n)'],
      'Dadle un pequeño encargo fijo en casa (poner las servilletas, dar de comer a la mascota).', 'Doneu-li un xicotet encàrrec fix a casa (posar els tovallons, donar de menjar a la mascota).'],
    [27, 's9', 2, '♻️', 'Reciclo', 'Recicle', 'Cuido el entorno', 'Cuide l’entorn',
      'Separa los residuos, no malgasta agua, luz ni papel y deja limpios el aula y el patio.', 'Separa els residus, no malbarata aigua, llum ni paper i deixa nets l’aula i el pati.',
      ['Separa papel, envases y restos', 'Cierra el grifo y apaga la luz', 'Deja limpio donde almuerza'], ['Separa paper, envasos i restes', 'Tanca l’aixeta i apaga el llum', 'Deixa net on esmorza'],
      'Que sea el responsable de separar el reciclaje de casa una vez por semana.', 'Que siga el responsable de separar el reciclatge de casa una vegada per setmana.'],
    [28, 's1', 2, '⚽', 'Saltarín', 'Saltaire', 'Me muevo y cuido el cuerpo', 'Em moc i cuide el cos',
      'Calienta y vuelve a la calma en EF, bebe agua al hacer ejercicio, juega activo y se sienta bien.', 'Escalfa i torna a la calma en EF, beu aigua en fer exercici, juga actiu i s’asseu bé.',
      ['Calienta y vuelve a la calma', 'Bebe agua en la actividad', 'Se sienta con la espalda apoyada'], ['Escalfa i torna a la calma', 'Beu aigua en l’activitat', 'S’asseu amb l’esquena recolzada'],
      'Buscad una hora al día de juego en movimiento: parque, bici, pelota o ir andando.', 'Busqueu una hora al dia de joc en moviment: parc, bici, pilota o anar caminant.'],
    [29, 's1', 2, '😴', 'Almohada', 'Coixí', 'Duermo, desayuno y me cepillo', 'Dorm, esmorze i em raspalle',
      'Duerme unas 10 horas, llega desayunado y se cepilla los dientes con el repaso de un adulto.', 'Dorm unes 10 hores, arriba esmorzat i es raspalla les dents amb el repàs d’un adult.',
      ['Se acuesta a la hora pactada', 'Llega desayunado', 'Se cepilla con repaso del adulto'], ['Se’n va al llit a l’hora pactada', 'Arriba esmorzat', 'Es raspalla amb repàs de l’adult'],
      'Hora fija para acostarse (unas 10 horas de sueño), desayuno en casa y repaso del cepillado hasta los 8 años.', 'Hora fixa per a anar al llit (unes 10 hores de son), esmorzar a casa i repàs del raspallat fins als 8 anys.', true],
    [30, 's7', 3, '🔧', 'Pruebo', 'Prove', 'Intento antes de pedir ayuda', 'Ho intente abans de demanar ajuda',
      'Ante una duda prueba primero (releer, mirar el ejemplo) y, si pide ayuda, dice qué ha intentado.', 'Davant d’un dubte prova primer (rellegir, mirar l’exemple) i, si demana ajuda, diu què ha intentat.',
      ['Prueba una estrategia antes', 'Explica qué ha probado', 'Pide algo concreto'], ['Prova una estratègia abans', 'Explica què ha provat', 'Demana una cosa concreta'],
      'Cuando os pida ayuda, preguntad primero «¿qué has probado tú?».', 'Quan us demane ajuda, pregunteu primer «què has provat tu?».'],
    [31, 's7', 3, '💪', 'Valiente', 'Valent', 'No me rindo', 'No em rendisc',
      'Ante un error o una tarea difícil vuelve a intentarlo y se anima con sus propias palabras.', 'Davant d’un error o una tasca difícil ho torna a intentar i s’anima amb les seues paraules.',
      ['Lo intenta otra vez tras equivocarse', 'Dice «todavía no me sale»', 'Termina tareas que le cuestan'], ['Ho intenta una altra vegada', 'Diu «encara no em surt»', 'Acaba tasques que li costen'],
      'Felicitad el esfuerzo y no solo el resultado: «te ha costado y no te has rendido».', 'Feliciteu l’esforç i no sols el resultat: «t’ha costat i no t’has rendit».'],
    [32, 's4', 3, '👂', 'Eco', 'Eco', 'Escucho de verdad', 'Escolte de veritat',
      'En la conversación mira a quien habla, responde a lo que ha dicho y no cambia de tema.', 'En la conversa mira qui parla, respon al que ha dit i no canvia de tema.',
      ['Mira al que habla', 'Responde a lo que ha dicho el otro', 'Repite con sus palabras una idea'], ['Mira qui parla', 'Respon al que ha dit l’altre', 'Repetix amb les seues paraules una idea'],
      'En la cena, que os pregunte algo sobre lo que habéis contado vosotros de vuestro día.', 'En el sopar, que us pregunte alguna cosa sobre el que heu contat del vostre dia.'],
    [33, 's5', 3, '💬', 'Palabra', 'Paraula', 'Digo lo que necesito con calma', 'Dic el que necessite amb calma',
      'Expresa lo que necesita, lo que no le gusta o un «no» con frases en primera persona y voz tranquila.', 'Expressa el que necessita, el que no li agrada o un «no» amb frases en primera persona i veu tranquil·la.',
      ['Dice «yo quiero…» sin gritar', 'Dice «no» sin agredir', 'Pide las cosas con claridad'], ['Diu «jo vull…» sense cridar', 'Diu «no» sense agredir', 'Demana les coses amb claredat'],
      'Cuando se enfade, ayudadle a decirlo: «estoy enfadado porque…» en lugar de gritar.', 'Quan s’enfade, ajudeu-lo a dir-ho: «estic enfadat perquè…» en lloc de cridar.'],
    [34, 's6', 3, '🌉', 'Puente', 'Pont', 'Pido perdón y reparo', 'Demane perdó i repare',
      'Reconoce lo que ha hecho, pide perdón diciendo por qué y propone cómo arreglarlo.', 'Reconeix el que ha fet, demana perdó dient per què i proposa com arreglar-ho.',
      ['Cuenta lo que ha pasado', 'Pide perdón diciendo por qué', 'Repara (recoger, ayudar, devolver)'], ['Conta el que ha passat', 'Demana perdó dient per què', 'Repara (arreplegar, ajudar, tornar)'],
      'Cuando os equivoquéis vosotros, pedid perdón delante de él y arreglad lo que haga falta.', 'Quan us equivoqueu vosaltres, demaneu perdó davant d’ell i arregleu el que calga.'],
    [35, 's6', 3, '👥', 'Equipo', 'Equip', 'Trabajo en equipo con un rol', 'Treballe en equip amb un rol',
      'En un grupo cumple su papel, aporta ideas, escucha las de los demás y acepta lo que se decide.', 'En un grup compleix el seu paper, aporta idees, escolta les dels altres i accepta el que es decidix.',
      ['Cumple su rol', 'Aporta y escucha ideas', 'Acepta la decisión del grupo'], ['Compleix el seu rol', 'Aporta i escolta idees', 'Accepta la decisió del grup'],
      'Preparad algo juntos (una receta, un puzle) repartiendo papeles: tú lees, yo mezclo.', 'Prepareu alguna cosa junts (una recepta, un trencaclosques) repartint papers: tu llegeixes, jo barreje.'],
    [36, 's2', 3, '✨', 'Pulcro', 'Polit', 'Presento mi trabajo con cuidado', 'Presente el treball amb cura',
      'Pone nombre y fecha y mantiene el cuaderno limpio y ordenado.', 'Posa nom i data i manté el quadern net i ordenat.',
      ['Pone nombre y fecha solo', 'Respeta márgenes y orden', 'Entrega sin rasgar ni tachones'], ['Posa nom i data a soles', 'Respecta marges i ordre', 'Entrega sense estripar ni ratllades'],
      'Al revisar sus deberes, fijaos primero en lo que está bien presentado y decídselo.', 'En revisar els deures, fixeu-vos primer en el que està ben presentat i digueu-l’hi.'],
    [37, 's2', 3, '📒', 'Agenda', 'Agenda', 'Organizo agenda y mochila', 'Organitze l’agenda i la motxilla',
      'Encuentra la página del día, apunta los deberes, enseña la agenda en casa y prepara la mochila según el horario.', 'Troba la pàgina del dia, apunta els deures, ensenya l’agenda a casa i prepara la motxilla segons l’horari.',
      ['Encuentra la página del día', 'Trae la agenda revisada', 'Prepara la mochila según el horario'], ['Troba la pàgina del dia', 'Porta l’agenda revisada', 'Prepara la motxilla segons l’horari'],
      'Que prepare la mochila la noche anterior mirando el horario; vosotros solo la revisáis al final.', 'Que prepare la motxilla la nit anterior mirant l’horari; vosaltres només la reviseu al final.'],
    [38, 's7', 3, '📝', 'Deberes', 'Deures', 'Rutina de deberes', 'Rutina de deures',
      'Hace los deberes en el mismo lugar y a la misma hora, con el material preparado y sin pantallas.', 'Fa els deures al mateix lloc i a la mateixa hora, amb el material preparat i sense pantalles.',
      ['Entrega los deberes a tiempo', 'Tiene lugar y hora fijos', 'Prepara el material antes'], ['Entrega els deures a temps', 'Té lloc i hora fixos', 'Prepara el material abans'],
      'Mismo sitio y misma hora (por ejemplo, después de merendar). Acompañad, pero no los hagáis por él.', 'Mateix lloc i mateixa hora (per exemple, després de berenar). Acompanyeu, però no els feu per ell.', true],
    [39, 's8', 3, '📚', 'Biblioteca', 'Biblioteca', 'Elijo y comento mis libros', 'Trie i comente els meus llibres',
      'Elige libros según sus gustos, los cuida, los devuelve a tiempo y cuenta lo que ha leído.', 'Tria llibres segons els seus gustos, els cuida, els torna a temps i conta el que ha llegit.',
      ['Elige un libro y dice por qué', 'Lo devuelve a tiempo y bien', 'Cuenta qué le ha gustado'], ['Tria un llibre i diu per què', 'El torna a temps i bé', 'Conta què li ha agradat'],
      'Id juntos a la biblioteca del barrio y dejad que elija él; luego que os lo cuente.', 'Aneu junts a la biblioteca del barri i deixeu que trie ell; després que us ho conte.'],
    [40, 's1', 3, '📺', 'Pantallita', 'Pantalleta', 'Límites de pantalla', 'Límits de pantalla',
      'Usa el dispositivo solo para la tarea y lo deja al aviso; en casa respeta el tiempo pactado y no usa pantallas en el dormitorio.', 'Usa el dispositiu només per a la tasca i el deixa a l’avís; a casa respecta el temps pactat i no usa pantalles al dormitori.',
      ['Deja el dispositivo al aviso', 'Respeta el tiempo pactado en casa', 'Avisa a un adulto si algo le incomoda'], ['Deixa el dispositiu a l’avís', 'Respecta el temps pactat a casa', 'Avisa un adult si alguna cosa l’incomoda'],
      'Pactad antes cuánto tiempo y cuándo; nada de pantallas en el dormitorio ni antes de dormir.', 'Pacteu abans quant de temps i quan; res de pantalles al dormitori ni abans de dormir.', true],
    [41, 's9', 3, '🛡️', 'Escudo', 'Escut', 'Me protejo', 'Em protegisc',
      'Conoce a sus adultos de confianza, sabe decir «no», alejarse y pedir ayuda, y sabe que siempre puede contarlo.', 'Coneix els seus adults de confiança, sap dir «no», allunyar-se i demanar ajuda, i sap que sempre ho pot contar.',
      ['Nombra adultos de confianza', 'Dice «no» con firmeza y se aleja', 'Sabe que contarlo nunca es malo'], ['Anomena adults de confiança', 'Diu «no» amb fermesa i s’allunya', 'Sap que contar-ho mai és roín'],
      'Repetidle que puede contaros cualquier cosa y que nunca se meterá en un lío por contarla.', 'Repetiu-li que us pot contar qualsevol cosa i que mai es ficarà en un embolic per contar-la.'],
    [42, 's6', 4, '🕊️', 'Paz', 'Pau', 'Resuelvo conflictos', 'Resolc conflictes',
      'Ante un conflicto pequeño sigue el guion de la clase (parar, decir qué pasa, escuchar, proponer) y avisa al adulto si hace falta.', 'Davant d’un conflicte xicotet seguix el guió de la classe (parar, dir què passa, escoltar, proposar) i avisa l’adult si cal.',
      ['Resuelve sin adulto un conflicto menor', 'Usa turnos o moneda para desempatar', 'Sabe cuándo avisar al adulto'], ['Resol sense adult un conflicte menor', 'Usa torns o moneda per a desempatar', 'Sap quan avisar l’adult'],
      'Si discute con un hermano o amigo, antes de intervenir preguntad: «¿qué podéis hacer para arreglarlo?».', 'Si discutix amb un germà o amic, abans d’intervindre pregunteu: «què podeu fer per a arreglar-ho?».'],
    [43, 's7', 4, '🔍', 'Lupa', 'Lupa', 'Planifico y reviso', 'Planifique i revise',
      'Antes de empezar dice qué va a hacer; al terminar lo comprueba con una lista y se pone pequeñas metas.', 'Abans de començar diu què farà; en acabar ho comprova amb una llista i es posa xicotetes metes.',
      ['Dice el plan antes de empezar', 'Revisa con la lista de comprobación', 'Se pone una meta semanal'], ['Diu el pla abans de començar', 'Revisa amb la llista de comprovació', 'Es posa una meta setmanal'],
      'Al terminar los deberes, que los revise él primero con tres preguntas: ¿nombre?, ¿todo hecho?, ¿se entiende?', 'En acabar els deures, que els revise ell primer amb tres preguntes: nom?, tot fet?, s’entén?'],
    [44, 's6', 4, '💎', 'Confianza', 'Confiança', 'Normas sin vigilancia', 'Normes sense vigilància',
      'Ayuda a hacer las normas, sabe para qué sirven, las cumple aunque no le vean y las recuerda a otros con respeto.', 'Ajuda a fer les normes, sap per a què servixen, les compleix encara que no el vegen i les recorda als altres amb respecte.',
      ['Propone o vota normas', 'Explica para qué sirve una norma', 'La cumple con otros adultos'], ['Proposa o vota normes', 'Explica per a què servix una norma', 'La compleix amb altres adults'],
      'Pactad juntos dos o tres normas de casa y dejadle que os las recuerde también a vosotros.', 'Pacteu junts dues o tres normes de casa i deixeu que us les recorde també a vosaltres.'],
    [45, 's7', 4, '🌠', 'Estrella Polar', 'Estel Polar', 'Me anticipo', 'M’anticipe',
      'Consulta el horario, prepara lo que va a necesitar antes de que se lo pidan y mantiene solo sus hábitos.', 'Consulta l’horari, prepara el que necessitarà abans que li ho demanen i manté a soles els seus hàbits.',
      ['Prepara el material sin que se lo pidan', 'Avisa antes de que le haga falta', 'Mantiene sus hábitos sin recordatorio'], ['Prepara el material sense que li ho demanen', 'Avisa abans que li faça falta', 'Manté els hàbits sense recordatori'],
      'Dadle la oportunidad de organizarse solo y celebradlo: ¡ha llegado a la cumbre de Monstrópolis!', 'Doneu-li l’oportunitat d’organitzar-se a soles i celebreu-ho: ha arribat al cim de Monstròpolis!']
  ];
  const PLANETS = P.map(r => ({
    n: r[0], sys: r[1], ring: r[2], emoji: r[3],
    name: { es: r[4], va: r[5] }, habit: { es: r[6], va: r[7] }, desc: { es: r[8], va: r[9] },
    ind: { es: r[10], va: r[11] }, home: { es: r[12], va: r[13] }, homeOnly: !!r[14]
  }));
  const COUNT = PLANETS.length;
  const get = (n) => PLANETS[Math.max(1, Math.min(COUNT, n | 0)) - 1];
  const tx = (o, lang) => o ? (o[lang] || o.es) : '';

  // Hábitos de casa que las familias confirman cada semana (y a qué planeta pertenecen)
  const HOME = [
    { id: 'lectura', n: 24, emoji: '📖', es: 'Ha leído un ratito casi todos los días', va: 'Ha llegit una estona quasi tots els dies' },
    { id: 'deberes', n: 38, emoji: '📝', es: 'Ha hecho los deberes en su sitio y a su hora', va: 'Ha fet els deures al seu lloc i a la seua hora' },
    { id: 'sueno', n: 29, emoji: '😴', es: 'Ha dormido bien, ha desayunado y se ha cepillado', va: 'Ha dormit bé, ha esmorzat i s’ha raspallat' },
    { id: 'pantallas', n: 40, emoji: '📺', es: 'Ha respetado el tiempo de pantallas pactado', va: 'Ha respectat el temps de pantalles pactat' }
  ];

  // Escala de dominio (se calcula con las observaciones del maestro)
  const STAGES = [
    { id: 0, es: 'Sin explorar', va: 'Sense explorar' },
    { id: 1, es: 'Despegue', va: 'Enlairament' },
    { id: 2, es: 'En órbita', va: 'En òrbita' },
    { id: 3, es: 'Aterrizaje', va: 'Aterratge' },
    { id: 4, es: 'Conquistado', va: 'Conquistat' }
  ];

  // ---------- Dibujo ----------
  function shade(hex, amt) {
    let c = hex.replace('#', ''); if (c.length === 3) c = c.split('').map(x => x + x).join('');
    const n = parseInt(c, 16);
    const f = v => Math.max(0, Math.min(255, Math.round(v + (amt > 0 ? (255 - v) * amt : v * amt))));
    return '#' + [f(n >> 16), f((n >> 8) & 255), f(n & 255)].map(v => v.toString(16).padStart(2, '0')).join('');
  }
  let uid = 0;
  /** Un planeta en SVG (viewBox 0 0 100 100). state: 'done' | 'cur' | 'lock' */
  function planetSvg(n, size, state) {
    const p = get(n), sys = SYSTEMS[p.sys];
    const id = 'pl' + (++uid);
    const idx = PLANETS.filter(x => x.sys === p.sys).indexOf(p);
    const base = shade(sys.color, (idx % 3) * 0.12 - 0.06);
    const dark = shade(base, -0.28), light = shade(base, 0.45);
    const kind = n % 5, ring = n % 3 === 0, moon = n % 4 === 1;
    const lock = state === 'lock';
    let deco = '';
    if (kind === 0) deco = `<path d="M18 44 Q50 36 82 44 L82 52 Q50 44 18 52Z" fill="${dark}" opacity=".35"/><path d="M20 62 Q50 56 80 62 L78 68 Q50 62 22 68Z" fill="${light}" opacity=".5"/>`;
    else if (kind === 1) deco = `<circle cx="38" cy="40" r="7" fill="${dark}" opacity=".35"/><circle cx="60" cy="62" r="9" fill="${dark}" opacity=".3"/><circle cx="64" cy="36" r="4" fill="${dark}" opacity=".3"/>`;
    else if (kind === 2) deco = `<circle cx="36" cy="58" r="6" fill="${light}" opacity=".6"/><circle cx="58" cy="44" r="5" fill="${light}" opacity=".6"/><circle cx="66" cy="66" r="4" fill="${light}" opacity=".6"/><circle cx="44" cy="34" r="3" fill="${light}" opacity=".6"/>`;
    else if (kind === 3) deco = `<path d="M24 50 Q40 34 56 46 T80 44" fill="none" stroke="${light}" stroke-width="5" stroke-linecap="round" opacity=".55"/><path d="M26 64 Q44 52 62 62" fill="none" stroke="${dark}" stroke-width="4" stroke-linecap="round" opacity=".3"/>`;
    else deco = `<path d="M30 30 Q42 40 34 54 Q28 66 40 74" fill="none" stroke="${dark}" stroke-width="3" opacity=".3"/><circle cx="62" cy="56" r="8" fill="${light}" opacity=".45"/>`;
    const special = n === COUNT;
    const body = special
      ? `<path d="M50 10 L60 38 L90 40 L66 58 L74 88 L50 70 L26 88 L34 58 L10 40 L40 38Z" fill="#ffd23f" stroke="#2d2440" stroke-width="3.5" stroke-linejoin="round"/><path d="M50 22 L56 40 L46 40Z" fill="#fff6c2" opacity=".8"/>`
      : `<circle cx="50" cy="52" r="32" fill="url(#${id}g)" stroke="#2d2440" stroke-width="3"/>
         <g clip-path="url(#${id}c)">${deco}<circle cx="64" cy="66" r="34" fill="#2d2440" opacity=".12"/></g>
         <ellipse cx="38" cy="38" rx="9" ry="5" fill="#fff" opacity=".55" transform="rotate(-30 38 38)"/>`;
    const ringBack = ring && !special ? `<path d="M10 58 Q50 34 90 46" fill="none" stroke="${light}" stroke-width="5" stroke-linecap="round" opacity=".9"/>` : '';
    const ringFront = ring && !special ? `<path d="M90 46 Q96 56 50 68 Q6 76 10 58" fill="none" stroke="${shade(base, 0.25)}" stroke-width="5" stroke-linecap="round"/><path d="M90 46 Q96 56 50 68 Q6 76 10 58" fill="none" stroke="#2d2440" stroke-width="1.5" opacity=".5"/>` : '';
    const moonG = moon && !special ? `<circle cx="84" cy="22" r="7" fill="#efe9ff" stroke="#2d2440" stroke-width="2.2"/><circle cx="82" cy="20" r="2" fill="#c9bfe6"/>` : '';
    const flag = state === 'done' ? `<g><path d="M66 20 V6" stroke="#2d2440" stroke-width="2.5" stroke-linecap="round"/><path d="M66 6 L80 10 L66 14Z" fill="#2fcf95" stroke="#2d2440" stroke-width="1.8" stroke-linejoin="round"/></g>` : '';
    return `<svg viewBox="0 0 100 100" width="${size || 100}" height="${size || 100}" class="planet${lock ? ' lock' : ''}" aria-hidden="true">
      <defs><radialGradient id="${id}g" cx="38%" cy="34%" r="75%"><stop offset="0" stop-color="${light}"/><stop offset=".55" stop-color="${base}"/><stop offset="1" stop-color="${dark}"/></radialGradient><clipPath id="${id}c"><circle cx="50" cy="52" r="30.5"/></clipPath></defs>
      ${lock ? '<g opacity=".38" style="filter:grayscale(1)">' : '<g>'}${ringBack}${body}${ringFront}${moonG}</g>${flag}</svg>`;
  }

  /** Posiciones de los 45 planetas en una espiral que entra hacia el centro (viewBox W×H).
      Se reparten a la misma distancia a lo largo del camino para que no se amontonen. */
  function layout(W, H) {
    const cx = W / 2, cy = H / 2 + Math.min(W, H) * 0.02, R = Math.min(W, H) * 0.42, sx = Math.min(1.5, W / H);
    const turns = 2.25, r0 = 0.2, N = 2000, pts = [];
    let len = 0;
    for (let i = 0; i <= N; i++) {
      const t = i / N, r = R * (1 - t * (1 - r0)), a = -Math.PI / 2 + t * Math.PI * 2 * turns;
      const p = { x: cx + Math.cos(a) * r * sx, y: cy + Math.sin(a) * r };
      if (i) len += Math.hypot(p.x - pts[i - 1].x, p.y - pts[i - 1].y);
      p.l = len; pts.push(p);
    }
    const out = []; let j = 0;
    for (let k = 0; k < COUNT; k++) {
      const target = k === COUNT - 1 ? len : len * k / (COUNT - 1) * 0.97;
      while (j < N && pts[j].l < target) j++;
      out.push({ n: k + 1, x: k === COUNT - 1 ? cx : pts[j].x, y: k === COUNT - 1 ? cy : pts[j].y });
    }
    return out;
  }
  /** Fondo de la galaxia: estrellas y el camino en espiral */
  function galaxyBg(W, H) {
    const pos = layout(W, H);
    let s = 7; const R = () => (s = (s * 9301 + 49297) % 233280) / 233280;
    const stars = Array.from({ length: 140 }, () => `<circle cx="${(R() * W).toFixed(0)}" cy="${(R() * H).toFixed(0)}" r="${(0.6 + R() * 1.8).toFixed(1)}" fill="#fff" opacity="${(0.25 + R() * 0.6).toFixed(2)}"/>`).join('');
    const path = 'M' + pos.map(p => p.x.toFixed(1) + ' ' + p.y.toFixed(1)).join(' L');
    return `${stars}<path d="${path}" fill="none" stroke="#fff" stroke-width="4" stroke-dasharray="2 12" stroke-linecap="round" opacity=".35"/>`;
  }

  window.Planets = { SYSTEMS, PLANETS, COUNT, HOME, STAGES, get, tx, planetSvg, layout, galaxyBg, shade };
})();
