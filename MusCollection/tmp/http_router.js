/**
 *   var http = require('http')
     var url = require('url')
       
     function parsetime (time) {
       return {
         hour: time.getHours(),
         minute: time.getMinutes(),
         second: time.getSeconds()
       }
     }
       
     function unixtime (time) {
       return { unixtime : time.getTime() }
     }
       
     var server = http.createServer(function (req, res) {
       var parsedUrl = url.parse(req.url, true)
       var time = new Date(parsedUrl.query.iso)
       var result
       
       if (/^\/api\/parsetime/.test(req.url))
         result = parsetime(time)
       else if (/^\/api\/unixtime/.test(req.url))
         result = unixtime(time)
       
       if (result) {
         res.writeHead(200, { 'Content-Type': 'application/json' })
         res.end(JSON.stringify(result))
       } else {
         res.writeHead(404)
         res.end()
       }
     })
     server.listen(Number(process.argv[2]))
   

 *
 *
 *
 */

var http = require('http');
var url  = require('url');
  
  var server = http.createServer(function (req, res) {
      res.setHeader('Content-Type', 'application/json');
      var url_obj = url.parse(req.url);
      
      
      
      if (url_obj.pathname == '/api/parsetime') {
        parseTimeISO(res,url_obj.query);
      }
      
      if (url_obj.pathname == '/api/unixtime') {
        parseTimeUNIX(res,url_obj.query);
      }
      
     });
  
  server.listen(process.argv[2]);
  
  server.on('listening',function(){
    console.log('Server started!');
  });
  
  // http://localhost:9080/api/parsetime?iso=2013-08-10T12:10:15.474Z
  function parseTimeISO(res,query){
     var out = {};
     var par_arr = query.split('&');
     var par = par_arr[0].split('=');
     var dt = new Date(par[1]);
     out.hour = dt.getHours();
     out.minute = dt.getMinutes();
     out.second = dt.getSeconds();
     //res.write(par[1]);
     res.end(JSON.stringify(out));
  };
  
  // http://localhost:9080/api/unixtime?iso=2013-08-10T12:10:15.474Z
  function parseTimeUNIX(res,query){
       var out = {};
       var par_arr = query.split('&');
       var par = par_arr[0].split('=');
       var dt = new Date(par[1]);
       out.unixtime = dt.getTime();
      
       res.end(JSON.stringify(out));
    
  };