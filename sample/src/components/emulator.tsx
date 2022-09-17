import React, { FunctionComponent } from 'react';
import ReactGbaJs from 'react-gbajs';

type Props = { scale: number; printFps: boolean };
const Emulator: FunctionComponent<Props> = ({ scale, printFps }) => {
  const fpsReportCallback = printFps
    ? (fps: number) => console.log('FPS', fps)
    : undefined;

  return (
    <ReactGbaJs
      onFpsReported={fpsReportCallback}
      scale={scale}
      volume={1}
      watchLogLevels={{ error: true, warn: true }}
      onLogReceived={(level, message) => {
        console.log(
          `Received a log level ${level} with the message "${message}"`
        );
      }}
    />
  );
};

export default Emulator;
