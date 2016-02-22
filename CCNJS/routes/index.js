var express = require('express');
var router = express.Router();
var path = require('path');

var mysql      = require('mysql');
var connection = mysql.createConnection({
    host     : '130.240.5.59',
    user     : 'CCNusr',
    password : 'd0020eccnusr',
    database : 'my_db'
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('real-time');
});

router.get('/client', function(req, res, next){
  res.render('client', { value: 400 });
});

router.get('/storedData', function(req, res, next){
  res.render('storedData');
});

router.get('/logs/relay', function(req, res, next){
  console.log(__dirname);
  res.sendFile(path.resolve(path.join(__dirname,'../public/logs/relay.log')));
});

router.get('/real-time', function(req, res, next){
  res.render('real-time');
});

router.get('/alarms', function(req, res, next){
  res.render('alarms');
});

router.get('/logs/ctrl', function(req, res, next){
  res.sendFile(path.resolve(path.join(__dirname,'../public/logs/ctrl.log')));
});

router.get('/logs/content', function(req, res, next){
  res.sendFile(path.resolve(path.join(__dirname,'../public/logs/content.log')));
});

router.get('/d3', function( req, res ) {
    res.render( 'd3test' );
} );

module.exports = router;
