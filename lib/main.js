function close_window() {
    if (confirm("Close Window?")) {
      dClose("hi");
    }
}


// Creating a div element
var div = document.createElement("div");
div.style.width = "100px";
div.style.height = "100px";
div.style.background = "red";
div.style.color = "white";
div.innerHTML = "Hello";

// document.body.append(div);
document.getElementById("main").appendChild(div);