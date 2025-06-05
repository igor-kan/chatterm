// Background script for the extension
// This would handle communication between the extension and ChatGPT

// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "fetchHistory") {
    // In a real extension, this would fetch history from ChatGPT
    // For now, we'll just send a success response
    sendResponse({ success: true })
  }

  // Return true to indicate we'll respond asynchronously
  return true
})

// Open the extension in a new tab when the extension icon is clicked
chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({ url: "index.html" })
})
