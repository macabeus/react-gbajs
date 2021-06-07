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

  const play = ({ newRomBuffer, restoreState }) => {
    if (
      newRomBuffer === undefined &&
      romBufferMemory === undefined
    ) {
      console.error('Error: There is no ROM buffer to can play the emulator')
      return false
    }

    const gbaInstance = (
      gba === undefined
        ? drawEmulator(newRomBuffer, canvasRef.current)
        : gba
    )

    gbaInstance.reportFPS = fpsCallback
    setGba(gbaInstance)

    if (newRomBuffer !== undefined) {
      const newRomBufferReference = new Uint8Array([...newRomBuffer])

      setRomBufferMemory(newRomBufferReference)
      gbaInstance.setRom(newRomBufferReference.buffer)
    } else {
      gbaInstance.setRom(romBufferMemory.buffer)
    }

    if (restoreState !== undefined) {
      gbaInstance.defrost(cloneDeep(restoreState))
    }

    gbaInstance.runStable()

    return true
  }

  const updateFrozenAddreses = () =>
    setFrozenAddresses(cloneDeep(gba.frozenAddresses))

  const saveState = () =>
    gba.freeze()

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
