enum LogLevel {
  error = 'error',
  warn = 'warn',
  stub = 'stub',
  info = 'info',
}

type WatchLogLevels = Partial<{ [level in LogLevel]: boolean }>

const makeLogger = (
  gba: Gba,
  watchLogLevels: WatchLogLevels,
  callback: (level: LogLevel, message: string) => void
) => (level: LogLevel, message: string) => {
  if (level === LogLevel.error) {
    gba.pause()
  }

  if (watchLogLevels[level] === false || watchLogLevels[level] === undefined) {
    return
  }

  callback(level, message)
}

export { LogLevel, WatchLogLevels, makeLogger }
