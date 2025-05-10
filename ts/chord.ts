import * as MiniBuffer from "./mini_buffer";
import * as Init from "./init";
import * as KeyInput from "./key_input";

var inChord: boolean = false;
var currentChord: string = "";
var chordCount: number = 0;

//? Note: This is set up slightly differently than emacs.
//? Emacs kind of forces you to cramp your hand and that hurt mine.
//? So, you can just hit C-M-x, etc, and it'll work the same.
//? This is also designed to accept ANY key.

//.todo: make it so more keys could be added in?

/**
 * These are the keys that can initialize a chord.
 */
const metaKeys = [
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
];

const chordLinks: Map<string, () => void> = new Map();

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
		for (const key of metaKeys) {
			if (key === thisKey) {
				currentChord = key;
				inChord = true;
				chordCount++;
				break;
			}
		}
		if (inChord) {
			MiniBuffer.reset();
			MiniBuffer.setLabel("Chord: " + currentChord);
			MiniBuffer.flush();
		}
	} else {
		if (thisKey == " ") {
			currentChord += "-space";
		} else {
			currentChord += "-" + thisKey;
		}

		MiniBuffer.setLabel("Chord: " + currentChord);
		MiniBuffer.flush();

		// todo: search up function to run. if found: return
		const func = chordLinks.get(currentChord);
		if (func) {
			func();
		}

		chordCount++;

		if (chordCount > 5) {
			MiniBuffer.setLabel(
				"Chord: " + currentChord + " is not a command."
			);
			MiniBuffer.flush();
			exitRecord();

			// todo: timeout function. If there's not a new chord and there's not an interaction, wipe the minibuffer
		}
	}
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

function registerDefaultChords(): void {
	// todo: Register the default chords.
}

//? END IMPLEMENTATION.

export function z____deploy() {
	KeyInput.setListener("chord_recorder_5000", doLogic);
	registerDefaultChords();
}
