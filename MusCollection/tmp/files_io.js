/**
 
 *
 */

var fs = require('fs');

function readData(){
  return	fs.readFileSync(process.argv[2]);
}


function processData(buf){
  var strData = buf.toString();
  var splitter = "\n";
  return strData.split(splitter).length - 1;
}

function printResult(n){
  console.log('' + n);
}


(function common(){
  var dataBuffer = readData();
  var rowNumbers = processData(dataBuffer);
  printResult(rowNumbers);
})();


