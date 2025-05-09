/**
 * Used for module initialization control.
 */
class ModInit {
	locked: boolean = false;
	fn: () => void;
	constructor(fn: () => void) {
		this.fn = fn;
	}
}

var mods: Map<string, ModInit> = new Map();

/**
 * Use this to initialize a module when the program opens.
 * @param moduleName The name of the module.
 * @param safety An object used to ensure that modules are not initialized multiple times.
 * @param fn The function to run.
 */
export function deploy(moduleName: string, fn: () => void) {
	if (mods.has(moduleName)) {
		throw new Error("Module " + moduleName + " was already defined.");
	}
	mods.set(moduleName, new ModInit(fn));
}

var __deployed: boolean = false;
/**
 * Deploys all the modules to load up at initialization.
 */
export function ____run() {
	if (__deployed) {
		throw new Error("Deploy run twice.");
	}
	__deployed = true;

	for (let [moduleName, mod] of mods) {
		if (mod.locked) {
			throw new Error(
				"Mod [" + moduleName + "] was initialized twice, somehow."
			);
		}
		mod.locked = true;
		mod.fn();
	}
}
