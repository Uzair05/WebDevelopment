var express  = require('express');
var app = express();

var monk = require('monk');
var db = monk('localhost:27017/assignment1');



app.use(express.static('public'));

// allow retrieval of static files and make db accessible to router
app.use(express.static(__dirname + 'public'), function(req,res,next){
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

app.get('/Dummythc',function(req, res){
  var db = req.db;
  var collection = db.get('emailList');


collection.insert({'sender':'amy@cs.hku.hk','recipient':'john@cs.hku.hk','title':'Meeting today','time':'20:32:01 Fri Oct 11 2019', 'content':'Shall we meet at the library at 5pm?','mailbox':'Inbox'})
collection.insert({'sender':'professor@cs.hku.hk','recipient':'u3560@hku.hk','title':'Assignment','time':'16:20:00 Thu Oct 10 2019', 'content':'The new assignment has been released','mailbox':'Inbox'})
collection.insert({'sender':'johnsnow@gmail.com','recipient':'u3560307@hku.hk','title':'My new movie','time':'01:00:00 Mon Oct 7 2019', 'content':'Do you want to watch my new movie with me','mailbox':'Inbox'})

collection.insert({'sender':'jkrowling@fin.hku.hk','recipient':'u3560307@hku.hk','title':'My new Book','time':'15:30:07 Thu Oct 10 2019', 'content':'Do you want to read the new book i wrote?','mailbox':'Important'})
collection.insert({'sender':'donaldtrump@whitehouse.us','recipient':'u3560307@hku.hk','title':'I quit','time':'00:00:07 Tue Oct 5 2019', 'content':'Im quitting this job!','mailbox':'Important'})
collection.insert({'sender':'postmaster@nobel.no','recipient':'u3560307@hku.hk','title':'Congratrulations!!','time':' 00:00:00 Sun Nov 3 2019', 'content':'Congratulations on winning the nobel prize!','mailbox':'Important'})

collection.insert({'sender':'u3560307@hku.hk','recipient':'postmaster@nobel.no','title':'Response','time':'00:00:00 Mon Nov 4 2019', 'content':'Thank you!','mailbox':'Sent'})
collection.insert({'sender':'u3560307@hku.hk','recipient':'donaldtrump@whitehouse.us','title':'Good Luck','time':'00:00:00 Mon Nov 4 2019', 'content':'Good luck at your new job','mailbox':'Sent'})
collection.insert({'sender':'u3560307@hku.hk','recipient':'barackobama','title':'Yo, hello','time':'00:00:00 Mon Nov 4 2019', 'content':'GGEZ','mailbox':'Sent'})

collection.insert({'sender':'bocsoc@hku.hk','recipient':'u3560307@hku.hk','title':'Scam 1','time':'01:00:00 Mon Nov 4 2019', 'content':'Scammed you 1','mailbox':'Trash'})
collection.insert({'sender':'bocsoc@hku.hk','recipient':'u3560307@hku.hk','title':'Scam 2','time':'02:00:00 Mon Nov 4 2019', 'content':'Scammed you 2','mailbox':'Trash'})
collection.insert({'sender':'bocsoc@hku.hk','recipient':'u3560307@hku.hk','title':'Scam 3','time':'03:00:00 Mon Nov 4 2019', 'content':'Scammed you 3','mailbox':'Trash'})

})

app.post('/NewMail', express.urlencoded({ extended: true }), function(req, res){
  var db = req.db;
	var collection = db.get('emailList');

	var title = req.body.title;
  var recipient = req.body.recipient;
  var content = req.body.content;

  /*console.log(recipient);
  console.log(title);
  console.log(content);*/

  var d = new Date();

  var month = ["Jan","Feb","Mar","April","May","Jun","Jul","Aug","Sept","Oct","Nov","Dec"];
  var day = ["Mon","Tues","Wed","Thu","Fri","Sat","Sun"]

  var date = d.getHours() +":"+ d.getMinutes()+":"+d.getSeconds() + " " + day[d.getDay()] + " " + month[d.getMonth()] + " " + d.getDate() + " " + d.getFullYear();
  var sender = 'u3560307@hku.hk';

  collection.insert({'sender':sender,'recipient':recipient,'title':title,'time':date, 'content':content,'mailbox':'Sent'});
})



var server = app.listen(8081, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("Example app listening at http://%s:%s", host, port)
})
