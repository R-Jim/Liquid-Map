

function newDataType(){
    var dataType = document.createElement("div");
    dataType.className = "dataType";
    var dataSets = getThatBloodyThing("dataSets");
    dataSets.appendChild(dataType);
}