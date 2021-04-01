const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema({
	title:{
		type: String
	},
	description:{
		type: String
	},
	training:{
		type: Boolean
	},
	link:{
		type: String,
		default:''
	},
	image:{
		type: String,
		required: false
	},
	video:{
		type: String,
		required: false
	}
},
{
	timestamps: true
})

const Article = mongoose.model('Article',ArticleSchema);

module.exports = Article;