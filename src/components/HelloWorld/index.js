import './style'
import tpl from './template'

class HelloWorld {
  constructor() {
    this.dom = tpl()
    this.$wrap = $('#app')
  }

  init() {
    this.render()
  }

  render() {
    this.$wrap.append(this.dom)
  }
}

export default new HelloWorld()