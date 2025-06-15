// Debug message to confirm script is loaded
console.log('Pettoji content script loaded');

// Global array to store all Shimejis
let shimejis = [];
let canvas;

// Inject p5.js by inlining its code into the page context
async function injectP5ScriptInline() {
    const url = chrome.runtime.getURL('libs/p5.min.js');
    const response = await fetch(url);
    const p5Code = await response.text();
    const script = document.createElement('script');
    script.textContent = p5Code;
    document.documentElement.appendChild(script);
    // Wait for p5 to be available
    return new Promise((resolve) => {
        const check = () => {
            if (window.p5) resolve();
            else setTimeout(check, 10);
        };
        check();
    });
}

// Function to create and inject the container
function createContainer() {
    // Remove existing container if it exists
    const existingContainer = document.getElementById('pettoji-container');
    if (existingContainer) {
        existingContainer.remove();
    }

    // Create new container
    const container = document.createElement('div');
    container.id = 'pettoji-container';
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.pointerEvents = 'none';
    container.style.zIndex = '9999';
    document.body.appendChild(container);
    console.log('Created container element');
    return container;
}

// Initialize the extension
async function initialize() {
    try {
        console.log('Starting Pettoji initialization...');
        
        // Create container first
        const container = createContainer();
        
        // Load p5.js
        await injectP5ScriptInline();
        
        // Initialize p5.js
        new window.p5((p) => {
            p.setup = function() {
                console.log('Setting up p5 canvas...');
                canvas = p.createCanvas(window.innerWidth, window.innerHeight);
                canvas.parent('pettoji-container');
                canvas.style('pointer-events', 'auto');
                p.background(0, 0, 0, 0);
                console.log('Canvas created and configured');
                
                // Add the first Shimeji
                addShimeji();
            };

            p.draw = function() {
                p.clear();
                
                // Update and draw all Shimejis
                for (let shimeji of shimejis) {
                    shimeji.update();
                    shimeji.draw(p);
                }
            };

            p.windowResized = function() {
                console.log('Window resized, updating canvas...');
                p.resizeCanvas(window.innerWidth, window.innerHeight);
            };

            p.mousePressed = function() {
                for (let shimeji of shimejis) {
                    if (shimeji.startDragging()) {
                        break;
                    }
                }
            };

            p.mouseDragged = function() {
                for (let shimeji of shimejis) {
                    shimeji.drag();
                }
            };

            p.mouseReleased = function() {
                for (let shimeji of shimejis) {
                    shimeji.stopDragging();
                }
            };
        });
        
        console.log('Pettoji initialization complete');
    } catch (error) {
        console.error('Error initializing Pettoji:', error);
    }
}

class Shimeji {
    constructor() {
        this.x = Math.random() * (window.innerWidth - 50);
        this.y = Math.random() * (window.innerHeight - 50);
        this.velocityX = 0;
        this.velocityY = 0;
        this.isDragging = false;
        this.dragOffsetX = 0;
        this.dragOffsetY = 0;
        this.isMoving = true;
        this.size = 50;
    }

    draw(p) {
        p.push();
        p.translate(this.x, this.y);
        
        // Draw the main circle
        p.fill('#ffd93d');
        p.stroke(0);
        p.strokeWeight(2);
        p.circle(0, 0, this.size);
        
        // Draw eyes
        p.fill(0);
        p.noStroke();
        p.circle(-10, -5, 8);
        p.circle(10, -5, 8);
        
        // Draw smile
        p.noFill();
        p.stroke(0);
        p.strokeWeight(2);
        p.arc(0, 5, 20, 20, 0, p.PI);
        
        // Draw blush
        p.fill('#ff6b6b');
        p.noStroke();
        p.circle(-15, 5, 8);
        p.circle(15, 5, 8);
        
        p.pop();
    }

    update() {
        if (!this.isDragging && this.isMoving) {
            // Add simple random movement
            this.velocityX = (Math.random() - 0.5) * 4;
            this.velocityY = (Math.random() - 0.5) * 4;

            this.x += this.velocityX;
            this.y += this.velocityY;

            // Keep the Shimeji within the window bounds
            this.x = Math.max(0, Math.min(window.innerWidth - this.size, this.x));
            this.y = Math.max(0, Math.min(window.innerHeight - this.size, this.y));
        }
    }

    isMouseOver() {
        return Math.hypot(window.mouseX - this.x, window.mouseY - this.y) < this.size / 2;
    }

    startDragging() {
        if (this.isMouseOver()) {
            this.isDragging = true;
            this.dragOffsetX = window.mouseX - this.x;
            this.dragOffsetY = window.mouseY - this.y;
            return true;
        }
        return false;
    }

    drag() {
        if (this.isDragging) {
            this.x = window.mouseX - this.dragOffsetX;
            this.y = window.mouseY - this.dragOffsetY;
        }
    }

    stopDragging() {
        this.isDragging = false;
    }

    toggleMovement() {
        this.isMoving = !this.isMoving;
    }
}

// Function to add a new Shimeji
function addShimeji() {
    const shimeji = new Shimeji();
    shimejis.push(shimeji);
    console.log('Added Shimeji, total count:', shimejis.length);
    return true;
}

// Function to remove the last Shimeji
function removeShimeji() {
    if (shimejis.length > 0) {
        shimejis.pop();
        console.log('Removed Shimeji, total count:', shimejis.length);
    }
    return true;
}

// Function to toggle movement for all Shimejis
function toggleMovement() {
    shimejis.forEach(shimeji => shimeji.toggleMovement());
    console.log('Toggled movement for all Shimejis');
    return true;
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Received message:', request.action);
    let response = false;
    
    switch (request.action) {
        case 'addShimeji':
            response = addShimeji();
            break;
        case 'removeShimeji':
            response = removeShimeji();
            break;
        case 'toggleMovement':
            response = toggleMovement();
            break;
    }
    
    sendResponse({success: response});
    return true;
});

// Start the extension
console.log('Pettoji content script loaded');
initialize(); 