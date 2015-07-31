app.controller("MainController", function($scope, Restaurant) {
	$scope.questions = ["What type of food do you want?", "What radius (Miles) should the restaurant be within?", "How much (Scale from 0 - 4) do you want to spend?", "What minimum rating (0 - 5) ?"];
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