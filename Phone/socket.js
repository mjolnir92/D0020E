/**
 *
 * Created by magnusbjork on 2/25/16.
 */

var PhoneManager = require( './PhoneManager');
var Phone = require( './Phone');

module.exports = function( io, server ) {
    var phoneManager = PhoneManager();



    io.on( 'connection', function( socket ) {
        var data = { hello: 'world' };
        //server.push( data );
        console.log( 'a user connected' );
        socket.on( 'disconnect', function(){
            console.log( 'user disconnected' );
        });

        socket.on( 'slidestop', function( data ){
            console.log('slidestop');
            console.log( data );
        })
    })
};
