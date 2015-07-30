app.controller("MainController", function($scope, Restaurant) {
	$scope.questions = ["What type of food do you want?", "How many miles are you willing to travel?", "How much (0 - 4) do you want to spend?", "What rating (0 - 5) should the restuarant have?"];
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
			answers.push($scope.searchBox);
			Restaurant.getRestaurant(answers).then(function(data) {
				console.log(data);
			});
		}
		$scope.inputForm.$setPristine();
		$scope.searchBox = "";
	};
});