/**
 * Created by magnusbjork on 2/25/16.
 */

Array.prototype.last = function(){
    return this[ this.length - 1 ];
};

/**
 *
 * @param param Simulation options
 * @param {string} [param.prefix] Prefix of ccn-node.
 * @param {object} param.socket Socket.io socket
 * @param {object} param.relay ccnjs Relay
 * @param {object} param.protocol server protocol
 * @returns {{mac: {string}, update: update}}
 * @constructor
 */
module.exports = function( param ) {
    var length = 40;

    var content = {
        prefix: '',
        data: {
            sensors: []
        }
    };

    var target = {
        L: 0,
        A: 37,
        B: 20,
        C: 0,
        D: 0
    };

    var initialized = false;

    param.socket.on( 'slidestop', function( data ) {
        console.log( data );
        target[ data.slider ] = data.value;
    } );

    param.socket.on( 'error', function( data ) {
        console.log( data );
    } );

    param.socket.on( 'alarm', function( data ) {
        console.log( data );
        data.sensors = content.data.sensors;

        var packet = {
            prefix: content.prefix,
            time: new Date(),
            type: 'ALARM',
            data: data
        };

        param.protocol.alarm( packet, function( data ) {
            console.log( data );
        } );
    } );

    param.socket.on( 'logon', function( data ) {
        param.protocol.hello( data, function( res ) {
            content.prefix = res.prefix;
            param.protocol.ack( res.prefix, function( res ) {
                param.socket.emit( 'loggedOn', res );
                initialized = true;
            } );
        } );
    } );



    function createSensorData( last ) {
        last = last || target;

        var element = { };

        for( var k in last ) {
            element[k] = Math.round( .9 * last[k] + .1 * target[k] );
        }
        element.T = new Date();
        return element;
    }


    function update( ) {
        if ( !initialized ) return;

        var last = content.data.sensors.last();
        var data = createSensorData( last );

        content.data.sensors.push( data );
        if( content.data.sensors.length > length ) {
            content.data.sensors.shift();
        }

        param.socket.emit( 'update', data );
        param.relay.addContent( { prefix: content.prefix, content: content.data.sensors } );
    }

    return {
        mac: param.mac,
        update: update
    };
};

