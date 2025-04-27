// اسکریپت برای حذف سرویس ورکرهای قدیمی
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(function(registrations) {
    for (let registration of registrations) {
      registration.unregister();
      console.log('سرویس ورکر حذف شد:', registration);
    }
  }).catch(function(error) {
    console.error('خطا در حذف سرویس ورکر:', error);
  });
  
  // پاک کردن کش‌های سرویس ورکر
  if (window.caches) {
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    }).then(function() {
      console.log('تمام کش‌های سرویس ورکر پاک شدند');
    }).catch(function(error) {
      console.error('خطا در پاک کردن کش‌ها:', error);
    });
  }
} 