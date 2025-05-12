import * as MiniBuffer from "./mini_buffer";
// import * as Init from "./init";
import * as KeyInput from "./key_input";
import * as WindowControl from "./window_control";

var inChord: boolean = false;
var currentChord: string = "";
var chordCount: number = 0;
var clearMinibufferTimeout: number = 2000;
var timeOutIDs: number[] = [];
var chordRecordTimeout = 2000;

//? Note: This is set up slightly differently than emacs.
//? Emacs kind of forces you to cramp your hand and that hurt mine.
//? So, you can just hit C-M-x, etc, and it'll work the same.
//? This is also designed to accept ANY key.

//todo: make it so more keys could be added in?

/**
 * These are the keys that can initialize a chord.
 */
const metaKeys: Set<string> = new Set([
	"control",
	"alt",
	"escape",
	"f1",
	"f2",
	"f3",
	"f4",
	"f5",
	"f6",
	"f7",
	"f8",
	"f9",
	"f10",
	"f11",
	"f12",
]);

interface ChordDefinition {
	name: string;
	fn: () => void;
}

//* sequence -> {name, function}
const chordDatabase: Map<string, ChordDefinition> = new Map();
//* name -> squence
const nameToSequenceDatabase: Map<string, string> = new Map();
//? Done like this to prioritize sequence access time.

/**
 * Register a chord key shortcut.
 * @param name The name of this command.
 * @param keySequence The chord's key sequence. control-alt-tab, etc
 * @param fn The function to run.
 */
export function registerChord(
	name: string,
	keySequence: string,
	fn: () => void
) {
	{
		const old: ChordDefinition | undefined = chordDatabase.get(keySequence);
		if (old) {
			// Wipe the old reverse lookup from the database.
			writeln("Overwriting chord: " + keySequence);
			const n: string = old.name;
			nameToSequenceDatabase.delete(n);
		}
	}

	chordDatabase.set(keySequence, { name: name, fn: fn });
	nameToSequenceDatabase.set(name, keySequence);
}

/**
 * This is the logic that chord uses to chord. :D
 * @param keyPressEvent The key press.
 */
export function doLogic(keyPressEvent: KeyboardEvent): void {
	// Do not record a new chord if interacting with the mini buffer.
	if (MiniBuffer.isInInteractiveMode()) {
		exitRecord();
		return;
	}
	const thisKey = keyPressEvent.key.toLocaleLowerCase();

	if (!inChord) {
		if (metaKeys.has(thisKey)) {
			clearTimeouts();
			if (chordRecordTimeout > 0) {
				timeOutIDs.push(
					window.setTimeout(
						resetMiniBufferAfterTimeout,
						chordRecordTimeout
					)
				);
			}
			currentChord = thisKey;
			inChord = true;
			chordCount++;

			MiniBuffer.reset();
			MiniBuffer.setLabel("Chord: " + currentChord);
			MiniBuffer.flush();
		}
	} else {
		clearTimeouts();
		if (chordRecordTimeout > 0) {
			timeOutIDs.push(
				window.setTimeout(
					resetMiniBufferAfterTimeout,
					chordRecordTimeout
				)
			);
		}

		if (thisKey == " ") {
			currentChord += "-space";
		} else {
			currentChord += "-" + thisKey;
		}

		MiniBuffer.setLabel("Chord: " + currentChord);
		MiniBuffer.flush();

		{
			const chord = chordDatabase.get(currentChord);
			if (chord) {
				clearTimeouts();

				MiniBuffer.setLabel(
					"Chord: " + currentChord + " | Running: " + chord.name
				);
				MiniBuffer.flush();
				exitRecord();
				chord.fn();

				// Automatically clear out the minibuffer after 1 second when command is run.
				timeOutIDs.push(
					window.setTimeout(
						resetMiniBufferAfterRecording,
						clearMinibufferTimeout
					)
				);
				return;
			}
		}

		chordCount++;

		if (chordCount > 5) {
			clearTimeouts();

			MiniBuffer.setLabel(
				"Chord: " + currentChord + " is not a command."
			);
			MiniBuffer.flush();
			exitRecord();

			// Automatically clear out the minibuffer after 1 second when failure is hit.
			timeOutIDs.push(
				window.setTimeout(
					resetMiniBufferAfterRecording,
					clearMinibufferTimeout
				)
			);
		}
	}
}

function clearTimeouts() {
	while (timeOutIDs.length > 0) {
		window.clearTimeout(timeOutIDs.pop()!);
	}
}

function resetMiniBufferAfterTimeout() {
	writeln("a", MiniBuffer.hasPendingInteractive());
	if (
		MiniBuffer.isInInteractiveMode() ||
		MiniBuffer.hasPendingInteractive() ||
		!inChord
	) {
		return;
	}

	exitRecord();

	MiniBuffer.reset();
}

function resetMiniBufferAfterRecording() {
	writeln("b", MiniBuffer.hasPendingInteractive());
	if (
		MiniBuffer.isInInteractiveMode() ||
		MiniBuffer.hasPendingInteractive() ||
		inChord
	) {
		return;
	}

	MiniBuffer.reset();
}

/**
 * Set the minibuffer clear timeout after a command either runs or the chord fails.
 * @param newTimeout The time it takes for the minibuffer to be cleared after a command runs or the chord fails.
 */
export function setFinishedClearTimeout(newTimeout: number): void {
	clearMinibufferTimeout = newTimeout;
}

/**
 * Get the minibuffer clear timeout after a command either runs or the chord fails.
 * @returns The current clear timeout.
 */
export function getFinishedClearTimeout(): number {
	return clearMinibufferTimeout;
}

/**
 * Set the minibuffer clear timeout after a key was pressed in the sequence.
 * @param newTimeout The new timeout for recording chord input.
 */
export function setRecordingTimeout(newTimeout: number): void {
	chordRecordTimeout = newTimeout;
}

/**
 * Get the minibuffer clear timeout after a key was pressed in the sequence.
 * @returns The timeout for recording chord input.
 */
export function getRecordingTimeout(): number {
	return chordRecordTimeout;
}

/**
 * Cancel the current recording, if any.
 * Resets the state.
 */
export function exitRecord(): void {
	if (inChord) {
		inChord = false;
		currentChord = "";
		chordCount = 0;
	}
}

/**
 * Add a new meta key to use with initializing chords.
 * @param key The meta key to add.
 */
export function addMetaKey(key: string): void {
	metaKeys.add(key);
}

/**
 * Add an existing meta key.
 * @param key The meta key to remove.
 * @returns Success.
 */
export function removeMetaKey(key: string): boolean {
	return metaKeys.delete(key);
}

function registerDefaultChords(): void {
	registerChord("exit", "control-x-c", () => {
		dClose();
	});

	registerChord("split_vertical", "control-x-2", () => {
		WindowControl.split(WindowControl.Orientation.vertical);
	});

	registerChord("split_horizontal", "control-x-3", () => {
		WindowControl.split(WindowControl.Orientation.horizontal);
	});

	registerChord("destroy_window", "control-x-0", () => {
		WindowControl.destroy();
	});
}

//? END IMPLEMENTATION.

export function z____deploy(): void {
	KeyInput.setListener("chord_recorder_5000", doLogic);
	registerDefaultChords();
}
