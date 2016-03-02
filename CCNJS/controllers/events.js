/**
 * Created by magnusbjork on 2/23/16.
 */

var ccnjs = require( '../ccnjs' );
var prefix = '/ltu';

module.exports = function() {
    var relay = ccnjs.Relay();
    var route;

    return {
        post: function( req, res ) {
            var event = req.body;

            console.log( event );
            console.log( req.ip );
            res.json( { msg: 'Welcome!' } );
        }
    }
};