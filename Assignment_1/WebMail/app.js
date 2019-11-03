var express  = require('express');
var app = express();


var monk = require('monk');
var db = monk('localhost:27017/assignment1');

// Make db accessible to router
app.use(function(req,res,next){
    req.db = db;
    next();

})

/*
var db = req.db;
var collection = db.get('emailList');
*/

app.get('/webmail.html', function (req, res) {
   res.sendFile( __dirname + "/public/" + "webmail.html" );
})
app.get('/', function (req, res) {
   res.sendFile( __dirname + "/public/" + "webmail.html" );
})

app.get('/mail',function(res,req){
  var db = req.db;
  var collection = db.get('emailList');
  //.../mail?mailBox=Inbox;
  collection.find({mailbox:req.body.mailBox},{},function(e,docs){
    res.send(JSON.stringify(docs));
  });
})


var server = app.listen(8081, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("Example app listening at http://%s:%s", host, port)
})
