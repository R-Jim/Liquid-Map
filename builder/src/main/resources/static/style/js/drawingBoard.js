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

function createElement(source) {
    if (source == null) {
        return;
    }
    if (selectedLayer == null) {
        return;
    }
    var div = document.createElement('div');
    div.className = 'component ' + selectedLayer;
    div.id = 'component' + idCount;
    div.name = (source.name === undefined) ? div.id : source.name + " Copy";
    var header = document.createElement('div');
    header.id = div.id + "header";
    header.className = "componentheader";
    div.appendChild(header);
    var sourceHeader = getThatBloodyThing(source.id + "header");
    if (sourceHeader) {
        header.style.backgroundColor = sourceHeader.style.backgroundColor;
    } else {
        header.style.backgroundColor = source.style.backgroundColor;
    }
    idCount++;
    div.style.top = source.style.top;
    div.style.left = source.style.left;
    sourceWidth = parseInt(source.style.width.substring(0, source.style.width.length - 2));
    sourceHeight = parseInt(source.style.height.substring(0, source.style.height.length - 2));
    div.style.width = (sourceWidth > 30) ? source.style.width : "30px";
    div.style.height = (sourceHeight > 30) ? source.style.height : "30px";
    div.onclick = function (ev) {
        selectingComponent(this);
        ev.stopPropagation();
    };
    return div;
}

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
            var div = createElement(componentDrawing);
            document.getElementById("base").appendChild(div);
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
    setUpChangeEventPropFields();
}

function changeValue(targetId, value) {
    document.getElementById(targetId).value = value;
}

function setUpChangeEventPropFields() {
    var base = getThatBloodyThing("base");
    if (selectedComponent == null) {
        return;
    }
    var component = getThatBloodyThing(selectedComponent);
    ////
    var name = getThatBloodyThing("componentPropertiesName");
    var sizeX = getThatBloodyThing("componentPropertiesSizeX");
    var sizeY = getThatBloodyThing("componentPropertiesSizeY");
    var posX = getThatBloodyThing("componentPropertiesPosX");
    var posY = getThatBloodyThing("componentPropertiesPosY");
    var colorPicker = getThatBloodyThing("componentPropertiesColor");
    ////
    name.onchange = function () {
        component.name = name.value;
    }
    sizeX.onchange = function () {
        sizeX.value = (sizeX.value < 50) ? 50 : (sizeX.value > base.offsetWidth - component.offsetLeft) ? base.offsetWidth - component.offsetLeft : sizeX.value;
        component.style.width = sizeX.value + "px";
    }
    sizeY.onchange = function () {
        sizeY.value = (sizeY.value < 50) ? 50 : (sizeY.value > base.offsetHeight - component.offsetTop) ? base.offsetHeight - component.offsetTop : sizeY.value;
        component.style.height = sizeY.value + "px";
    }
    posX.onchange = function () {
        posX.value = (posX.value < 0) ? 1 : (posX.value > base.offsetWidth - component.offsetWidth) ? base.offsetWidth - component.offsetWidth : posX.value;
        component.style.left = posX.value + "px";
    }
    posY.onchange = function () {
        posY.value = (posY.value < 0) ? 1 : (posY.value > base.offsetHeight - component.offsetHeight) ? base.offsetHeight - component.offsetHeight : posY.value;
        component.style.top = posY.value + "px";
    }
    colorPicker.onchange = function () {
        var header = getThatBloodyThing(component.id + "header");
        header.style.backgroundColor = colorPicker.value;
    }
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
        component.style.border = " 1.2px solid rgb(0, 140, 255)";
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


//add base
function addBase() {
    var width = getThatBloodyThing("txtBaseWidth").value;
    var height = getThatBloodyThing("txtBaseHeight").value;
    if (width < 100 || height < 100) {
        return;
    }
    var base = document.createElement('div');
    var board = document.getElementById("mappingBoard");
    board.appendChild(base);
    base.id = 'base';
    base.style.width = width + "px";
    base.style.height = height + "px";
    board.style.paddingTop = (board.offsetHeight - height) / 2 + "px";
    board.style.paddingLeft = (board.offsetWidth - width) / 2 + "px";
    //add default layer to base
    base.onclick = deselectingComponent;
    addLayer();

    //zoom base
    document.getElementById('zoomBaseSlide').oninput = function zoomBase() {
        var base = document.getElementById("base");
        var board = document.getElementById("mappingBoard");
        base.style.zoom = this.value / 100;
        board.style.paddingTop = (board.offsetHeight - base.offsetHeight * (this.value / 100)) / 2 + "px";
        board.style.paddingLeft = (board.offsetWidth - base.offsetWidth * (this.value / 100)) / 2 + "px";
    }
    getThatBloodyThing("baseConfig").style.visibility = "hidden";
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
        turnOnAIndicator(this.id);
        deselectingComponent();
    }
    layer.style.zIndex = layerCount;
    layer.id = 'layer' + layerCount++;
    selectedLayer = layer.id;
    //create css class for layer
    var layerCssHolder = document.getElementById("layerCssHolder");
    var sheet = document.createElement('style')
    sheet.innerHTML = "." + layer.id + " {z-index:" + layerCount + ";}";
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
    turnOnAIndicator(layer.id);
}

