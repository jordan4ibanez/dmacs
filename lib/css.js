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
 * @param {string | object} clazzOrBulk Which class this will work on. Or, a super-bulk set object.
 * @param {string | object} keyOrBulk The key. Or, Object if you want to bulk set.
 * @param {*} value The value.
 * @param {boolean} flush If the CSS should be rebuilt immediately.
 */
css.set = (clazzOrBulk, keyOrBulk, value, flush = false) => {
	const tclzz = typeof clazzOrBulk;

	if (tclzz === "string") {
		const tkob = typeof keyOrBulk;

		if (cssClassThings[clazzOrBulk] == null) {
			cssClassThings[clazzOrBulk] = {};
		}

		// Non bulk.
		if (tkob === "string") {
			cssClassThings[clazzOrBulk][keyOrBulk] = value;
			// Semi-bulk.
		} else if (tkob === "object") {
			for (let [key, value] of Object.entries(keyOrBulk)) {
				cssClassThings[clazzOrBulk][key] = value;
			}
		} else {
			throw new Error("wrong type! [1]");
		}
	} else if (tclzz === "object") {
        
	} else {
		throw new Error("wrong type! [2]");
	}

	if (flush) {
		css.rebuild();
	}
};
