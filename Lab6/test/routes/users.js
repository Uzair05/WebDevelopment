var express = require('express');
var router = express.Router();
/*
* GET contactList.
*/
router.get('/contactList', function(req, res) {
  var db = req.db;
  var collection = db.get('contactList');
  collection.find({},{},function(err,docs){
    if (err === null){
      res.json(docs);
    }
    else{
      res.send({msg: err});
    }
  });
});

/* * POST to addContact. */
router.post('/addContact', function(req, res) {
  var db = req.db;
  var collection = db.get('contactList');
  collection.insert(req.body, function(err, result){
    res.send( (err === null) ? { msg: '' } : { msg: err } );
  });
});


/*
* PUT to updateContact
*/
router.put('/updateContact/:id', function (req, res) {
  var db = req.db;
  var collection = db.get('contactList');
  var contactToUpdate = req.params.id;

  var filter = {"_id":contactToUpdate};
  collection.update(filter,{$set:{"tel":req.body.tel,"email":req.body.email}}, function(err, result){
    res.send( (err === null) ? { msg: '' } : { msg: err } );
  });
});


/*
* DELETE to delete a contact.
*/
router.delete('/deleteContact/:id', function(req, res) {
  var db = req.db;
  var collection = db.get('contactList');
  var contactToDelete = req.params.id;

  var filter = {"_id":contactToDelete};

  collection.remove(filter, function(err){
    res.send( (err === null) ? { msg: '' } : { msg:"error" + err } );
  });
});







module.exports = router;
