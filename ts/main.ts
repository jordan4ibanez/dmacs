import * as CSS from "./css";
import * as Deploy from "./init";
Deploy.z____run();

function closeWindow() {
	if (confirm("Close Window?")) {
		dClose("hi");
	}
}

(function main() {
	createBuffer("*scratch*");
})();
