/**
 * Created by magnusbjork on 2/23/16.
 */

var path = require( 'path' );
var ccnjs = require( '../ccnjs' );
var db = require( '../db' );
var prefix = '/ltu';

module.exports = function() {
    var relay = ccnjs.Relay();
    var phones = {};
    var routes = {};
    relay.addRoute( { udp: '9998', ip: '127.0.0.1', prefix: prefix } );

    return {
        post: function( req, res ) {
            var event = req.body;

            switch( event.type ) {
                case 'HELLO': {
                    var phonePrefix = path.join( prefix, event.data.mac );
                    var response = {
                        prefix: phonePrefix
                    };
                    phones[ phonePrefix ] = event.data;

                    res.json( response );
                    break;
                }
                case 'BYE': {
                    var phoneData = phones[ event.data.prefix ];
                    phoneData.online = 0;
                    var sql = 'INSERT INTO `phones` ' +
                        'SET ? ' +
                        'ON DUPLICATE KEY UPDATE ?';

                    sql = db.format( sql, [phoneData, phoneData] );

                    db.query( sql, function( err, result ) {
                        res.json( { msg: 'goodbye!' } );
                    } );
                    break;
                }
                case 'ACK': {
                    var phoneData = phones[ event.data.prefix ];
                    phoneData.online = 1;
                    console.log( phoneData );
                    //TODO insert update user
                    var sql = 'INSERT INTO `phones` ' +
                        'SET ? ' +
                        'ON DUPLICATE KEY UPDATE ?';

                    sql = db.format( sql, [phoneData, phoneData] );

                    db.query( sql, function( err, result ) {
                        res.json( { msg: 'welcome' } );
                    } );
                    break;
                }
                case 'ALARM': {
                    break;
                }
            }

            console.log( event );
            console.log( req.ip );


        },
        f: function(prefix, callback){
            relay.getContent( prefix, callback );
        }
    }
};