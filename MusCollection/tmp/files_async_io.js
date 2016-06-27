/**
 *
 */

var fs = require('fs');

(function readData(){
  fs.readFile(process.argv[2], function (err, data) {
    if (err) throw err;
    printResult(processData(data));
  });
})();


function processData(buf){
  var strData = buf.toString();
  var splitter = "\n";
  return strData.split(splitter).length - 1;
}

function printResult(n){
  console.log('' + n);
}




