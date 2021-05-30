import React, { FunctionComponent } from 'react'

type Props = { printFps: boolean, setPrintFps: (value: boolean) => void }
const TogglePrintFps: FunctionComponent<Props> = ({ printFps, setPrintFps }) => (
  <div>
    <input
      type='checkbox'
      checked={printFps}
      onChange={(e) => { setPrintFps(e.target.checked) }}
    />
    <label>Print FPS on the console</label>
  </div>
)

export default TogglePrintFps
