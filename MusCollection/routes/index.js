var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next){
  res.render('index', {stat_txt: 'page body',
                       page_title: 'My collection'});
  next()
});


module.exports = router;