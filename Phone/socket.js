/**
 *
 * Created by magnusbjork on 2/25/16.
 */

module.exports = function( io, server ) {
    io.on( 'connection', function( socket ) {
        var data = { hello: 'world' };
        server.push( data );
        console.log( 'a user connected' );
        socket.on( 'disconnect', function(){
            console.log( 'user disconnected' );
        })
    })
};
