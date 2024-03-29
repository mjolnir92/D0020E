/**
 * Created by magnusbjork on 2/23/16.
 */

var path = require( 'path' );
var ccnjs = require( '../ccnjs' );
var db = require( '../db' );
var prefix = '/ltu';

/**
 * Protocol for communication with phone.
 * @param io
 * @returns {{post: post, f: f}}
 */
module.exports = function( io ) {
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

                    //TODO FIX THIS!!
                    event.data.mac = phonePrefix;

                    var response = {
                        prefix: phonePrefix
                    };

                    phones[ phonePrefix ] = event.data;

                    io.sockets.emit('login', event.data);

                    res.json( response );
                    break;
                }
                case 'BYE': {
                    var phoneData = phones[ event.data.prefix ];
                    console.log( event.data );
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
                    console.log( req.body );
                    var sql = 'INSERT INTO `events` SET ?';
                    var _event = {
                        time: event.data.eventTime,
                        type: event.data.eventType,
                        phones_mac: event.prefix
                    };

                    sql = db.format( sql, _event );

                    db.query( sql, function( err, result ) {
                        var eventInfo = {
                                        id: result.insertId,
                                        type: _event.type,
                                        time: _event.time,
                                        msg: event.data.eventDesc
                                        };
                        event.data.sensors.forEach( function( element ) {
                            var sql = 'INSERT INTO `sensors` SET ?';
                            element.events_eventId = eventInfo.id;
                            sql = db.format( sql, element );

                            db.query( sql, function( err, result ) {
                                console.log( sql );
                            } )
                        } );

                        io.sockets.emit('notification', eventInfo); //sends notification to website about alarm.
                        res.json( { msg: 'Sending help right away!' } );
                    } );
                    break;
                }
            }
        },
        f: function(prefix, callback){
            relay.getContent( prefix, callback );
        }
    }
};
