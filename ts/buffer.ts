import * as Chord from "./chord";

var focusedBuffer: string | null = null;
const database: Map<string, string> = new Map();

/**
 * Set the currently focused buffer.
 * @param bufferName The name of the buffer.
 */
export function setFocus(bufferName: string): void {
	focusedBuffer = bufferName;
	Chord.exitRecord();
}

/**
 * Get the currently focused buffer.
 * @returns The currently focused buffer. Or null.
 */
export function getFocus(): string | null {
	return focusedBuffer;
}

/**
 * Create a new buffer. This is a no-op if the buffer already exists.
 * @param bufName The name of the buffer to create.
 * @param text The text of the buffer. Defaults to "".
 */
export function create(bufName: string, text: string = ""): void {
	if (database.has(bufName)) {
		writeln(
			"Warning: Buffer [" + bufName + "] already exists. Cannot create."
		);
		return;
	}
	database.set(bufName, text);
}
}
