/**
 *
 */

var http = require('http');


(function httpGet(url){
  http.get(url,
           function(res) {
//                           console.log('STATUS: ' + res.statusCode);
//                           console.log('HEADERS: ' + JSON.stringify(res.headers));
                           res.setEncoding('utf8');
                           res.on('data',
                                  function (chunk) {
                                                      console.log(chunk);
                                                   }
                                 );
                         }
         );
})(process.argv[2]);






