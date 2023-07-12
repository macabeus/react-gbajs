import React, { FunctionComponent, useState, useRef, ReactNode } from 'react'
import cloneDeep from 'lodash.clonedeep'
import drawEmulator from '../emulator'
import GbaContext from './gba-context'

type Props = {
  children?: ReactNode
};

const GbaProvider: FunctionComponent<Props> = ({ children }) => {
  const [gba, setGba] = useState<Gba>()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [fpsCallback, setFpsCallback] = useState<FpsCallback>()
  const [romBufferMemory, setRomBufferMemory] = useState<Uint8Array>()
  const [frozenAddresses, setFrozenAddresses] = useState({})

  const play: Play = ({ newRomBuffer, restoreState }) => {
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
      gbaInstance.setRom(romBufferMemory!.buffer)
    }

    if (restoreState !== undefined) {
      gbaInstance.defrost(cloneDeep(restoreState))
    }

    gbaInstance.runStable()

    return true
  }

  const updateFrozenAddreses = () =>
    setFrozenAddresses(cloneDeep(gba!.frozenAddresses))

  const saveState = () =>
    gba.freeze()

  const clearGbaInstance = () =>
    setGba(undefined)

  return (
    <GbaContext.Provider value={{
      gba,
      clearGbaInstance,
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

export default GbaProvider
