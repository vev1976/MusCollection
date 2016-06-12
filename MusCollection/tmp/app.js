/**
 * http://usejsdoc.org/
 */

var express = require('express');
var app = express();
var expressLayouts = require('express-ejs-layouts')
var port = process.env.PORT || 3000;

var bands = ['Aria', 'Piknik', 'Nautilus'];

app.set('view engine', 'ejs');
app.set('view options', {layout : true});
app.set('views', __dirname + '/views');

app.use(expressLayouts);

app.get('/', function (req, res) {
	res.render('index',{stat_txt : 'page body',
		                page_title : 'My collection'})
})

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


app.listen(port);
console.log('Server is listening on port 3000');


