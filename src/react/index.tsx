import React, { FunctionComponent, useEffect, useContext } from 'react'
import emulatorSetVolume from '../emulator/setVolume'
import GbaContext from './gba-context'
import { LogLevel, WatchLogLevels, makeLogger } from '../emulator/logs'

const defaultWidth = 240
const defaultHeight = 160

type Props = ({
  onFpsReported?: FpsCallback,
  scale?: number,
  volume?: number,
  watchLogLevels?: WatchLogLevels,
  onLogReceived?: (level: LogLevel, message: string) => void,
})
const ReactGbaJs: FunctionComponent<Props> = ({
  onFpsReported,
  volume = 0,
  watchLogLevels = { error: true },
  onLogReceived = () => {},
  scale = 1,
}) => {
  const {
    gba,
    clearGbaInstance,
    setFpsCallback,
    canvasRef,
  } = useContext(GbaContext)

  useEffect(() => {
    setFpsCallback(onFpsReported)
  }, [onFpsReported, setFpsCallback])

  useEffect(() => {
    gba?.setLogger(
      makeLogger(gba, watchLogLevels, onLogReceived)
    )
  }, [gba, JSON.stringify(watchLogLevels), onLogReceived])

  useEffect(
    () =>
      () => clearGbaInstance(),
    []
  )

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
