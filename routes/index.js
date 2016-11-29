var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/chatApp');
var Schema = mongoose.Schema;

var userDataSchema = new Schema({
    email: String,
    password: String,
    createdAt: String,
});
// }, {collection: 'user-data'});

var UserData = mongoose.model('RegistrationData', userDataSchema);


/* GET login page */
router.get('/login', function(req,res,next) {
    res.render('login');
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express', name: 'Uday Hosamani' });
});


router.get('/get-data', function(req,res,next){
    UserData.find()
        .then(function(doc){
            res.render('index',{items: doc});
        })
});

router.post('/insert', function(req,res,next){
    console.log("Here its coming...!");
    var datetime = new Date();
    var item = {
        email:       req.body.email,
        password:   req.body.password,
        createdAt:  datetime,
    };
    var data = new UserData(item);
    data.save();
    res.redirect('/get-data');
});

module.exports = router;
