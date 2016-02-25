/**
 *
 * Created by magnusbjork on 2/25/16.
 */

var PhoneManager = require( './PhoneManager');
var Phone = require( './Phone');
var PREFIX = '/ltu';
var LENGTH = 40;

module.exports = function( io, server ) {
    var phoneManager = PhoneManager();

    phoneManager.start( 5000 );

    io.on( 'connection', function( socket ) {

        var param = {
            length: LENGTH,
            prefix: PREFIX
        };

        var phone = new Phone( param, function( phone, data ) {
            socket.emit( 'update', data );
            console.log( 'updated phone: ' + phone.content.mac );
        });

        phoneManager.addSimulation( phone );

        socket.on( 'disconnect', function(){
            phoneManager.delSimulation( phone );
            console.log( 'user disconnected' );
        });

        socket.on( 'slidestop', function( data ){
            phone.target[ data.slider ] = data.value;
        });
    })
};
