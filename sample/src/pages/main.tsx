import React from 'react'
import Emulator from "../components/emulator"
import InputROM from '../components/input-rom'
import Instructions from '../components/instructions'

const Main = () => (
  <div
    style={{
      display: 'grid',
    }}
  >
    <InputROM />
    <Instructions />
    <Emulator />
  </div>
)

export default Main
