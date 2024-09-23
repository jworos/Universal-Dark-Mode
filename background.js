chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.set({darkModeEnabled: false, darkColor: '#1a1a1a'});
  });
  
  chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete') {
      chrome.storage.sync.get(['darkModeEnabled', 'darkColor'], function(result) {
        if (result.darkModeEnabled) {
          chrome.tabs.sendMessage(tabId, {
            action: 'toggleDarkMode',
            enabled: true,
            color: result.darkColor
          });
        }
      });
    }
  });