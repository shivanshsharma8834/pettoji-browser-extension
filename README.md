# Pettoji Browser Extension

A browser extension that brings animated characters to life on your web pages, inspired by the classic Shimeji desktop application.

## Features

- Animated characters that roam around your web pages
- Drag and drop functionality
- Multiple character support
- Customizable behavior
- Simple and intuitive controls

## Installation

1. Clone this repository or download the source code
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the extension directory

## Usage

1. Click the extension icon in your browser toolbar to open the control panel
2. Use the buttons to:
   - Add new Shimeji characters
   - Remove existing characters
   - Toggle character movement

## Development

### Project Structure

- `manifest.json` - Extension configuration
- `content.js` - Main Shimeji character logic
- `background.js` - Background service worker
- `popup.html` and `popup.js` - Extension popup interface
- `styles.css` - Styling for the extension

### Building from Source

1. Make sure you have Node.js installed
2. Clone the repository
3. Install dependencies (if any)
4. Load the extension in Chrome as described in the Installation section

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 