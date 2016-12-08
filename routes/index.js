var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var app = express();
// call socket.io to the app


mongoose.connect('mongodb://localhost:27017/chatApp');
var Schema = mongoose.Schema;

var userDataSchema = new Schema({
    name: String,
    email: String,
    password: String,
    createdAt: String,
});
// }, {collection: 'user-data'});

var UserData = mongoose.model('RegistrationData', userDataSchema);


express.io = require('socket.io')();

/* GET login page */
router.get('/login', function(req, res, next) {
    res.render('login');
});

/* Simple Auth */

router.post('/auth', function(req, res, next) {
    var email = req.body.username;
    var password = req.body.password;
    UserData.findOne({
        email: email,
        password: password
    }, function(err, user) {
        if (err) {
            return res.status(500).send();
        }
        if (!user) {
            return res.render('login', {
                fail: 'we dont recognize that email address or password. Please try again.'
            });
        }
        var listUsers = UserData.find({}, function(err, users) {
            // console.log("Is Coming here???"+user._id);
            return res.render('dashboard', {
                count: req.session.views,
                users: users,
                name: user.name
            });
        });
        if (!req.session.views) req.session.views = 1;
        req.session.views += 1;

    })
});

// start listen with socket.io
express.io.on('connection', function(socket) {
    console.log('a user connected');
    socket.on('new message', function(msg) {
        console.log('new message: ' + msg);
        express.io.emit('chat message', msg);
    });
});


/* logout function */
router.get('/logout', function(req, res, next) {
    req.session.destroy();
    res.render('login');
});


/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {
        title: 'Chat App'
    });
});

/* get all data and show */
router.get('/get-data', function(req, res, next) {
    UserData.find()
        .then(function(doc) {
            res.render('index', {
                items: doc
            });
        });
});

/* Insert the data into mongo db */
router.post('/insert', function(req, res, next) {
    var datetime = new Date();
    var item = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        createdAt: datetime,
    };
    var data = new UserData(item);
    data.save();
    res.redirect('/get-data');
});

module.exports = router;
