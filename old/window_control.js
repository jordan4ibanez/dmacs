const WindowControl = new (function () {
	
	

	/**
	 * Create a textarea node.
	 * @param {string} id The ID of this text area.
	 * @param {*} buffer Which text buffer this text area is attached to.
	 * @returns Textarea node.
	 */
	this.createTextArea = (id, buffer) => {
		if (buffer == null) {
			buffer = "*scratch*";
		}
		if (id == null) {
			throw new Error("id is null");
		}

		const newTextArea = document.createElement("textarea");
		newTextArea.className = "textarea";
		newTextArea.id = id;

		newTextArea.oncut = () => {
			return false;
		};
		newTextArea.onpaste = () => {
			return false;
		};
		newTextArea.onkeydown = () => {
			return false;
		};
		newTextArea.ondragenter = () => {
			return false;
		};
		newTextArea.ondragleave = () => {
			return false;
		};
		newTextArea.ondragover = () => {
			return false;
		};
		newTextArea.ondrop = () => {
			return false;
		};

		newTextArea.addEventListener("input", () => {
			// println(newTextArea.value);
		});

		return newTextArea;
	};

	Init.deployFunction(() => {
		// The secret element is the master container.
		const rootDiv = document.createElement("div");
		rootDiv.className = "root";
		rootDiv.id = "root";
		rootDiv.style.height = "calc(100% - 26px)";
		document.body.appendChild(rootDiv);

		const windowArea = document.createElement("div");
		windowArea.className = "window_area";
		windowArea.id = "window_area";
		windowArea.style.height = "100%";
		rootDiv.appendChild(windowArea);

		// Create the initial window area.
		windowArea.appendChild(WindowControl.createTextArea("main_window"));

		// rootDiv.appendChild
	});
})();
