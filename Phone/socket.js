/**
 *
 * Created by magnusbjork on 2/25/16.
 */

module.exports = function( io ) {
    io.on( 'connection', function( socket ) {
        console.log( 'a user connected' );
        socket.on( 'disconnect', function(){
            console.log( 'user disconnected' );
        })
    })
};
