import './style'
import helloWorld from 'components/HelloWorld'

class Index {
  init() {
    helloWorld.render()
  }
}

export default new Index()