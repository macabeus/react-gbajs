import React, { useEffect, useContext } from 'react'
import PropTypes from 'prop-types'
import emulatorSetVolume from '../emulator/setVolume'
import GbaContext from './gba-context'

const defaultWidth = 240
const defaultHeight = 160

const ReactGbaJs = ({ onFpsReported, scale = 1, volume }) => {
  const { gba, setFpsCallback } = useContext(GbaContext)

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
        id="screen"
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

ReactGbaJs.propTypes = {
  onFpsReported: PropTypes.func,
  scale: PropTypes.number,
  volume: PropTypes.number.isRequired,
}

export default ReactGbaJs
