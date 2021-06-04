import React, { useState, useRef } from 'react'
import PropTypes from 'prop-types'
import cloneDeep from 'lodash.clonedeep'
import drawEmulator from '../emulator'
import GbaContext from './gba-context'

const GbaProvider = ({ children }) => {
  const [gba, setGba] = useState()
  const canvasRef = useRef()
  const [fpsCallback, setFpsCallback] = useState()
  const [romBufferMemory, setRomBufferMemory] = useState()
  const [frozenAddresses, setFrozenAddresses] = useState({})

  const play = (newRomBufferMemory) => {
    setRomBufferMemory(new Uint8Array([...newRomBufferMemory]))

    const newGbaInstance = drawEmulator(newRomBufferMemory, canvasRef.current)
    newGbaInstance.reportFPS = fpsCallback
    setGba(newGbaInstance)
  }

  const saveState = () =>
    gba.freeze()

  const updateState = ({ restoreState, newRomBuffer }) => {
    if (newRomBuffer !== undefined) {
      const newRomBufferReference = new Uint8Array([...newRomBuffer])

      setRomBufferMemory(newRomBufferReference)
      gba.setRom(newRomBufferReference.buffer)
    } else {
      gba.setRom(romBufferMemory.buffer)
    }

    if (restoreState !== undefined) {
      gba.defrost(cloneDeep(restoreState))
    }

    gba.runStable()
  }

  const updateFrozenAddreses = () =>
    setFrozenAddresses(cloneDeep(gba.frozenAddresses))

  return (
    <GbaContext.Provider value={{
      gba,
      canvasRef,
      setFpsCallback: (newFpsCallback) => {
        setFpsCallback(newFpsCallback)

        if (gba) {
          gba.reportFPS = newFpsCallback
        }
      },
      play,
      saveState,
      updateState,
      frozenAddresses,
      addFreezeAddress: gba && ((args) => {
        gba.addFreezeAddress(args)
        updateFrozenAddreses()
      }),
      removeFreezeAddress: gba && ((args) => {
        gba.removeFreezeAddress(args)
        updateFrozenAddreses()
      }),
    }}
    >
      {children}
    </GbaContext.Provider>
  )
}

GbaProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export default GbaProvider
