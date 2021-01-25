/**
 * Adds markers to the map highlighting the locations of the captials of
 * France, Italy, Germany, Spain and the United Kingdom.
 *
 * @param  {H.Map} map      A HERE Map instance within the application
 */

var userLat = 0, userLng = 0, cLocation;
var platform, defaultLayers, map, behavior, ui;
let homeIcon = '<svg width="50" height="50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path fill="#404a6b" d="M16,2A10.0114,10.0114,0,0,0,6,12c0,7.3,8.8789,17.249,9.2568,17.6689a1,1,0,0,0,1.4864,0C17.1211,29.249,26,19.3,26,12A10.0114,10.0114,0,0,0,16,2Zm4,13a1,1,0,0,1-1,1H13a1,1,0,0,1-1-1V11a1,1,0,0,1,.293-.707l3-3a.9994.9994,0,0,1,1.414,0l3,3A1,1,0,0,1,20,11Z"/></svg>';
let generalIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 32 32"><g transform="translate(-1063.251 -1534.686)" fill="#000000" class="color000 svgShape"><path fill="#c30202" d="m 1086.7514,1547.1856 c 0,4.4183 -8,15 -8,15 0,0 -8,-10.5817 -8,-15 0,-4.4183 3.5817,-8 8,-8 4.4183,0 8,3.5817 8,8 z" class="colorec7bb0 svgShape"></path><circle cx="1078.751" cy="1547.186" r="5" fill="#f2f2f2" class="colorf2f2f2 svgShape"></circle><path style="line-height:normal;text-indent:0;text-align:start;text-decoration-line:none;text-decoration-style:solid;text-decoration-color:#000;text-transform:none;block-progression:tb;isolation:auto;mix-blend-mode:normal" fill="#ff0000" d="m 1078.7514,1538.6856 c -4.6885,0 -8.5,3.8115 -8.5,8.5 0,1.2555 0.5331,2.7769 1.2969,4.4199 0.7638,1.6431 1.7724,3.394 2.7793,5.0039 2.0137,3.2196 4.0254,5.8789 4.0254,5.8789 a 0.50004997,0.50004997 0 0 0 0.7969,0 c 0,0 2.0116,-2.6593 4.0253,-5.8789 1.0069,-1.6099 2.0156,-3.3608 2.7793,-5.0039 0.7638,-1.643 1.2969,-3.1644 1.2969,-4.4199 0,-4.6885 -3.8115,-8.5 -8.5,-8.5 z m 0,1 c 4.1481,0 7.5,3.3519 7.5,7.5 0,0.9537 -0.4669,2.4143 -1.2031,3.998 -0.7362,1.5837 -1.7276,3.3067 -2.7207,4.8946 -1.7872,2.8574 -3.2355,4.7689 -3.5762,5.2246 -0.3407,-0.4557 -1.789,-2.3672 -3.5762,-5.2246 -0.9931,-1.5879 -1.9844,-3.3109 -2.7207,-4.8946 -0.7362,-1.5837 -1.2031,-3.0443 -1.2031,-3.998 0,-4.1481 3.352,-7.5 7.5,-7.5 z m 0,2 c -3.0316,0 -5.5,2.4684 -5.5,5.5 0,3.0317 2.4684,5.5 5.5,5.5 3.0317,0 5.5,-2.4683 5.5,-5.5 0,-3.0316 -2.4683,-5.5 -5.5,-5.5 z m 0,1 c 2.4912,0 4.5,2.0088 4.5,4.5 0,2.4912 -2.0088,4.5 -4.5,4.5 -2.4912,0 -4.5,-2.0088 -4.5,-4.5 0,-2.4912 2.0088,-4.5 4.5,-4.5 z m -0.01,0.9941 a 0.50004997,0.50004997 0 0 0 -0.4922,0.5059 l 0,2.5 -2.5,0 a 0.50004997,0.50004997 0 1 0 0,1 l 2.5,0 0,2.5 a 0.50004997,0.50004997 0 1 0 1,0 l 0,-2.5 2.5,0 a 0.50004997,0.50004997 0 1 0 0,-1 l -2.5,0 0,-2.5 a 0.50004997,0.50004997 0 0 0 -0.5078,-0.5059 z" color="#000" font-family="sans-serif" font-weight="400" overflow="visible" class="color62355c svgShape"></path></g></svg>';
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
		zoom: 14,
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
	geoFindMe();

	if (queryResult) {
		var WH = $(window).height();
		var SH = $("body").prop("scrollHeight");
		$("html, body")
			.stop()
			.animate({ scrollTop: SH - WH }, 800, 'swing');
	}
	else {
		$("html, body")
			.stop()
			.animate({ scrollTop: 0 }, 800, 'swing');
	}

	handlePermission();
}

function locationSetup() {
	cLocation = userLat + "," + userLng;
	document.getElementById("clocation").value = cLocation;
	boilerPlate();
	addInfoBubble(map, { lat: userLat, lng: userLng }, queryResult);
}

var options = {
	enableHighAccuracy: true,
	timeout: 5000,
	maximumAge: 0
};

function geoFindMe() {
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
		navigator.geolocation.getCurrentPosition(success, error, options);
		return true;
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