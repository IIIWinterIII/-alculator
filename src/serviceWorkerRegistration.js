// Этот код регистрирует сервис-воркер, но его не устанавливает автоматически.
// Для этого нам нужно перейти к файлу serviceWorker.js

export function register(config) {
    if ('serviceWorker' in navigator) {
      // Регистрируем сервис-воркер, используя файл serviceWorker.js
      navigator.serviceWorker.register('/serviceWorker.js').then(registration => {
        console.log('Service Worker registered with scope:', registration.scope);
      }).catch(error => {
        console.error('Service Worker registration failed:', error);
      });
    }
  }
  