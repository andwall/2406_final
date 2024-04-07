/*
Basic express server with middleware, SQLite database, and Handlebars template rendering.
Here we use server-side templating using the Handlebars template engine to generate the HTML for the response pages to send to the client.

We use the exported route functions in the 'use' and 'get'
routes. Typically 'use' calls functions that invoke next() whereas our
get and post routes send responses to the client.

Testing: (user: ldnel password: secret)
http://localhost:3000/index.html
http://localhost:3000/users
http://localhost:3000/find?title=Love
http://localhost:3000/song/372
*/

const http = require('http');
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const hbs = require('hbs');
const app = express(); //create express middleware dispatcher
const PORT = process.env.PORT || 3000
const session = require('express-session');


// view engine setup
hbs.registerPartials(__dirname + '/views/partials');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs'); //use hbs handlebars wrapper
app.locals.pretty = true; //to generate pretty view-source code in browser

//read routes modules
const routes = require('./routes/index');
const authRouter = require('./routes/authRouter');
const {authChecker, adminAuthChecker} = require('./routes/auth')
const exerciseApi = require('./routes/exerciseApi');

/* Middleware */
// app.use(routes.authenticate); //authenticate user
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(express.urlencoded({extended: 'false'}))
app.use(express.json());
app.use(session({
	secret: 'jdfla44yyeerelll',
	name: 'sid',
	resave: false,
	saveUninitialized: false,
	cookie: {
		secure: false,
		httpOnly: true,
		sameSite: 'lax',
		expires: 1000 * 60 * 24 * 7 //one week
	},
}))

/* Authentication */
const protected = [authChecker];
const adminProtected = [adminAuthChecker]
app.use('/auth', authRouter);

/* Public Routes */
app.get('/', routes.login);
app.get('/login', routes.login);
app.get('/register', routes.register);
app.get('/logout', routes.logout)

/* Private routes */
app.get('/home', protected, routes.home);
app.get('/songs', protected, routes.find);
app.use('/users', adminProtected, routes.users);
app.use('/api', protected, exerciseApi);
// app.get('/users', routes.users);
// app.get('/song/*', routes.songDetails);

//start server
app.listen(PORT, err => {
  if(err) console.log(err)
  else {
		console.log(`Server listening on port: ${PORT} CNTL:-C to stop`)
		console.log(`To Test:`)
		console.log('user: ldnel password: secret')
		console.log('http://localhost:3000/index.html')
		// console.log('http://localhost:3000/users')
		// console.log('http://localhost:3000/songs?title=Love')
		// console.log('http://localhost:3000/song/372')
	}
})
