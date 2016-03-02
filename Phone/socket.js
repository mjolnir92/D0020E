/**
 *
 * Created by magnusbjork on 2/25/16.
 */

var PhoneManager = require( './PhoneManager' );
var Phone = require( './Phone' );
var ccnjs = require( './ccnjs' );
var protocol = require( './protocol' );

var LENGTH = 40;

module.exports = function( io, protocol ) {
    var phoneManager = PhoneManager();
    var relay = ccnjs.Relay();

    phoneManager.start( 5000 );

    io.on( 'connection', function( socket ) {

        function randomMac() {
            return "XX:XX:XX:XX:XX:XX".replace(/X/g, function() {
                return "0123456789ABCDEF".charAt(Math.floor(Math.random() * 16))
            });
        }

        var param = {
            length: LENGTH,
            socket: socket,
            relay: relay,
            protocol: protocol,
            mac: randomMac()
        };

        var phone = new Phone( param );

        phoneManager.addSimulation( phone );

        socket.on( 'disconnect', function() {
            phoneManager.delSimulation( phone );
            console.log( 'user disconnected' );
        });
    })
};
