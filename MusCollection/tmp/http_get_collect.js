/**
 *
 */

var http = require('http');


(function httpGet(url){
  http.get(url,
           function(res) {
//                           console.log('STATUS: ' + res.statusCode);
//                           console.log('HEADERS: ' + JSON.stringify(res.headers));
                         var buf = '';
                           res.setEncoding('utf8');
                           res.on('data',
                                  function (chunk) {
                                                      buf = buf +chunk;
                                                   }
                                 );
                           res.on('end',
                                  function () {
                                                  console.log(buf.length);
                                                  console.log(buf);
                                              }
                                 );
                         }
         );
})(process.argv[2]);






