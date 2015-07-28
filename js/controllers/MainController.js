app.controller("MainController", function($scope, Restaurant) {
	$scope.questions = ["What type of food do you want?", "How far in minutes are you willing to travel?", "How many dollars do you want to spend?", "What Yelp rating should the restuarant have?"];
	$scope.curQuestion = 0;

	var answers = [];
	
	$scope.button = "";

	
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
			Restaurant.getRestaurant().then(function(data) {
				$scope.button = data;
			});
			/*restaurant.getRestaurant(answers).then(function(restaurants) {
				alert(restaurants[0]);
			});
			alert("failed");*/
		}
		$scope.inputForm.$setPristine();
		$scope.searchBox = "";
	};
});