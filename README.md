# Piano JS

Functionnal piano made for the pianists only.

[Demo here](http://piano-js.lyfing.dev)

## Motivation

For Vanilla JS learning purpose and challenging myself, I have decided to build a simple virtual piano on the web.


## Installation

```shell
$ npm install

$ npm run dev # Run webpack-dev-server to serve app in localhost:8080
OR 
$ npm run build # Build and ouput assets in dist folder
```

## Built with
- HTML5/ CSS3
- Sass
- Vanilla JS (ES6)
- Webpack v4

# Requirements
- Node 14


## Optimizations with Webpack
In `src/preload.js`
- Leverage **webpack dynamic import** feature to preload piano key sounds in the browser before rendering the piano. 
- Encode all mp3 key sounds into base 64 then generate a separated single-chunk containing all sounds using webpack `lazy-once` mode (Avoid multiple requests made by the browser)

## Features
- Play up to 6 octaves (N°2 to N°6)
- Current note played display in the dashboard screen
- Dynamically add/remove octaves using arrow buttons
- Sounds are preloaded with a loading animation before rendering the piano

## Limitations
- App is not responsive
- No keyboard integration for piano keys
- Not supported on Safari browser (Causing slow/delay audio playback on piano key pressing)