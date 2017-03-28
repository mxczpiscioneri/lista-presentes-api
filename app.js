var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
var morgan = require('morgan');

var routeAuth = require('./routes/auth');
var routeUser = require('./routes/user');
var routeEvent = require('./routes/event');
var routeProduct = require('./routes/product');
var routeDonation = require('./routes/donation');
var db = require('./extras/mongoose')(); // connect to database


// Config
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());

app.use(morgan('dev')); // use morgan to log requests to the console


// CORS headers
app.all('*', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
	res.header("Access-Control-Allow-Headers", "Content-type, Accept, X-Access-Token, X-Key");
	next();
});


// Routes
app.post('/api/authenticate', routeAuth.authenticate);
app.post('/api/isAuthenticated', routeAuth.isAuthenticated);
app.post('/api/refreshAuthentication', routeAuth.refreshAuthentication);

app.get('/api/users', routeAuth.isAuthenticated, routeUser.findAll);
app.get('/api/users/:id', routeAuth.isAuthenticated, routeUser.findById);
app.post('/api/users', routeUser.add);
app.put('/api/users/:id', routeAuth.isAuthenticated, routeUser.update);
app.delete('/api/users/:id', routeAuth.isAuthenticated, routeUser.delete);

app.get('/api/events/:slug/:password', routeEvent.findByName);
app.get('/api/users/:user/events', routeAuth.isAuthenticated, routeEvent.findById);
app.get('/api/users/:user/events/password/:password', routeEvent.findByIdPassword);
app.get('/api/users/:user/events/confirmations', routeAuth.isAuthenticated, routeEvent.confirmations);
app.post('/api/users/:user/events/confirmation', routeEvent.confirmation);
app.get('/api/users/:user/events/donations', routeAuth.isAuthenticated, routeEvent.donations);
app.post('/api/users/:user/events/donation', routeEvent.donation);
app.post('/api/users/:user/events', routeAuth.isAuthenticated, routeEvent.add);
app.put('/api/users/:user/events', routeAuth.isAuthenticated, routeEvent.update);
app.post('/api/users/:user/events/upload', routeAuth.isAuthenticated, routeEvent.upload);

app.get('/api/products/search/:name/:page/:sort', routeAuth.isAuthenticated, routeProduct.search);
app.get('/api/users/:user/products', routeAuth.isAuthenticated, routeProduct.findAll);
app.get('/api/users/:user/products/bought', routeAuth.isAuthenticated, routeProduct.bought);
app.get('/api/users/:user/products/:id/buy/:bought', routeProduct.buy);
app.post('/api/users/:user/products', routeAuth.isAuthenticated, routeProduct.add);
app.delete('/api/users/:user/products/:id', routeAuth.isAuthenticated, routeProduct.delete);

app.post('/api/notification/:id', routeDonation.notification);


// Show errors
process.on('uncaughtException', function(err) {
	console.log(err);
});


// Server
app.listen(process.env.PORT || 8080, function() {
	console.log('App listening on port 8080!');
});