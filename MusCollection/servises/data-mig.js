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
};


function makeWhere(keys, header, data){
   var s = "";
   for (var i=0;i<keys.length;i++){
       var id = header.indexOf(keys[i]);
       s = s + (s==""?s:" and ") + keys[i] + " = '" + data[id] + "'";
   }
   return s;
}

function makeValues(fields, header, data){
     var s = "";
     for (var i=0;i<fields.length;i++){
         var id = header.indexOf(fields[i]);
         s = s + (s==""?s:", ") + "'" + data[id] + "'";
     }
     return s;
}


function loadDB(db, dataForLoad){
   return new Promise(function(resolve, reject){
       async.forEachSeries(dataForLoad,function(oneCSV,callback_data) {
            if (!oneCSV.data) {
                 callback_data();
                 return;
            };
          
            var stmt_exists = "select count(*) cn from %from% where %where%";
            var stmt_insert = "insert into %from% (%fields%) values (%value%)";
            stmt_exists = stmt_exists.replace("%from%", oneCSV.purpose);
            stmt_insert = stmt_insert.replace("%from%", oneCSV.purpose).replace("%fields%", oneCSV.fields.join(","));

            var sql = [];
            for(var i=1; i<oneCSV.data.length; i++){
                   var sql_com = {};
                   var s = makeWhere(oneCSV.keys,oneCSV.data[0],oneCSV.data[i]);
                   sql_com.exists = stmt_exists.replace("%where%", s);
                   s = makeValues(oneCSV.fields,oneCSV.data[0],oneCSV.data[i])
                   sql_com.insert = stmt_insert.replace("%value%", s);          //  oneCSV.data[i].join(",")
                   sql.push(sql_com);
            }
            
            async.forEachSeries(sql,function(sql_com, callback_sql){
          //    console.log(sql_com);
              db.query(sql_com.exists, { type: db.QueryTypes.SELECT}).then(function(result) {
                   if (result.length==1 && result[0].cn == '0') {
                      db.query(sql_com.insert).then(function() {
                        callback_sql();
                      }, function(err){
                        callback_sql(err);
                      });
                   }
                   else callback_sql();
              }, function(err){
                   logger.error("DB error -->>> " + err);
                   callback_sql(err);
              });
            }, function(err) {
                   if (err)
                      logger.error("File " + oneCSV.filename + " was loaded with error - ", err);
                   else
                      logger.info("File " + oneCSV.filename + " was loaded successfully!");
                   callback_data();
            });
            
        }, function(err){
              resolve();
        });
       
   });
}


var uploadCSV = function(db, folder) {
  return new Promise(function(resolve, reject) {
  
      var header = [{purpose: "app.i10n", fields: ["key", "en", "de"], keys: ["key"]},
                    {purpose: "app.role", fields: ["name"],            keys: ["name"]}
                   ];
    
      var files = fs.readdirSync(path.resolve(folder, 'data'));
      var callCount = files.length;
  
      files.forEach(function(file){
        var data = [];
 //       console.log(path.resolve(folder, 'data', file));
        csv.fromPath(path.resolve(folder, 'data', file), csvOption)
                .on("data", function(row){
                                data.push(row);
                            })
                .on("error", function(err){      //it works!!!
                                 logger.error("Error in file " + file + " -->>> " + err);
                                 callCount--;
                                 if (callCount <= 0) {
                                    loadDB(db,header).then(function(result){
                                        resolve();
                                    },function(err){
                                        resolve();
                                    });
                                 }
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
                              callCount--;
                              if (callCount <= 0) {
                                 loadDB(db,header).then(function(result){
                                     resolve();
                                 },function(err){
                                     resolve();
                                 });
                              }
                                
                           });
      });
  });
}

var makeMeLookSync = function(fn) {
    iterator = fn();
    loop = function(result) {
      !result.done && result.value.then(res =>
        loop(iterator.next(res)));
    };

    loop(iterator.next());
  };
  
var  uploadCSVSync = function(db, folder) {
  
  makeMeLookSync(function* () {
      result = yield uploadCSV(db, folder);

      console.log(result);
    });
}
  


module.exports = {
  importCSV : uploadCSV,
  importCSVSync : uploadCSVSync,
}


