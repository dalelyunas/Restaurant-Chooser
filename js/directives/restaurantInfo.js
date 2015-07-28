app.directive("restaurantInfo", function() {
  return {
    restrict: 'E',
    scope: {
      info: '='
    },
    templateUrl: 'js/directives/restuarantInfo.html'
  };
});