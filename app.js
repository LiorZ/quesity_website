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
});


app.get('/', function (req, res) {
    res.render('index-default-heb.html');
});

app.get('*',function(req,res) {
	res.redirect('/');
})
app.listen(port);
console.log('Listening on port 3000');
