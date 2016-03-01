#!/usr/bin/env node
/**
 *
 * Created by magnusbjork on 1/27/16.
 */

var ccn = require("./../ccnjs.js");
var prefix = "/prefix/content";

//values how many values to store at most.
var phone = ccn.Simulation({ prefix: prefix, values: 30 }, true);

var manager = ccn.SimulationManager( );
manager.addSimulation( phone );

//500 is the interval to update the simulation. ( in millisec. )
manager.start(500);

/*
 setTimeout will call a callback function after a set value,
 in this case the function will be called after 10000ms.
 */
setTimeout(function() {

    //get a simulation added to the manager, var simulation == var phone
    var simulation = manager.getSimulation( prefix );

    //getContent returns a content object, see ccnjs.js::ccnjs.Simulation.mContent
    //sensorData is an array of random values.
    simulation.getContent( function( content ) {
        content.sensorData.forEach( function( element ) {
            console.log( "Date and Time: " + element.time);
            console.log( "Body temperature: " + element.bodyTemp );
            console.log( "Environment temperature: " + element.envTemp );
            console.log( "Pulse: " + element.pulse );
            console.log( "CO2: " + element.co2 + "\n");
        } );

        //stop the simulation
        manager.stop( function( ) {
            console.log( "simulation stopped." );
        })

    });

}, 10000);
