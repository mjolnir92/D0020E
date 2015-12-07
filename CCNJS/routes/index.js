var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/client', function(req, res, next){
  res.render('client', {value: 400});
});

router.get('/logs/relay', function(req, res, next){
  res.sendfile('./public/logs/relay.log')
});

router.get('/logs/ctrl', function(req, res, next){
  res.sendfile('./public/logs/relay.log')
});

router.get('/logs/content', function(req, res, next){
  res.sendfile('./public/logs/relay.log')
});

module.exports = router;
