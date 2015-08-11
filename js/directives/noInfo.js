app.directive('noInfo', function() {
  return {
    restrict: 'E',
    scope: {
      onBack: '&'
    },
    templateUrl: 'js/directives/noInfo.html'
  }
});