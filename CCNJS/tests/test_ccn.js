#!/usr/bin/env node
/**
 * Created by magnusbjork on 2/27/16.
 */

var ccnjs = require( '../ccnjs' );

function test_mkc_add_get( relayA, relayB ) {
    var testobj = { test: 'object' };
    var prefix = '/ltu/prefix';

    relayB.addContent( { prefix: prefix, content: testobj });
    relayA.getContent( prefix, function( data ) {
        if ( testobj.test == data.test ) {
            console.log( 'test passed!' );
        } else {
            console.log( 'test failed.' );
            console.log( 'input: ' );
            console.log( testobj );
            console.log( 'returned: ' );
            console.log( data );
        }
    } );
}

function main(){
    console.log( '--main' );
    var relayA = ccnjs.Relay();
    var relayB = ccnjs.Relay( { udp: '9998', socket: '/tmp/mgmt-sockB.sock', tcp: '6565'} );

    relayA.addRoute({ udp: '9998', ip: '127.0.0.1', prefix: '/ltu' });

    test_mkc_add_get( relayA, relayB );

    setTimeout(function(){
        relayA.close(null);
        relayB.close(null);
    }, 5000);
}

main();