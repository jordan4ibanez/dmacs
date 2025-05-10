import * as Buffer from "./buffer";
import * as Chord from "./chord";
import * as CSS from "./css";
import * as MiniBuffer from "./mini_buffer";
import * as WindowControl from "./window_control";
import * as KeyInput from "./key_input";

var __deployed: boolean = false;
/**
 * Deploys all the modules to load up at initialization.
 */
export function z____run() {
	if (__deployed) {
		throw new Error("Deploy run twice.");
	}
	__deployed = true;

	Chord.z____deploy();
	CSS.z____deploy();
	WindowControl.z____deploy();
	KeyInput.z____deploy();
}
