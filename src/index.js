import '@css/index.scss'
import CONSTANT from '@/constants'
import pianoConfig from '@/config'

const { RENDER_ACTION, NB_MAX_OCTAVES, OCTAVES_BY_NUMBER, OCTAVES_ORDER } = CONSTANT

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
    }, 2000)
  },

  renderKeys (action) {
    switch (action) {
      case RENDER_ACTION.INIT:
        this.initRender()
        break
      case RENDER_ACTION.ADD_OCTAVE:
        this.addOctaveRender()
        break
    }
  },
  initRender () {
    // Generate keys and add to DOM
    const keys = (function () {
      const octaves = OCTAVES_ORDER.slice(0, pianoConfig.initialNbOctaves)
      octaves.sort()
      return octaves.reduce((acc, octNb) => acc.concat(OCTAVES_BY_NUMBER[octNb]), [])
    })()
    this.$piano.appendChild(this.generateKeysFrag(keys))
  },
  generateKeysFrag (keys) {
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
    return $keysFrag
  },
  addOctaveRender () {
    if (this.curNbOctaves < NB_MAX_OCTAVES) {
      this.curNbOctaves++
      // Keys to add
      const keys = OCTAVES_BY_NUMBER[this.curNbOctaves]
      this.$piano.appendChild(this.generateKeysFrag(keys))
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
