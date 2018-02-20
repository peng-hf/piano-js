import '@css/index.scss'
import Mustache from 'mustache'
import CONSTANT from '@/constants'
import pianoConfig from '@/config'

const Piano = {
  cacheDOM () {
    this.keyTemplate = document.querySelector('#key-template').innerHTML
    this.$keys = document.querySelector('.keys')
  },
  bindEvents () {},
  renderKeys () {
    const keys = (function () {
      const octaves = CONSTANT.OCTAVES_ORDER.slice(0, pianoConfig.nbOctavesDisplay)
      octaves.sort()
      return octaves.reduce((acc, octNb) => acc.concat(CONSTANT.OCTAVES_BY_NUMBER[octNb]), [])
    })()
    this.$keys.innerHTML = Mustache.render(this.keyTemplate, {
      keys
    })
  },
  init () {
    this.cacheDOM()
    this.renderKeys()
  }
}

Piano.init()
