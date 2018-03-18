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
    // Cache DOM
    this.$piano = document.querySelector('#piano')
  },
  bindEvents () {},
  renderKeys () {
    var $keysFrag = document.createDocumentFragment()
    var $previousKey
    this.keys.forEach(key => {
      let $key = document.createElement('div')
      if ($previousKey && key.note.includes('s')) {
        $key.classList.add('piano__key--black')
        $previousKey.appendChild($key)
      } else {
        let $wrapperKey = document.createElement('div')
        $wrapperKey.classList.add('piano__key')
        $key.classList.add('piano__key--white')
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
    this.renderKeys()
  }
}

Piano.init()
