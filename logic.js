// Variable con la direccion al JSON que contiene los sismos con magnitud mayor a 4.5 en el ultimo mes
var queryUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson';

// Traemos el json
d3.json(queryUrl, function(data) {
   createFeatures(data.features);
});

function createFeatures(earthquakeData) {
   // La función pop up mostrará el lugar, la magnitud y la fecha del sismo
   function onEachFeature(feature, layer) {
       layer.bindPopup('<h3>' + feature.properties.place +
           '</h3><hr><p> Magnitude:' + feature.properties.mag + '<hr> Date:' + new Date(feature.properties.time) + '</p>');
   }

   var earthquakes = L.geoJSON(earthquakeData, {
       onEachFeature: onEachFeature,
       pointToLayer: popplaces_marker
   });

   createMap(earthquakes);
}

function popplaces_marker(feature, latlng) {
    //redondeo de la magnitud
    var magn = Math.round(feature.properties.mag);
    //console.log (magn);
    //Asignación de color por magnitud
    switch (magn){
        case 4:
            var f_color = '#bfff00';
            break;
        case 5:
            var f_color = '#ffff00';
            break;
        case 6:
            var f_color = '#ffbf00';
            break;
        case 7:
            var f_color = '#ff8000';
            break;
        case 8:
            var f_color = '#ff4000';
            break;
        };
    //console.log (f_color);

   return L.circleMarker(latlng, {
       radius: feature.properties.mag * 5, //radio del circulo de acuerdo a la magnitud
       fillColor: f_color,
       color: f_color,
       weight: 1,
       opacity: 1.0,
       fillOpacity: 0.8
   })
}

function createMap(earthquakes) {

   // Definimos mapas street y satellite
   var streetmap = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
       attribution: 'Map data &copy; <a href=\'https://www.openstreetmap.org/\'>OpenStreetMap</a> contributors, <a href=\'https://creativecommons.org/licenses/by-sa/2.0/\'>CC-BY-SA</a>, Imagery © <a href=\'https://www.mapbox.com/\'>Mapbox</a>',
       maxZoom: 11,
       id: 'mapbox.streets-basic',
       accessToken: API_KEY
   });

   var satmap = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
       attribution: 'Map data &copy; <a href=\'https://www.openstreetmap.org/\'>OpenStreetMap</a> contributors, <a href=\'https://creativecommons.org/licenses/by-sa/2.0/\'>CC-BY-SA</a>, Imagery © <a href=\'https://www.mapbox.com/\'>Mapbox</a>',
       maxZoom: 11,
       id: 'mapbox.satellite',
       accessToken: API_KEY
   });

   // baseMaps
   var baseMaps = {
       'Street Map': streetmap,
       'Satellite Map': satmap
   };

   var overlayMaps = {
       Earthquakes: earthquakes
   };

   var myMap = L.map('map', {
       center: [
           19.43, -99.13
       ],
       zoom: 5,
       layers: [streetmap, earthquakes]
   });

   L.control.layers(baseMaps, overlayMaps, {
       collapsed: false
   }).addTo(myMap);
}