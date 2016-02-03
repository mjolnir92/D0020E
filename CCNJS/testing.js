/**
 *
 * Created by magnusbjork on 1/27/16.
 */

var ccn = require("./ccnjs.js");
var local = {
    debug  : 'debug',
    udp    : '9998',
    socket : '/tmp/mgmt-relay-b.sock',
    tcp    : '6362'
};

var prefix = "/prefix/content";
var relay = ccn.Relay(  );
var relay2 = ccn.Relay( local );
relay.addRoute({udp: '9998', ip: '192.168.192.0.23', prefix: '/prefix' });
relay2.addContent( prefix, "Hello World");
var manager = ccn.SimulationManager( );
var phone = ccn.Simulation( prefix, relay );
manager.addSimulation( phone );


manager.start(2000);

setTimeout(function() {
    //manager.stop();
    relay.getContent( prefix, function( content ) {
        console.log( 'got content: ' );
        console.log( content );
        relay.close( function () {
            console.log( 'Relay closed.' );
        } );
    });
}, 10000);

