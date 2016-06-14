/**
 *
 */

var http = require('http');
var querystring = require('querystring');

var postData = querystring.stringify({             // result is MSG=HELLO%20WORLD!
  'msg' : 'Hello World!'
});

//var postData = 'Hello World!';

var options = {
  hostname: 'localhost',
  port: 9080,
  path: '',
  method: 'POST',
  headers: {
    'Content-Type': 'text/plain',
    'Content-Length': postData.length
  }
};

var req = http.request(options, function(res)  {
  console.log('STATUS: ${res.statusCode}');
  console.log('HEADERS: ${JSON.stringify(res.headers)}');
  res.setEncoding('utf8');
  res.on('data', function(chunk) {
    console.log(chunk);
  });
  res.on('end', function() {
    console.log('No more data in response.');
  });
});

req.on('error', function(e) {
  console.log('problem with request: ${e.message}');
});

// write data to request body
req.write(postData);
req.end();