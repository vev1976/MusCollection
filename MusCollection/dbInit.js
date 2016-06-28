var Sequelize = require('Sequelize');
var fs        = require('fs');
var path      = require('path');
var async     = require('async');
var data_mig  = require('./servises/data-mig');

var upd_path = "/dbupdates"; // default
var script_delimiter = "$$"; // default
var select_version = "select major, minor, version from db_version order by major, minor";  // default
var update_version = "dbo.up_db_version_set :major, :minor, :version";         // default

var db;

function make_execScript(script, t) {
  return function(callback) {
            db.query(script, {transaction:t})
            .then(
               function(){
                   callback();
               },
               function(err){
                   console.log(err);
                   callback(err);
            });
        };
}

function make_execFile(filename, major, minor, version) {
  return function(callback) {
       var txt = fs.readFileSync(filename, 'utf8');
       var batches = txt.split(script_delimiter);
       db.transaction().then(function(t) {
           var farray = [];
           for(var i = 0; i < batches.length; i++) {
               farray.push(make_execScript(batches[i], t));
           }
           async.series(farray, function(err) {
             if (!err){
                  db.query(update_version, {replacements:{major:major, minor:minor, version:version}, transaction:t})
                  .then(function(){
                          t.commit().then(function(){
                              console.log('Updated to ',{major:major, minor:minor, version:version});
                              callback(null);
                          });
                  }, function(err){
                      t.rollback().then(callback(err));
                  });
             } else {
                  t.rollback().then(callback(err));
             }
           });
       });
  };
}


function make_checkFile(folder, file, outputarray) {
  return function(callback) {
        var file_patt   = /update([0-9]+)[.]sql/i;
        var res = file_patt.exec(file);
        if (res !== null) {
           fs.access(path.join(folder,file), fs.R_OK, function(err) {
              if (!err) {
                outputarray[Number(res[1])] = path.join(folder,file);
              }
              callback();
           });
        } else {
           callback();
        }
        
  };
}


function updateDB(major, minor, version, done){
  var folder = path.join(__dirname,upd_path,('' + major + '.' + minor));
  var files = fs.readdirSync(folder);
  var sortedFiles = [];
  var farray = [];
  
  for(var i = 0; i < files.length; i++) {
     farray.push(make_checkFile(folder, files[i], sortedFiles));
  }
  console.log('Updating branch ', major, minor);
  async.parallel(farray, function(err){
      var i = version + 1;
      var farray = [];
      while (i < sortedFiles.length)  {
        if (sortedFiles[i]) {
            farray.push(make_execFile(sortedFiles[i], major, minor, i));
        }
        i++;
      }
      async.series(farray, function(err){
         if (err) {
            console.log('Updating branch ', major, minor, ' failed!');
            done(err, db);
         }
         else {
            console.log('Branch ', major, minor, ' has been updated successfully!');
            require("./model/models").init(db);
            data_mig.importCSV(db, path.join(__dirname,upd_path)).then(function(){
            	done(null, db)
            });
       //     console.log(db.Models);
         //   done(null, db);
         }
         return;
      });
  });
}

function checkDB_version(env, done) {
 
  db = new Sequelize(env.dburi, env.dboptions);
    if (!db) {
      done({message:'Can not connect to database!'}, null);
      return;
    }
  
  if (env.dbupdatepath) {
     upd_path = env.dbupdatepath;
  }
  if (env.dbscript_delimiter) {
     script_delimiter = env.dbscript_delimiter;
  }
    
  db.query(select_version, { type: db.QueryTypes.SELECT})
       .then(function(results){
             if (results.length > 0) {
                  results.forEach(function(result) {
                        updateDB(result.major, result.minor, result.version, done);
                  });
             } else {
                 updateDB(0, 0, -1, done);
             }
        }, function(err){
              if (err.message === 'Invalid object name \'db_version\'.') {
                 updateDB(0, 0, -1, done);
              } else {
                 console.log(err);
              }
        });
}

module.exports = checkDB_version;







