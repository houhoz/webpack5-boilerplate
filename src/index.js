import printMe from './js/print.js'
import webpackImg from './images/webpack.svg'
import './styles/index.scss'

const ele = document.createElement('div')
ele.classList.add('hello')
ele.innerHTML = '点我'
ele.onclick = printMe

const img = new Image()
img.src = webpackImg
const app = document.querySelector('#root')

const map = new Map()

console.log('map', map)

const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    if (Math.random() > 0.5) {
      resolve('成功')
    } else {
      reject('失败')
    }
  }, 1000)
})

promise
  .then(res => {
    console.log('res', res)
  })
  .catch(err => {
    console.log('err', err)
  })

app.append(ele, img)
