import '@css/index.scss'
import CONSTANT from '@/constants'
import pianoConfig from '@/config'

const Piano = {
  data () {
    this.curNbOctaves = pianoConfig.initialNbOctaves
    this.keys = (function () {
      const octaves = CONSTANT.OCTAVES_ORDER.slice(0, pianoConfig.initialNbOctaves)
      octaves.sort()
      return octaves.reduce((acc, octNb) => acc.concat(CONSTANT.OCTAVES_BY_NUMBER[octNb]), [])
    })()
    this.isMouseDown = false
    // DOM
    this.$piano = document.querySelector('#piano')
  },
  bindEvents () {
    ['mousedown', 'mouseup', 'mouseover', 'mouseout'].forEach(evtName => {
      this.$piano.addEventListener(evtName, this.mouseHandler.bind(this))
    })
  },
  render () {
    var $keysFrag = document.createDocumentFragment()
    var $previousKey
    this.keys.forEach(key => {
      let $key = document.createElement('div')
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
    this.$piano.appendChild($keysFrag)
  },
  init () {
    this.data()
    this.bindEvents()
    this.render()
  },

  playNote (note) {
    var audio = document.createElement('audio')
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
        console.log('mousedown')
        evt.preventDefault() // Disable drag and drop on HTML elements
        this.isMouseDown = true
        $target.classList.add('active')
        this.playNote($target.dataset.note)
        break
      case 'mouseup':
        console.log('mouseup')
        $target.classList.remove('active')
        this.isMouseDown = false
        break
      case 'mouseover':
        console.log('mouseover', this.isMouseDown)
        if (this.isMouseDown) {
          $target.classList.add('active')
          this.playNote($target.dataset.note)
        }
        break
      case 'mouseout':
        console.log('mouseout', evt)
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
