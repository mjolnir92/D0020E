/**
 * Created by magnusbjork on 2/25/16.
 */
module.exports = function( ) {
    var simulations = {};
    var intervalId = 0;

    function start( interval, callback ) {
        intervalId = setInterval(function( ) {
            for( var prefix in simulations ) {
                var simulation = simulations[ prefix ];
                simulation.update();
                if ( callback ){
                    callback( simulation );
                }
            }
        }, interval );
    }

    function stop( callback ) {
        clearInterval( intervalId );
        callback();
    }

    function addSimulation( simulation ) {
        simulations[ simulation.mac ] = simulation;
    }

    function getSimulation( mac ) {
        console.log( mac );
        return simulations[ mac ];
    }

    return {
        getSimulation: getSimulation,
        addSimulation: addSimulation,
        start: start,
        stop: stop
    };
};

