# <img src="/assets/logo.png" height="75px" /> 

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

const ButtonStartEmulator = () => {
  const {
    play,
  } = useContext(GbaContext)

  const startEmulator = () => {
    const gameRom = getGameRom()
    play({ newRomBuffer: gameRom })
  }

  return (
    <button onClick={() => startEmulator()}>
      Start Emulator
    </button>
  )
}
```

3 - And render the emulator using the default export

```jsx
import ReactGbaJs from 'react-gbajs'

const Emulator = () => (
  <ReactGbaJs />
)
```

Done! 🎉 <br />
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

#### `play({ newRomBuffer, restoreState }): boolean`

Use this function to start or restart the emulator.

Pass at `newRomBuffer` the game's ROM to load it:

```js
play({ newRomBuffer: myGameRom })
```

You can also fill the property `restoreState` to restore to a previous state saved using `saveState`. If both are present, the emulator will be reset loading the ROM, and then restored to the given state:

```js
play({ newRomBuffer: myGameRom, restoreState: someState })
```

If you pass only `restoreState`, the previous ROM will be re-loaded and will start on the given state. If there is no ROM previously loaded, it won't work.

```js
play({ restoreState: someState })
```

#### `saveState()`

Return the serializable state of the emulator.

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

#### `volume={number}` (optional)

Should be a number between `0` (default, muted) or `1` (max volume).

#### `onFpsReported={((fps: number) => void)}` (optional)

Callback called every time that an FPS is reported.

#### `scale={number}` (optional)

Set the emulator scale. Default value is `1`, which has width 240px and height 160px.

#### `onLogReceived={(level: 'error' | 'warn' | 'stub' | 'info', message: string) => void}` (optional)

Callback called every time that a log is received within the levels set as `true` by the prop `watchLogLevels`.

#### `watchLogLevels={{ error?: boolean, warn?: boolean, stub?: boolean, info?: boolean }}` (optional)

Set when the callback `onLogReceived` should be called. By default the value is `{ error: true }`.

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

# Thanks

[@endrift](https://twitter.com/endrift) for GBA.js.<br />
[@felix.rodent](https://twitter.com/felixrodent) for the logo.
