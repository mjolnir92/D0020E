var express = require('express');
var router = express.Router();
var path = require('path');
var connection = require('../tests/testingSQL');
var controllers = {
    events: require( '../controllers/events.js' )()
};

router.post( '/events', controllers.events.post )
      .get( '/events', controllers.events.post );

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

//-----SQL------
router.post('/search_alarms', function(req, res){
  var sql = "SELECT mac FROM phones WHERE ?";
  sql = connection.format(sql, req.body);
  connection.query(sql , function(err, rows){
    var c = {phones_mac: rows[0]["mac"]};
    var sql2 = "SELECT * FROM events WHERE ?";
    sql2 = connection.format(sql2, c);
    connection.query(sql2 , function(err, rows){
      res.json(rows);
    });
  })

});

router.post('/all_alarms', function(req, res){
  var sql = "SELECT phones.firstName, phones.lastName, events.time, events.type " +
      "FROM phones INNER JOIN events ON phones.mac=events.phones_mac";
  connection.query(sql, function(err, rows){
    console.log(err);
    res.json(rows);
  });
});

router.post('/search_workers_two_names', function(req, res){
  var sql = "SELECT * FROM phones WHERE firstName LIKE ? OR firstName LIKE ? " +
      "OR lastName LIKE ? OR lastName LIKE ?";
  var arr = [req.body.firstName+"%", "% "+req.body.firstName+"%", req.body.lastName+"%", "% "+req.body.lastName+"%"];
  sql = connection.format(sql, arr);
  connection.query(sql, function(err, rows){
    console.log(err);
    res.json(rows);
  });
});

router.post('/search_workers_one_name', function(req, res){
  var sql = "SELECT * FROM phones WHERE firstName LIKE ? OR lastName LIKE ?";
  var arr = [req.body.Name+"%",req.body.Name+"%"];
  sql = connection.format(sql, arr);
  connection.query(sql, function(err, rows){
    console.log(err);
    res.json(rows);
  });
});

module.exports = router;
