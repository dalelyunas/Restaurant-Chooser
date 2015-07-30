/*app.factory("restaurant", function($q) {

  var getRestaurants = function(requestArray) {
  	alert("tried");
  	var deferred = q.defer();


    var lat = 0;
    var lon = 0;

    if (navigator.geolocation) {
    	navigator.geolocation.getCurrentPosition(function(position) {
    		lat = position.coords.latitude;
    		lon = position.coords.longitude;
    	});
    }
    var request = {
    	location: new google.maps.LatLng(lat, lon);
    	radius: 10000;
    	types: ['restaurant'];
    	query: requestArray[0];
    	maxPriceLevel: requestArray[2] / 10;
    }

    var service = new google.maps.places.PlacesService();
	service.textSearch(request, deferred.resolve());

	return deferred.promise;
  };

  return {
    getRestaurants: getRestaurants;
  };
  
 
});*/

app.factory('Restaurant', function($q, $timeout, $window) {

  var getRestaurant = function(requestArray) {
    var deferred = $q.defer();
   	var service = new google.maps.places.PlacesService($("#mapPlaceholder").get(0));

    $window.navigator.geolocation.getCurrentPosition(function(position) {
    	var request = {
    		location: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
    		radius: requestArray[1] * 1609.34,
    		query: requestArray[0],
    		types: ["restaurant"],
    		maxPriceLevel: requestArray[2] / 10
    	};
		service.textSearch(request, function(results, status) {
			if (status == google.maps.places.PlacesServiceStatus.OK) {
				deferred.resolve(selectRestaurant(results));
			}
		});

    }, function(error) {
    	if (error.code === 1) {
    		alert("Please enable location so nearby restaurants can be found");
    	}
    }); 

    return deferred.promise;
  };

  return {
    getRestaurant: getRestaurant
  };

});

function selectRestaurant(results) {
	console.log(results[0]);
	return 0;
}