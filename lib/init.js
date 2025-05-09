const print = println;

const Init = {};
const self = Init;

self.deployStorage = [];

Init.deployFunction = (inputFunc) => {
	self.deployStorage.push(inputFunc);
};

self.__deploy = () => {
	// print("Deploying functions.");
	self.deployStorage.forEach((f) => {
		f();
	});
};
