const print = println;

const Init = {};
const self = Init;

self.deployStorage = [];
self.deployed = false;

Init.deployFunction = (inputFunc) => {
	if (self.deployed) {
		throw new Error("Do not run this function after main triggers.");
	}
	self.deployStorage.push(inputFunc);
};

self.__deploy = () => {
	if (self.deployed) {
		throw new Error("Do not run this function manually.");
	}
	// print("Deploying functions.");
	self.deployStorage.forEach((f) => {
		f();
	});
	self.deployed = true;
};
