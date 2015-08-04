app.directive("restaurantInfo", function() {
  return {
    restrict: 'E',
    scope: {
      info: '='
    },
    //templateUrl: 'js/directives/restuarantInfo.html'
    template: '<h1>THIS IS SUPER COOL</h1>'
  }
});