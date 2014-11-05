module.exports = function(app,models) {
	
	var NewsArticle = models.NewsArticle;
	
	var admin_auth = function(req,res,next) {
		if ( req.session.logged_in ){
			next();
		}
		else {
			res.redirect('/googi/login');
		}
	}
	
	app.get('/googi/dashboard',admin_auth, function(req,res,next) {
		res.render('admin_dashboard');
	})
	
	app.get('/googi/new_article',admin_auth,function(req,res,next) {
		res.render('admin_submit_article',{article:{}});
	});
	
	app.post('/googi/new_article',admin_auth,function(req,res,next){
		var news_article = new NewsArticle(req.body);
		console.log(news_article);
		news_article.save(function(err,doc) {
			if (err) {
				res.render('admin_submit_article',{err_message:"Error submitting article. Tell Lior and he'll see what's wrong"});
			}else {
				res.redirect('/googi/dashboard');
			}
		})
	});
	
	app.get('/googi/login',function(req,res,next) {
		res.render('admin_login');
	});
	
	app.post('/googi/login',function(req,res,next) {
		
		var password = req.body.password;
		if (password == 'QuesityForever') {
			req.session.logged_in = true;
			res.redirect('/googi/dashboard');
		}else {
			res.render('admin_login',{err_message:"Wrong password"}); 
		}
		
		
	});
	
	app.get('/googi/article_list',admin_auth,function(req,res,next) {
		NewsArticle.find({}, function(err,doc) {
			if (err) {
				res.send(401);
				return;
			}
			
			res.render('article_list',{articles:doc});
		}).sort({data_created:-1})
	});
	
	app.get('/googi/article/:id',admin_auth,function(req,res,next) {
		var article_id = req.param('id');
		if ( !article_id ) {
			res.send(401);
		}
		
		NewsArticle.findOne({_id: article_id}, function(err,doc) {
			if (err) {
				res.send(401);
			}else {
				res.render('admin_submit_article',{edit_mode:true,article:doc});
			}
		})
	});
	
	app.post('/googi/edit_article/:id',admin_auth,function(req,res,next) {
		var article_id = req.param('id');
		if ( !article_id ) {
			res.send(401);
		}
		console.log(req.body.long_text);
		NewsArticle.update({_id:article_id},req.body,function(err,doc) {
			if (err){
				res.send(401);
			}else {
				res.redirect('/googi/article_list');
			}
		})
	});
	
	app.post('/googi/delete_article/:id',admin_auth,function(req,res,next) {
		var article_id = req.param('id');
		if ( !article_id ) {
			res.send(401);
		}
		
		NewsArticle.remove({_id:article_id},function(err,doc) {
			
			if (err) {
				res.send(401);
			}else{
				res.send(200);
			}
			
		});
	});
}