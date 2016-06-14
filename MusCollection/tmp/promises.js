/**
 *
 */

var fs = require('fs');
var async = require('async');

var path = process.argv[2];


function readFilePromised(filename){
  return new Promise(function(resolve, reject) {
    fs.readFile(filename, {encoding: 'utf8'}, function (err, data) {
      if (err) {
        reject(err);
      }
      else {
        resolve({filename:filename,data:data});
      }
    });
  });
};


function readDirPromised(fpath){
  return new Promise(function(resolve, reject){
    fs.readdir(fpath, function(err,filearray){
      if (err) {
        reject(err);
      }
      else {
        resolve(filearray);
      }
    });
  });
};


function processFile(filename) {
    readFilePromised(filename).then(function(content){
    console.log(content.filename);
    console.log('///////////////////////// CONTENT \\\\\\\\\\\\\\\\\\\\\\\\\\');
    console.log(content.data);
    })
    .catch(function(err){
    console.log(err);
    });
}
/* does not work by series - only parallel
function makeFunc(filename) {
  return function(callback) {
    processFile(filename);
    callback();
  }
};
*/

function makeFunc(filename) {
    return function(callback) {
     readFilePromised(filename).then(function(content){
           console.log(content.filename);
           console.log('///////////////////////// CONTENT \\\\\\\\\\\\\\\\\\\\\\\\\\');
           console.log(content.data);
           callback();
        })
        .catch(function(err){
          console.log(err);
          callback();
        });
    };
  };



//var farray = [];
// async execution of file reading
/*readDirPromised(path).then(function(filearray){
         //console.log(filearray);
         //farray = farray.concat(filearray);
         filearray.forEach(function(filename) {
               readFilePromised(filename).then(function(content){
               console.log(content.filename);
               console.log('///////////////////////// CONTENT \\\\\\\\\\\\\\\\\\\\\\\\\\');
               console.log(content.data);
               })
               .catch(function(err){
               console.log(err);
               });
           });
});

*/

readDirPromised(path).then(function(filearray){
    console.log(filearray);
    var farray = [];
    filearray.forEach(function(filename) {
        farray.push(makeFunc(filename));
    });
    async.series(farray, function(){
      console.log('application finished!!!!!!');
    });
    
});



//console.log('application finished!!!!!!');





//console.log(farray.length);





