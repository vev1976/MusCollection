/**
var fs = require('fs');

function read_directory(path, next) {
  fs.readdir(".", function (err, files) {
    var count = files.length,
        results = {};
    files.forEach(function (filename) {
      fs.readFile(filename, function (data) {
        results[filename] = data;
        count--;
        if (count <= 0) {
          next(results);
        }
      });
    });
  });
}

function read_directories(paths, next) {
  var count = paths.length,
      data = {};
  paths.forEach(function (path) {
    read_directory(path, function (results) {
      data[path] = results;
      count--;
      if (count <= 0) {
        next(data);
      }
    });
  });
}

read_directories(['articles', 'authors', 'skin'], function (data) {
  // Do something
});
 
 */

var http = require('http');


function httpGet(url, next){
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
                                                  next(buf,url);
                                              }
                                 );
                         }
         );
}

//(process.argv[2]);

function getAllURLs(urls) {
  var res_arr  = [];
  var countdown = urls.length;
  for (var i=0;i<urls.length;i++) {
    httpGet(urls[i], function(buf,url){
                        for (var j=0;j<urls.length;j++){
                          if (urls[j] == url) {
                             res_arr[j] = buf;
                             break;
                          }
                        }
                        countdown--;
                        if (countdown<=0) {
                          printResult(res_arr);
                        }
                     });
  }
}

function printResult(resArr){
  for (var j=0;j<resArr.length;j++) {
    console.log(resArr[j]);
  }
}

(function start(){
  var cmdl_urls = process.argv.slice(2);
  //console.log(cmdl_urls);
  getAllURLs(cmdl_urls);
})();


/*
 *
     var http = require('http')
     var bl = require('bl')
     var results = []
     var count = 0
       
     function printResults () {
       for (var i = 0; i < 3; i++)
         console.log(results[i])
     }
       
     function httpGet (index) {
       http.get(process.argv[2 + index], function (response) {
         response.pipe(bl(function (err, data) {
           if (err)
             return console.error(err)
       
           results[index] = data.toString()
           count++
       
           if (count == 3)
             printResults()
         }))
       })
     }
       
     for (var i = 0; i < 3; i++)
       httpGet(i)
   

 *
 */











