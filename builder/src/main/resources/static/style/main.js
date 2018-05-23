function dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById(elmnt.id + "header")) {
        /* if present, the header is where you move the DIV from:*/
        document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
        document.getElementById(elmnt.id + "header").onmouseenter = function (ev) {
            if (elmnt.className.indexOf(selectedLayer) >= 0) {
                document.getElementById(elmnt.id + "header").style.cursor = "move";
            }
        }
        document.getElementById(elmnt.id + "header").onmouseleave = function (ev) {
            document.getElementById(elmnt.id + "header").style.cursor = "default";
        }
    } else {
        /* otherwise, move the DIV from anywhere inside the DIV:*/
        elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        if (elmnt.className.indexOf(selectedLayer) < 0) {
            return;
        }
        e = e || window.event;
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        var base = document.getElementById("base");
        if (elmnt.offsetTop > 0 && (elmnt.offsetTop + elmnt.offsetHeight) < base.offsetHeight) {
            elmnt.style.top = (elmnt.offsetTop - pos2) + "px";

        } else {
            elmnt.style.top = (elmnt.offsetTop <= 0) ? "1px" : base.offsetHeight - elmnt.offsetHeight - 1 + "px";
        }
        if (elmnt.offsetLeft > 0 && (elmnt.offsetLeft + elmnt.offsetWidth) < base.offsetWidth) {
            elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
        } else {
            elmnt.style.left = (elmnt.offsetLeft <= 0) ? "1px" : base.offsetWidth - elmnt.offsetWidth - 1 + "px";
        }
        document.getElementById("value").innerHTML = elmnt.offsetTop + "," + base.offsetHeight;
    }

    function closeDragElement() {
        /* stop moving when mouse button is released:*/
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

var idCount = 0;

function addComponent() {
    var board = document.getElementById("mappingBoard");
    var base = document.getElementById("base");
    var zoom = document.getElementById("zoomBaseSlide").value / 100;
    var boardPaddingTop = board.style.paddingTop;
    var boardPaddingLeft = board.style.paddingLeft;
    var offSetTop = board.offsetTop + parseInt(boardPaddingTop.substr(0, boardPaddingTop.length - 2)) - board.scrollTop;
    var offSetLeft = board.offsetLeft + parseInt(boardPaddingLeft.substr(0, boardPaddingLeft.length - 2)) - board.scrollLeft;
    base.onmousedown = dragMouseDown;
    base.style.cursor = "crosshair";

    function dragMouseDown(e) {
        e = e || window.event;
        // get the mouse cursor position at startup:
        this.pos1 = e.clientY;
        this.pos2 = e.clientX;
        base.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        base.onmousemove = elementDrag;
        var div = document.createElement('div');
        div.style.top = (e.clientY - offSetTop) / zoom + "px";
        div.style.left = (e.clientX - offSetLeft) / zoom + "px";
        div.className = "mapping";
        div.id = "drag";
        base.appendChild(div);
    }

    function elementDrag(e) {
        e = e || window.event;
        this.pos3 = e.clientX;
        this.pos4 = e.clientY;
        var div = document.getElementById("drag");
        div.style.width = (this.pos3 > this.pos2) ? (this.pos3 - this.pos2) / zoom + "px" : (this.pos2 - this.pos3) / zoom + "px";
        div.style.height = (this.pos4 > this.pos1) ? (this.pos4 - this.pos1) / zoom + "px" : (this.pos1 - this.pos4) / zoom + "px";
        if (this.pos2 > this.pos3) {
            div.style.left = (this.pos3 - offSetLeft) / zoom + "px";
        }
        if (this.pos1 > this.pos4) {
            div.style.top = (this.pos4 - offSetTop) / zoom + "px";
        }

    }

    function closeDragElement() {
        /* stop moving when mouse button is released:*/
        var componentDrawing = document.getElementById("drag");
        try {
            //create component
            var div = document.createElement('div');
            document.getElementById("base").appendChild(div);
            div.className = 'component ' + selectedLayer;
            div.id = 'component' + idCount;
            div.name = div.id;
            div.innerHTML = '  <div id="component' + idCount + 'header" class="componentheader"></div>';
            idCount++;
            div.style.top = componentDrawing.style.top;
            div.style.left = componentDrawing.style.left;
            div.style.width = (componentDrawing.offsetWidth > 30) ? componentDrawing.style.width : "30px";
            div.style.height = (componentDrawing.offsetHeight > 30) ? componentDrawing.style.height : "30px";
            div.onclick = function (ev) {
                selectingComponent(this);
                ev.stopPropagation();
            };
            selectedComponent = div.id;
            selectingComponent(div);
            dragElement(div);
        } catch (err) {
            console.log(err);
        }
        while (componentDrawing != null) {
            componentDrawing.remove();
            componentDrawing = document.getElementById("drag");
        }
        base.onmouseup = null;
        base.onmousemove = null;
        base.onmousedown = null;
        base.style.cursor = "auto";
    }
}

//Show component properties
function showComponentProp(component) {
    changeValue("componentPropertiesName", component.name);
    changeValue("componentPropertiesSizeX", component.offsetWidth);
    changeValue("componentPropertiesSizeY", component.offsetHeight);
    changeValue("componentPropertiesPosX", component.offsetLeft);
    changeValue("componentPropertiesPosY", component.offsetTop);
    var header = document.getElementById(component.id + "header");
    changeValue("componentPropertiesColor", rgb2hex(window.getComputedStyle(header).backgroundColor));
}
function changeValue(targetId, value) {
    document.getElementById(targetId).value = value;
}

//RGB to Hex
var hexDigits = new Array
    ("0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f");

//Function to convert rgb color to hex format
function rgb2hex(rgb) {
    rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}

function hex(x) {
    return isNaN(x) ? "00" : hexDigits[(x - x % 16) / 16] + hexDigits[x % 16];
}

////////
//Selecting a component
var selectedComponent = null;

function selectingComponent(component) {
    deselectingComponent();
    if (component.className.indexOf(selectedLayer) >= 0) {
        component.style.border = "2px dashed black";
        selectedComponent = component.id;
        showComponentProp(component);
    }
}
function deselectingComponent() {
    selectedComponent = null;
    var components = document.getElementsByClassName("component");
    for (var i = 0; i < components.length; i++) {
        components[i].style.border = "none";
    }
}

//for base

//zoom base
document.getElementById('zoomBaseSlide').oninput = function zoomBase() {
    var base = document.getElementById("base");
    var board = document.getElementById("mappingBoard");
    base.style.zoom = this.value / 100;
    board.style.paddingTop = (board.offsetHeight - base.offsetHeight * (this.value / 100)) / 2 + "px";
    board.style.paddingLeft = (board.offsetWidth - base.offsetWidth * (this.value / 100)) / 2 + "px";
}


//add base
function addBase() {
    var base = document.createElement('div');
    var board = document.getElementById("mappingBoard");
    board.appendChild(base);
    base.id = 'base';
    board.style.paddingTop = (board.offsetHeight - base.offsetHeight) / 2 + "px";
    board.style.paddingLeft = (board.offsetWidth - base.offsetWidth) / 2 + "px";
    //add default layer to base
    base.onclick = deselectingComponent;
    addLayer();
}

//add new layer
var layerCount = 0;
var selectedLayer = null;

function addLayer() {
    var layer = document.createElement('div');
    var layersBar = document.getElementById('layersBar');
    layersBar.insertBefore(layer, layersBar.childNodes[0]);
    layer.className = 'layer';
    //set mouse on clink to select layer
    layer.onclick = function (ev) {
        selectedLayer = this.id;
        turnOnAIndicator(this.id + "Indicator");
        deselectingComponent();
    }
    layer.style.zIndex = layerCount;
    layer.id = 'layer' + layerCount++;
    selectedLayer = layer.id;
    //create css class for layer
    var layerCssHolder = document.getElementById("layerCssHolder");
    var sheet = document.createElement('style')
    sheet.innerHTML = "." + layer.id + " {background-color: red;z-index:" + layerCount + ";}";
    layerCssHolder.appendChild(sheet);
    //remove selected layer
    deselectingComponent();
    //build UI for layer
    layerUIBuild(layer);
}

function layerUIBuild(layer) {
    var btnHidden = document.createElement('input');
    btnHidden.type = 'checkbox';
    btnHidden.checked = true;
    btnHidden.onchange = function (ev) {
        var strCSS = 'cssRules';
        if (document.all) {
            strCSS = 'rules';
        }
        var position = parseInt(layer.id.substring(5, layer.id.length));
        document.styleSheets[++position][strCSS][0].style["visibility"] = (this.checked) ? "visible" : "hidden";
    }
    layer.appendChild(btnHidden);
    var nameTag = document.createElement('div');
    nameTag.innerText = layer.id;
    nameTag.id = layer.id + "NameTag";
    nameTag.className = "nameTag";
    layer.appendChild(nameTag);
    var indicator = document.createElement('div');
    indicator.id = layer.id + "Indicator";
    indicator.className = "indicator";
    layer.appendChild(indicator);
    turnOnAIndicator(indicator.id);
}

function turnOnAIndicator(indicatorId) {
    var indicators = document.getElementsByClassName("indicator");
    for (var i = 0; i < indicators.length; i++) {
        if (indicators[i].id == indicatorId) {
            indicators[i].style.visibility = "visible";
        } else {
            indicators[i].style.visibility = "hidden";
        }
    }
}

