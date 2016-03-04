/**
 * Created by magnusbjork on 2/25/16.
 */
module.exports = function( ) {
    var simulations = {};
    var intervalId = 0;
    var autoInc = 0;

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
        simulation.index = autoInc++;
        simulations[ simulation.index ] = simulation;
    }

    function delSimulation( simulation ) {
        delete simulations[ simulation.index ];
    }

    return {
        addSimulation: addSimulation,
        delSimulation: delSimulation,
        start: start,
        stop: stop
    };
};

