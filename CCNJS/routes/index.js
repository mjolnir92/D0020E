var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/client', function(req, res, next){
  res.render('client', {value: 400});
});

module.exports = router;
