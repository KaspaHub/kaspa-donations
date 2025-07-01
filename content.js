function checkKaspaMetaTag() {
  if (document.querySelector('meta[name="kaspa:wallet"]')) {
    chrome.runtime.sendMessage({ kaspa: true });
  }
}

window.addEventListener('pageshow', checkKaspaMetaTag);