//Array of images which you want to show: Use path you want.
var images = new Array("url(img/bento.jpg)","url(img/bolognese_meal.jpg)","url(img/cooked_salmon.jpg)", "url(img/dessert.jpg)");
var nextimage = 0;

var questions = 0;
var curQuestion = 0;

function doSlideshow() {
	if(nextimage >= images.length){ 
		nextimage = 0; 
	}

    $(".body-container").css("background-image", images[nextimage++]);
    setTimeout(doSlideshow, 5000);
}


$(document).ready(function() {
	doSlideshow();
});

var app = angular.module("App", []);

app.controller("SearchController", ['$scope', function($scope) {
	var vm = this;
	vm.title="What type of food do you want to eat?";
	vm.button="NEXT";
	vm.updateQuestion = function() {
		$scope.inputForm.$setPristine();
		$scope.searchBox = "";
	};
}]);
