import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
const container = document.getElementById('root')
const root = createRoot(container) // createRoot(container!) if you use TypeScript
root.render(<App />)

// 如果启动webpack热更新，则会执行一下代码
if (module.hot) {
  module.hot.accept('./App.js', () => {
    const NextApp = require('./App.js').default
    // 再次挂在到dom元素上
    root.render(<NextApp />)
  })
}
