// Handle keyboard shortcut
chrome.commands.onCommand.addListener((command) => {
  if (command === "auto-convert") {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {action: "autoConvert"});
    });
  }
});

// Handle browser action click
chrome.browserAction.onClicked.addListener((tab) => {
  chrome.tabs.sendMessage(tab.id, {action: "autoConvert"});
});