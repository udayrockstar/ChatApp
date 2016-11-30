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

/* Simple Auth */

router.post('/auth', function(req,res,next) {
    var email = req.body.username;
    var password = req.body.password;
    UserData.findOne({email: email,password: password}, function(err, user) {
        if (err) {
            console.log(err);
            return res.status(500).send();
        }
        if (!user) {
            console.log('No result found..!');
            return res.render('login', {fail:'we dont recognize that email address or phone number. Please try again.'});
        }
        return res.render('dashboard');
    })
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
