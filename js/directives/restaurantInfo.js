app.directive("restaurantInfo", function() {
  return {
    restrict: 'E',
    scope: {
      info: '=',
      onBack: '&'
    },
    templateUrl: 'js/directives/restaurantInfo.html'
  }
});