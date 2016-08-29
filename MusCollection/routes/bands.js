var express = require('express');
var router = express.Router();


 router.get('/', function(req, res) {

    res.render('bands',{bands : {},
          page_title : 'Groups'})

  });


 router.get('/:name?', function(req, res, next) {
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



/*
 router.get('/bands/*+', function(req, res) {
    res.send('Unknown band!')
  });
  */
  
  
  module.exports = router;
