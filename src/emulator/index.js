import { fadeOut } from './fades'
import './util'
import './core'
import './arm'
import './thumb'
import './mmu'
import './io'
import './audio'
import './video'
import './video/proxy'
import './video/software'
import './irq'
import './keypad'
import './sio'
import './savedata'
import './gpio'
import './gba'
import biosBin from '../../assets/bios.bin'
import { makeLogger } from './logs'

const drawEmulator = (buffer, canvas) => {
  var gba
  var runCommands = []
  var debug = null

  try {
    gba = new GameBoyAdvance();
    gba.keypad.eatInput = true;

    gba.setLogger(
      makeLogger(gba, { error: true }, () => {})
    );
  } catch (exception) {
    gba = null;
  }

  gba.setCanvas(canvas);

  gba.setBios(biosBin);

  function run(file) {
    gba.loadRomFromFile(file, function(result) {
      if (result) {
        for (var i = 0; i < runCommands.length; ++i) {
          runCommands[i]();
        }
        runCommands = [];
        fadeOut('preload', 'ingame');
        fadeOut('instructions', null, true);
        gba.runStable();
      } else {
        setTimeout(function() {
          load.onclick = function() {
            document.getElementById('loader').click();
          }
        }, 3000);
      }
    });
  }

  function uploadSavedataPending(file) {
    runCommands.push(function() { gba.loadSavedataFromFile(file) });
  }

  function togglePause() {
    if (gba.paused) {
      if (debug && debug.gbaCon) {
        debug.gbaCon.run();
      } else {
        gba.runStable();
      }
    } else {
      if (debug && debug.gbaCon) {
        debug.gbaCon.pause();
      } else {
        gba.pause();
      }
    }
  }

  function screenshot() {
    var canvas = gba.indirectCanvas;
    window.open(canvas.toDataURL('image/png'), 'screenshot');
  }

  function setPixelated(pixelated) {
    var screen = document.getElementById('screen');
    var context = screen.getContext('2d');
    if (context.webkitImageSmoothingEnabled) {
      context.webkitImageSmoothingEnabled = !pixelated;
    } else if (context.mozImageSmoothingEnabled) {
      context.mozImageSmoothingEnabled = !pixelated;
    } else if (window.navigator.appName != 'Microsoft Internet Explorer') {
        if (pixelated) {
          screen.setAttribute('width', '240');
          screen.setAttribute('height', '160');
        } else {
          screen.setAttribute('width', '480');
          screen.setAttribute('height', '320');
        }
        if (window.navigator.appName == 'Opera') {
        // Ugly hack! Ew!
        if (pixelated) {
          screen.style.marginTop = '0';
          screen.style.marginBottom = '-325px';
        } else {
          delete screen.style;
        }
      }
    }
  }

  function enableDebug() {
    window.onmessage = function(message) {
      if (message.origin != document.domain && (message.origin != 'file://' || document.domain)) {
        console.log('Failed XSS');
        return;
      }
      switch (message.data) {
      case 'connect':
        if (message.source == debug) {
          debug.postMessage('connect', document.domain || '*');
        }
        break;
      case 'connected':
        break;
      case 'disconnect':
        if (message.source == debug) {
          debug = null;
        }
      }
    }
    window.onunload = function() {
      if (debug && debug.postMessage) {
        debug.postMessage('disconnect', document.domain || '*');
      }
    }
    if (!debug || !debug.postMessage) {
      debug = window.open('debugger.html', 'debug');
    } else {
      debug.postMessage('connect', document.domain || '*');
    }
  }

  run(buffer)

  return gba
}

export default drawEmulator
