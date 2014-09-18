var express = require('express');
var http = require("http");
var _ = require('underscore')
var engine = require('jade');
var captcha = require('captcha');


var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'quesitywebsite@gmail.com',
        pass: 'QuesityGugi'
    }
});


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
app.configure(function() {
	app.use(express.cookieParser());
	app.use(express.session({
	    store: new MemoryStore(),
	    secret: 'Lior&Tomer',
	}));
	app.set('views', __dirname + '/public');
	app.set("view options", {layout: false});
	app.use(express.static(__dirname + '/public'));
	app.engine('html', require('ejs').renderFile);
	app.use(express.bodyParser());
	app.use(captcha({ url: '/captcha.jpg', color:'#ffffff', background: 'rgba(20,30,200,0)' }));
});


app.get('/', function (req, res) {
    res.render('index-default-eng.html');
});
app.get('/he', function (req, res) {
    res.render('index-default-heb.html');
});

app.get('*',function(req,res) {
	res.redirect('/');
})

app.post('/contactus' , function(req,res,next) {
	console.log(req.body.captcha);
	console.log(req.session.captcha);
	var email = req.body.email;
	var name = req.body.name;
	var message = req.body.message;
	if ( req.session.captcha != req.body.captcha ) {
		res.send(401);
		return;
	}
	
	transporter.sendMail({
	    to: 'general@quesity.com',
	    subject: 'Message from Quesity Website',
	    text: "Message from " + name + " ( email: " +email +")" + "\n" + message
	});
	res.send(200);
})
app.listen(port);
console.log('Listening on port 3000');
