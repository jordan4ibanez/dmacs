function close_window() {
	if (confirm("Close Window?")) {
		dClose("hi");
	}
}

// var elemDiv = document.createElemendocument.body.innerHTML += '<div style="position:absolute;width:100%;height:100%;opacity:0.3;z-index:100;background:#000;"></div>';

function jsMain() {
	// print("hi from main!")
	// document.body.innerHTML = '<ol><li>html data</li></ol>';
	// document.getElementById('test').innerHTML = '<ol><li>html data</li></ol>';

	document.body.innerHTML = `
    <div class="split">
    <div id="split-0"></div>
    <div id="split-1"></div>
    </div>
    `;

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
	div1.style.display = "flex";
	div1.style.flexDirection = "row";
	div2.appendChild(textArea2);

	// document.body.appendChild(textArea1)
	// document.body.appendChild(textArea2)

	Split(["#split-0", "#split-1"]);

	console.log("hi");

	// document.appendChild(x);
}

// onload = function(){

// };
