var express = require('express');
var router = express.Router();
var cors = require('cors');


/*
* GET contactList.
*/
router.get('/contactList', cors(), function(req, res) {
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


/*
 * POST to addContact.
 */
router.post('/addContact', cors(), function(req, res) {
    var db = req.db;
    var collection = db.get('contactList');
    collection.insert(req.body, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
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
