import * as CSS from "./css";

var __deployed: boolean = false;

export function run() {
	if (__deployed) {
		throw new Error("Deploy run twice.");
	}
	__deployed = true;
	CSS.deploy();
}
