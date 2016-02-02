/**
 *
 * Created by magnusbjork on 1/27/16.
 */

var ccn = require("./ccnjs.js");

var prefix = "/prefix";
var relay = ccn.Relay();
var manager = ccn.SimulationManager( );
var phone = ccn.Simulation( prefix, relay );
manager.addSimulation( phone );


manager.start();

setTimeout(function() {
    manager.stop();
    relay.getContent( prefix, function( content ) {
        console.log( content );
    });
}, 10000);

