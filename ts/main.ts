import * as CSS from "./css";
import * as Deploy from "./init";
import * as Split from "./split";
Deploy.z____run();

function closeWindow() {
	if (confirm("Close Window?")) {
		dClose("hi");
	}
}

(function main() {
	createBuffer("*scratch*");
	Split.testing();
})();
