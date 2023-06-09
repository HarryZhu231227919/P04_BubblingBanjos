var map = L.map('map').setView([40.70850, -74.00603], 12); //40.70850/-74.00603


L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// add the nyc zip codes polygon data to the map
var data = document.getElementById("data");

json_data = JSON.parse(data.innerHTML);


// heat map

function getColor(people) {
    return people > 150 ? '#800026' :
           people > 125  ? '#BD0026' :
           people > 100  ? '#E31A1C' :
           people > 75  ? '#FC4E2A' :
           people > 50   ? '#FD8D3C' :
           people > 25   ? '#FEB24C' :
           people > 15   ? '#FED976' :
                      '#FFEDA0';
}

function styleGeoJson(feature) {

    if (feature.properties.AdultLiteracyBENLESOL == null) {
        return {
            fillColor: getColor(0),
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.7
        }
    }

    return {
        fillColor: getColor(feature.properties.AdultLiteracyBENLESOL.total),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}


L.geoJson(json_data, {style: styleGeoJson}).addTo(map);

// end of the states polylgon data code




// to add a bunch of markers to the map

var demo_data = document.getElementById("demo_data");


var col_points = document.getElementById("collision_points");
json_col_points = JSON.parse(col_points.innerHTML);
var sho_points = document.getElementById("shooting_points");
json_sho_points = JSON.parse(sho_points.innerHTML);
var arr_points = document.getElementById("arrest_points");
json_arr_points = JSON.parse(arr_points.innerHTML);

//marker colors
var normal = "";
var orange = "invert(62%) sepia(22%) saturate(2096%) hue-rotate(1deg) brightness(104%) contrast(104%)";
var red = "invert(94%) sepia(56%) saturate(2798%) hue-rotate(353deg) brightness(102%) contrast(104%)";
var yellow = "invert(12%) sepia(83%) saturate(6686%) hue-rotate(1deg) brightness(111%) contrast(117%)";
var purple = "invert(7%) sepia(100%) saturate(7307%) hue-rotate(247deg) brightness(113%) contrast(145%)";
var alien = "invert(32%) sepia(35%) saturate(504%) hue-rotate(78deg) brightness(91%) contrast(93%)"

//color values retrieved with the help of https://codepen.io/sosuke/pen/Pjoqqp (CSS filter generator to convert from black to target hex color)

const colorList = [normal, orange, red, yellow, purple, alien];



/* ================================================================================ PLOTTING POINTS ON MAP ================================================================================ */
// console.log("COLLISION: " + json_col_points[1]);
var collisionGroup = L.layerGroup().addTo(map);
var plotCollision =  function(date) {
    for (let i = 0; i < json_col_points.length; i++) {
        if (json_col_points[i][3].substring(0,json_col_points[i][3].indexOf(' ')) == date ) {
            var mark = L.marker([json_col_points[i][1], json_col_points[i][2]]).addTo(collisionGroup);
            mark.getElement().style.filter = colorList[document.getElementById('colorSelector1').value];
            var popup_string = "<b>Motor Collision's Info</b><br> <b>Coordinates:</b> [" + json_col_points[i][1] + ", " + json_col_points[i][2] + "]<br> <b>Date:</b> " + json_col_points[i][3].substring(0,json_col_points[i][3].indexOf(' ')) + "<br><b>Crash Time:</b> " + json_col_points[i][4] + "<br><b>Number of Persons Injured:</b> " + json_col_points[i][6] + "<br><b>Number of Persons Killed:</b> " + json_col_points[i][7] + "<br> <b>Vehicle Type:</b> " + json_col_points[i][8];
            mark.bindPopup(popup_string);
        }
    }
};
plotCollision("2022-05-01");

//months seem to have a day '0' which really are day '1' of the month. (Need to take account of this)

var shootingsGroup = L.layerGroup().addTo(map);
var plotShootings = function(date) {
    for (let i = 0; i < json_sho_points.length; i++) {
        if (json_sho_points[i][3].substring(0,json_sho_points[i][3].indexOf(' ')) == date) {
            var mark = L.marker([json_sho_points[i][1], json_sho_points[i][2]]).addTo(shootingsGroup);
            mark.getElement().style.filter = colorList[document.getElementById('colorSelector2').value];
            var popup_string = "<b>Shooting Incident's Info</b><br> <b>Coordinates:</b> [" + json_sho_points[i][1] + ", " + json_sho_points[i][2] + "]<br> <b>Date:</b>" + json_sho_points[i][3].substring(0,json_sho_points[i][3].indexOf(' ')) + "<br><b>Perpetrator's Age Group:</b> " + json_sho_points[i][4] + "<br><b>Perpetrator's Sex:</b> " + json_sho_points[i][5] + "<br><b>Perpetrator's Race:</b>" + json_sho_points[i][6]+ "<br><b>Victim's Age Group:</b> " + json_sho_points[i][7] + "<br><b>Victim's Sex:</b> " + json_sho_points[i][8] + "<br><b>Victim's Race:</b> " + json_sho_points[i][9];
            mark.bindPopup(popup_string);
        }
    }
};
plotShootings("2022-05-01")


/* ================================================================================ NAV BAR SCRIPT ================================================================================ */

 
//script for changing the color of markers

var selectDropdownCollision = document.getElementById('colorSelector1');
selectDropdownCollision.addEventListener('input', function() {
    collisionGroup.eachLayer(function(marker) {
        marker.getElement().style.filter = colorList[selectDropdownCollision.value];
    });
});

var selectDropdownShootings = document.getElementById('colorSelector2');
selectDropdownShootings.addEventListener('input', function() {
    shootingsGroup.eachLayer(function(marker) {
        marker.getElement().style.filter = colorList[selectDropdownShootings.value];
    });
});


//script for displaying/hiding markers

var displayBtnCollision = document.getElementById('collisionDisplay1');
displayBtnCollision.addEventListener('input', () => {
    collisionGroup.eachLayer(function(marker) {
        marker.getElement().style.visibility = 'visible';
        marker._shadow.style.visibility = 'visible';
    });
});

var hideBtnCollison = document.getElementById('collisionDisplay2');
hideBtnCollison.addEventListener('input', () => {
    collisionGroup.eachLayer(function(marker) {
        marker.getElement().style.visibility = 'hidden';
        marker._shadow.style.visibility = 'hidden';
    });
});

var displayBtnShootings = document.getElementById('shootingsDisplay1');
displayBtnShootings.addEventListener('input', () => {
    shootingsGroup.eachLayer(function(marker) {
        marker.getElement().style.visibility = 'visible';
        marker._shadow.style.visibility = 'visible';
    });
});

var hideBtnShootings = document.getElementById('shootingsDisplay2');
hideBtnShootings.addEventListener('input', () => {
    shootingsGroup.eachLayer(function(marker) {
        marker.getElement().style.visibility = 'hidden';
        marker._shadow.style.visibility = 'hidden';
    });
});


//Dynamically change markers with date input

var collisionDateButton = document.getElementById('collisionDateButton');
collisionDateButton.addEventListener('click', function(){
    collisionGroup.clearLayers();
    var inputDate = document.getElementById('collisionDateInput').value;
    plotCollision(inputDate);
});

var shootingsDateButton = document.getElementById('shootingsDateButton');
shootingsDateButton.addEventListener('click', function() {
    shootingsGroup.clearLayers();
    var inputDate = document.getElementById('shootingsDateInput').value;
    plotShootings(inputDate);
})