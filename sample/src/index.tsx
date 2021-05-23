import React from 'react'
import ReactDOM from 'react-dom'
import { GbaProvider } from 'react-gbajs'
import Main from './pages/main'

const App = () => (
  <GbaProvider>
    <Main />
  </GbaProvider>
)

ReactDOM.render(<App />, document.getElementById('app'))
