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
