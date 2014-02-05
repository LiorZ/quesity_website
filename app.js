var express = require('express');
var http = require("http");
var engine = require('jade');
var app = express();

var port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/public'));
app.use(express.bodyParser());
app.use(require('express-blocks'));

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.get('/', function (req, res) {
    res.render('heb/index');
});

app.get('/what-is-it' , function(req,res) {
	res.render('heb/what_is_it');
});
app.get('/quests' ,function(req,res) {
	res.render('heb/quests.jade');
});

app.get('/about',function(req,res) {
	res.render('heb/about.jade');
});

app.get('*',function(req,res) {
	res.redirect('/');
})
app.listen(port);
console.log('Listening on port 3000');
