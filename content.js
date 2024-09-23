function applyDarkMode(enabled, color) {
    if (enabled) {
      document.documentElement.style.setProperty('--dark-mode-bg', color);
      document.body.classList.add('universal-dark-mode');
    } else {
      document.body.classList.remove('universal-dark-mode');
    }
  }
  
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'toggleDarkMode') {
      applyDarkMode(request.enabled, request.color);
    }
  });
  
  // Check initial state
  chrome.storage.sync.get(['darkModeEnabled', 'darkColor'], function(result) {
    if (result.darkModeEnabled) {
      applyDarkMode(true, result.darkColor || '#1a1a1a');
    }
  });