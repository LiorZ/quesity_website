var express = require('express');
var http = require("http");
var _ = require('underscore')
var engine = require('jade');
var MemoryStore = express.session.MemoryStore;
var app = express();
var fs = require('fs');
var supported_langs = { eng:1 , heb:1 };
var lang_params = {};

var port = process.env.PORT || 3000;

function readJsonFileSync(filepath, encoding){

    if (typeof (encoding) == 'undefined'){
        encoding = 'utf8';
    }
    var file = fs.readFileSync(filepath, encoding);
    return JSON.parse(file);
}

var load_lang_vars = function() {
	_.chain(supported_langs).keys().each(function(l) {
		lang_params[l] = readJsonFileSync('views/'+l+'/vars.json');
	}).value();
};

app.use(express.cookieParser());
app.use(express.session({
    store: new MemoryStore(),
    secret: 'Lior&Tomer',
}));
app.use(express.static(__dirname + '/public'));
app.use(express.bodyParser());
app.use(require('express-blocks'));

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
load_lang_vars();
var lang_detection = function(req,res,next) {
	if ( req.session.lang ) {
		next();
		return;
	}
	var lang = req.headers["accept-language"];
	if ( _.isUndefined(lang) || _.isNull(lang) ) {
		req.session.lang = "eng";
	}else {
		if ( lang.match(/he/g) ) {
			req.session.lang = "heb";
		}else {
			req.session.lang="eng";
		}
	}

	next();
};
app.use(lang_detection);

app.use(function(req,res,next) {
	var lang = req.param('lang')
	if ( lang && supported_langs[lang] ) {
		req.session.lang = req.param('lang');
		console.log("Using " +req.session.lang);
	}
	next();
});

app.use(function(req,res,next){
	  console.log("USING LANG PARAMS " + JSON.stringify(lang_params[req.session.lang]));
	  res.locals.lang_params = lang_params[req.session.lang];
	  next();
});


app.get('/', function (req, res) {
    res.render(req.session.lang+'/index');
});

app.get('/what-is-it' , function(req,res) {
	res.render(req.session.lang+'/what_is_it');
});
app.get('/quests' ,function(req,res) {
	res.render(req.session.lang+'/quests.jade');
});

app.get('/about',function(req,res) {
	res.render(req.session.lang+'/about.jade');
});

app.get('*',function(req,res) {
	res.redirect('/');
})
app.listen(port);
console.log('Listening on port 3000');
