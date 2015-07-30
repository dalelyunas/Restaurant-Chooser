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
    		maxPriceLevel: requestArray[2]
    	};
		service.textSearch(request, function(results, status, pagination) {
			if (status == google.maps.places.PlacesServiceStatus.OK) {
				deferred.resolve(selectRestaurant(results, pagination, requestArray[3]));
			}
			if (status == google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
				deferred.resolve("No results found");
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

function selectRestaurant(results, pagination, rating) {
	while (results.length > 0) {
		var index = Math.floor(Math.random() * results.length);
		var restaurant = results[index];

		if (restaurant.rating >= rating) {
			return restaurant;
			break;
		}
		else {
			results.splice(index, 1);
		}
	}

	if (pagination.hasNextPage) {
		selectRestaurant(pagination.nextPage());
	}
	else {
		return "No results found";
	}
}