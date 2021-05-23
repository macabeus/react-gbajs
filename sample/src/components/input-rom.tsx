import React, { useContext } from 'react'
import { GbaContext } from 'react-gbajs'

const getFileContent = async (file: File) =>
  new Promise<Uint8Array>((resolve, reject) => {
    const reader = new FileReader()

    reader.onerror = (ev) => {
      reject(ev.target.error)
    }

    reader.onload = (ev) => {
      const { result } = ev.target

      if (typeof result === 'string') {
        reject(new Error('Wrong file type'))
        return
      }

      const buffer = new Uint8Array(result)
      resolve(buffer)
    }

    reader.readAsArrayBuffer(file)
  })

const InputROM = () => {
  const {
    play: playGba,
  } = useContext(GbaContext)

  const onChangeHandle = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const [file] = event.target.files
    const result = await getFileContent(file)
    playGba(result)
  }

  return (
    <input
      type='file'
      onChange={onChangeHandle}
    />
  )
}

export default InputROM
