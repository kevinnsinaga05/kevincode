(function(){
  if (!('serviceWorker' in navigator)) return;
  window.addEventListener('load', function(){
    navigator.serviceWorker.register('/sw.js')
      .then(function(reg){ console.log('ServiceWorker registered', reg.scope); })
      .catch(function(err){
        console.error('ServiceWorker registration failed', err);
        window.alert('Mode offline tidak dapat diaktifkan. Aplikasi tetap bisa dipakai, tetapi cache PWA belum tersedia.');
      });
  });
})();