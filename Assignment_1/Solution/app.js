var express  = require('express');
var app = express();

var monk = require('monk');
var db = monk('localhost:27017/assignment1');

// allow retrieval of static files and make db accessible to router
app.use(express.static('public'), function(req,res,next){	
  req.db = db;
  next();
});

var server = app.listen(8081, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("Example app listening at http://%s:%s", host, port)
});

const weekday=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const month = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const global_limit = 3;

// create the time string
function CreateTimeStr(){
  var timeString = "";
  var currentDate = new Date();
  var hours = String(currentDate.getHours());
  var minutes = String(currentDate.getMinutes());
  var seconds = String(currentDate.getSeconds());

  if(hours.length < 2){
      hours = "0" + hours;
  }
  if(minutes.length < 2){
      minutes = "0" + minutes;
  }
  if(seconds.length < 2){
      seconds = "0" + seconds;
  }
  var timeString = hours+":"+minutes+":"+seconds+" "+weekday[currentDate.getDay()]+
                      " "+month[currentDate.getMonth()]+" "+currentDate.getDate()+
                      " "+currentDate.getFullYear();
  return timeString;
}

// compare two time strings
function TimeCompare(a, b){
  a_list = a.split(" ");
  b_list = b.split(" ");
  if(a_list[4] != b_list[4]){
      if(a_list[4] > b_list[4]){
          return 1;
      } else return -1;
  } else if(a_list[2] != b_list[2]){
      a_month = month.indexOf(a_list[2]);
      b_month = month.indexOf(b_list[2]);
      if(a_month > b_month){
          return 1;
      } else return -1;
  } else if(a_list[3] != b_list[3]){
      if(parseInt(a_list[3]) > parseInt(b_list[3])){
          return 1;
      } else return -1;
  } else if(a_list[0] != b_list[0]){
      if(a_list[0] > b_list[0]){
          return 1;
      } else return -1;
  } else return 0;
} 

function ResHTML(docs) {
  var res_str = "";
  for (var i = 0; i < docs.length; i++) {
    var row = docs[i];
    res_str += "<div class=\"email\" id=" + row['_id']  + "_m>";
    res_str += "<input class=\"check\" type=\"checkbox\" id=\"" + row['_id'] + "\">";
    res_str += "<div class=\"date\" onclick=showEmailContent(\"" + 
                row['_id'] + "\")>" + row['time'] + "</div>";
    res_str += "<div class=\"title\" onclick=showEmailContent(\"" + 
                row['_id'] + "\")>(" + row['title'] + ")</div>";
    if (row['sender'] != undefined) {
      res_str += "<div class=\"sender\" onclick=showEmailContent(\"" + 
                  row['_id'] + "\")>" + row['sender'] + "</div>";
    }
    if (row['recipient'] != undefined) {
      res_str += "<div class=\"sender\" onclick=showEmailContent(\"" + 
                  row['_id'] + "\")>" + row['recipient'] + "</div>";
    }
    res_str += "<br> <br> </div>";
  }
  return res_str;
}

app.get('/retrieveemaillist', function(req, res, next) {
  var currentPage = req.query.currentPage;
  var mailbox = req.query.mailbox;
  var return_role = "sender";
  if (mailbox == "Sent") {
    return_role = "recipient";
  }
  var db = req.db;
  var collection = db.get('emailList');
  var limit = global_limit;
  var offset = currentPage*limit;
  var filter = {"mailbox":mailbox};
  var options = {
    "projection":{
      "_id": 1,
      "title": 1,
      "time": 1
    }
  }
  options["projection"][return_role] = 1;

  collection.find(filter, options, function(err, docs){
    if (err === null) {
  	  docs.sort(function(a, b) {
        return TimeCompare(b.time, a.time);
      })
      var return_docs = docs.slice(offset, offset + limit);
	  
      res.send(ResHTML(return_docs));
    } else res.send({msg:err});
  });  
});


