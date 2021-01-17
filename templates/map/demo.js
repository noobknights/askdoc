/**
 * Adds markers to the map highlighting the locations of the captials of
 * France, Italy, Germany, Spain and the United Kingdom.
 *
 * @param  {H.Map} map      A HERE Map instance within the application
 */

var userLat = 0, userLng = 0, cLocation;
var platform, defaultLayers, map, behavior, ui;
let homeIcon = '<svg width="45px" height="45px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path fill="#404a6b" d="M16,2A10.0114,10.0114,0,0,0,6,12c0,7.3,8.8789,17.249,9.2568,17.6689a1,1,0,0,0,1.4864,0C17.1211,29.249,26,19.3,26,12A10.0114,10.0114,0,0,0,16,2Zm4,13a1,1,0,0,1-1,1H13a1,1,0,0,1-1-1V11a1,1,0,0,1,.293-.707l3-3a.9994.9994,0,0,1,1.414,0l3,3A1,1,0,0,1,20,11Z"/></svg>'
let generalIcon = '<svg width="45px" height="45px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path fill="#eeadea" d="M24.42,5.49A11.91,11.91,0,1,0,7.58,22.34l7.12,7.12a1.84,1.84,0,0,0,2.6,0l7.12-7.12a11.91,11.91,0,0,0,0-16.85Z"/><path fill="#eec1ea" d="M7.58,5.49a11.91,11.91,0,0,0,0,16.85l7.12,7.12A1.83,1.83,0,0,0,16,30V2A11.83,11.83,0,0,0,7.58,5.49Z"/><circle cx="16" cy="13.42" r="4.98" fill="#fffbbe"/><path fill="#be97dc" d="M24.42,5.49A11.91,11.91,0,1,0,7.58,22.34l7.12,7.12a1.84,1.84,0,0,0,2.6,0l7.12-7.12a11.91,11.91,0,0,0,0-16.85ZM23,20.92l-7,7-7-7a9.91,9.91,0,1,1,14,0Z"/><path fill="#be97dc" d="M16,8.43a5,5,0,0,0-1,9.87v4.08a1,1,0,0,0,2,0V18.3a5,5,0,0,0-1-9.87Zm0,8a3,3,0,1,1,3-3A3,3,0,0,1,16,16.4Z"/></svg>'
homeIcon = new H.map.Icon(homeIcon);
generalIcon = new H.map.Icon(generalIcon);


function addInfoBubble(map, userLocation, query) {
	var group = new H.map.Group();
	map.addObject(group);

	// add 'tap' event listener, that opens info bubble, to the group
	group.addEventListener('tap', function (evt) {
		// event target is the marker itself, group is a parent event target
		// for all objects that it contains
		var bubble = new H.ui.InfoBubble(evt.target.getGeometry(), {
			// read custom data
			content: evt.target.getData()
		});
		// show info bubble
		ui.addBubble(bubble);
	}, false);

	var homeMarker = new H.map.Marker(userLocation, { icon: homeIcon });
	homeMarker.setData("<span class='text-danger font-weight-bold'>Home</span>");
	group.addObject(homeMarker);

	if (query) {
		let querys = query.results.items
		querys.forEach(e => {
			var renderObj = new H.map.Marker({ lat: e.position[0], lng: e.position[1] }, { icon: generalIcon });
			renderObj.setData("<p class='font-weight-bold'>" + e.title + "</p >" + e.vicinity);
			group.addObject(renderObj);
		});
	}
}


function boilerPlate() {
	/**
 * Boilerplate map initialization code starts below:
 */

	//Step 1: initialize communication with the platform
	// In your own code, replace variable window.apikey with your own apikey
	platform = new H.service.Platform({
		apikey: window.apikey
	});

	defaultLayers = platform.createDefaultLayers();

	//Step 2: initialize a map - this map is centered over Europe
	map = new H.Map(document.getElementById('map'),
		defaultLayers.vector.normal.map, {
		center: { lat: userLat, lng: userLng },
		zoom: 12,
		pixelRatio: window.devicePixelRatio || 1
	});
	// add a resize listener to make sure that the map occupies the whole container
	window.addEventListener('resize', () => map.getViewPort().resize());

	//Step 3: make the map interactive
	// MapEvents enables the event system
	// Behavior implements default interactions for pan/zoom (also on mobile touch environments)
	behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

	// Create the default UI components
	ui = H.ui.UI.createDefault(map, defaultLayers);
}

// Now use the map as required...
window.onload = function () {
	geoFindMe(queryResult);
	handlePermission();
}

function locationSetup() {
	cLocation = userLat + "," + userLng;
	document.getElementById("clocation").value = cLocation;
	boilerPlate();
	addInfoBubble(map, { lat: userLat, lng: userLng }, queryResult);
}

function geoFindMe(queryResult = undefined) {
	function success(position) {
		const lat = position.coords.latitude;
		const lng = position.coords.longitude;
		userLat = lat;
		userLng = lng;
		locationSetup();
	}

	function error() {
		reportLocationStatus('Unable to retrieve your location');
		locationSetup();
	}

	if (!navigator.geolocation) {
		reportLocationStatus('Geolocation is not supported by your browser');
	} else {
		reportLocationStatus('Locating…');
		navigator.geolocation.getCurrentPosition(success, error);
	}
}

function reportLocationStatus(state) {
	console.log('Location: ' + state);
}

function handlePermission() {
	navigator.permissions.query({ name: 'geolocation' }).then(function (result) {
		if (result.state == 'granted') {
			reportPermission(result.state);
		} else if (result.state == 'prompt') {
			reportPermission(result.state);
			navigator.geolocation.getCurrentPosition(revealPosition, positionDenied, geoSettings);
		} else if (result.state == 'denied') {
			reportPermission(result.state);
		}
		result.onchange = function () {
			reportPermission(result.state);
		}
	});
}

function reportPermission(state) {
	console.log('Permission: ' + state);
}