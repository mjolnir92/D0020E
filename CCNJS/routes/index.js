var express = require('express');
var router = express.Router();
var path = require('path');
var connection = require('../tests/testingSQL');
var controllers = {
    events: require( '../controllers/events.js' )()
};

router.post( '/events', controllers.events.post );



/*
 ==========================
 GET PAGES
 ==========================
 */
router.get('/', function(req, res, next) {
    res.render('users');
});

router.get( '/users', function( req, res ) {
    res.render( 'users' );
});

router.get('/alarms', function(req, res, next){
    res.render('alarms');
});



/*
 ==========================
 PAGE - USERS
 ==========================
 */
/**
 * (comment here)
 */
router.post( '/getSensorData', function( req, res ) {
    var mac = req.body.mac;
    console.log( mac );
    var prefix = '/ltu/' + mac;
    controllers.events.f( prefix, function( data ) {
        res.json( data );
    } );
} );

/**
 * Script for search-bar (explain more here..)
  */
router.post( '/users', function( req, res ) {
    var names = req.body.name.split(/[ ,]+/);
    console.log( names );
    var sql = '';
    var arr = [];

    if ( names.length > 1){

        sql = "SELECT * FROM phones WHERE (firstName LIKE ? OR firstName LIKE ?) " +
            "AND (lastName LIKE ? OR lastName LIKE ?) ";

        arr = [
            names[0] + "%",
            names[1] + "%",
            names[1] + "%",
            names[0] + "%"
        ];

    } else {
        sql = "SELECT * FROM phones WHERE firstName LIKE ?";
        arr = [
            names + "%"
        ];
    }

    if ( sql !== '') {
        sql = connection.format( sql, arr );
        console.log( sql );
        connection.query( sql, function( err, rows ) {
            console.log( err );
            console.log( rows );
            res.render( 'users', { rows: rows } );
        } );
    }
} );

/**
 * (comment here)
 */
router.get( '/sensors*', function( req, res ) {
    console.log( req.query.prefix );
    controllers.events.f( req.query.prefix, function( data ) {
        res.render( 'data', { sensors: data } );
    });
} );



/*
==========================
PAGE - ALARMS
==========================
*/

/**
 * returns json object of all alarms
 */
router.post('/all_alarms', function(req, res){
  var sql = "SELECT phones.firstName, phones.lastName, events.time, events.type, events.eventId " +
      "FROM phones INNER JOIN events ON phones.mac=events.phones_mac";
  connection.query(sql, function(err, rows){
    console.log(err);
    res.json(rows);
  });
});


/**
 * returns json object with sensor data from alarm matching eventId.
 */
router.post('/get_alarm_data', function(req, res){
  var sql = "SELECT * FROM sensors WHERE ?";
  sql = connection.format(sql, req.body.eventId);
  connection.query(sql, function(err, rows){
    console.log(err);
    res.json(rows);
  });
});

module.exports = router;
