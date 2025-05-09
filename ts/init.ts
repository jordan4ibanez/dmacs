var __deployed: boolean = false;

export class Safety {
	protected tick: boolean = false;
}

//? These are synchronized.
var fns: (() => void)[] = [];
var saf: Safety[] = [];

/**
 * 
 * @param moduleName The name of the module.
 * @param safety An object used to ensure that modules are not initialized multiple times.
 * @param fn 
 */
export function deploy(moduleName: string, safety: Safety, fn: () => void) {
	fns.push(fn);
	if (!safety) {
		throw new Error("Safety was null.");
	}
	saf.push(safety);
}

/**
 * Deploys all the modules to load up at initialization.
 */
export function run() {
	if (__deployed) {
		throw new Error("Deploy run twice.");
	}
	__deployed = true;

	fns.forEach((fn: () => void) => {
		fn();
	});
}
