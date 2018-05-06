const MIN_OCTAVE = 2
const MAX_OCTAVE = 6

function getOctavesByNumber () {
  // Octaves generation function
  const OCTAVE_TEMPLATE = [
    { note: 'C' },
    { note: 'Cs' },
    { note: 'D' },
    { note: 'Ds' },
    { note: 'E' },
    { note: 'F' },
    { note: 'Fs' },
    { note: 'G' },
    { note: 'Gs' },
    { note: 'A' },
    { note: 'As' },
    { note: 'B' }
  ]
  var res = {}

  for (let octaveNb = MIN_OCTAVE; octaveNb <= MAX_OCTAVE; ++octaveNb) {
    res[octaveNb] = OCTAVE_TEMPLATE.map(pianoKey => ({
      note: pianoKey.note + octaveNb
    }))
  }
  return res
}

const CONSTANT = {
  MAX_OCTAVE,
  MIN_OCTAVE,
  OCTAVES_BY_NUMBER: getOctavesByNumber(),
  OCTAVES_ORDER: [4, 5, 3, 6, 2], // Octaves display order by number
  RENDER_ACTION: {
    INIT: 'init',
    ADD_OCTAVE: 'add_octave',
    REMOVE_OCTAVE: 'remove_octave'
  }
}

export default CONSTANT
