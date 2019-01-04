import './style'
import tpl from './template'

class HelloWorld {
  constructor() {
    this.dom = tpl()
    this.$wrap = $('#app')
  }

  render() {
    this.$wrap.html(this.dom)
  }
}

export default new HelloWorld()