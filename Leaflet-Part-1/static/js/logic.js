// Creating the map object
let myMap = L.map("map-id", {
    center: [39.5, -108.35],
    zoom: 4
});

// Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

/******************************************************************************************************************************************************/

// Determines the color of a circle marker based on the depth of the earthquake
function depthColor(depth) {
    if (depth <= 10) return "limegreen";
    else if (depth <= 30) return "greenyellow";
    else if (depth <= 50) return "yellow";
    else if (depth <= 70) return "gold";
    else if (depth <= 90) return "orange";
    else return "orangered";
}

// Determines the size of the radius of a circle marker based on the magnitude of the earthquake
function magnitudeRadius(magnitude) {
        return (magnitude * 6);
}

// Styles the circle markers for the map
function eqStyle(feature) {
    return {
        color: "dimgrey",
        fillColor: depthColor(feature.geometry.coordinates[2]),
        fillOpacity: 0.9,
        weight: 1,
        radius: magnitudeRadius(feature.properties.mag)
    };
}

/******************************************************************************************************************************************************/

// Use this link to get the GeoJSON data
const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Getting our GeoJSON data
d3.json(url).then(function(data) {

    // Creating a GeoJSON layer with the retrieved data
    L.geoJson(data, {
        style: eqStyle,
        pointToLayer: function(feature, latlng) {
            return new L.CircleMarker(latlng);
        },
        onEachFeature: function (feature, layer) {
            layer.bindPopup(
                "<h3>Time: </h3>" + new Date(feature.properties.time) + 
                "<h3>Latitude: </h3>" + feature.geometry.coordinates[0] + "<br>" +
                "<h3>Longitude: </h3>" + feature.geometry.coordinates[1] + "<br>" +
                "<h3>Magnitude: </h3>" + feature.properties.mag + "<br>" +
                "<h3>Depth: </h3>" + feature.geometry.coordinates[2] + "<br>"
            );
        }
    }).addTo(myMap);
});

/******************************************************************************************************************************************************/

// Information on creating a Legend was found via the link: https://leafletjs.com/examples/choropleth/#custom-legend-control
let legend = L.control({
    position: 'bottomright'
});

legend.onAdd = function (myMap) {

    let div = L.DomUtil.create('div', 'info legend'),
    grades = [-10, 10, 30, 50, 70, 90],
    labels = ["limegreen", "greenyellow", "yellow", "gold", "orange", "orangered"];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (let i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + labels[i] + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(myMap);