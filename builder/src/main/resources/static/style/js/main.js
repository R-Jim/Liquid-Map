mainMenu("drawing");
function mainMenu(path) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var mainContentHolder = document.getElementById("mainContent");       
            mainContentHolder.innerHTML = this.responseText;
            // alert(this.responseText);
        }
    };
    xhttp.open("GET", path, true);
    xhttp.send();
}