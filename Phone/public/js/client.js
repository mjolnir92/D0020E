/**
 *
 * Created by magnusbjork on 2/25/16.
 */

var client = function( socket, d3 ) {
    function randomMac() {
        return "XX:XX:XX:XX:XX:XX".replace(/X/g, function() {
            return "0123456789ABCDEF".charAt(Math.floor(Math.random() * 16))
        });
    }

    $(document).ready( function() {

        console.log( 'constructor' );
        $('.slider').on( "slidestop", function( event ){
            var data = {
                slider: event.target.name,
                value: event.target.value
            };
            console.log( data );
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
    function logon( form ) {

        var json = $( form).serializeJSON();
        localStorage.mac = localStorage.mac || randomMac();
        json.mac = localStorage.mac;
        socket.emit( 'logon', json );
    }


    return {
        logon: logon
    }

}( io(), d3 );

