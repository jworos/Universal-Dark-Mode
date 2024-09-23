document.addEventListener('DOMContentLoaded', function() {
  const darkModeToggle = document.getElementById('darkModeToggle');
  const colorPicker = document.getElementById('colorPicker');
  const body = document.body;
  const toggleBg = document.querySelector('.toggle-bg');
  const dot = document.querySelector('.dot');

  // Load saved settings
  chrome.storage.sync.get(['darkModeEnabled', 'darkColor'], function(result) {
    darkModeToggle.checked = result.darkModeEnabled || false;
    colorPicker.value = result.darkColor || '#1a1a1a';
    updateToggleUI();
    updateBodyClass();
  });

  // Toggle dark mode
  darkModeToggle.addEventListener('change', function() {
    const enabled = darkModeToggle.checked;
    chrome.storage.sync.set({darkModeEnabled: enabled}, function() {
      updateToggleUI();
      updateBodyClass();
      applyDarkMode(enabled);
    });
  });

  // Update dark color
  colorPicker.addEventListener('change', function() {
    const color = colorPicker.value;
    chrome.storage.sync.set({darkColor: color}, function() {
      applyDarkMode(darkModeToggle.checked);
    });
  });

  function updateToggleUI() {
    if (darkModeToggle.checked) {
      dot.classList.add('translate-x-4');
      toggleBg.classList.remove('bg-gray-400');
      toggleBg.classList.add('bg-blue-600');
      dot.classList.remove('bg-white');
      dot.classList.add('bg-gray-200');
    } else {
      dot.classList.remove('translate-x-4');
      toggleBg.classList.remove('bg-blue-600');
      toggleBg.classList.add('bg-gray-400');
      dot.classList.remove('bg-gray-200');
      dot.classList.add('bg-white');
    }
  }

  function updateBodyClass() {
    if (darkModeToggle.checked) {
      body.classList.add('dark');
    } else {
      body.classList.remove('dark');
    }
  }

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