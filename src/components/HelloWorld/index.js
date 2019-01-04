import './style'
import tpl from './template'

class HelloWorld {
  constuctor() {
    this.dom = tpl()
    this.$wrap = $('#app')
  }

  render() {
    $('#app').html(this.dom)
  }
}

export default new HelloWorld()