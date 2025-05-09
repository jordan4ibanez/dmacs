var ____deployed: boolean = false;

export function ____deploy() {
	if (____deployed) {
		throw new Error("CSS initialized twice.");
	}
	____deployed = true;
	var styleSheet = document.createElement("style");
	styleSheet.id = "SuperCSS";
	styleSheet.textContent = "";
	document.head.appendChild(styleSheet);
}
