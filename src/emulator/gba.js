import { LogLevel } from "./logs";

window.GameBoyAdvance = class GameBoyAdvance {
	constructor() {
		this.SYS_ID = "com.endrift.gbajs";

		this.rom = null;

		this.cpu = new ARMCore();
		this.mmu = new GameBoyAdvanceMMU();
		this.irq = new GameBoyAdvanceInterruptHandler();
		this.io = new GameBoyAdvanceIO();
		this.audio = new GameBoyAdvanceAudio();
		this.video = new GameBoyAdvanceVideo();
		this.keypad = new GameBoyAdvanceKeypad();
		this.sio = new GameBoyAdvanceSIO();

		this.frozenAddresses = {};

		// TODO: simplify this graph
		this.cpu.mmu = this.mmu;
		this.cpu.irq = this.irq;

		this.mmu.cpu = this.cpu;
		this.mmu.core = this;

		this.irq.cpu = this.cpu;
		this.irq.io = this.io;
		this.irq.audio = this.audio;
		this.irq.video = this.video;
		this.irq.core = this;

		this.io.cpu = this.cpu;
		this.io.audio = this.audio;
		this.io.video = this.video;
		this.io.keypad = this.keypad;
		this.io.sio = this.sio;
		this.io.core = this;

		this.audio.cpu = this.cpu;
		this.audio.core = this;

		this.video.cpu = this.cpu;
		this.video.core = this;

		this.keypad.core = this;

		this.sio.core = this;

		this.keypad.registerHandlers();
		this.doStep = this.waitFrame;
		this.paused = false;

		this.seenFrame = false;
		this.seenSave = false;
		this.lastVblank = 0;

		this.reportFPS = null;

		var self = this;

		window.URL = window.URL || window.webkitURL;

		this.video.vblankCallback = function () {
			self.seenFrame = true;
		};
	}
	addFreezeAddress({ address, size, value }) {
		this.frozenAddresses[address] = { size, value };
	}
	removeFreezeAddress(address) {
		delete this.frozenAddresses[address];
	}
	requestFrame(callback) {
		this.requestFrameTimeoutId = setTimeout(callback, 16);
	}
	setCanvas(canvas) {
		this.context = canvas.getContext('2d');
		this.video.setBacking(this.context);
	}
	setBios(bios, real) {
		this.mmu.loadBios(bios, real);
	}
	setRom(rom) {
		this.reset();

		this.rom = this.mmu.loadRom(rom, true);
		if (!this.rom) {
			return false;
		}
		this.retrieveSavedata();
		return true;
	}
	hasRom() {
		return !!this.rom;
	}
	loadRomFromFile(romBuffer, callback) {
		this.setRom(romBuffer.buffer)
	  
		if (callback) {
		  callback(romBuffer.buffer)
		}
	}
	reset() {
		if (this.requestFrameTimeoutId) {
			window.clearTimeout(this.requestFrameTimeoutId);
			delete this.requestFrameTimeoutId;
		}

		this.audio.pause(true);

		this.mmu.clear();
		this.io.clear();
		this.audio.clear();
		this.video.clear();
		this.sio.clear();

		this.mmu.mmap(this.mmu.REGION_IO, this.io);
		this.mmu.mmap(
			this.mmu.REGION_PALETTE_RAM,
			this.video.renderPath.palette
		);
		this.mmu.mmap(this.mmu.REGION_VRAM, this.video.renderPath.vram);
		this.mmu.mmap(this.mmu.REGION_OAM, this.video.renderPath.oam);

		this.cpu.resetCPU(0);
	}
	step() {
		const mmuMemoryIram = this.mmu.memory[this.mmu.REGION_WORKING_IRAM];

		while (this.doStep()) {
			this.cpu.step();
			
			for (const address in this.frozenAddresses) {
				const { size, value } = this.frozenAddresses[address];
				
				switch (size) {
					case 8:
						mmuMemoryIram.store8(address, value);
						break;
					case 16:
						mmuMemoryIram.store16(address, value);
						break;
					case 32:
						mmuMemoryIram.store32(address, value);
						break;
				}
			}
		}
	}
	waitFrame() {
		var seen = this.seenFrame;
		this.seenFrame = false;
		return !seen;
	}
	pause() {
		this.paused = true;
		this.audio.pause(true);
	}
	advanceFrame() {
		this.step();
		if (this.seenSave) {
			if (!this.mmu.saveNeedsFlush()) {
				this.storeSavedata();
				this.seenSave = false;
			} else {
				this.mmu.flushSave();
			}
		} else if (this.mmu.saveNeedsFlush()) {
			this.seenSave = true;
			this.mmu.flushSave();
		}
	}
	runStable() {
		var self = this;
		var timer = 0;
		var frames = 0;
		var start = Date.now();
		this.paused = false;
		this.audio.pause(false);

		function callRunFnc() {
			if (self.reportFPS) {
				runFuncWithFpsReport();
				return;
			}
	
			runFuncSimple();
		}
	
		function runFuncSimple() {
			try {
				if (self.paused) {
					return;
				} else {
					self.requestFrame(callRunFnc);
				}
				self.advanceFrame();
			} catch(exception) {
				self.ERROR(exception);
				if (exception.stack) {
					self.logStackTrace(exception.stack.split('\n'));
				}
				throw exception;
			}
		};
	
		function runFuncWithFpsReport() {
			try {
				timer += Date.now() - start;
				if (self.paused) {
					return;
				} else {
					self.requestFrame(callRunFnc);
				}
				start = Date.now();
				self.advanceFrame();
				++frames;
				if (frames == 60) {
					self.reportFPS((frames * 1000) / timer);
					frames = 0;
					timer = 0;
				}
			} catch(exception) {
				self.ERROR(exception);
				if (exception.stack) {
					self.logStackTrace(exception.stack.split('\n'));
				}
				throw exception;
			}
		};
	
		self.requestFrame(callRunFnc);
	}
	setSavedata(data) {
		this.mmu.loadSavedata(data);
	}
	loadSavedataFromFile(saveFile) {
		var reader = new FileReader();
		var self = this;
		reader.onload = function (e) {
			self.setSavedata(e.target.result);
		};
		reader.readAsArrayBuffer(saveFile);
	}
	decodeSavedata(string) {
		this.setSavedata(this.decodeBase64(string));
	}
	decodeBase64(string) {
		var length = (string.length * 3) / 4;
		if (string[string.length - 2] == "=") {
			length -= 2;
		} else if (string[string.length - 1] == "=") {
			length -= 1;
		}
		var buffer = new ArrayBuffer(length);
		var view = new Uint8Array(buffer);
		var bits = string.match(/..../g);
		for (var i = 0; i + 2 < length; i += 3) {
			var s = atob(bits.shift());
			view[i] = s.charCodeAt(0);
			view[i + 1] = s.charCodeAt(1);
			view[i + 2] = s.charCodeAt(2);
		}
		if (i < length) {
			var s = atob(bits.shift());
			view[i++] = s.charCodeAt(0);
			if (s.length > 1) {
				view[i++] = s.charCodeAt(1);
			}
		}

		return buffer;
	}
	encodeBase64(view) {
		var data = [];
		var b;
		var wordstring = [];
		var triplet;
		for (var i = 0; i < view.byteLength; ++i) {
			b = view.getUint8(i, true);
			wordstring.push(String.fromCharCode(b));
			while (wordstring.length >= 3) {
				triplet = wordstring.splice(0, 3);
				data.push(btoa(triplet.join("")));
			}
		}
		if (wordstring.length) {
			data.push(btoa(wordstring.join("")));
		}
		return data.join("");
	}
	downloadSavedata() {
		var sram = this.mmu.save;
		if (!sram) {
			this.WARN("No save data available");
			return null;
		}
		if (window.URL) {
			var url = window.URL.createObjectURL(
				new Blob([sram.buffer], { type: "application/octet-stream" })
			);
			window.open(url);
		} else {
			var data = this.encodeBase64(sram.view);
			window.open(
				"data:application/octet-stream;base64," + data,
				this.rom.code + ".sav"
			);
		}
	}
	storeSavedata() {
		var sram = this.mmu.save;
		try {
			var storage = window.localStorage;
			storage[this.SYS_ID + "." + this.mmu.cart.code] = this.encodeBase64(
				sram.view
			);
		} catch (e) {
			this.WARN("Could not store savedata! " + e);
		}
	}
	retrieveSavedata() {
		try {
			var storage = window.localStorage;
			var data = storage[this.SYS_ID + "." + this.mmu.cart.code];
			if (data) {
				this.decodeSavedata(data);
				return true;
			}
		} catch (e) {
			this.WARN("Could not retrieve savedata! " + e);
		}
		return false;
	}
	freeze() {
		return {
			cpu: this.cpu.freeze(),
			mmu: this.mmu.freeze(),
			irq: this.irq.freeze(),
			io: this.io.freeze(),
			audio: this.audio.freeze(),
			video: this.video.freeze()
		};
	}
	defrost(frost) {
		this.cpu.defrost(frost.cpu);
		this.mmu.defrost(frost.mmu);
		this.audio.defrost(frost.audio);
		this.video.defrost(frost.video);
		this.irq.defrost(frost.irq);
		this.io.defrost(frost.io);
	}
	log(level, message) {}
	setLogger(logger) {
		this.log = logger;
	}
	logStackTrace(stack) {
		var overflow = stack.length - 32;
		if (overflow > 0) {
			this.log(-1, "> (Too many frames)");
		}
		for (var i = Math.max(overflow, 0); i < stack.length; ++i) {
			this.log(-1, "> " + stack[i]);
		}
	}
	ERROR(error) {
		this.log(LogLevel.error, error);
	}
	WARN(warn) {
		this.log(LogLevel.warn, warn);
	}
	STUB(func) {
		this.log(LogLevel.stub, func);
	}
	INFO(info) {
		this.log(LogLevel.info, info);
	}
	ASSERT_UNREACHED(err) {
		throw new Error("Should be unreached: " + err);
	}
	ASSERT(test, err) {
		if (!test) {
			throw new Error("Assertion failed: " + err);
		}
	}
}