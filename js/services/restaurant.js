app.factory('Restaurant', function($q, $timeout, $window, $http) {

  var getRestaurant = function(requestArray) {
    var deferred = $q.defer();
   	var service = new google.maps.places.PlacesService($("#mapPlaceholder").get(0));

    $window.navigator.geolocation.getCurrentPosition(function(position) {
    	var request = {
    		loc: position.coords.latitude + "," + position.coords.longitude,
    		radius: requestArray[1] * 1609.34,
    		term: requestArray[0],
    		limit: 20,
    		maxPrice: requestArray[2],
    		rating: requestArray[3]
    	};
    	
		$http.get('http://localhost:4730/api/params', {params:{
			loc: position.coords.latitude + "," + position.coords.longitude,
    		radius: requestArray[1] * 1609.34,
    		term: requestArray[0],
    		limit: 20,
    		maxPrice: requestArray[2],
    		rating: requestArray[3]
    	}})
		.success(function(data) {
    		deferred.resolve(data);
		})
		.error(function(error) {
    		deferred.resolve("NO_DATA");
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

