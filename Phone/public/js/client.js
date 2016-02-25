/**
 *
 * Created by magnusbjork on 2/25/16.
 */

var client = function( socket, http ) {
    console.log('yolo');

    $(document).ready( function() {

        $('.slider').on( "slidestop", function( event ){
            var data = {
                slider: event.target.name,
                value: event.target.value
            };
            socket.emit( 'slidestop', data );
        });

    } );

    socket.on( 'connection', function( argument ) {
        console.log( 'connected' );
        console.log( argument );
    } )

}( io() );

