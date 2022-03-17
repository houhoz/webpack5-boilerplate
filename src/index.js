import printMe from './js/print.js'
import webpackImg from './images/webpack.svg'
import './styles/index.css'

const ele = document.createElement('div')
ele.classList.add('hello')
ele.innerHTML = '点我'
ele.onclick = printMe

const img = new Image()
img.src = webpackImg
const app = document.querySelector('#root')
app.append(ele, img)
