import React, { FunctionComponent } from 'react'

type Props = { scale: number, setScale: (value: number) => void }
const InputScale: FunctionComponent<Props> = ({ scale, setScale }) => (
  <div>
    <label>Scale</label>
    <input
      type='range'
      value={scale}
      min={0.5}
      step={0.25}
      max={3}
      onChange={(e) => { setScale(Number(e.target.value)) }}
    />
  </div>
)

export default InputScale
