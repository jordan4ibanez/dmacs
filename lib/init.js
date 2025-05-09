const print = println;

const deployStorage = [];

const deployFunction = (inputFunc) => {
	deployStorage.push(inputFunc);
};

const initJSDeploy = () => {
	// print("Deploying functions.");
	deployStorage.forEach((f) => {
		f();
	});
};

const Final = {
	// constructor() {
	// 	throw new Error("no");
	// }
};

Final.blah = function () {
	print("blah!");
	this.x = 5;
};
