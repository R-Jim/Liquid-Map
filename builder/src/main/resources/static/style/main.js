function dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById(elmnt.id + "header")) {
        /* if present, the header is where you move the DIV from:*/
        document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
    } else {
        /* otherwise, move the DIV from anywhere inside the DIV:*/
        elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
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
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
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
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

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
        document.getElementById("value").innerHTML = "=" + e.pageY + "," + offSetTop + ":" + div.offsetTop;
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
            var div = document.createElement('div');
            document.getElementById("base").appendChild(div);
            div.className = 'component ' + selectedLayer;
            div.id = 'component' + idCount;
            div.innerHTML = '  <div id="component' + idCount + 'header" class="componentheader"></div>';
            idCount++;
            div.style.top = componentDrawing.style.top;
            div.style.left = componentDrawing.style.left;
            div.style.width = componentDrawing.style.width;
            div.style.height = componentDrawing.style.height;
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

//for base

//zoom base
document.getElementById('zoomBaseSlide').oninput = function zoomBase() {
    var base = document.getElementById("base");
    var board = document.getElementById("mappingBoard");
    base.style.zoom = this.value / 100;
    board.style.paddingTop = (board.offsetHeight - base.offsetHeight * (this.value / 100)) / 2 + "px";
    board.style.paddingLeft = (board.offsetWidth - base.offsetWidth * (this.value / 100)) / 2 + "px";
    document.getElementById("value").innerHTML = board.style.paddingTop + "," + board.style.paddingLeft;
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
    addLayer();
}

//add new layer
var layerCount = 0;
var selectedLayer = null;

function addLayer() {
    var layer = document.createElement('div');
    var layersBar = document.getElementById('layersBar');
    layersBar.appendChild(layer);
    layer.className = 'layer';
    //set mouse on clink to select layer
    layer.onclick = function (ev) {
        selectedLayer = this.id;
        document.getElementById("value").innerHTML = selectedLayer;
    }
    layer.id = 'layer' + layerCount++;
    selectedLayer = layer.id;
    layerUIBuild(layer);
}

function layerUIBuild(layer) {
    var btnHidden = document.createElement('input');
    btnHidden.type = 'checkbox';
    btnHidden.checked = true;
    btnHidden.onchange = function (ev) {
        var components = document.getElementsByClassName(layer.id);
        var i;
        for (i = 0; i < components.length; i++) {
            components[i].style.visibility = (this.checked) ? "visible" : "hidden";
        }
        document.getElementById("value").innerHTML = components.length;
    }
    layer.appendChild(btnHidden);
    var nameTag = document.createElement('div');
    nameTag.innerText = layer.id;
    nameTag.id = layer.id + "NameTag";
    nameTag.className = "nameTag";
    layer.appendChild(nameTag);
}

