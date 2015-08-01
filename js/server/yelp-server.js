/* required modules */
var express = require('express');
var app = express();
var oauthSignature = require('oauth-signature');  
var n = require('nonce')();  
var request = require('request');  
var qs = require('querystring');  
var fs = require('fs');


// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

var fs = require('fs');
var obj = JSON.parse(fs.readFileSync('yelp_api_keys.json', 'utf8'));

var price = 0;
var rating = 0;

app.get('/api/params?', function(req, res) {

	console.log(req.url);
	// Parameters for Yelp API call
	var parameters = {
		ll: req.query.loc,
		term: req.query.term,
		radius_filter: req.query.radius,
		limit: req.query.limit,
		sort: '0',
		oauth_consumer_key : obj.consumer_key,
    	oauth_token : obj.token,
    	oauth_nonce : n(),
    	oauth_timestamp : n().toString().substr(0,10),
    	oauth_signature_method : 'HMAC-SHA1',
    	oauth_version : '1.0'
	};

	console.log(parameters.limit);
	console.log(parameters.term);
	rating = req.query.rating;
	price = req.query.maxPrice;

	request_yelp(parameters, selectRestaurant, res);

  	//res.send(restaurant_json);
});



app.listen(process.env.PORT || 4730);
/* Function for yelp call
 * ------------------------
 * set_parameters: object with params to search
 * callback: callback(error, response, body)
 */
var request_yelp = function(parameters, callback, res) {

  /* The type of request */
  var httpMethod = 'GET';

  /* The url we are using for the request */
  var url = 'http://api.yelp.com/v2/search';

  /* We set our secrets here */
  var consumerSecret = obj.consumer_secret;
  var tokenSecret = obj.token_secret;

  /* Then we call Yelp's Oauth 1.0a server, and it returns a signature */
  /* Note: This signature is only good for 300 seconds after the oauth_timestamp */
  var signature = oauthSignature.generate(httpMethod, url, parameters, consumerSecret, tokenSecret, { encodeSignature: false});

  /* We add the signature to the list of paramters */
  parameters.oauth_signature = signature;

  /* Then we turn the paramters object, to a query string */
  var paramURL = qs.stringify(parameters);

  /* Add the query string to the url */
  var apiURL = url+'?'+paramURL;

  /* Then we use request to send make the API Request */
  request(apiURL, function(error, response, body){
    callback(error, response, body, res);
  });

};

// Processes recieved json data to find a single restaurant
function selectRestaurant(error, response, body, res) {
	var jsonobj = JSON.parse(body);
	var businesses = jsonobj.businesses;
	
	while (businesses.length > 0) {
		var index = Math.floor(Math.random() * businesses.length);
		console.log(businesses[index].rating);
		if (businesses[index].rating >= rating)  {
			res.send("hi");
			break;
		}
		else {
			businesses.splice(index, 1);
		}
	}
	//console.log(body);
	
}

function scrapePrice(url) {
	return 5;
}

function formatForSend(business) {
	return "hi";
}

