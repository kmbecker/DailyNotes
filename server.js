var express = require("express"),
	bodyParser = require("body-parser"),
	logger = require("morgan"),
	mongoose = require("mongoose"),
	request = require("request"),
	cheerio = require("cheerio"),
	PORT = process.env.PORT || 3000,
	exphbs = require('express-handlebars');
	
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, {
  useMongoClient: true
});

var	Article = require('./models/articleModel.js'),
	Note = require('./models/noteModel.js');

var app = express();

var db = mongoose.connection;

app.engine('hbs', exphbs({ 
  extname: 'hbs', 
  defaultLayout: 'main', 
  layoutsDir: __dirname + '/views/layouts/',
  partialsDir: __dirname + '/views/partials/'
}));

app.set('view engine', 'handlebars');


app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));

// Make public a static dir
app.use(express.static("public"));

db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
  console.log("Mongoose connection successful.");
});


app.use(logger('combined'));
logger('combined', {buffer: true});

request("http://www.dailykos.com", function(error, response, html) {

  // Load the HTML into cheerio
  var $ = cheerio.load(html);

  $(".story").each(function(i, element) {

  	var storyTitle = $(element).find(".story-title.heading").children("a").first().text();
  	var storyDate = $(element).find(".author-date.visible-sm-block").children("span.timestamp").first().text();
    var storyLink = $(element).find(".story-title.heading").children("a").first().attr("href");
    var para1 = $(element).find(".story-intro").find("p").first().text();

    var newArticle = new Article({
    	title: storyTitle,
     	date: storyDate,
     	link: "http://www.dailykos.com" + storyLink,
     	story: para1
    });

    newArticle.save(function(err, data) {
    	if(err) {
    		console.log("newarticle save error is " + err);
    	} else {
    		console.log(data);
    	}
    });
  }); 
});

app.get('/', function(req, res) {

	var article = new Article(req.query);

	article.retrieveAll(res);

});

app.get('/detail', function(req, res) {

	var article = new Article(req.query);

	article.retrieveOne(req, res);


});

app.get('/submit', function(req, res) {

	var note = new Note(req.query);
	console.log('note instance ' + note);
	note.saveNote(req, res, Article, note);

});

app.get('/shownotes', function(req, res) {
	var article = new Article(req.query);
	console.log('article instance ' + article);
	article.viewNotes(req, res, Note, article);
});

app.listen(PORT, function() {
	console.log('app listening on port ' + PORT);
});
