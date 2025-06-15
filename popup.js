document.addEventListener('DOMContentLoaded', () => {
    // Get button elements
    const addButton = document.getElementById('addShimeji');
    const removeButton = document.getElementById('removeShimeji');
    const toggleButton = document.getElementById('toggleMovement');

    // Function to send message to content script
    function sendMessage(action) {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            if (tabs[0]) {
                chrome.tabs.sendMessage(tabs[0].id, {action: action}, function(response) {
                    if (chrome.runtime.lastError) {
                        alert('Pettoji: This website does not allow Shimeji to be injected.');
                        console.error('Error:', chrome.runtime.lastError);
                    } else {
                        console.log('Message sent successfully:', action);
                    }
                });
            }
        });
    }

    // Add event listeners only if buttons exist
    if (addButton) {
        addButton.addEventListener('click', () => sendMessage('addShimeji'));
    }
    if (removeButton) {
        removeButton.addEventListener('click', () => sendMessage('removeShimeji'));
    }
    if (toggleButton) {
        toggleButton.addEventListener('click', () => sendMessage('toggleMovement'));
    }
}); 