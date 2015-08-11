app.controller("MainController", function($scope, Restaurant) {
	$scope.questions = ["What type of food do you want?", "How far (< 20 mi) do you want to travel?", "How much ($) do you want to spend?", "What minimum rating (0 - 5) do you want?"];
	$scope.curQuestion = 0;

	var answers = [];
	
	$scope.button = "";
  $scope.submitted = false;
  $scope.loading = false;
	
	$scope.$watch("curQuestion", function () {
    if ($scope.curQuestion < $scope.questions.length - 1) {
      $scope.button = "NEXT";
    } 
    else {
      $scope.button = "GO";
    }
  });
	
	$scope.updateQuestion = function() {
		if ($scope.curQuestion < $scope.questions.length - 1) {
			answers.push($scope.searchBox);
			$scope.curQuestion++;
		}
		else {
			answers.push($scope.searchBox);
      $scope.loading = true;
			Restaurant.getRestaurant(answers)
      .then(function(data) {
				console.log(data);
        if (data === "NO_DATA") {
          $scope.noDataRecieved = true;
        }
        else {
          $scope.restaurantData = data;
          $scope.dataRecieved = true;
        }
        
			})
      .finally(function() {

        $scope.submitted = true;
        $scope.loading = false;
      });
		}
		$scope.inputForm.$setPristine();
		$scope.searchBox = "";
	};

  $scope.back = function() {
      $scope.dataRecieved = false;
      $scope.noDataRecieved = false;
      $scope.submitted = false;
      $scope.curQuestion = 0;
      answers = [];
    
  };
});