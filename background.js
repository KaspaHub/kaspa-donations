function setGreenIcon(tabId) {
  chrome.action.setIcon({
    tabId,
    path: {
      "16": "images/icon16_green.png",
      "48": "images/icon48_green.png",
      "128": "images/icon128_green.png"
    }
  });
}

chrome.runtime.onMessage.addListener((message, sender) => {
  if (!sender.tab || !sender.tab.id) {
    return;
  }

  chrome.tabs.get(sender.tab.id, (tab) => {
    if (chrome.runtime.lastError || !tab) {
      return;
    }

    if (message.kaspa) {
      setGreenIcon(sender.tab.id);
    }
  });
});
