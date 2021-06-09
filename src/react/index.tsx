import React, { FunctionComponent, useEffect, useContext } from 'react'
import emulatorSetVolume from '../emulator/setVolume'
import GbaContext from './gba-context'

const defaultWidth = 240
const defaultHeight = 160

type Props = ({
  onFpsReported: FpsCallback,
  scale: number,
  volume: number,
})
const ReactGbaJs: FunctionComponent<Props> = ({ onFpsReported, scale = 1, volume }) => {
  const { gba, setFpsCallback, canvasRef } = useContext(GbaContext)

  useEffect(() => {
    setFpsCallback(onFpsReported)
  }, [onFpsReported, setFpsCallback])

  useEffect(() => {
    if (gba === undefined) {
      return
    }

    emulatorSetVolume(gba, volume)
  }, [gba, volume])

  return (
    <div
      style={{
        width: defaultWidth * scale,
        height: defaultHeight * scale,
      }}
    >
      <canvas
        ref={canvasRef}
        width={defaultWidth}
        height={defaultHeight}
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'left top',
        }}
      />
    </div>
  )
}

export default ReactGbaJs
