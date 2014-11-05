module.exports = function(mongoose) {
	
	var NewsArticleSchema = new mongoose.Schema({
		
		date_created:{type:Date, 'default':Date.now},
		title: {type:String},
		short_text: {type:String},
		long_text:{type:String, set:function(text) {
			return text.replace('\n','<br/>');
		}},
		img: {type:String},
		
		
	});
	var NewsArticle = mongoose.model('NewsArticle',NewsArticleSchema);
	
	return NewsArticle;
}