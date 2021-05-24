import React, { useEffect, useContext } from 'react'
import PropTypes from 'prop-types'
import emulatorSetVolume from '../emulator/setVolume'
import GbaContext from './gba-context'

const ReactGbaJs = ({ onFpsReported, volume }) => {
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
    <canvas id="screen" width="480" height="320" />
  )
}

ReactGbaJs.propTypes = {
  onFpsReported: PropTypes.func,
  volume: PropTypes.number.isRequired,
}

export default ReactGbaJs
