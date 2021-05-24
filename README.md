# react-gbajs

> GBA emulator on your React project - easy and powerful to use!

Just three steps to set it up ✨

1 - Apply `GbaProvider`
```jsx
import { GbaProvider } from 'react-gbajs'

const App = () => (
  <GbaProvider>
    ...
  </GbaProvider>
)
```

2 - Get `play` function from `GbaContext` and call it with the game ROM
```jsx
import { useContext } from 'react'
import { GbaContext } from 'react-gbajs'

const Component = () => {
  const {
    play,
  } = useContext(GbaContext)

  const onSomeHandle = () => {
    const gameRom = getGameRom()
    play(gameRom)
  }

  return (
    <SomeComponent startGame={onSomeHandle}>
  )
}
```

3 - And render the emulator using the default export

```js
import ReactGbaJs from 'react-gbajs'

const Emulator = () => (
  <ReactGbaJs volume={0} />
)
```

Check a full example in [`/sample`](sample).

## How it works

This package is a React wrapper for [GBA.js](https://github.com/endrift/gbajs).

`GBA.js` is vendored, with new features over the original version:
- save and restore state
- freeze address with a given value

## Who is using

<table align="center">
    <tr>
        <td align="center" width="50%">
          <img src="https://i.imgur.com/QxCoVPh.png"><br />
          <strong><a href="https://github.com/macabeus/klo-gba.js">klo-gba.js</a></strong>, level editor for <strong>Klonoa: Empire of Dreams<strong>
        </td>
        <td align="center" width="50%">
          <i><a href="https://github.com/macabeus/react-gbajs/issues/new">Add your project here</a></i>
        </td>
    </tr>
</table>

## Features

### `GbaContext`

`GbaContext` exports the following properties:

#### `play(newRomBufferMemory)`

Use this method to play the emulator, passing as its argument the game's ROM. Every time this function is called, it creates a new `GameBoyAdvance` instance, so all game progress is lost.

#### `saveState()`

Return the serializable state of the emulator.

#### `updateState({ restoreState, newRomBuffer })`

Use this function passing `restoreState` to restore to a previous state saved using `saveState`. You can also pass `newRomBuffer` to reset the emulator and then load a new ROM. If both are passed, the emulator will be reset with the new ROM and then restored to the given state.

#### `addFreezeAddress({ address: number, size: 8 | 16 | 32, value: number })`

Freeze an address with the given value.

#### `removeFreezeAddress(address: number)`

Remove the freeze value on the given address.

#### `frozenAddresses()`

Return the list of the addresses frozen in the following format:

```ts
{
  [address in number]: { size: 8 | 16 | 32, value: number }
}
```

### `<ReactGbaJs />`

`<ReactGbaJs />` has the following props:

#### `volume={number}`

Should be a number between `0` (muted) or `1` (max volume).

#### `onFpsReported={((fps: number) => void) | undefined}`

This callback is called every time that an FPS is reported.

# Contribution

1 - Clone this repository

```
> git clone git@github.com:macabeus/react-gbajs.git
> cd react-gbajs
```

2 - Build and watch the project

```
> npm run start
```

3 - In another terminal window, go to the [`/sample`](sample) project, then build and watch it

```
> cd sample
> npm run start
```

Finished! Now you can develop the package and test it in real-time 🎉
