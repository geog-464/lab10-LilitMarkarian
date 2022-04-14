// declare the map variable here to give it a global scope
let myMap;

// we might as well declare our baselayer(s) here too
const OpenStreetMap_Mapnik = L.tileLayer(
	'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

function initialize(){
    loadMap();
};

function fetchData(){
    //load the data
    fetch(url)
        .then(function(response){
            return response.json();
        })
        .then(function(json){
            //create a Leaflet GeoJSON layer and add it to the map
            L.geoJson(json,
								{style: styleAll, pointToLayer: generateCircles, onEachFeature: addPopups}).addTo(myMap);
        })
};

function loadMap(mapid){
	try {
		myMap.remove()
	}
	catch(e) {
		console.log(e)
		console.log("no map to delete")
	}
	finally {

		if (mapid=='Stations'){
		myMap = L.map('mapdiv', {
			center: [45.50, -73.58]
			,zoom: 3
			,maxZoom: 15
			,minZoom: 3
			,layers: OpenStreetMap_Mapnik
			});

			fetchData(url='https://raw.githubusercontent.com/geog-464/lab10/main/data/Amtrak_Stations.geojson');
		}

		if (mapid=="Megacities") {
			myMap = L.map('mapdiv', {
				center: [31.24967, 30.06263]
				,zoom: 2
				,maxZoom: 15
				,minZoom: 1
				,layers: OpenStreetMap_Mapnik
			});
			fetchData(url='https://raw.githubusercontent.com/geog-464/lab10/main/data/megacities.geojson');
		}
	}

	//add the basemap style(s) to a JS object, to which you could also add other baselayers. This object is loaded as a basemap selector as seen further down
	let baseLayers = {
		"OpenStreetMap.Mapnik": OpenStreetMap_Mapnik
	};

	//declare basemap selector widget
	let lcontrol = L.control.layers(baseLayers);
	//add it to the map
	lcontrol.addTo(myMap);

	fetchData();

	console.log(mapid)

};

function generateCircles(feature, latlng) {
	return L.circleMarker(latlng);
}


function styleAll(feature, latlng) {

	var styles = {
		dashArray:null,
		dashOffset:null,
  	lineJoin:null,
		lineCap:null,
	  stroke:false,
	  color:'#000',
		opacity:1,
		weight:1,
		fillColor:null,
		fillOpacity:0
	};

	if (feature.geometry.type == "Point") {
		styles.fillColor = '#F1A99B'
		,styles.fillOpacity = 0.3
		,styles.stroke=true
		,styles.radius=10
	}

	if (typeof feature.properties.ZipCode == 'string') {
		styles.fillColor = '#65b5ab'
		,styles.fillOpacity = 0.5
		,styles.stroke=true
		,styles.radius=10
	}

	return styles;
}

function addPopups(feature, layer){

	layer.bindPopup();
}



window.onload = initialize();
