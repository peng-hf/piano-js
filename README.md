# Piano JS

A virtual piano built with Vanilla JS.

**[Live Demo](http://piano-js.lyfing.dev)**

## Features

- Play across up to 6 octaves (2–6)
- Dynamically add or remove octaves with arrow buttons
- Current note displayed in the dashboard
- Sounds preloaded with a loading animation before rendering

## Motivation

A personal challenge to build a functional web instrument using only Vanilla JS — no frameworks, no libraries.

## Getting Started

```sh
npm install

npm run dev    # Start dev server at localhost:8080
npm run build  # Build production assets into /dist
```

## Tech Stack

- HTML5 / CSS3
- Sass
- Vanilla JS (ES6)
- Webpack 4

**Requires Node 14+**

## How Sound Preloading Works

All MP3 key sounds are base64-encoded and bundled into a single chunk using Webpack's `lazy-once` dynamic import mode (see `src/preload.js`). This avoids multiple browser requests and ensures sounds are ready before the piano renders.

## Known Limitations

- Not responsive (desktop only)
- No keyboard input support
- Safari has slow/delayed audio playback
