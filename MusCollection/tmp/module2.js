/**
 *
 */


   var fs = require('fs');
   var pth = require('path');
       
   function dir_filter(path,ext,callback){
     
     fs.readdir(path, function (err, list) {
       
                          if (err) return callback(err);
                          var arr = new Array();
                          list.forEach(function (file) {
                                          if (pth.extname(file) === '.' + process.argv[3])
                                          arr.push(file);
                                       });
                          return callback(null,arr);
                       });
   }
   
   
   module.exports = dir_filter;
   
   
   
   
   
   