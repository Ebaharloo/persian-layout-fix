// Background: forwards the shortcut / toolbar click to the active tab.
const api = globalThis.browser || globalThis.chrome;

function sendToTab(tab) {
  if (!tab || tab.id == null) return;
  api.tabs.sendMessage(tab.id, { action: 'autoConvert' }, () => {
    // Reading lastError silences "no content script in this tab" (about:, AMO, PDF viewer).
    void api.runtime.lastError;
  });
}

api.commands.onCommand.addListener((command) => {
  if (command !== 'auto-convert') return;
  api.tabs.query({ active: true, currentWindow: true }, (tabs) => sendToTab(tabs && tabs[0]));
});

api.browserAction.onClicked.addListener(sendToTab);
