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
    this.isLeftClicked = false
    this.$piano = document.querySelector('#piano')
  },
  bindEvents () {
    this.$piano.addEventListener('click', function (evt) {
      console.log('Note', evt.target.dataset.note)
      var audio = document.createElement('audio')
      audio.src = `./assets/sounds/${evt.target.dataset.note}.mp3`
      audio.play()
    })
  },
  populateKeys () {
    var $keysFrag = document.createDocumentFragment()
    var $previousKey
    this.keys.forEach(key => {
      let $key = document.createElement('div')
      $key.dataset.note = key.note
      if ($previousKey && key.note.includes('#')) {
        $key.classList.add('key__black')
        $previousKey.appendChild($key)
      } else {
        let $wrapperKey = document.createElement('div')
        $wrapperKey.classList.add('key')
        $key.classList.add('key__white')
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
    this.populateKeys()
  }
}

Piano.init()
