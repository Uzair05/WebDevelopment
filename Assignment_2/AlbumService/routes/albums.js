var express = require('express');
var router = express.Router();
var cookieParser = require('cookie-parser');
const cors = require('cors');
var corsOption = {
  origin: 'http://localhost:3002'
}

router.use(cookieParser());
router.use(cors(corsOption)

function findFriends(docs){
  var resp = [];
    //extract username and _id of friends amd me
    //Array of objects name:+++, _id:+++
  return resp;
}

/**/
router.get('/init', cors(), function(req, res) {
  if (req.cookies.userID) {
    //res.send("<p>"++" has logged in</p><p>Click to <a href='/logout'>log out</a></p>");
    var userName = req.cookies.userID;
    var db = req.db;
    var collection = db.get('userList');


    collection.find({'username':userName},{},function(err,docs){
      if (err === null){
        res.json(findFriends(docs));
      }
      else{
        res.send({msg: err});
      }
    });
  } else {
    res.send("");
  }

});


/*
* Logout; Clear Cookies
*/
router.get('/logout', cors(), function(req, res) {
  res.clearCookie('userID');
  res.send("");
});


/*
 * Login; set Cookies
 */
router.post('/login', cors(), function(req, res) {
    var db = req.db;
    var collection = db.get('userList');

    var userName = req.body.username;
    var password = req.body.password;

    collection.find({'username':userName},{},function(err,docs){
      if ((docs.length() == 0 || docs.password != password) && (err === null)){
        res.send({'message':"Login failure"});
      }else if (err != null){
        res.send({msg: err});
      }else{

      }
    });
});





/*
* PUT to updateContact
*/
router.put('/updateContact/:id', cors(), function (req, res) {
    var db = req.db;
    var collection = db.get('contactList');
    var contactToUpdate = req.params.id;
    var filter = { "_id": contactToUpdate};
    collection.update(filter, { $set: {"name": req.body.name, "tel": req.body.tel, "email": req.body.email}}, function (err, result) {
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    })
});



/*
 * DELETE to deleteContact.
 */
router.delete('/deleteContact/:id', cors(), function(req, res) {
    var db = req.db;
    var contactID = req.params.id;
    var collection = db.get('contactList');
    collection.remove({'_id':contactID}, function(err, result){
    	res.send((err === null)?{msg:''}:{msg:err});
    });
});

/*
 * Handle preflighted request
 */
router.options("/*", cors());

module.exports = router;
