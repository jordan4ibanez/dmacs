var __deployed: boolean = false;

class Safety {
	protected tick: boolean = false;
}

//? These are synchronized.
var fns: (() => void)[] = [];
var saf: Safety[] = [];

/**
 *
 * @param fn You pass this function a blank object for
 */
export function add(safety: Safety, fn: () => void) {
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
