var express  = require('express');
var app = express();

var monk = require('monk');
var db = monk('localhost:27017/assignment1');



//auxillary function for generating the HTML content
function ResHTML(docs) {
	var response_string = "";


	for (var i = 0; i < docs.length; i++) {
		var stock = docs[i];
		response_string += "<div><input type=\"checkbox\" name="+stock['_id']+">";
		response_string += stock['sender'] + " " + stock['title'] + " " + stock['time'];
		response_string += "</input></div>";
	}
	return response_string;
}

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

app.get('/mail',function(res,req){
  var db = req.db;
  var collection = db.get('emailList');

  var box = req.body.mailBox;
  //.../mail?mailBox=Inbox;

	collection.find({'mailbox':box},{},function(e,docs){
    res.send(ResHTML(docs));
  });
})



var server = app.listen(8081, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("Example app listening at http://%s:%s", host, port)
})
