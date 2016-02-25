var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});




router.post( '/events', function( req, res ) {
    console.log( req.body );
    console.log( "host:" + req.body );
} );

module.exports = router;
