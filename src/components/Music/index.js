import './style'
import tpl from './template'
import musicBg from 'assets/music/dear.mp3'

class Music {
  constructor() {
    this.dom = tpl()
    this.$wrap = $('#app')
    this.music = null
  }

  init() {
    this.render()
    this.createMusic()
    this.bindEvents()
  }

  render() {
    this.$wrap.append(this.dom)
  }

  createMusic() {
    this.music = new Audio()
    this.music.src = musicBg
    this.music.loop = 'loop'
    this.music.play() && $('#music_switch').addClass('play')
  }

  bindEvents() {
    const _this = this
    
    $('#music_switch').on('click', function() {
      _this.music.paused ? _this.music.play() : _this.music.pause()
      $(this).toggleClass('play', !_this.music.paused)
    })
  }
}

export default new Music()
