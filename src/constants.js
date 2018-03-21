const OCTAVE_RANGE = [2, 6]

function getOctavesByNumber () {
  // Octaves generation function
  const OCTAVE_TEMPLATE = [
    { note: 'C' },
    { note: 'C#' },
    { note: 'D' },
    { note: 'D#' },
    { note: 'E' },
    { note: 'F' },
    { note: 'F#' },
    { note: 'G' },
    { note: 'G#' },
    { note: 'A' },
    { note: 'A#' },
    { note: 'B' }
  ]
  var res = {}

  for (let octaveNb = OCTAVE_RANGE[0]; octaveNb <= OCTAVE_RANGE[1]; ++octaveNb) {
    res[octaveNb] = OCTAVE_TEMPLATE.map(pianoKey => ({
      note: pianoKey.note + octaveNb
    }))
  }
  return res
}

const CONSTANT = {
  NB_MAX_OCTAVES: OCTAVE_RANGE[1] - OCTAVE_RANGE[0],
  OCTAVES_BY_NUMBER: getOctavesByNumber(),
  OCTAVES_ORDER: [4, 5, 3, 6, 2] // Octaves display order by number
}

export default CONSTANT
