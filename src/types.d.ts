type Gba = any
type State = any

type ClearGbaInstance = () => void

type FpsCallback = (fps: number) => void

type FrozenAddress = { size: 8 | 16 | 32, value: number }
type FrozenAddresses = { [address in number]: FrozenAddress }

type Play = ({ newRomBuffer, restoreState }: { newRomBuffer: Uint8Array | undefined, restoreState: State | undefined }) => boolean
type SetFpsCallback = (newFpsCallback?: FpsCallback) => void
type SaveState = () => State
type AddFreezeAddress = ({ size, value}: FrozenAddress) => void
type RemoveFreezeAddress = (address: number) => void
