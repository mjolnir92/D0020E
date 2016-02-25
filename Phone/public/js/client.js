/**
 *
 * Created by magnusbjork on 2/25/16.
 */

var client = function( socket ) {
    socket.on( 'connection', function( argument ) {
        console.log( 'connected' );
        console.log( argument );
    } )

}( io() );

