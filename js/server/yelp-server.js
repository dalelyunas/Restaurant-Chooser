/* required modules */
var express = require('express');
var app = express();
var oauthSignature = require('oauth-signature');  
var n = require('nonce')();  
var request = require('request');  
var qs = require('querystring');  
var fs = require('fs');
var cheerio = require('cheerio');

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://rp.davidalelyunas.me');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', false);

    // Pass to next layer of middleware
    next();
});

var fs = require('fs');
var obj = JSON.parse(fs.readFileSync('yelp_api_keys.json', 'utf8'));

var price = 0;
var rating = 0;

app.get('/api/params?', function(req, res) {
	console.log('recieved');
	// Parameters for Yelp API call
	var parameters = {
		ll: req.query.loc,
		term: req.query.term,
		radius_filter: req.query.radius,
		limit: req.query.limit,
		sort: '0',
		category_filter: 'restaurants',
		oauth_consumer_key : obj.consumer_key,
    oauth_token : obj.token,
    oauth_nonce : n(),
    oauth_timestamp : n().toString().substr(0,10),
    oauth_signature_method : 'HMAC-SHA1',
    oauth_version : '1.0'
	};

	rating = parseFloat(req.query.rating);
	price = parseInt(req.query.maxPrice);

	request_yelp(parameters, yelpDataReceived, res);
});

app.listen(8080, '104.236.193.158');
console.log('Server running at http://104.236.193.158:8080/');

// Calls the Yelp API with the passed parameters and callback function
var request_yelp = function(parameters, callback, res) {
  var httpMethod = 'GET';
  var url = 'http://api.yelp.com/v2/search';

  var consumerSecret = obj.consumer_secret;
  var tokenSecret = obj.token_secret;

  var signature = oauthSignature.generate(httpMethod, url, parameters, consumerSecret, tokenSecret, { encodeSignature: false});

  parameters.oauth_signature = signature;
  var paramURL = qs.stringify(parameters);
  var apiURL = url+'?'+paramURL;

  request(apiURL, function(error, response, body){
    callback(error, response, body, res);
  });
};

// Callback function for when the Yelp API data is recieved
function yelpDataReceived(error, response, body, res) {
	var jsonobj = JSON.parse(body);
	var businesses = jsonobj.businesses;

	if (typeof jsonobj.error === 'undefined') {
		selectRestaurant(businesses, res);
	}
	else {
		console.log(jsonobj.error.text);
		res.send("NO_DATA");
	}
}

// Selects a restaurant from the list and passes it to the processing functions
function selectRestaurant(businesses, res) {
	if (businesses.length === 0) {
		res.send("NO_DATA");
	}
	else {
		var newIndex = Math.floor(Math.random() * (businesses.length - 1));

		console.log("Index: " + newIndex);
		scrapePrice(businesses, newIndex, checkBusiness, res);
	}
}

// Scrapes the price data from the Yelp page and then calls the callback function
function scrapePrice(businesses, index, callback, res) {
	var url = businesses[index].url
	console.log("URL: " + url);
	console.log("LENGTH: " + businesses.length);
	request(url, function(error, response, html){
    var $ = cheerio.load(html);

    $('.price-description').filter(function(){
    		var yelpPrice = 0;
        var data = $(this);
        var price = data.text(); 
        var parsePrice = price.replace(/\s+/g, '');
        console.log(parsePrice);
        if (parsePrice === "Under$10") {
        	yelpPrice = 0;
        }
        else {
        	yelpPrice = parseInt(parsePrice.split("-")[0].substring(1));
        }           
        callback(businesses, index, yelpPrice, parsePrice, res);
    });
	});
}

// Checks to see if the restaurant meets the request's criteria
// If it does it sends a response, else it recurrs back to the selectRestaurant after
// removing the current bad restaurant from the list
function checkBusiness(businesses, index, yelpPrice, displayPrice, res) {
	console.log("Rating: " + businesses[index].rating + " " + rating);
	console.log("Price: " + yelpPrice + " " + price);

	if (parseFloat(businesses[index].rating) >= rating && price >= yelpPrice)  {
		res.send(formatForSend(businesses[index], displayPrice));
	}
	else {
		var newBusinesses = businesses;
		newBusinesses.splice(index, 1);
		selectRestaurant(newBusinesses, res);
	}
}

// Formats the business and price data to send to the client
function formatForSend(business, businessPrice) {
	var largeImage = business.image_url.substring(0, business.image_url.lastIndexOf("/")) + "/ls.jpg"; 

	var json = {
		image: largeImage,
		name: business.name,
		url: business.url,
		rating: business.rating,
		price: businessPrice,
		address: business.location.display_address,
		snippet: business.snippet_text,
		rating_image: business.rating_img_url,
		reviews: business.review_count
	}
	return json;
}

