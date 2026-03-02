# 3xx

A Chrome extension that redirects omnibar input directly to URLs or search engines, bypassing tracking by default search engines.

## How it works

Type the backtick (`) in the Chrome address bar, press Tab, then enter your query:

- If you enter a URL (e.g., `facebook.com`), it navigates directly to that site.
- If you enter a search query (e.g., `hello world`), it forwards to your configured search engine.

This skips sending your input to Google or other tracking search engines first.

## Installation

1. Clone this repository.
2. Run `npm install` to install dependencies.
3. Run `npm run build` to compile the extension.
4. Open Chrome and go to `chrome://extensions`.
5. Enable "Developer mode" in the top right.
6. Click "Load unpacked" and select the `dist/` folder.

## Configuration

After installing, right-click the extension icon and select "Options" to choose your preferred search engine (DuckDuckGo, Google, Bing, etc.) or enter a custom search URL template.

## Development

- `npm run build`: Compile TypeScript and copy files to `dist/`.
- `npm run watch`: Watch for changes and recompile.
- `npm run clean`: Remove the `dist/` folder.

## Icons

Optional: Add PNG images to `icons/` for a better extension appearance:

- `icon16.png`: 16x16 pixels
- `icon48.png`: 48x48 pixels
- `icon128.png`: 128x128 pixels

Then add the icons section back to `manifest.json`:

```json
"icons": {
  "16": "icons/icon16.png",
  "48": "icons/icon48.png",
  "128": "icons/icon128.png"
}
```

## License

MIT
