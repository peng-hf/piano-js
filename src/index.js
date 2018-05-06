import '@css/index.scss'
import CONSTANT from '@/constants'
import pianoConfig from '@/config'

const {
  RENDER_ACTION,
  MIN_OCTAVE,
  MAX_OCTAVE,
  OCTAVES_BY_NUMBER,
  OCTAVES_ORDER
} = CONSTANT

const Piano = {
  data () {
    this.isMouseDown = false
    this.curNbOctaves = pianoConfig.initialNbOctaves
    this.$piano = document.querySelector('#piano') // DOM Caching
  },
  bindEvents () {
    ['mousedown', 'mouseup', 'mouseover', 'mouseout'].forEach(evtName => {
      this.$piano.addEventListener(evtName, this.mouseHandler.bind(this))
    })
  },
  init () {
    this.data()
    this.bindEvents()
    this.renderKeys(RENDER_ACTION.INIT)
    setTimeout(() => {
      this.renderKeys(RENDER_ACTION.ADD_OCTAVE)
      setTimeout(() => {
        this.renderKeys(RENDER_ACTION.REMOVE_OCTAVE)
      }, 1000)
    }, 1000)
  },

  renderKeys (action) {
    switch (action) {
      case RENDER_ACTION.INIT:
        this.initRenderAction()
        break
      case RENDER_ACTION.ADD_OCTAVE:
        this.addOctaveRenderAction()
        break
      case RENDER_ACTION.REMOVE_OCTAVE:
        this.removeOctaveRenderAction()
        break
    }
  },
  insertKeys (keys, before = false) {
    // Helper function to insert keys to the DOM
    var $keysFrag = document.createDocumentFragment()
    var $previousKey
    keys.forEach(key => {
      var $key = document.createElement('div')
      $key.dataset.note = key.note
      if ($previousKey && !this.isWhiteKey(key.note)) {
        $key.classList.add('black')
        $previousKey.appendChild($key)
      } else {
        let $wrapperKey = document.createElement('div')
        $wrapperKey.classList.add('key')
        $key.classList.add('white')
        $wrapperKey.appendChild($key)
        $keysFrag.appendChild($wrapperKey)
        $previousKey = $wrapperKey
      }
    })
    if (before) {
      this.$piano.insertBefore($keysFrag, this.$piano.childNodes[0])
    } else {
      this.$piano.appendChild($keysFrag)
    }
  },
  initRenderAction () {
    // Generate keys and add to DOM
    const keys = (function () {
      const octaves = OCTAVES_ORDER.slice(0, pianoConfig.initialNbOctaves)
      octaves.sort()
      return octaves.reduce((acc, octNb) => acc.concat(OCTAVES_BY_NUMBER[octNb]), [])
    })()
    this.insertKeys(keys)
  },
  addOctaveRenderAction () {
    if (this.curNbOctaves < MAX_OCTAVE) {
      // Retrieved minimum current octave displayed
      const minCurOctaveNb = Math.min.apply(null, OCTAVES_ORDER.slice(0, this.curNbOctaves))
      // Insert before if new octave to add if lower than the minimum current octave displayed
      const insertBefore = OCTAVES_ORDER[this.curNbOctaves] < minCurOctaveNb
      this.curNbOctaves++
      const keys = OCTAVES_BY_NUMBER[this.curNbOctaves]
      this.insertKeys(keys, insertBefore)
    } else {
      console.error('Number of octaves rendered reached')
    }
  },
  removeOctaveRenderAction () {
    if (this.curNbOctaves > MIN_OCTAVE) {
      const octaveNb = OCTAVES_ORDER[this.curNbOctaves] // octave number to remove
      console.log('octave to remove', octaveNb)
      console.log('current octave number', this.curNbOctaves)
      this.curNbOctaves--
    }
  },
  playNote (note) {
    const audio = document.createElement('audio')
    audio.src = `./assets/sounds/${note}.mp3`
    audio.play()
  },
  isWhiteKey (note) {
    return !note.includes('s')
  },
  mouseHandler (evt) {
    const $target = evt.target
    switch (evt.type) {
      case 'mousedown':
        if (evt.which === 1) { // left click
          evt.preventDefault() // Disable drag and drop on HTML elements
          this.isMouseDown = true
          $target.classList.add('active')
          this.playNote($target.dataset.note)
        }
        break
      case 'mouseup':
        $target.classList.remove('active')
        this.isMouseDown = false
        break
      case 'mouseover':
        if (this.isMouseDown) {
          $target.classList.add('active')
          this.playNote($target.dataset.note)
        }
        break
      case 'mouseout':
        if (this.isMouseDown) {
          $target.classList.remove('active')
          if (!evt.relatedTarget.dataset.note) {
            this.isMouseDown = false
          }
        }
        break
    }
  }
}

Piano.init()
