deployFunction(() => {
	var styleSheet = document.createElement("style");
	styleSheet.textContent = "";
	document.head.appendChild(styleSheet);
});

var cssClassThings = {};

const css = {};

css.set = (clazz, key, value) => {
	if (cssClassThings[clazz] == null) {
		cssClassThings[clazz] = {};
	}
	cssClassThings[clazz][key] = value;
};
