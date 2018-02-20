const	mongoose = require("mongoose"), 
		express = require('express');

const	app = express();

// Create a Schema class with mongoose
var Schema = mongoose.Schema;

var ArticleSchema = new Schema ({
	title: {
		type: String,
		trim: true,
		unique: true,
		required: "title is required"
	},
	date: {
		type: String,
		trim: true
	},
	link: {
		type: String,
		trim: true,
		unique: true
	},
	story: {
		type: String,
		trim: true
	}, 
	notes: [{
    type: Schema.Types.ObjectId
  }]
});

ArticleSchema.methods.retrieveAll = function(res) {
	return this.model('Article').find({}).sort({date: -1}).exec(function(err, data) {
		if(err) {
			console.log(err);
		} else {
			console.log(data);
			res.render('index.hbs', { articles: data});
		}
	});
};

ArticleSchema.methods.retrieveOne = function(req, res) {
	return this.model('Article')
		.find({_id: req.query.articleID})
		.exec(function(err, data) {
		if(err) {
			console.log(err);
		} else {
			console.log(data);
			res.render('article.hbs', {article: data[0], showNotes: false});
		}
	});
};

ArticleSchema.methods.viewNotes = function(req, res, Note, article) {
	return this.model('Article')
	.find({_id: req.query.articleID})
	.exec(function(err, data) {
		console.log('viewNotes exec fired');
		console.log(data);
			Note.find({_id: {$in: data[0].notes}})
			.sort({created: -1})
			.exec(function(err, doc) {
				if(err) {
					console.log(err);
				} else {
					console.log('doc is ' + doc);
					res.render('article.hbs', {article: data[0], notes: doc, showNotes: req.query.showNotes});
				}
			});
	});
};



var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;
