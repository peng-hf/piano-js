import debounce from 'debounce'

import '@css/index.scss'
import CONSTANT from '@/constants'
import pianoConfig from '@/config'

// Nb (count) != no (numero)

const {
  RENDER_ACTION,
  NB_MAX_OCTAVES,
  OCTAVES_BY_NO,
  OCTAVES_ORDER
} = CONSTANT

const Piano = {
  data () {
    this.isMouseDown = false
    this.curNbOctaves = pianoConfig.initialNbOctaves // Current number of octaves displayed
    /* DOM caching */
    this.$piano = document.querySelector('#piano')
    this.$screen = document.getElementById('screen')
  },
  bindEvents () {
    /* Keybaords events */
    ['mousedown', 'mouseup', 'mouseover', 'mouseout'].forEach(evtName => {
      this.$piano.addEventListener(evtName, this.mouseHandler.bind(this))
    })

    /* Buttons events */
    const $btnAddOctave = document.getElementById('btn-add-octave')
    const $btnRemoveOctave = document.getElementById('btn-remove-octave')
    $btnAddOctave.addEventListener('click', this.addOctaveRenderAction.bind(this))
    $btnRemoveOctave.addEventListener('click', this.removeOctaveRenderAction.bind(this))
  },
  init () {
    this.data()
    this.bindEvents()
    this.renderKeys(RENDER_ACTION.INIT)
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
    var $saveWrapperKey
    keys.forEach(key => {
      var $key = document.createElement('div')
      $key.dataset.note = key.note
      if ($saveWrapperKey && !this.isWhiteKey(key.note)) {
        $key.classList.add('black')
        $saveWrapperKey.appendChild($key)
      } else {
        let $wrapperKey = document.createElement('div')
        $wrapperKey.dataset.octave = key.note.slice(-1)
        $wrapperKey.classList.add('key')
        $key.classList.add('white')
        $wrapperKey.appendChild($key)
        $keysFrag.appendChild($wrapperKey)
        $saveWrapperKey = $wrapperKey
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
    const keys = (function () { // arrow function can also be an option to prevent binding current context
      const octaves = OCTAVES_ORDER.slice(0, this.curNbOctaves)
      octaves.sort()
      return octaves.reduce((acc, octNo) => acc.concat(OCTAVES_BY_NO[octNo]), [])
    }.bind(this))()
    this.insertKeys(keys)
  },
  addOctaveRenderAction () {
    if (this.curNbOctaves < NB_MAX_OCTAVES) {
      // Retrieved minimum current octave no displayed
      const minCurOctaveNo = Math.min.apply(null, OCTAVES_ORDER.slice(0, this.curNbOctaves))
      // New octave number (no) to add
      const newOctaveNo = OCTAVES_ORDER[this.curNbOctaves]
      // Insert before if new octave to add is lower than the minimum current octave displayed
      const insertBefore = newOctaveNo < minCurOctaveNo
      const keys = OCTAVES_BY_NO[newOctaveNo]
      this.insertKeys(keys, insertBefore)
      this.curNbOctaves++
      this.displayText('Add octave')
    } else {
      console.error('Number of octaves rendered reached')
    }
  },
  removeOctaveRenderAction () {
    if (this.curNbOctaves > 1) {
      const octaveNoRemove = OCTAVES_ORDER[this.curNbOctaves - 1] // octave number (no) to remove
      const $keysToRemove = document.querySelectorAll(`[data-octave="${octaveNoRemove}"]`)
      $keysToRemove.forEach($key => { $key.remove() })
      this.curNbOctaves--
      this.displayText('Remove octave')
    }
  },
  clearText: debounce(function () {
    this.$screen.textContent = 'Play'
  }, 1500),
  displayText (text = 'Play') {
    this.$screen.textContent = text
    this.clearText()
  },
  playNote (note) {
    const audio = document.createElement('audio')
    audio.src = `./assets/sounds/${note}.mp3`
    audio.play()
    this.displayText(note)
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
