var express = require('express');
var exphbs  = require('express-handlebars');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var methodOverride = require('method-override');
var mongoose = require('mongoose');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var configDB = require('./config/database');

mongoose.connect(configDB.url);

var app = express();

//require('./config/passport')(passport);
// This says that if we do root or /, we mean to look in the public folder.
app.use(express.static(__dirname + '/'));

// require('./config/passport')(passport);

app.use(cookieParser());
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(methodOverride('_method'));
app.use(session({
	resave: false,
	saveUninitialized: true,
	secret: '123'
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

require('./app/routes.js')(app, passport);

// var routes = require('./controllers/routes.js');
// app.use('/', routes);

app.listen(process.env.PORT || 3000);