// Note: Standard piano contains 7 octaves from 1 to 7 (extension 0 and 8 are not included)
const NB_MAX_OCTAVES = 7

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

  for (let octaveNb = 1; octaveNb <= NB_MAX_OCTAVES; ++octaveNb) {
    res[octaveNb] = OCTAVE_TEMPLATE.map(pianoKey => ({
      note: octaveNb + pianoKey.note
    }))
  }
  return res
}

const CONSTANT = {
  NB_MAX_OCTAVES,
  OCTAVES_BY_NUMBER: getOctavesByNumber(),
  OCTAVES_ORDER: [4, 5, 3, 6, 2, 7, 1] // Octaves display order by number
}

export default CONSTANT
