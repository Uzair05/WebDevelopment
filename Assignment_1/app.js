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
app.get('/retrieveemaillist',function(req, res){
  var db = req.db;
  var collection = db.get('emailList');
  var box = req.query.mailBox;


//Added some changes
	collection.find({'mailbox':box}, {}, function(err,docs){
    if (err === null){
			res.send(Sort(docs));
		}else{
			res.send(err);
		}
  });
})
app.get('/getemail',function(req, res){
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
app.post('/sendemail', express.urlencoded({ extended: true }), function(req, res){
  var db = req.db;
	var collection = db.get('emailList');

	var title = req.body.title;
  var recipient = req.body.recipient;
  var content = req.body.content;


  var d = new Date();

  var month = ["Jan","Feb","Mar","April","May","Jun","Jul","Aug","Sept","Oct","Nov","Dec"];
  var day = ["Mon","Tues","Wed","Thu","Fri","Sat","Sun"]

  var date = d.getHours() +":"+ d.getMinutes()+":"+d.getSeconds() + " " + day[d.getDay()] + " " + month[d.getMonth()] + " " + d.getDate() + " " + d.getFullYear();
  var sender = 'u3560307@hku.hk';

  collection.insert({'sender':sender,'recipient':recipient,'title':title,'time':date, 'content':content,'mailbox':'Sent'});
})
app.post('/changemailbox', express.urlencoded({ extended: true }), function(req, res){
  var db = req.db;
  var collection = db.get('emailList');
  var id = req.body.id;
  var box = req.body.mailBox;

  collection.update({"_id":id}, {$set:{'mailbox':box}}, function(err, docs){
		if (err === null) {
			res.send("OK");
		} else res.send(err);
	})
})



function SortYear(docs){
  for(var i=0;i<docs.length;++i){
    for(var m=0;m<(docs.length-1);++m){

      var beep = parseInt(docs[m]['time'].split(" ")[4]);
      var boop = parseInt(docs[m+1]['time'].split(" ")[4]);

      if (beep < boop){
        var b = docs[m];
        docs[m]=docs[m+1];
        docs[m+1]=b;
      }
    }
  }
  return docs;
}
function SortMonth(docs){
  var month = ["Jan","Feb","Mar","April","May","Jun","Jul","Aug","Sept","Oct","Nov","Dec"];
  for(var i=0;i<docs.length;++i){
    for(var m=0;m<(docs.length-1);++m){

      var beep = month.indexOf(docs[m]['time'].split(" ")[2]);
      var boop = month.indexOf(docs[m+1]['time'].split(" ")[2]);

      //console.log(beep + ", " + boop);

      if (beep < boop){
        var b = docs[m];
        docs[m]=docs[m+1];
        docs[m+1]=b;
      }
    }
  }
  return SortYear(docs);
}
function SortDay(docs){
  for(var i=0;i<docs.length;++i){
    for(var m=0;m<(docs.length-1);++m){
      var beep = parseInt(docs[m]['time'].split(" ")[3]);
      var boop = parseInt(docs[m+1]['time'].split(" ")[3]);

      if (beep < boop){
        var b = docs[m];
        docs[m]=docs[m+1];
        docs[m+1]=b;
      }
    }
  }
  return SortMonth(docs);
}
function Sort(docs){
  for(var i=0;i<docs.length;++i){
    for(var m=0;m<(docs.length-1);++m){

      var beep = docs[m]['time'].split(" ")[0];
      var boop = docs[m+1]['time'].split(" ")[0];

      if (beep < boop){
        var b = docs[m];
        docs[m]=docs[m+1];
        docs[m+1]=b;
      }
    }
  }
  return SortDay(docs);
}



var server = app.listen(8081, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("Example app listening at http://%s:%s", host, port)
})
