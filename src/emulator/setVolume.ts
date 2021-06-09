const setVolume = (gba: Gba, value: number) =>
  gba.audio.masterVolume = Math.pow(2, value) - 1

export default setVolume
