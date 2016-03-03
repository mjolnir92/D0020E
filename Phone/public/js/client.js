/**
 *
 * Created by magnusbjork on 2/25/16.
 */

var client = function( socket, http, d3 ) {
    $(document).ready( function() {

        $('.slider').on( "slidestop", function( event ){
            var data = {
                slider: event.target.name,
                value: event.target.value
            };
            socket.emit( 'slidestop', data );
        });

        d3.select('#d3').append('svg')
            .attr( "width", "100%" )
            .attr( "height", "100%" )
            .attr( "background", 'red');

    } );

    socket.on( 'update', function( data ) {
        console.log( data );
    } );

    socket.on( 'connect', function( ) {
        console.log( 'connected' );
    } );

    socket.on( 'loggedOn', function( data ) {
        $.mobile.changePage( "#page2", { transition: 'slideup' } );

        console.log( data );
    } );



    return {
        logon: function( form ) {
            var json = $( form).serializeJSON();
            json.mac = localStorage.mac;
            socket.emit( 'logon', json );
        }
    }

}( io(), null, d3 );

