var express = require('express');
var http = require("http");
var _ = require('underscore')
var engine = require('jade');
var fs = require('fs');
var mongoose = require('mongoose')
var nodemailer = require('nodemailer');
var nconf = require('nconf');
var models = require('./models')(mongoose);
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'quesitywebsite@gmail.com',
        pass: 'QuesityGugi'
    }
});


var MemoryStore = express.session.MemoryStore;
var app = express();
var supported_langs = { eng:1 , heb:1 };
var lang_params = {};

nconf.argv().env();

nconf.defaults({
	mode:'development'
});
var options = {
		production:{
			db_address: 'mongodb://googi:QuesityForever@linus.mongohq.com:10058/app21939361',
			port:process.env.PORT,
		},
		development: {
			db_address:'mongodb://localhost/quesity_website',
			port:3000,
		}		
};

var configuration = options[nconf.get('mode')];

console.log("Connecting through " + nconf.get('mode') + " mode");

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


app.configure(function() {
	app.use(express.cookieParser());
	app.use(express.session({
	    store: new MemoryStore(),
	    secret: 'Lior&Tomer',
	}));
	app.use(express.bodyParser());
	app.set('views', __dirname + '/ejs_views');
	app.set('view engine', 'ejs');
	app.set("view options", {layout: false});
	app.use(express.static(__dirname + '/public'));
	app.engine('html', require('ejs').renderFile);
	mongoose.connect(configuration.db_address);	
});
require('./admin')(app,models);


app.get('/', function (req, res) {
    res.render('index-default-eng.html');
});
app.get('/he', function (req, res) {
	models.NewsArticle.find({},function(err,doc) {
		res.render('index-default-heb',{articles: doc});
	}).sort({date_created:-1}).limit(10);
    
});


app.post('/contactus' , function(req,res,next) {
	var email = req.body.email;
	var name = req.body.name;
	var message = req.body.message;
	if ( message == undefined || name == undefined || email == undefined ) {
		res.send(401);
	}
	transporter.sendMail({
	    to: 'general@quesity.com',
	    subject: 'Message from Quesity Website',
	    text: "Message from " + name + " ( email: " +email +")" + "\n" + message
	});
	res.send(200);
})
app.listen(configuration.port);
console.log('Listening on port ' + configuration.port);
