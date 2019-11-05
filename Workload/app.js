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

	collection.find({'mailbox':box}, {}, function(err,docs){
    if (err === null){
			res.send(docs);
		}else{
			res.send(err);
		}
  });
})
app.get('/Update',function(req,res){
  var db = req.db;
  var collection = db.get('emailList');
  var id = req.query.id;
  var box = req.query.mailBox;

  collection.update({"_id":id}, {$set:{'mailbox':box}}, function(err, docs){
		if (err === null) {
			res.send("OK");
		} else res.send(err);
	})

})
app.get('/Email',function(req, res){
  var db = req.db;
  var collection = db.get('emailList');
  var id = req.query.id;

	collection.find({'_id':id}, {}, function(err,docs){
    if (err === null){
			res.send(docs);
		}else{
			res.send(err);
		}
  });
})

app.post('/NewMail', express.urlencoded({ extended: true }), function(req, res){
  var db = req.db;
	var collection = db.get('emailList');

	var title = req.query.title;
  var recipient = req.query.recipient;
  var content = req.query.content;

  var d = new Date();
  var date = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();

  var sender = 'u3560307@hku.hk';

  collection.insert({'sender':sender,'recipient':recipient,'title':title,'time':date, 'content':content,'mailbox':'Sent'});
})



var server = app.listen(8081, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("Example app listening at http://%s:%s", host, port)
})
