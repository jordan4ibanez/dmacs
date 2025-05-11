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

}
