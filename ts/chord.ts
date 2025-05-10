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
		{
			const chord = chordDatabase.get(currentChord);
			if (chord) {
				MiniBuffer.setLabel(
					"Chord: " + currentChord + " | Running: " + chord.name
				);
				MiniBuffer.flush();
				exitRecord();
				chord.fn();
			}
			// todo: exit and set a timer to clear the buffer.
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

function resetMiniBufferAfterRecording() {
	writeln("running", MiniBuffer.hasPendingInteractive());
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
	registerChord("test_command", "control-control-x", () => {
		writeln("hi from chord recording!");
	});
}

//? END IMPLEMENTATION.

export function z____deploy(): void {
	KeyInput.setListener("chord_recorder_5000", doLogic);
	registerDefaultChords();
}
