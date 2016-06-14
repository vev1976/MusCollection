/**
 *
 * var http = require('http')
     var map = require('through2-map')
       
     var server = http.createServer(function (req, res) {
       if (req.method != 'POST')
         return res.end('send me a POST\n')
       
       req.pipe(map(function (chunk) {
         return chunk.toString().toUpperCase()
       })).pipe(res)
     })
       
     server.listen(Number(process.argv[2]))
 *
 */



var http = require('http');

  
  var server = http.createServer(function (req, res) {
      res.setHeader('Content-Type', 'text/plain');
      var req_data = '';
      req.setEncoding('utf8');
      req.on('data',function(chunc){
        req_data += chunc;
      });
      req.on('end', function(){
        req_data += req.method;
        console.log(req_data);
        res.write(req_data.toUpperCase());
        res.end();
      });
          
     });
  
  server.listen(process.argv[2]);
  
  server.on('listening',function(){
    console.log('Server started!');
  });
      