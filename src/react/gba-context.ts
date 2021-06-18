import React, { Ref } from 'react'

const defaultValue = {
  gba: undefined as Gba,
  clearGbaInstance: (() => {}) as ClearGbaInstance,
  setFpsCallback: (() => {}) as SetFpsCallback,
  canvasRef: undefined as unknown as Ref<HTMLCanvasElement>,
  play: (() => {}) as unknown as Play,
  saveState: (() => {}) as SaveState,
  frozenAddresses: {} as FrozenAddresses,
  addFreezeAddress: (() => {}) as AddFreezeAddress,
  removeFreezeAddress: (() => {}) as RemoveFreezeAddress,
}
const GbaContext = React.createContext(defaultValue)

export default GbaContext
