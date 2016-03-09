/**
 *
 * Created by magnusbjork on 2/25/16.
 */

var PhoneManager = require( './PhoneManager' );
var Phone = require( './Phone' );
var ccnjs = require( './ccnjs' );
var protocol = require( './protocol' );
var path = require('path');


module.exports = function( io, protocol ) {
    var phoneManager = PhoneManager();
    var relay = ccnjs.Relay( { udp: '9998', socket: '/tmp/b.sock', tcp: '8888', keepAlive: true, content: true} );

    phoneManager.start( 5000 );

    io.on( 'connection', function( socket ) {

        var param = {
            socket: socket,
            relay: relay,
            protocol: protocol,
            manager: phoneManager
        };

        var phone = new Phone( param );
        phoneManager.addSimulation( phone );

        socket.on( 'disconnect', function() {
            phoneManager.delSimulation( phone );
        } );

    })
};