function moveLayer(direction) {
    var layer = getThatBloodyThing(selectedLayer);
    var layersBar = document.getElementById('layersBar');
    var posNodeBefore = 0;
    for (var i = 0; i < layersBar.childNodes.length; i++) {
        if (direction == "up") {
            if (layersBar.childNodes[i].id == selectedLayer) {
                break;
            }
            posNodeBefore = i;
        } else {
            if (layersBar.childNodes[i].id == selectedLayer) {
                posNodeBefore = i + 1;
                break;
            }
        }
    }
    ///change z-index
    var strCSS = 'cssRules';
    if (document.all) {
        strCSS = 'rules';
    }
    var layerBefore = layersBar.childNodes[posNodeBefore];
    if (layerBefore !== undefined && layerBefore.id != selectedLayer) {
        var position = parseInt(layer.id.substring(5, layer.id.length)) + 1;
        var positionBf = parseInt(layerBefore.id.substring(5, layerBefore.id.length)) + 1;
        var zIndexBf = document.styleSheets[positionBf][strCSS][0].style["zIndex"];
        var zIndex = document.styleSheets[position][strCSS][0].style["zIndex"];
        document.styleSheets[position][strCSS][0].style["zIndex"] = zIndexBf;
        document.styleSheets[positionBf][strCSS][0].style["zIndex"] = zIndex;
    }
    //Move the selected layer
    layersBar.insertBefore(layer, layersBar.childNodes[(direction == "up") ? posNodeBefore : posNodeBefore + 1]);
}

function deleteLayer() {
    var layer = getThatBloodyThing(selectedLayer);
    var posNodeBefore = 0;
    for (var i = 0; i < layersBar.childNodes.length; i++) {
        if (layersBar.childNodes[i].id == selectedLayer) {
            posNodeBefore = i + 1;
            break;
        }
    }
    var layerBefore = layersBar.childNodes[posNodeBefore];
    if (layerBefore !== undefined) {
        var components = document.getElementsByClassName(layer.id);
        while (components.length > 0) {
            components[0].remove();
            alert(components.length);
        }
        layer.remove();
        selectedLayer = layerBefore.id;
        turnOnAIndicator(layerBefore.id + "Indicator");
        deselectingComponent();
    }
}

function turnOnAIndicator(indicatorId) {
    var layers = document.getElementsByClassName("layer");
    for (var i = 0; i < layers.length; i++) {
        if (layers[i].id == indicatorId) {
            layers[i].style.backgroundColor = "lightgrey";
        } else {
            layers[i].style.backgroundColor = "white";
        }
    }
}

///key down function
var copyComponent = null;
onkeydown = function (e) {
    if (e.ctrlKey) {
        switch (e.key.toLowerCase(e.key)) {
            case "c":
                copyComponent = getThatBloodyThing(selectedComponent);
                break;
            case "x":
                var tmpComponent = getThatBloodyThing(selectedComponent);
                copyComponent = createElement(tmpComponent);
                copyComponent.name = copyComponent.name.substring(0, copyComponent.name.length - 5);
                var header = getThatBloodyThing(tmpComponent.id + "header");
                copyComponent.style.backgroundColor = header.style.backgroundColor;
                tmpComponent.remove();
                break;
            case "v":
                var div = createElement(copyComponent);
                div.style.top = parseInt(div.style.top.substring(0, div.style.top.length - 2)) + 10 + "px";
                div.style.left = parseInt(div.style.left.substring(0, div.style.left.length - 2)) + 10 + "px";
                document.getElementById("base").appendChild(div);
                selectedComponent = div.id;
                selectingComponent(div);
                dragElement(div);
                copyComponent = div;
                break;
        }
    }
    if (e.key.toLowerCase(e.key) == "delete") {
        getThatBloodyThing(selectedComponent).remove();
    }
}
