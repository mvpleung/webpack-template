import './style'
import tpl from './template'

class Time {
  constructor() {
    this.$wrap = $('#app')
    this.$time = null
    this.dom = tpl()
    this.time = ''
  }

  init() {
    this.render()
    this.create()
  }

  render() {
    this.$wrap.append(this.dom)
    this.$time = $('#time_odd')
  }

  create() {
    this.$time.text(this.getTime())
    setInterval(() => {
      this.time = this.getTime()
      this.$time.text(this.time)
    }, 1000)
  }

  getTime() {
    let duration, months, days, hours, minutes, seconds

    duration = moment.duration(moment().endOf('year') - moment())
    months = duration.get('months')
    days = duration.get('days')
    hours = duration.get('hours')
    minutes = duration.get('minutes')
    seconds = duration.get('seconds')

    months = (months + '').padStart(2, '0')
    days = (days + '').padStart(2, '0')
    hours = (hours + '').padStart(2, '0')
    minutes = (minutes + '').padStart(2, '0')
    seconds = (seconds + '').padStart(2, '0')

    return `${months} 个月 ${days} 天 ${hours} 小时 ${minutes} 分 ${seconds} 秒`
  }
}

export default new Time()
