deployFunction(() => {
	var styleSheet = document.createElement("style");
	styleSheet.id = "SuperCSS";
	styleSheet.textContent = "";
	document.head.appendChild(styleSheet);
});

var cssClassThings = {};

const css = {};

css.rebuild = () => {
	var rebuild = [];
	rebuild.push("\n");
	for (let [clazz, component] of Object.entries(cssClassThings)) {
		rebuild.push(`.${clazz} {\n`);

		for (let [key, value] of Object.entries(component)) {
			// print(key, value);
			rebuild.push(`  ${key}: ${value};\n`);
		}
		rebuild.push(`}\n\n`);
	}

	const f = rebuild.join("");
	console.log(f);
	document.getElementById("SuperCSS").textContent = f;
};

/**
 * Set CSS through javascript.
 * @param {string} clazz Which class this will work on.
 * @param {string} key The key.
 * @param {*} value The value.
 */
css.set = (clazz, key, value, autoFlush = false) => {
	if (cssClassThings[clazz] == null) {
		cssClassThings[clazz] = {};
	}
	cssClassThings[clazz][key] = value;

	if (autoFlush) {
		css.rebuild();
	}
};