app.get('/getemail', function(req, res, next) {
  var id = req.query.emailID;
  var increment = req.query.increment;
  var mailbox = req.query.mailbox;
  
  var db = req.db;
  var collection = db.get('emailList');
  
  if (increment == "1" || increment == "-1") {
    var filter = {"mailbox":mailbox};
    collection.find(filter, {}, function(err, docs) {
      if (err === null) {
        docs.sort(function(a, b) {
          return TimeCompare(b.time, a.time);
        })
        var index = -1;
        for (var i = 0; i < docs.length; i++) {
          
          if(docs[i]._id == id) {
            index = i;
          }
        }
        if (index == -1) {
          res.send("err:id not found!");
        } else {
          var new_content_index = index + parseInt(increment);
          
          if (new_content_index < 0 || new_content_index >= docs.length){
            res.send("err:Bound");
          } else {
            var row = docs[new_content_index];
            var res_str = "";
            res_str += "<div class=\"email\" id=" + row['_id'] + "> <span>";
            res_str += "<p class=\"content-title\">" + row['title'] + "</p>";
            res_str += "<p class=\"content-time\">" + row['time'] + "</p> </span> <br>";
            res_str += "<p class=\"content-sender\">Sender: " + row["sender"]+"</p><br><br>";
            res_str += "<p class=\"content-receiver\">Receiver: " + row["recipient"]+"</p><br><br>";
            res_str += "<p class=\"content-content\">" + row['content'] + "</p> </div>";
            res.send(res_str);
          }
        }
      } else res.send("err:"+err);
    });
  } else {
    collection.find({"_id":id}, {}, function(err, docs){
      if (err === null) {
        var row = docs[0];
        var res_str = "";
        res_str += "<div class=\"email\" id=" + row['_id'] + "> <span>";
        res_str += "<p class=\"content-title\">" + row['title'] + "</p>";
        res_str += "<p class=\"content-time\">" + row['time'] + "</p> </span> <br>";
        res_str += "<p class=\"content-sender\">Sender: " + row["sender"]+"</p><br><br>";
        res_str += "<p class=\"content-receiver\">Receiver: " + row["recipient"]+"</p><br><br>";
        res_str += "<span><p class=\"content-content\">" + row['content'] + "</p> </span></div>";
        res.send(res_str);
      } else res.send({msg:err});
    });
  }
});


app.post('/changemailbox', express.urlencoded({ extended: true }), function(req, res, next) {
  var querystring = req.body.labelcheck;
  var srcmailbox = req.body.srcmailbox;
  var dstmailbox = req.body.dstmailbox;
  var currentPage = req.body.currentPage;
  var showContent = req.body.showContent;
  var ids = querystring.split(",");
  var return_role = "sender";
  if (srcmailbox == "Sent") {
    return_role = "recipient";
  }

  var db = req.db;
  var collection = db.get('emailList');
  collection.update({"_id":{$in: ids} }, {$set:{'mailbox':dstmailbox}},{multi:true}, function(err, docs){
    if (err === null) {      
      var filter = {"mailbox":srcmailbox};
      var options = {
        "projection":{
          "_id": 1,
          "title": 1,
          "time": 1
        }
      }
      options["projection"][return_role] = 1;

      collection.find(filter, options, function(err, docs){
        if (err === null) {
          docs.sort(function(a, b) {
            return TimeCompare(b.time, a.time);
          })
		  
	      var offset = currentPage*global_limit + global_limit - ids.length;
	      var limit = ids.length;
	      if (showContent == "1") {
	        limit = global_limit;
	        offset = 0;
	      }
          docs = docs.slice(offset, offset + limit);
          res.send(ResHTML(docs));
        } else res.send({msg:err});
      });
    } else res.send({msg:err});
  });
});


app.post('/sendemail', express.urlencoded({ extended: true }), function(req, res, next) {
  var mailbox = req.body.mailbox;
  var sender = req.body.sender;
  var recipient = req.body.recipient;
  var title = req.body.title;
  var content = req.body.content;
  var return_role = "sender";
  if (mailbox == "Sent") {
    return_role = "recipient";
  }
  var time = CreateTimeStr();
  var email = {
    "sender": sender,
    "recipient": recipient,
    "title": title,
    "content": content,
    "time": time,
    "mailbox": "Sent"
  }
  
  var db = req.db;
  var collection = db.get('emailList');
  collection.insert(email, function(err, docs) {
    if (err === null) {
      var filter = {"mailbox":mailbox};    
      var options = {
        "projection":{
          "_id": 1,
          "title": 1,
          "time": 1
        }
      }
      options["projection"][return_role] = 1;

      collection.find(filter, options, function(err, docs){
        if (err === null) {
          docs.sort(function(a, b) {
            return TimeCompare(b.time, a.time);
          })
		  
	      var limit = global_limit;
	      var offset = 0;	      
          docs = docs.slice(offset, offset + limit);
          res.send(ResHTML(docs));
        } else res.send({msg:err});
      });
    } else res.send(err);
  });
});

