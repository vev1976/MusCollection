
var fs        = require('fs');
var path      = require('path');
var async     = require('async');

var source_path = '/Users/velichko/Documents/workspace/JS/WebContent/AllSAS';
var output_file = 'sas_reports.json';

var db2lib_out  = {};
var db2load_out = {};
var reports_out = {};
var farray =[];

reports_out.reports = [];

var files = fs.readdirSync(source_path);

for(var i = 0;i<=files.length; i++) {
  farray.push(make_check_File(files[i], source_path));
}

//console.log(farray);

async.series(farray, function(err){
  //console.log(db2lib_out);
  //console.log(db2load_out);
  //console.log(JSON.stringify(reports_out, null, "\t"));
  fs.writeFileSync(path.join(source_path,output_file), JSON.stringify(reports_out, null, "\t"));
});




function make_check_File(file, folder){
  return function(callback){
      var file_patt   = /BZ.*/i;
      var res = file_patt.exec(file);
      if (res != null) {
         fs.access(path.join(folder,file), fs.R_OK, function(err) {
            if (!err) {
              parse_file_report2(file, folder);
            }
            callback(null);
         });
      } else callback(null);
  };
}



function parse_file_rep(file, folder) {
    var txt = fs.readFileSync(path.join(folder,file),"UTF-8");
    txt = txt.split("\r\n").join(" ").toLowerCase();
    var proc_stmt = /ods\s*(pdf|html)\s*file\s*=\s*(\w*)[\s;]/igm;
 
    while (res_proc = proc_stmt.exec(txt)) {
      if (res_proc[2]) {
         var file_stmt  = new RegExp("filename\\s*" + res_proc[2] +"\\s*(.*?);", "igm");
         var res_file = file_stmt.exec(txt);
         if (res_file) {
               console.log(file,"; ",res_file[1]);
         }
         else {
           console.log(file, "; ", res_proc[0]);
         }
      }
    }
}

function parse_file_report2(file, folder) {

  var txt = fs.readFileSync(path.join(folder,file),"UTF-8");
    txt = txt.split("\r\n").join(" ").toLowerCase().replace(/\/\*.*?\*\//ig,"");
 
    var proc_stmt = /proc\s*report\s*data\s*=\s*([^\s]*)(.*?)run;/igm;
    var field_stmt = /define\s*([\w&.]*)\s*\/\s*([^ ]*)\s*(.*?);/igm;
    var caption_stmt = /([\'\"])(.*?)\1/;
    var contents_stmt = /contents\s*=\s*([\'\"])(.*?)\1/;
    var title_stmt = /title\d*.*?;/gm;
    var title_txt = /([\'\"])(.*?)\1/gm;
    
    while (res_proc = proc_stmt.exec(txt)) {

 
      var report = {};
      report.filename = file;
      report.datasource = res_proc[1];

      res_contents = contents_stmt.exec(res_proc[2]);
      if (res_contents) report.contents = res_contents[2];
      else report.contents = '';
      
      var title = '';
      while (res_title = title_stmt.exec(res_proc[2])){
          while (res_title_txt = title_txt.exec(res_title[0])){
             title = title + (title==""?"":"\n") + res_title_txt[2];      //
          }
       }
      report.title = title;
      
      report.fields = [];

      while (res_field = field_stmt.exec(res_proc[2])) {
        var field = {};

        res_caption = caption_stmt.exec(res_field[3]);
        field.fieldname = res_field[1];
        field.process_type = res_field[2];
        if (res_caption) field.caption = res_caption[2];
        else field.caption = '';
        if (res_field[3].search("noprint")>=0) field.noprint = true;
        else field.noprint = false;
        
        report.fields.push(field);
      }
      
     // console.log(report);
      reports_out.reports.push(report);
    }
};


function parse_file(file, folder) {
    var txt = fs.readFileSync(path.join(folder,file),"UTF-8");
    txt = txt.split("\r\n").join(" ").toLowerCase();
    var proc_stmt = /proc\ssql.*?quit/igm;
    var select_stmt = /select([^;]*?)from\s*(db2lib|db2load)\.(\w*).*?;/igm;
    var subsel_stmt = /\bselect\b/;
    var fields = {};
    var str = "";
  //  console.log(file);
    while (res_proc = proc_stmt.exec(txt)) {
  //    console.log("res_proc",res_proc[0], "-----------------------------------");
      while (res_sel = select_stmt.exec(res_proc[0])) {
  //      console.log(res_sel[0], "-----------------------------------");
  //      console.log(res_sel[1], "-----------------------------------");
  //      console.log(res_sel[2], "-----------------------------------");
  //      console.log(res_sel[3], "-----------------------------------");
        
        if (!subsel_stmt.test(res_sel[1]))
           str = res_sel[1].replace(/\bformat\b/g,"").replace(/\b\d+\b/g,"").replace(/\bcase.*?end\b/g,"").replace(/\b\w*\s*=/g,"").replace(/\b\w*\(/g,"").replace(/\b\w*\./g,"").replace(/\bas\s*\w*\b/ig,"").replace(/\s*/g,"").
                                replace(/distinct/i,"").replace(/\)/ig,"").replace(/\*/ig,"").replace(/&\w*?\./ig,"").replace(/\/\*.*?\*\//ig,"").replace(/\b\*,\b/ig,"").replace(/\/.*?\//ig,"").
                                replace(/".*?"/ig,"").replace(/into:\w*/ig,"").replace(/'.*?'/ig,"").replace(/[\/\+\-\!\&\*\$\.\%\\]/ig,"");
        else str = "";
   //     console.log(str);
        
        if (res_sel[2].toLowerCase() == 'db2lib') {
           if (!db2lib_out[res_sel[3]])
              db2lib_out[res_sel[3]] = {};
           fields = db2lib_out[res_sel[3]];
         }
        if (res_sel[2].toLowerCase() == 'db2load') {
            if (!db2load_out[res_sel[3]])
               db2load_out[res_sel[3]] = {};
            fields = db2load_out[res_sel[3]];
        }
        var farr =str.split(",");
        for(var i = 0; i<farr.length; i++) {
          var s = farr[i].toString();
            if (s != "" && s != "." && s != "$" && s != "&") fields[s] = file;
        };

      }
    }
};



