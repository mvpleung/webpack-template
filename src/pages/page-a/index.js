import './style'
import music from 'components/Music'
import time from 'components/Time'

class Index {
  init() {
    music.init()
    time.init()
  }
}

export default new Index()