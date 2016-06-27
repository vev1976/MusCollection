/**
 *
 */

var fs = require('fs');

(function common(){
    var path = process.argv[2];
    var ext  = (process.argv[3]==undefined?'':('.' + process.argv[3]));
    
      
    fs.readdir(path, function(err,filearr){
      
      if (err) throw err;
    
      for(var i = 0; i < filearr.length; i++){
       if (fs.statSync(path + '/' + filearr[i]).isFile()) {
          if (filearr[i].toString().slice(-ext.length) == ext){
              console.log(filearr[i]);
          }
       }
      }
    });
  
})();


/*

    var fs = require('fs');
     var path = require('path');
       
     fs.readdir(process.argv[2], function (err, list) {
       list.forEach(function (file) {
         if (path.extname(file) === '.' + process.argv[3])
           console.log(file)
       })
     })




*/