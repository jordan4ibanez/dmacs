function close_window() {
	if (confirm("Close Window?")) {
		dClose("hi");
	}
}

// var elemDiv = document.createElemendocument.body.innerHTML += '<div style="position:absolute;width:100%;height:100%;opacity:0.3;z-index:100;background:#000;"></div>';

function createSplit(id) {
	var masterSplit = document.createElement("div");
	masterSplit.className = "split";
	masterSplit.id = id;
	masterSplit.style.height = "100%";
	masterSplit.style.width = "100%";
	return masterSplit;
}

function jsMain() {
	// print("hi from main!")
	// document.body.innerHTML = '<ol><li>html data</li></ol>';
	// document.getElementById('test').innerHTML = '<ol><li>html data</li></ol>';

	// Your CSS as text
	var styles = `
.split {
    display: flex;
    flex-direction: row;
}

.gutter {
    background-color: #eee;
    background-repeat: no-repeat;
    background-position: 50%;
}

.gutter.gutter-horizontal {
    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAeCAYAAADkftS9AAAAIklEQVQoU2M4c+bMfxAGAgYYmwGrIIiDjrELjpo5aiZeMwF+yNnOs5KSvgAAAABJRU5ErkJggg==');
    cursor: col-resize;
}
`;

	// todo: make this an entire thing you can use to work with css cause I'm insane.
	var styleSheet = document.createElement("style");
	styleSheet.textContent = styles;
	document.head.appendChild(styleSheet);

	const masterSplit = createSplit("master_split");
	document.body.appendChild(masterSplit);

	var leftSideDiv = document.createElement("div");
	leftSideDiv.id = "split-0";
	masterSplit.appendChild(leftSideDiv);

	var rightSideDiv = document.createElement("div");
	rightSideDiv.id = "split-1";
	masterSplit.appendChild(rightSideDiv);

	console.log(document.body.innerHTML);

	const textArea1 = document.createElement("textarea");
	textArea1.id = "base1";
	textArea1.style.width = "100%";
	textArea1.style.height = "100%";
	textArea1.style.resize = "none";

	var div1 = document.getElementById("split-0");
	div1.style.display = "flex";
	div1.style.flexDirection = "row";
	div1.appendChild(textArea1);

	const textArea2 = document.createElement("textarea");
	textArea2.id = "base2";
	textArea2.style.width = "100%";
	textArea2.style.height = "100%";
	textArea2.style.resize = "none";

	var div2 = document.getElementById("split-1");
	div2.style.display = "flex";
	div2.style.flexDirection = "row";
	div2.appendChild(textArea2);

    

	// document.body.appendChild(textArea1)
	// document.body.appendChild(textArea2)

	Split(["#split-0", "#split-1"]);

	console.log("hi");

	// document.appendChild(x);
}

// onload = function(){

// };
