const print = println;

const Init = new (function () {
	const deployStorage = [];
	var deployed = false;

	function deployBlock(is) {
		if (deployed) {
			throw new Error(is);
		}
	}

	/**
	 * Run a function when the program is initialized.
	 * @param {function(): void} inputFunc The function to run when the program hits main.
	 */
	this.deployFunction = (inputFunc) => {
		deployBlock("Do not run this function after main triggers.");
		deployStorage.push(inputFunc);
	};

	this.z____payload____ = () => {
		deployBlock("Do not run this function manually.");
		// print("Deploying functions.");
		deployStorage.forEach((f) => {
			f();
		});
		deployed = true;
	};
})();
