// import _ from 'lodash'
// import printMe from './print.js'
// import './styles.css'

// function component() {
//   const element = document.createElement('div')
//   const btn = document.createElement('button')

//   element.innerHTML = _.join(['Hello', 'webpack'], ' ')

//   btn.innerHTML = 'Click me and check the console!'
//   btn.onclick = printMe // onclick event is bind to the original printMe function

//   element.appendChild(btn)
//   console.log('111', 111)
//   return element
// }

// let element = component()
// document.body.appendChild(element)

// if (module.hot) {
//   module.hot.accept('./print.js', function () {
//     console.log('Accepting the updated printMe module!')
//     document.body.removeChild(element)
//     element = component() // 重新渲染 "component"，以便更新 click 事件处理函数
//     document.body.appendChild(element)
//   })
// }

// import _ from 'lodash'
import * as _ from 'lodash'

function component() {
  const element = document.createElement('div')

  element.innerHTML = _.join(['Hello', 'webpack'], ' ')

  return element
}

document.body.appendChild(component())
