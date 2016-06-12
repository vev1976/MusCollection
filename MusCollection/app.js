

global.prj = {};
G = global.prj;


var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');
var expressLayouts = require('express-ejs-layouts');
var dbInit = require('./dbInit');

G.env = require("./config/config");


function startapp() {
  
  var app = express();
  
  var index = require('./routes/index');
  
  //all environments
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.set('view options', {layout : true});
  app.use(expressLayouts);
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
  
  //development only
  if ('development' === app.get('env')) {
     app.use(express.errorHandler());
  }
  
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







