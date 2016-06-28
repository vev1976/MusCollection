var async = require("async");
var fs = require('fs');
var logger = require('log4js').getLogger("Data Migrator");
var csv = require("fast-csv");
var path = require("path");

var csvOption = {
        headers: false,
        delimiter: ';',
        objectMode: true,
        ignoreEmpty: true
};


var intersect = function (A, B) {
    return B.map(function(b){
        return A.indexOf(b) > -1;
    }).reduce(function(prev, curr){
        return prev && curr;
    }, true);
};


var getPurpose = function (header, testRowKeys) {
   var id = -1;
    for(var i=0;i<header.length;i++) {
         if (intersect(testRowKeys, header[i].fields)){
           id = i;
           break;
        }
    }
    return id;
}


function makeJSON(keys, fieldMap, header, data){
	var obj = {};
    for (var i=0;i<keys.length;i++)
	     obj[(fieldMap[keys[i]]?fieldMap[keys[i]]:keys[i])] = data[header.indexOf(keys[i])] ;
	return obj;	
}


function loadDB(db, dataForLoad){
   return new Promise(function(resolve, reject){
       async.forEachSeries(dataForLoad, function(oneCSV,callback_data) {
            if (!oneCSV.data) {
                 callback_data();
                 return;
            };
            
            var model = oneCSV.model;            
            var options = [];            
            for(var i=1; i < oneCSV.data.length; i++)
            	options.push({ where    : makeJSON(oneCSV.keys,   model.fieldAttributeMap, oneCSV.data[0], oneCSV.data[i]),
                               defaults : makeJSON(oneCSV.fields, model.fieldAttributeMap, oneCSV.data[0], oneCSV.data[i])
                             });            
            
            async.forEachSeries(options,function(option, callback_sql){
                model.findOrCreate(option)
                       .spread(function(inst, created){callback_sql()})
                       .catch(function(err){callback_sql("Error in row - " + JSON.stringify(option.where))});                       
            }, function(err) {
                   if (err)                     
                      logger.error("File " + oneCSV.filename + " was not loaded completely! ", err);
                   else
                      logger.info("File " + oneCSV.filename + " was loaded successfully!");
                   callback_data();
            });
            
       }, resolve);
       
   });
}


var uploadCSV = function(db, folder) {
  return new Promise(function(resolve, reject) {
	  
      var header = [{model: db.models.i10n, fields: ["key", "en", "de"], keys: ["key"]},
                    {model: db.models.band, fields: ["name", "style_id"], keys: ["name"]},
                    {model: db.models.style, fields: ["name"], keys: ["name"]}
                   ];
      try {
         var files = fs.readdirSync(path.resolve(folder, 'data'));
      }   
      catch (err) {
    	 logger.error(err);  
    	 reject(err); 
      }
   //   console.log(files);
      async.forEach(files,
        function(file, callback){
            var data = [];     
	        csv.fromPath(path.resolve(folder, 'data', file), csvOption)
	                .on("data", function(row){
	                                data.push(row);
	                            })
	                .on("error", function(err){      //it works!!!
	                                 logger.warn("Error in file " + file + " -->>> " + err);
	                                 callback();
	                             })
	                .on("end", function(){
	                              var res = getPurpose(header, data[0] ? data[0] : []);
	                              if (res < 0) {
	                                    logger.warn("File "+ file + " has unknown header!!!" + JSON.stringify(data[0] ? data[0] : []));
	                              }
	                              else {
	                                 header[res].data = data;
	                                 header[res].filename = file;
	                              };
	                              callback();
	                           });
        }, 
        function(err){       	
    	    loadDB(db,header).then(function(result){
                resolve();
            },function(err){
                reject(err);
            }); 
        });
  });
}  


module.exports = {
		  importCSV : uploadCSV,
		}

