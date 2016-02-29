/**
 *
 * Created by magnusbjork on 2/29/16.
 */

var ccnjs = require( '../ccnjs' );

function main(){
    var relay = ccnjs.Relay();
    var prefix = '/ltu/testingDel';
    //relay.addContent( { prefix: prefix, content: { test: 'obj' } } );

    relay.delContent( prefix, function() {
        console.log( "hello world");
    });

    //relay.getContent( prefix, function( data ) {
    //    console.log( data );
    //    relay.delContent( prefix, function() {
    //        relay.getContent( prefix, function( data ) {
    //            console.log( data );
    //            //relay.close();
    //            console.log( 'relay closed' );
    //        });
    //    });
    //});

    //relay.delContent( prefix, function() {
    //    relay.close( function() {
    //        console.log( 'relay closed' );
    //    });
    //});
}

main();