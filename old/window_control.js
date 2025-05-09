const WindowControl = new (function () {
	
	

	/**
	 * 
	 * @param {string} id 
	 * @param {*} buffer 
	 * @returns Textarea 
	 */
	this.createTextArea = () => {
		
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
