var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
var morgan = require('morgan');

var routeAuth = require('./routes/auth');
var routeUser = require('./routes/user');
var db = require('./extras/mongoose')(); // connect to database


// Config
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());

app.use(morgan('dev')); // use morgan to log requests to the console


// Routes
app.post('/api/authenticate', routeAuth.authenticate);

app.get('/api/users', routeAuth.isAuthenticated, routeUser.findAll);
app.get('/api/users/:id', routeAuth.isAuthenticated, routeUser.findById);
app.post('/api/users', routeAuth.isAuthenticated, routeUser.add);
app.put('/api/users/:id', routeAuth.isAuthenticated, routeUser.update);
app.delete('/api/users/:id', routeAuth.isAuthenticated, routeUser.delete);

app.use('*', function(req, res, next) {
	var indexFile = path.resolve(__dirname + '/public/index.html');
	res.sendFile(indexFile);
});


// Server
app.listen(process.env.PORT || 8080, function() {
	console.log('App listening on port 8080!');
});