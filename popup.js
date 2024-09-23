document.addEventListener('DOMContentLoaded', function() {
  const lightBtn = document.getElementById('lightBtn');
  const darkBtn = document.getElementById('darkBtn');
  const colorPicker = document.getElementById('colorPicker');
  const body = document.body;
  const modeIcon = document.getElementById('modeIcon');

  function setDarkMode(enabled) {
    if (enabled) {
      body.classList.remove('light-mode');
      body.classList.add('dark-mode');
      lightBtn.classList.remove('active');
      darkBtn.classList.add('active');
      modeIcon.innerHTML = `
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      `;
    } else {
      body.classList.remove('dark-mode');
      body.classList.add('light-mode');
      lightBtn.classList.add('active');
      darkBtn.classList.remove('active');
      modeIcon.innerHTML = `
        <path d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M12 2V4M12 20V22M4 12H2M6.31412 6.31412L4.8999 4.8999M17.6859 6.31412L19.1001 4.8999M6.31412 17.69L4.8999 19.1042M17.6859 17.69L19.1001 19.1042M22 12H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      `;
    }
  }

  // Load saved settings
  chrome.storage.sync.get(['darkModeEnabled', 'darkColor'], function(result) {
    setDarkMode(result.darkModeEnabled || false);
    colorPicker.value = result.darkColor || '#1a1a1a';
  });

  // Toggle dark mode
  lightBtn.addEventListener('click', function() {
    chrome.storage.sync.set({darkModeEnabled: false}, function() {
      setDarkMode(false);
      applyDarkMode(false);
    });
  });

  darkBtn.addEventListener('click', function() {
    chrome.storage.sync.set({darkModeEnabled: true}, function() {
      setDarkMode(true);
      applyDarkMode(true);
    });
  });

  // Update dark color
  colorPicker.addEventListener('change', function() {
    const color = colorPicker.value;
    chrome.storage.sync.set({darkColor: color}, function() {
      applyDarkMode(body.classList.contains('dark-mode'));
    });
  });

  function applyDarkMode(enabled) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: 'toggleDarkMode',
        enabled: enabled,
        color: colorPicker.value
      });
    });
  }
});