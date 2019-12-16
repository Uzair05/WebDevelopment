var express = require('express');
var router = express.Router();
var cors = require('cors');
var cookieParser = require('cookie-parser');
router.use(cookieParser()); /*Implement cookies in the end*/


/*Redirect Empty GET requests (Debugging purposes)*/
router.get('/',cors(),function(req,res){
  res.redirect('/init');
});
/*Handle GET init requests*/
router.get('/init',cors(),function(req,res){
  var db = req.db;
  var collection = db.get("userList");

  if(req.cookies.userID !== undefined){
    var userID = req.cookies.userID;
    collection.find({'username': userID},{},function(err, docs){
      if (err === null){
        //var resp = [{"username":docs[0].username, "_id":docs[0]._id}];
        var resp = [];
        var friends = docs[0].friends;
          for(var i=0;i<friends.length;i++){
            collection.find({'username': friends[i]},{},function(err2, doc2){
              if (err2 === null){
                resp.push({"username":doc2[0].username, "_id":doc2[0]._id});
                if (resp.length == friends.length){
                  var data = {"username":userID, "friends":resp};
                  res.json(data);
                }
              }else{
                res.send({msg:err2});
              }
            });
          }
      }else{
          res.send({msg: err});
        }
    });
  }else{
    res.send("");
  }
});
/*Handle POST login requests*/
router.post('/login',cors(),function(req,res){
  var username = req.body.username;
  var password = req.body.password;
  var db = req.db;
  var collection = db.get("userList");

  collection.find({"username":username},{},function(err,docs){
    if (err === null){
      if (docs[0].password === password){
        res.cookie("userID",docs[0].username,{ maxAge: 3600000});
        var friends = docs[0].friends;
        var resp = [];
        for(var i=0;i<friends.length;i++){
          collection.find({"username":friends[i]},{},function(err2,doc2){
            if (err2 === null){
              resp.push({"username":doc2[0].username, "_id":doc[2]._id});
              if (resp.length == friends.length){
                var data = {"username":username, "friends":resp};
                res.json(data);
              }
            }else{
              res.send({msg: err2});
            }
          });
        }

      }else{
        res.send("Login Failure");
      }
    }else{
      res.send({msg: err});
    }
  });
});
/*Handle GET logout requests*/
router.get('/logout',cors(),function(req,res){
  res.clearCookie(req.cookies.userID);
  res.json("");
});
/*Handle GET getalbum requests*/
router.get('/getalbum/:userid',cors(),function(req,res){
  var db = req.db;
  var collection2 = db.get("userList");
  var collection = db.get("photoList");

  var userID = req.param.userid;


  if (userID == '0'){
    var userID = req.cookies.userID;
    collection2.find({"username":userID},{},function(err,docs){
      if (err ==== null){
        var currentUserID = docs[0]._id;
        collection.find({"userid":currentUserID},{},function(err2,doc2){
          if (err2 === null){
            var resp = [];
            for(var i=0;i<doc2.length;i++){
              resp.push({"_id":doc2[i]._id, "url":docs2[i].url, "likedby":docs2[i].likedby});
              if (resp.length == doc2.length){
                res.json(resp);
              }
            }
          }else{
            res.send({msg:err2});
          }
        });
      }else{
        res.send({msg:err})
      }
    });
  }else{
    ollection.find({"userid":userID},{},function(err2,doc2){
      if (err2 === null){
        var resp = [];
        for(var i=0;i<doc2.length;i++){
          resp.push({"_id":doc2[i]._id, "url":docs2[i].url, "likedby":docs2[i].likedby});
          if (resp.length == doc2.length){
            res.json(resp);
          }
        }
      }else{
        res.send({msg:err2});
      }
    });
  }

});


/*
POST to upload photos
DELETE to delete photos
PUT to update likes
*/



router.options("/*", cors());
module.exports = router;
