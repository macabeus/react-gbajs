import React, { FunctionComponent } from 'react'
import GBAEmulator from 'react-gbajs'

type Props = { printFps: boolean }
const Emulator: FunctionComponent<Props> = ({ printFps }) => {
  const fpsReportCallback = (
    printFps
      ? (fps: number) => console.log('FPS', fps)
      : undefined
  )

  return (
    <GBAEmulator
      onFpsReported={fpsReportCallback}
      volume={0}
    />
  )
}

export default Emulator
