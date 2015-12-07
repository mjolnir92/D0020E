var express = require('express');
var router = express.Router();
var path = require('path');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/client', function(req, res, next){
  res.render('client', { value: 400 });
});

router.get('/logs/relay', function(req, res, next){
  console.log(__dirname);
  res.sendFile(path.resolve(path.join(__dirname,'../public/logs/relay.log')));
});

router.get('/logs/ctrl', function(req, res, next){
  res.sendFile(path.resolve(path.join(__dirname,'../public/logs/ctrl.log')));
});

router.get('/logs/content', function(req, res, next){
  res.sendFile(path.resolve(path.join(__dirname,'../public/logs/content.log')));
});

module.exports = router;
