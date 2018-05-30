import './../common/css/reset.css'
import './../common/css/main.css'
require('./../scss/index.scss')
import { getData } from './../common/js/http'
// 获取首页信息
function getHome(cityCode) {
    getData('home/' + cityCode, 'GET', {})
    .then(res => {
      if (res.code === 200) {
        console.log(res.data)
      }
    }, err => {
      console.log(err)
    })
}
window.onload = function() {
    getHome(99999);
    let text = document.getElementsByClassName('content-div')
    console.log(text.length)
    console.log(text[0].innerHTML, '1')
}