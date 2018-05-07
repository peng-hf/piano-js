const MIN_OCTAVE_NO = 2
const MAX_OCTAVE_NO = 6

function getOctavesByNo () {
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

  for (let octaveNo = MIN_OCTAVE_NO; octaveNo <= MAX_OCTAVE_NO; ++octaveNo) {
    res[octaveNo] = OCTAVE_TEMPLATE.map(pianoKey => ({
      note: pianoKey.note + octaveNo
    }))
  }
  return res
}

const CONSTANT = {
  NB_MAX_OCTAVES: MAX_OCTAVE_NO - MIN_OCTAVE_NO + 1,
  OCTAVES_BY_NO: getOctavesByNo(),
  OCTAVES_ORDER: [4, 5, 3, 6, 2], // Octaves display order by number (no)
  RENDER_ACTION: {
    INIT: 'init',
    ADD_OCTAVE: 'add_octave',
    REMOVE_OCTAVE: 'remove_octave'
  }
}

export default CONSTANT
