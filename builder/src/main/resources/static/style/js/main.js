function getThatBloodyThing(id) {
    return document.getElementById(id);
}

loadContent()
function loadContent() {
    var paths = ["drawing", "data", "statistic"]
    for (var i = 0; i < paths.length; i++) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var mainContentHolder = getThatBloodyThing("mainContent");
                mainContentHolder.innerHTML = mainContentHolder.innerHTML + this.responseText;
                // alert(this.responseText);
            }
        };
        xhttp.open("GET", paths[i], false);
        xhttp.send();
    }
    mainMenu("drawingBoard");
}




function mainMenu(path) {
    var drawingBoard = getThatBloodyThing("drawingBoard");
    var dataSet = getThatBloodyThing("dataSet");
    var statistic = getThatBloodyThing("statistic");
    drawingBoard.style.visibility = "hidden";
    dataSet.style.visibility = "hidden";
    statistic.style.visibility = "hidden";

    var showContent = getThatBloodyThing(path);
    showContent.style.visibility = "visible";
}