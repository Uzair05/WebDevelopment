var express = require('express');
var app = express();
var monk = require('monk');
var db = monk('localhost:27017/test');
// allow retrieval of static files and make db accessible to router


app.use(express.static('public'), function(req,res,next){
  req.db = db;
  next();
})

app.get('/GetEntries', function(req, res){
  var db = req.db;
  var collection = db.get('stockList');
  var show = req.query.show;
  var value = req.query.value;
  if (show == "all"){
    collection.find({}, {}, function(err, docs){
    if (err === null){
      res.send(ResHTML(docs));
    }
    else{
      res.send(err);
    }
    });
  }else if (show == "category"){
    collection.find({}, {'category':value}, function(err, docs){
      if (err === null){
        res.send(ResHTML(docs));
      }
      else{
        res.send(err);
      }
    });
  } else if (show == "stockcode"){
    collection.find({}, {'stockcode':value}, function(err, docs){
      if (err === null){
        res.send(ResHTML(docs));
      }
      else{
        res.send(err);
      }
    });
  }
});

function ResHTML(docs) {
  var response_string = "";
  for (var i = 0; i < docs.length; i++) {
    var stock = docs[i];
    response_string += "<div id="+stock['_id']+">";
    response_string += "<span onclick=\"changeState(this)\">" + stock['status']
    + "</span><h3>" + stock['stockname'];
    response_string += " (" + stock['category'] + ")</h3><h5>(" +
    stock['stockcode'] + ") on " + stock['date'] + "</h5>";
    response_string += "</div>";
  }
  return response_string;
}


var server = app.listen(8081, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("Example app listening at http://%s:%s", host, port)
})
