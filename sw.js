/* Monstruitos 2.5 — Avisos en el móvil de la familia.
   Este pequeño programa del navegador solo recibe el aviso que manda el Mac del tutor y lo enseña.
   No guarda datos ni copia la página: la ficha se sigue abriendo cifrada como siempre. */
self.addEventListener('install', function () { self.skipWaiting(); });
self.addEventListener('activate', function (e) { e.waitUntil(self.clients.claim()); });

self.addEventListener('push', function (e) {
  var d = {};
  try { d = e.data ? e.data.json() : {}; } catch (err) { d = {}; }
  var title = d.t || 'Monstruitos';
  var opts = {
    body: d.b || 'Hay novedades · Hi ha novetats',
    icon: 'v/icon-192.png',
    badge: 'v/icon-192.png',
    tag: d.g || 'monstruitos',
    renotify: true,
    data: { f: d.f || '' }
  };
  var jobs = [self.registration.showNotification(title, opts)];
  if (self.navigator && self.navigator.setAppBadge) jobs.push(self.navigator.setAppBadge(1).catch(function () {}));
  e.waitUntil(Promise.all(jobs));
});

self.addEventListener('notificationclick', function (e) {
  e.notification.close();
  var f = (e.notification.data && e.notification.data.f) || '';
  var url = new URL('./' + (f ? '#f=' + f : ''), self.registration.scope).href;
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (list) {
    for (var i = 0; i < list.length; i++) {
      var c = list[i];
      if (c.url.indexOf(self.registration.scope) === 0 && 'focus' in c) {
        c.postMessage({ open: f });
        return c.focus();
      }
    }
    return self.clients.openWindow(url);
  }));
});
