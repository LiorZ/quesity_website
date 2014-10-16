module.exports = function(mongoose) {
	
	var NewsArticle = require('./models/NewsArticle')(mongoose);

	return {
		
		NewsArticle: NewsArticle
		
	}
}
