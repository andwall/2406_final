
var url = require('url');
var sqlite3 = require('sqlite3').verbose(); //verbose provides more detailed stack trace
var db = new sqlite3.Database('data/db_1200iRealSongs');

/* Init database */
db.serialize(function(){
	var sqlString = "CREATE TABLE IF NOT EXISTS users (userid TEXT PRIMARY KEY, password TEXT)";
	db.run(sqlString);
	sqlString = "INSERT OR REPLACE INTO users VALUES ('andrew', 'secret')";
	db.run(sqlString);
	sqlString = "INSERT OR REPLACE INTO users VALUES ('frank', 'secret2')";
	db.run(sqlString);
});

/* Authenticate user */
exports.authenticate = function (request, response, next){
	let auth = request.headers.authorization;
	if(!auth){
 	 	//note here the setHeader must be before the writeHead
		// response.setHeader('WWW-Authenticate', 'Basic realm="need to login"');
		// response.writeHead(401, {'Content-Type': 'text/html'});
		// console.log('No authorization found, send 401.');
		response.render('login')
 		// response.end();
	}else{
		console.log("Authorization Header: " + auth);
		let tmp = auth.split(' '); // decode authorization header
    let buf = Buffer.from(tmp[1], 'base64'); //create a buffer and tell it the data coming in is base64
		let plain_auth = buf.toString(); //read it back out as a string
		console.log("Decoded Authorization ", plain_auth);

		//extract the userid and password as separate strings
		let credentials = plain_auth.split(':');      // split on a ':'
		let username = credentials[0];
		let password = credentials[1];
		console.log("User: ", username);
		console.log("Password: ", password);

		let authorized = false;
		db.all("SELECT userid, password FROM users", function(err, rows){ // check user exists
			for(let i = 0; i < rows.length; i++){
				if(rows[i].userid == username & rows[i].password == password) authorized = true;
			}
			if(authorized == false){
				//we had an authorization header by the user:password is not valid
				response.setHeader('WWW-Authenticate', 'Basic realm="need to login"');
				response.writeHead(401, {'Content-Type': 'text/html'});
				console.log('No authorization found, send 401.');
				response.end();
			}else{ //valid user
				next();
			}
		});
	}
	//notice no call to next()
}

exports.register = function(req, res, next){
	res.render('register');
}

exports.login = function(req, res, next){
	res.render('login');
}

function addHeader(request, response){
	var title = 'COMP 2406:';
	response.writeHead(200, {'Content-Type': 'text/html'});
	response.write('<!DOCTYPE html>');
	response.write('<html><head><title>About</title></head>' + '<body>');
	response.write('<h1>' +  title + '</h1>');
	response.write('<hr>');
}

function addFooter(request, response){
	response.write('<hr>');
	response.write('<h3>' +  'Carleton University' + '</h3>');
	response.write('<h3>' +  'School of Computer Science' + '</h3>');
	response.write('</body></html>');
}



exports.index = function (request, response){
	response.render('index', { title: 'COMP 2406', body: 'rendered with handlebars'});
}

function parseURL(request, response){
	let parseQuery = true; //parseQueryStringIfTrue
	let slashHost = true; //slashDenoteHostIfTrue
	let urlObj = url.parse(request.url, parseQuery , slashHost );
	console.log('path:');
	console.log(urlObj.path);
	console.log('query:');
	console.log(urlObj.query);
	return urlObj;
}

exports.users = function(request, response){
	db.all("SELECT userid, password FROM users", function(err, rows){
		response.render('users', {title : 'Users:', userEntries: rows});
	})
}

exports.find = function (request, response){
	console.log("RUNNING FIND SONGS");
	let urlObj = parseURL(request, response);
	let sql = "SELECT id, title FROM songs";
	if (urlObj.query['title']) {
		let keywords = urlObj.query['title']
		keywords = keywords.replace(/\s/g, '%')
		console.log("finding title: " + keywords);
		sql = "SELECT id, title FROM songs WHERE title LIKE '%" +
			keywords + "%'"
	}

	db.all(sql, function(err, rows){
		response.render('songs', {title: 'Songs:', songEntries: rows});
	});
}

exports.songDetails = function(request, response){
	var urlObj = parseURL(request, response);
	var songID = urlObj.path; //expected form: /song/235
	songID = songID.substring(songID.lastIndexOf("/")+1, songID.length);
	var sql = "SELECT id, title, composer, key, bars FROM songs WHERE id=" + songID;
	console.log("GET SONG DETAILS: " + songID );
	db.all(sql, function(err, rows){
		let song = rows[0];
		let replacedStr = song.bars.replace(/\||\[\||\|]/g, ',');
		console.log(replacedStr)
		replacedStr = replacedStr.replace(/\s+/g, '');

		let bars = replacedStr.split(',');

		// console.log(bars);
		for(let i = 0; i < bars.length; ++i){
			if(bars[i] === '|' || bars[i] === '|]' || bars[i] === ']' || bars[i] === '||' || bars[i] === ''){
				bars.splice(i, 1);
			}
		}
		bars = divideArray(bars, 4, bars.length);
		console.log('Song Data');
		console.log(bars);
		song.individualBars = bars;
		response.render('songDetails', {title: 'Songs Details:', song: song});
	});

}

// Function to split the array
function divideArray(nums, K, N) {
	let ans = [];
	let temp = [];
	for (let i = 0; i < N; i++) {
		temp.push(nums[i]);
		if (((i + 1) % K) == 0) {
			ans.push(temp);
			temp = [];
		}
	}
	if(temp) ans.push(temp);
	return ans;
}
