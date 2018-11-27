import CONSTANT from '@/constants'

const NOTES = Object.keys(CONSTANT.OCTAVES_BY_NO).reduce((acc, no) => {
  const octave = CONSTANT.OCTAVES_BY_NO[no]
  return acc.concat(octave.map(({ note }) => note))
}, [])

async function preloadSounds () {
  // Preload sounds. Return an object where key represents the note mapped to its sound encoded in base64
  var cache = {}
  for (let i = 0; i < NOTES.length; ++i) {
    const note = NOTES[i]
    // Generates a single lazy-loadable chunk using lazy-once mode for dynamic import
    const { default: data64 } = await import(/* webpackMode: 'lazy-once' */`@assets/sounds/${note}.mp3`)
    cache[note] = data64
  }
  return cache
}

export default preloadSounds
