import React, { useState } from 'react'
import Emulator from "../components/emulator"
import InputROM from '../components/input-rom'
import Instructions from '../components/instructions'
import TogglePrintFps from '../components/toggle-print-fps'

const Main = () => {
  const [printFps, setPrintFps] = useState(false)

  return (
    <div
      style={{
        display: 'grid',
      }}
    >
      <InputROM />
      <Instructions />
      <TogglePrintFps printFps={printFps} setPrintFps={setPrintFps} />
      <Emulator printFps={printFps} />
    </div>
  )
}

export default Main
