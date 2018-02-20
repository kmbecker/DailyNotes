const	mongoose = require("mongoose"), 
		express = require('express');

const	app = express();

// Create a Schema class with mongoose
var Schema = mongoose.Schema;

var NoteSchema = new Schema ({
	username: {
		type: String,
		trim: true,
		unique: false
	},
	q1: {
		type: String,
		trim: true
	},
	a1: {
		type: String,
		trim: true,
		required: "Please answer all questions."
	},
	q2: {
		type: String,
		trim: true
	},
	a2: {
		type: String,
		trim: true,
		required: "Please answer all questions."
	},
	q3: {
		type: String,
		trim: true
	},
	a3: {
		type: String,
		trim: true,
		required: "Please answer all questions."
	},
	articleID: {
		type: Schema.Types.ObjectId,
		ref: "Article"
	},
	created: {
		type: Date,
		default: Date.now
	}

});

NoteSchema.methods.saveNote = function(req, res, Article, note) {
	this.save(function(err, data) {
			if(err) {
				console.log(err);
			} else {
				console.log('req.query.articleid ' + req.query.articleID)
				return Article.update({_id: req.query.articleID}, {$push: {"notes": note._id}}, {new: true}).exec(function(err, numAffected) {
					if(err) {
						console.log(err);
					} else {
						console.log('note id ' + note._id)
						console.log(numAffected);
						res.redirect('/shownotes?' + 'showNotes=true&articleID=' + req.query.articleID);
					}
				});
			}
		});
};


var Note = mongoose.model("Note", NoteSchema);

module.exports = Note;