/* required modules */
var express = require('express');
var app = express();
var oauthSignature = require('oauth-signature');  
var n = require('nonce')();  
var request = require('request');  
var qs = require('querystring');  
var fs = require('fs');


var fs = require('fs');
var obj = JSON.parse(fs.readFileSync('yelp_api_keys.json', 'utf8'));

app.get('/api/params?', function(req, res) {

	// Parameters for Yelp API call
	var parameters = {
		ll: req.param('loc'),
		term: req.param('term'),
		radius_filter: req.param('radius'),
		limit: req.param('limit'),
		sort: '0',
		oauth_consumer_key : obj.consumer_key,
    	oauth_token : obj.token,
    	oauth_nonce : n(),
    	oauth_timestamp : n().toString().substr(0,10),
    	oauth_signature_method : 'HMAC-SHA1',
    	oauth_version : '1.0'
	};

	var restaurant_json = request_yelp(parameters, selectRestaurant);

  	res.send("");
});



app.listen(process.env.PORT || 4730);
/* Function for yelp call
 * ------------------------
 * set_parameters: object with params to search
 * callback: callback(error, response, body)
 */
var request_yelp = function(parameters, callback) {

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
    return callback(error, response, body);
  });

};

// Processes recieved json data to find a single restaurant
function selectRestaurant(error, response, body) {

}