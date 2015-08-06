//Array of images which you want to show: Use path you want.
var images = new Array("img/bento.jpg","img/bolognese_meal.jpg","img/cooked_salmon.jpg", "img/dessert.jpg");
var nextimage = 0;

var preloadImages = new Array();

function doSlideshow() {
	if(nextimage >= preloadImages.length){ 
		nextimage = 0; 
	}
  $(".body-container").css("background-image", "url(" + preloadImages[nextimage++].src + ")");
  setTimeout(doSlideshow, 5000);
}

$(document).ready(function() {
  for(i=0; i < images.length; i++){
    preloadImages[i] = new Image();
    preloadImages[i].src = images[i];
  }

	doSlideshow();
});