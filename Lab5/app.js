var express  = require('express');
var app = express();

var monk = require('monk');
var db = monk('localhost:27017/lab4');

// allow retrieval of static files and make db accessible to router
app.use(express.static('public'), function(req,res,next){	
    req.db = db;
    next();
})

//router to handle HTTP GET request for "GetEntries"
app.get('/GetEntries', function(req, res){
	var db = req.db;
	var collection = db.get('stockList');
	
	var show = req.query.show;
	var value = req.query.value;
	
	if(show == "all"){
		collection.find({}, {}, function(err, docs){
			if (err === null){
				console.log(JSON.stringify(docs));
				res.json(docs);
			} else res.send(err);
		})
	} else if (show == "category"){
		collection.find({"category":value}, {}, function(err, docs){
			if (err === null){
				res.json(docs);
			} else res.send(err);
		})		
	} else if (show == "stockcode"){
		collection.find({"stockcode":value}, {}, function(err, docs){
			if (err === null){
				res.json(docs);
			} else res.send(err);
		})		
	}
})

//router to handle HTTP POST request for "UpdateState"
app.post('/updateState', express.urlencoded({ extended: true }), function(req, res){
	var db = req.db;
	var collection = db.get('stockList');
	
	var id = req.body.id;
	var newValue = req.body.newValue;
	
	collection.update({"_id":id}, {$set:{'status':newValue}}, function(err, docs){
		if (err === null) {
			res.send(newValue);
		} else res.send(err);
	})
})

//router to handle HTTP POST request for "CreateEntries"
app.post('/CreateEntries', express.urlencoded({ extended: true }), function(req, res){
	
	//to complete	
		
})

var server = app.listen(8081, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("Example app listening at http://%s:%s", host, port)
})