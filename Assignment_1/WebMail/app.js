var express  = require('express');
var app = express();

var monk = require('monk');
var db = monk('localhost:27017/assignment1');



// allow retrieval of static files and make db accessible to router
app.use(express.static('public'), function(req,res,next){
    req.db = db;
    next();
})


app.get('/', function (req, res) {
   res.sendFile( __dirname + "/public/" + "webmail.html" );
})
app.get('/webmail.html', function (req, res) {
   res.sendFile( __dirname + "/public/" + "webmail.html" );
})

app.get('/inbox',function(req, res){
  var db = req.db;
  var collection = db.get('emailList');
  var box = req.query.mailBox;

	collection.find({}, {}, function(err,docs){
    if (err === null){
			res.send(docs);
		}else{
			res.send(err);
		}
  });
})




var server = app.listen(8081, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("Example app listening at http://%s:%s", host, port)
})
