const print = println;

const Init = {};
const self = Init;

self.deployStorage = [];
self.deployed = false;

self.____deployBlock = (is) => {
	if (self.deployed) {
		throw new Error();
	}
};

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
