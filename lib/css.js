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
 * @param {string | object} keyOrBulk The key. Or, Object if you want to bulk set.
 * @param {*} value The value.
 * @param {boolean} flush If the CSS should be rebuilt immediately.
 */
css.set = (clazz, keyOrBulk, value, flush = false) => {
	const t = typeof keyOrBulk;

	if (cssClassThings[clazz] == null) {
		cssClassThings[clazz] = {};
	}

	if (t === "string") {
		cssClassThings[clazz][keyOrBulk] = value;
	} else if (t === "object") {
		for (let [key, value] of Object.entries(keyOrBulk)) {
			cssClassThings[clazz][key] = value;
		}
	}

	if (flush) {
		css.rebuild();
	}
};
