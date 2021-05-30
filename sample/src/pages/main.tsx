import React, { useState } from 'react'
import Emulator from "../components/emulator"
import InputROM from '../components/input-rom'
import InputScale from '../components/input-scale'
import Instructions from '../components/instructions'
import TogglePrintFps from '../components/toggle-print-fps'

const Main = () => {
  const [printFps, setPrintFps] = useState(false)
  const [scale, setScale] = useState(1)

  return (
    <div
      style={{
        display: 'grid',
      }}
    >
      <InputROM />
      <Instructions />
      <TogglePrintFps printFps={printFps} setPrintFps={setPrintFps} />
      <InputScale scale={scale} setScale={setScale} />
      <Emulator scale={scale} printFps={printFps} />
    </div>
  )
}

export default Main
