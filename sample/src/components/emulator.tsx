import React, { FunctionComponent } from 'react'
import GBAEmulator from 'react-gbajs'

type Props = { scale: number, printFps: boolean }
const Emulator: FunctionComponent<Props> = ({ scale, printFps }) => {
  const fpsReportCallback = (
    printFps
      ? (fps: number) => console.log('FPS', fps)
      : undefined
  )

  return (
    <GBAEmulator
      onFpsReported={fpsReportCallback}
      scale={scale}
      volume={0}
    />
  )
}

export default Emulator
