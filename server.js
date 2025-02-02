/*
Basic express server with middleware, SQLite database, and Handlebars template rendering.
Here we use server-side templating using the Handlebars template engine to generate the HTML for the response pages to send to the client.

Testing: (user: admin@mail.com password: secret)
Testing: (user: andrew@mail.com password: secret)
http://localhost:3000/home (only when logged in)
http://localhost:3000/users (only when logged in as admin)
http://localhost:3000/exercise/search?muscleGroup=biceps
*/

const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const hbs = require('hbs');
const app = express(); //create express middleware dispatcher
const PORT = process.env.PORT || 3000
const session = require('express-session');

/* View engine setup */ 
hbs.registerPartials(__dirname + '/views/partials');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs'); //use hbs handlebars wrapper
app.locals.pretty = true; //to generate pretty view-source code in browser

/* Route definitions */
const routes = require('./routes/index');
const authRouter = require('./routes/authRouter');
const {authChecker, adminAuthChecker} = require('./routes/auth')
const userRouter = require('./routes/userRouter');
const exerciseRouter = require('./routes/exerciseApiRouter');

/* Middleware */
app.use(favicon(path.join(__dirname, 'public', 'favicon.png')));
app.use(logger('dev'));
app.use(express.urlencoded({extended: 'false'}))
app.use(express.json());

/* Cookie session */
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
app.use('/users', adminProtected, routes.users);
app.use('/user', protected, userRouter)
app.use('/exercise', protected, exerciseRouter)

/* Catch all other routes */
app.get('*', (req, res) => {
	res.status(404).send('404 NOT FOUND')
})

/* Start server */
app.listen(PORT, err => {
  if(err) console.log(err)
  else {
		console.log(`Server listening on port: ${PORT} CNTL:-C to stop`)
		console.log(`To Test:`)
		console.log('user: admin@mail.com | password: secret')
		console.log('user: andrew@mail.com | password: secret')
		console.log('user: frank@mail.com | password: secret')
		console.log('http://localhost:3000/')
		console.log('http://localhost:3000/login')
		console.log('http://localhost:3000/register')
		console.log('http://localhost:3000/home (only when logged in)')
		console.log('http://localhost:3000/home (only when logged in)')
		console.log('http://localhost:3000/users (only when logged in as admin)')
		console.log('http://localhost:3000/exercise/search?muscleGroup=biceps (only when logged in)')
	}
})
