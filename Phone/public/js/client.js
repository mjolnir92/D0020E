/**
 *
 * Created by magnusbjork on 2/25/16.
 */

var client = function( socket ) {
    function randomMac() {
        return "XX:XX:XX:XX:XX:XX".replace(/X/g, function() {
            return "0123456789ABCDEF".charAt(Math.floor(Math.random() * 16))
        });
    }

    $( document ).on( "pageinit", "#page2", function( event ) {
        $('.slider').on( 'slidestop', function( event ){
            var data = {
                slider: event.target.name,
                value: event.target.value
            };
            socket.emit( 'slidestop', data );
        });

        $('#alarm01').bind( 'click', function( event, ui ) {
            console.log( 'click!' );
            var info = {
                eventType: 'SEVERE',
                eventTime: new Date()
            };

            socket.emit( 'alarm', info );
        } );
    });

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

}( io() );

