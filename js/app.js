// =======================================================
// DRONE SATELLITE VIEWER
// app.js
// Version 1.0
// =======================================================

// ---------------------------
// Viewer
// ---------------------------

const viewer = new Cesium.Viewer("cesiumContainer", {

    animation: false,

    timeline: false,

    geocoder: true,

    homeButton: true,

    sceneModePicker: true,

    navigationHelpButton: false,

    fullscreenButton: true,

    baseLayerPicker: true,

    infoBox: false,

    selectionIndicator: false,

    shouldAnimate: true,

    terrain: Cesium.Terrain.fromWorldTerrain()

});

// ---------------------------
// Hide Loading
// ---------------------------

viewer.scene.globe.depthTestAgainstTerrain = true;

window.onload = () => {

    document.getElementById("loading").style.display = "none";

};

// ---------------------------
// Marker
// ---------------------------

let marker = null;

// ---------------------------
// Fly To Coordinate
// ---------------------------

function flyToCoordinate() {

    const lat = parseFloat(document.getElementById("latitude").value);

    const lon = parseFloat(document.getElementById("longitude").value);

    const height = parseFloat(document.getElementById("height").value);

    const heading =
        Cesium.Math.toRadians(
            parseFloat(document.getElementById("heading").value)
        );

    const pitch =
        Cesium.Math.toRadians(
            parseFloat(document.getElementById("pitch").value)
        );

    viewer.camera.flyTo({

        destination: Cesium.Cartesian3.fromDegrees(

            lon,

            lat,

            height

        ),

        orientation:{

            heading:heading,

            pitch:pitch,

            roll:0

        },

        duration:2

    });

    if(marker){

        viewer.entities.remove(marker);

    }

    marker = viewer.entities.add({

        position:Cesium.Cartesian3.fromDegrees(

            lon,

            lat

        ),

        point:{

            pixelSize:15,

            color:Cesium.Color.RED,

            outlineColor:Cesium.Color.WHITE,

            outlineWidth:2

        },

        label:{

            text:"Lokasi",

            font:"16px sans-serif",

            fillColor:Cesium.Color.WHITE,

            style:Cesium.LabelStyle.FILL_AND_OUTLINE,

            verticalOrigin:Cesium.VerticalOrigin.TOP,

            pixelOffset:new Cesium.Cartesian2(0,20)

        }

    });

}

// ---------------------------
// Button
// ---------------------------

document

.getElementById("btnGo")

.addEventListener(

"click",

flyToCoordinate

);

// ---------------------------
// Slider Heading
// ---------------------------

document

.getElementById("heading")

.addEventListener(

"input",

function(){

document.getElementById("headingValue").innerHTML=

this.value+"°";

}

);

// ---------------------------
// Slider Pitch
// ---------------------------

document

.getElementById("pitch")

.addEventListener(

"input",

function(){

document.getElementById("pitchValue").innerHTML=

this.value+"°";

}

);

// ---------------------------
// Click Globe
// ---------------------------

const handler =

new Cesium.ScreenSpaceEventHandler(

viewer.scene.canvas

);

handler.setInputAction(function(click){

const cartesian=

viewer.scene.pickPosition(

click.position

);

if(!cartesian) return;

const cartographic=

Cesium.Cartographic.fromCartesian(

cartesian

);

const lat=

Cesium.Math.toDegrees(

cartographic.latitude

);

const lon=

Cesium.Math.toDegrees(

cartographic.longitude

);

document.getElementById("latitude").value=

lat.toFixed(6);

document.getElementById("longitude").value=

lon.toFixed(6);

flyToCoordinate();

},

Cesium.ScreenSpaceEventType.LEFT_CLICK

);

// ---------------------------
// GPS
// ---------------------------

document

.getElementById("btnGPS")

.onclick=function(){

navigator.geolocation.getCurrentPosition(

function(pos){

document.getElementById("latitude").value=

pos.coords.latitude;

document.getElementById("longitude").value=

pos.coords.longitude;

flyToCoordinate();

}

);

};

// ---------------------------
// Copy Coordinate
// ---------------------------

document

.getElementById("btnCopy")

.onclick=function(){

const txt=

document.getElementById("latitude").value+

","+

document.getElementById("longitude").value;

navigator.clipboard.writeText(txt);

alert("Koordinat berhasil disalin.");

};

// ---------------------------
// Google Maps
// ---------------------------

document

.getElementById("btnGoogle")

.onclick=function(){

const lat=

document.getElementById("latitude").value;

const lon=

document.getElementById("longitude").value;

window.open(

"https://www.google.com/maps?q="+

lat+

","+lon

);

};

// ---------------------------
// Download PNG
// ---------------------------

document

.getElementById("btnDownloadPNG")

.onclick=function(){

viewer.render();

const canvas=

viewer.scene.canvas;

const link=

document.createElement("a");

link.download="Satellite.png";

link.href=

canvas.toDataURL("image/png");

link.click();

};

// ---------------------------
// Download JPG
// ---------------------------

document

.getElementById("btnDownloadJPG")

.onclick=function(){

viewer.render();

const canvas=

viewer.scene.canvas;

const link=

document.createElement("a");

link.download="Satellite.jpg";

link.href=

canvas.toDataURL("image/jpeg",1);

link.click();

};

// ---------------------------
// First Fly
// ---------------------------

flyToCoordinate();