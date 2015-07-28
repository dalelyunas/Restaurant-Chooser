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

app.factory('Restaurant', function($q, $timeout) {

  var getRestaurant = function() {
    var deferred = $q.defer();

	var lat = 0;
    var lon = 0;
    if (navigator.geolocation) {
    	navigator.geolocation.getCurrentPosition(function(position) {
    		alert("sup");
    		lat = position.coords.latitude;
    		lon = position.coords.longitude;
    	});
    }
    console.log(lat);
    console.log(lon);

    $timeout(function() {
      deferred.resolve("asd");
    }, 2000);

    return deferred.promise;
  };

  return {
    getRestaurant: getRestaurant
  };

});