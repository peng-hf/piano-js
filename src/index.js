import 'babel-polyfill'
import debounce from 'debounce'

import '@assets/styles/index.scss'
import CONSTANT from '@/constants'
import pianoConfig from '@/config'
import preloadSounds from '@/preload'

// Nb (count) != no (numero)

const {
  RENDER_ACTION,
  NB_MAX_OCTAVES,
  OCTAVES_BY_NO,
  OCTAVES_ORDER
} = CONSTANT

function isWhiteKey (note) {
  return !note.includes('s')
}

const Piano = {
  data (sounds) {
    this.cachedSounds = sounds
    this.isMouseDown = false
    this.curNbOctaves = pianoConfig.initialNbOctaves // Current number of octaves displayed
    this.isMoving = false // delete/add button animation

    /* DOM caching */
    this.$app = document.getElementById('app')
    this.$piano = document.getElementById('piano')
    this.$keys = document.getElementById('keys')
    this.$screen = document.getElementById('screen')
  },
  bindEvents () {
    /* Keybaords events */
    ['mousedown', 'mouseup', 'mouseover', 'mouseout'].forEach(evtName => {
      this.$keys.addEventListener(evtName, this.mouseHandler.bind(this))
    })

    /* Buttons events */
    const $btnAddOctave = document.getElementById('btn-add-octave')
    const $btnRemoveOctave = document.getElementById('btn-remove-octave')
    $btnAddOctave.addEventListener('click', this.renderKeys.bind(this, RENDER_ACTION.ADD_OCTAVE))
    $btnRemoveOctave.addEventListener('click', this.renderKeys.bind(this, RENDER_ACTION.REMOVE_OCTAVE))
  },
  init (sounds) {
    this.data(sounds)
    this.$app.classList.add('loaded')
    this.bindEvents()

    setTimeout(() => { // delay to render keys as loader is fading-out
      this.renderKeys(RENDER_ACTION.INIT)
    }, 600)
  },

  renderKeys (action) {
    switch (action) {
      case RENDER_ACTION.INIT:
        this.initRenderAction()
        break
      case RENDER_ACTION.ADD_OCTAVE:
        !this.isMoving && this.addOctaveRenderAction()
        break
      case RENDER_ACTION.REMOVE_OCTAVE:
        !this.isMoving && this.removeOctaveRenderAction()
        break
    }
  },
  insertKeys (keys, before = false) {
    this.isMoving = true
    // Helper function to insert keys to the DOM
    var $keysFrag = document.createDocumentFragment()
    var $saveWrapperKey
    keys.forEach((key, idx) => {
      var $key = document.createElement('div')
      $key.dataset.note = key.note
      if ($saveWrapperKey && !isWhiteKey(key.note)) {
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

      const listenerCondition = before ? idx === 0 : idx === keys.length - 1
      const delay = (before ? keys.length - idx : idx) * 50
      var handlerRef
      const handler = () => {
        // Listen to the end of transition of the last key inserted
        this.isMoving = false
        // handleRef is use to reference the same function when removing listener
        // note: bind create a new ref
        $key.removeEventListener('transitionend', handlerRef)
      }
      handlerRef = handler.bind(this)
      listenerCondition && $key.addEventListener('transitionend', handlerRef)

      // Opacity transition is applied after keys got inserted into the DOM because of setTimeout
      setTimeout(() => {
        $key.style.opacity = 1
      }, delay)
    })

    if (before) {
      this.$keys.insertBefore($keysFrag, this.$keys.childNodes[0])
    } else {
      this.$keys.appendChild($keysFrag)
    }
  },
  removeKeys (octaveNo, removeFromRight = false) {
    this.isMoving = true
    const $keys = document.querySelectorAll(`[data-note*="${octaveNo}"]`) // keys to reduce opacity
    const $wrapperKeys = document.querySelectorAll(`[data-octave="${octaveNo}"]`) // wrapper keys to remove
    Array.from($keys).forEach(($key, idx) => {
      const delay = (removeFromRight ? $keys.length - idx : idx) * 50
      const listenerCondition = removeFromRight ? idx === 0 : idx === $keys.length - 1
      var handlerRef
      const handler = () => {
        // If transition is finished for the first or last key of the octave (depend on removeFromRight), delete all wrapperKeys from DOM
        Array.from($wrapperKeys).forEach($wKey => { $wKey.remove() })
        this.isMoving = false
        $key.removeEventListener('transitionend', handlerRef) // stop listener
      }
      handlerRef = handler.bind(this)
      listenerCondition && $key.addEventListener('transitionend', handlerRef)

      setTimeout(() => {
        $key.style.opacity = 0
      }, delay)
    })
  },
  initRenderAction () {
    // Generate keys and insert them into the DOM
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
    } else {
      console.error('Number of octaves rendered reached')
    }
  },
  removeOctaveRenderAction () {
    if (this.curNbOctaves > pianoConfig.minOctaveDisplayed) {
      const octaveNo = OCTAVES_ORDER[this.curNbOctaves - 1] // octave number (no) to remove
      const fromRight = octaveNo > 4 // Delete keys from right if octave no to remove is greater than the middle octave no
      this.removeKeys(octaveNo, fromRight)
      this.curNbOctaves--
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
    audio.src = this.cachedSounds[note]
    audio.play()
    this.displayText(note)
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

document.addEventListener('DOMContentLoaded', async () => {
  const cachedSounds = await preloadSounds()
  Piano.init(cachedSounds)
})
