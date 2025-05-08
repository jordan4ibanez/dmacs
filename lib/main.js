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


    const textArea1 = document.createElement("textarea");
    textArea1.id = "base1"
    textArea1.tagName = "base1"
    textArea1.style.width = "100%"
    textArea1.style.height = "100%"
    textArea1.style.resize = "none"

    const textArea2 = document.createElement("textarea");
    textArea2.id = "base2"
    textArea2.style.width = "100%"
    textArea2.style.height = "100%"
    textArea2.style.resize = "none"
    
    document.body.appendChild(textArea1)
    document.body.appendChild(textArea2)

    Split(['base1', 'base2'], {
        sizes: [25, 75],
    })


    // document.appendChild(x);

}


// onload = function(){
    
// };