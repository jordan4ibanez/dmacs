Init.deployFunction(() => {
	var styleSheet = document.createElement("style");
	styleSheet.id = "SuperCSS";
	styleSheet.textContent = "";
	document.head.appendChild(styleSheet);
});

const CSS = new (function () {
	const cssClassContainer = {};

	/**
	 * Updates the CSS of the page.
	 */
	this.rebuild = () => {
		var rebuild = [];
		rebuild.push("\n");
		for (let [clazz, component] of Object.entries(cssClassContainer)) {
			if (clazz === "*") {
				rebuild.push(`${clazz} {\n`);
			} else {
				rebuild.push(`.${clazz} {\n`);
			}

			for (let [key, value] of Object.entries(component)) {
				// print(key, value);
				rebuild.push(`  ${key}: ${value};\n`);
			}
			rebuild.push(`}\n\n`);
		}

		const f = rebuild.join("");
		// console.log(f);
		document.getElementById("SuperCSS").textContent = f;
	};

	/**
	 * Set CSS through javascript.
	 * @param {string | object} clazzOrBulk Which class this will work on. Or, a super-bulk set object.
	 * @param {string | object} keyOrBulk The key. Or, Object if you want to bulk set. If clazzOrBulk is an object, this has no effect.
	 * @param {*} value The value. If (clazzOrBulk or keyOrBulk) is an object, this has no effect.
	 */
	this.set = (clazzOrBulk, keyOrBulk, value) => {
		const typeClassOrBulk = typeof clazzOrBulk;

		if (typeClassOrBulk === "string") {
			const typeKeyOrBulk = typeof keyOrBulk;

			if (cssClassContainer[clazzOrBulk] == null) {
				cssClassContainer[clazzOrBulk] = {};
			}

			//? Non bulk.
			if (typeKeyOrBulk === "string") {
				cssClassContainer[clazzOrBulk][keyOrBulk] = value;
				//? Semi-bulk.
			} else if (typeKeyOrBulk === "object") {
				for (let [key, value] of Object.entries(keyOrBulk)) {
					cssClassContainer[clazzOrBulk][key] = value;
				}
			} else {
				throw new Error("wrong type! [1]");
			}
			//? Bulk.
		} else if (typeClassOrBulk === "object") {
			for (let [clazz, entry] of Object.entries(clazzOrBulk)) {
				if (typeof entry !== "object") {
					throw new Error(
						"Bulk needs to use objects to define the class!"
					);
				}
				if (cssClassContainer[clazz] == null) {
					cssClassContainer[clazz] = {};
				}

				for (let [key, value] of Object.entries(entry)) {
					cssClassContainer[clazz][key] = value;
				}
			}
		} else {
			throw new Error("wrong type! [2]");
		}

		this.rebuild();
	};
})();
