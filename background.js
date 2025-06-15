// Initialize extension state
let isEnabled = true;

// Listen for installation
chrome.runtime.onInstalled.addListener(() => {
    console.log('Pettoji extension installed');
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getState') {
        sendResponse({ isEnabled });
    }
    return true;
}); 