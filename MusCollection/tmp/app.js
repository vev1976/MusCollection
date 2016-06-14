
global.prj = {};
G = global.prj;

G.env = require("./config");
var dbInit = require('./dbInit');


dbInit(G.env, function(err, dbref){
  if (!err) {
     G.db = dbref;
     startapp();
  }
  else {
     console.log(err);
     process.exit(-1);
  }
});


function startapp() {
  
  console.log('App started!!!');
  
  
  
  process.exit(-1);
}

