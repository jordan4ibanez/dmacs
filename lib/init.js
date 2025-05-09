const print = println;

const Init = {};
{
	const self = Init;

	self.deployStorage = [];
	self.deployed = false;

	self.____deployBlock = (is) => {
		if (self.deployed) {
			throw new Error(is);
		}
	};

	/**
	 * Run a function when the program is initialized.
	 * @param {function(): void} inputFunc The function to run when the program hits main.
	 */
	Init.deployFunction = (inputFunc) => {
		self.____deployBlock("Do not run this function after main triggers.");
		self.deployStorage.push(inputFunc);
	};

	self.__deploy = () => {
		self.____deployBlock("Do not run this function manually.");
		// print("Deploying functions.");
		self.deployStorage.forEach((f) => {
			f();
		});
		self.deployed = true;
	};
}
