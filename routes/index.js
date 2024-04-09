/**
 * File: index.js
 * Purpose: responsible for handling main routes to the app
 */
const db = require('../sql/database');
const crud = require('../sql/crud');

/* Renders the register page */
exports.register = function(req, res, next){
	res.render('register', {isLoggedIn: req.session.isLoggedIn, isAdmin: req.session.user ? req.session.user.role === 'admin' : false});
}

/* Renders the login page */
exports.login = function(req, res, next){
	res.render('login', {isLoggedIn: req.session.isLoggedIn, isAdmin: req.session.user ? req.session.user.role === 'admin' : false});
}

exports.logout = function(req, res, next){
	if (req.session) {
    req.session.destroy(err => {
      if (err) {
        res.status(400).send('Unable to log out');
      } else {
        // res.send('Logout successful');
				res.render('login', {isLoggedIn: false, isAdmin: false})
      }
    });
  } else {
    res.end();
  }
}

/* Renders the home page with required info */
exports.home = async (req, res) => {
	const browseExercises = [
    {displayName: 'Abs', searchName: 'abdominals', img: ''},
    {displayName: 'Biceps', searchName: 'biceps', img: ''},
    {displayName: 'Calves', searchName: 'calves', img: ''},
    {displayName: 'Chest', searchName: 'chest', img: ''},
    {displayName: 'Forearms', searchName: 'forearms', img: ''},
    {displayName: 'Glutes', searchName: 'glutes', img: ''},
    {displayName: 'Hamstrings', searchName: 'hamstrings', img: ''},
    {displayName: 'Lats', searchName: 'lats', img: ''},
    {displayName: 'Lower Back', searchName: 'lower_back', img: ''},
    {displayName: 'Middle Back', searchName: 'middle_back', img: ''},
    {displayName: 'Quads', searchName: 'quadriceps', img: ''},
    {displayName: 'Traps', searchName: 'traps', img: ''},
    {displayName: 'Triceps', searchName: 'triceps', img: ''},
  ];
		
	db.get(crud.GET_USER_BY_EMAIL, [req.session.user.email], (err, row) => {
		if (err) {
			res.render('home', {
				title: 'COMP2406 Final', 
				name: req.session.user.name, 
				isAdmin: req.session ? req.session.user.role === 'admin' : false, 
				isLoggedIn: req.session.isLoggedIn, 
				mainContent: 'Hello world',
				userExercises: [],
				browseExercises: []
			});
		}
		if (row) { // User exists
			db.all(crud.GET_USER_EXERCISES, [row.userid], (err, rows) => {
				if (err) {
					res.render('home', {
						title: 'COMP2406 Final', 
						name: req.session.user.name, 
						isAdmin: req.session ? req.session.user.role === 'admin' : false, 
						isLoggedIn: req.session.isLoggedIn, 
						mainContent: 'Hello world',
						userExercises: [],
						browseExercises: []
					});
				}
				else{ //user exercises found
					res.render('home', {
						title: 'COMP2406 Final', 
						name: req.session.user.name.charAt(0).toUpperCase() + req.session.user.name.slice(1), 
						isAdmin: req.session ? req.session.user.role === 'admin' : false, 
						isLoggedIn: req.session.isLoggedIn, 
						mainContent: 'Hello world',
						userExercises: rows,
						browseExercises: browseExercises
					})
				}
			})
		}
	});
}

/* Gets all the users from the database */
exports.users = function(req, res){
	db.all("SELECT * FROM users", function(err, rows){
		if (err) {
			return res.status(500).send('Database error occurred');
		}
		res.render('users', {title : 'Users', userEntries: rows, isLoggedIn: req.session.isLoggedIn, isAdmin: req.session ? req.session.user.role === 'admin' : false });
	})
}
