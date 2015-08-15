app.factory('Restaurant', function($q, $timeout, $window, $http) {

    var getRestaurant = function(requestArray) {
	var deferred = $q.defer();

	$window.navigator.geolocation.getCurrentPosition(function(position) {
	    $http.get('http://104.236.193.158:8080/api/params', {params:{
		loc: position.coords.latitude + "," + position.coords.longitude,
    		radius: requestArray[1] * 1609.34,
    		term: requestArray[0],
    		limit: 20,
    		maxPrice: requestArray[2],d
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
    		alert("Please enable location so nearby restaurants can be found and try again");
		deferred.resolve("NO_DATA");
    	    }
	}); 

	return deferred.promise;
    };

    return {
	getRestaurant: getRestaurant
    };
});

