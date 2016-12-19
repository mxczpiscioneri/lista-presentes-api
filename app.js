var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
var routes = require('./routes/api');
var db = require('./extras/mongoose')();

// Config
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());

// Routes
app.get('/api', routes.findAll);
app.get('/api/:id', routes.findById);
app.post('/api', routes.addBeer);
app.put('/api/:id', routes.updateBeer);
app.delete('/api/:id', routes.deleteBeer);
app.use('*', function(req, res, next) {
	var indexFile = path.resolve(__dirname + '/public/index.html');
	res.sendFile(indexFile);
});

// Server
app.listen(process.env.PORT || 8080, function() {
	console.log('App listening on port 8080!');
});