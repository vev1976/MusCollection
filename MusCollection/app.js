global.CFG = {};


var dbInit = require('./dbInit');

CFG.env = require("./config/config");


function startapp() {
 
  var express = require('express');
  var routes = require('./routes');
  var user = require('./routes/user');
  var http = require('http');
  var path = require('path');
  var expressLayouts = require('express-ejs-layouts');
  var favicon = require('serve-favicon');
  var logger = require('log4js');
  var app = express();
  
  //all environments
  app.set('port', process.env.PORT || 3000);
  app.set('views', path.join(__dirname,'/views'));
  app.set('view engine', 'ejs');
  app.set('view options', {layout : true});

  app.use(expressLayouts);
  app.use(favicon(path.join(__dirname,'public','favicon.png')));
  app.use(logger.connectLogger(logger.getLogger("HTTP:"),{format:":method :url :status :response-time ms - :content-length"}));
  app.use(express.static(path.join(__dirname, 'public')));
 // console.log("before -------------");
   
  
  var index = require('./routes/index');
  
/*  //development only
  if ('development' === app.get('env')) {
     app.use(express.errorHandler());
  }
 */
  app.use("/", index);
  

  app.get('/bands/:name?', function(req, res, next) {
    var name = req.params.name;
    for (key in bands) {
      if (bands[key] === name) {
        res.render('band',{page_title : 'The best group',
                         band_name  : bands[key],
                         layout : 'band_layout'}
        );
        return;
      }
    }
    next();
  });

  app.get('/bands/', function(req, res) {
  /*	var body = '';
    for (key in bands) {
      body += '<a href=/bands/' + bands[key] + '>' + bands[key] + '</a><br />';
    }
    res.send(body);*/
    res.render('bands',{bands : bands,
          page_title : 'Groups'})

  });


  app.get('/bands/*+', function(req, res) {
    res.send('Unknown band!')
  });

  
  http.createServer(app).listen(app.get('port'), function(){
     console.log('Express server listening on port ' + app.get('port'));
  });

}


dbInit(CFG.env, function(err, dbref){
    if (!err) {
       CFG.db = dbref;
       startapp();
    }
    else {
       console.log(err);
       process.exit(-1);
    }
});





