import { lcdFade, fadeOut } from './fades'

const reset = gba => {
  gba.pause()
  gba.reset()

  lcdFade(
    gba.context,
    gba.targetCanvas.getContext('2d'),
    gba.video.drawCallback
  );

  fadeOut('ingame', 'preload');
}

export default reset
