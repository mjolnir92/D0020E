/**
 * Created by magnusbjork on 2/25/16.
 */


Array.prototype.last = function(){
    return this[ this.length - 1 ];
};

String.prototype.hashCode = function() {
    var hash = 0, i, chr, len;
    if (this.length === 0) return hash;
    for (i = 0, len = this.length; i < len; i++) {
        chr   = this.charCodeAt(i);
        hash  = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
};
/**
 *
 * @param param Simulation options
 * @param {string} [param.prefix] Prefix of ccn-node.
 * @param {number} [param.length] Amount of data elements to keep
 * @param {object} param.socket Socket.io socket
 * @param {object} param.relay ccnjs Relay
 * @param {object} param.protocol server protocol
 * @param {string} param.mac mac-address
 * @returns {{update: update}}
 * @constructor
 */
module.exports = function( param ) {
    var content = {
        prefix: '',
        data: {
            sensors: []
        }
    };

    var target = {
        L: 0,
        A: 37,
        B: 37,
        C: 37,
        D: 37
    };


    param.socket.on( 'slidestop', function( data ) {
        phone.target[ data.slider ] = data.value;
    });

    param.socket.on( 'logon', function( data ) {
        console.log( 'logon' );
        data.mac = param.mac;
        console.log( data );
        param.protocol.hello( data, function( res ) {
            console.log( res );
            content.prefix = res.prefix;
        } );
    } );


    function createSensorData( last ) {
        last = last || target;

        var element = { };

        for( var k in last ) {
            element[k] = Math.round(.7 * last[k] + .3 * target[k]);
        }
        element.T = new Date();
        return element;
    }


    function update( ) {

        var last = content.data.sensors.last();
        var data = createSensorData( last );

        content.data.sensors.push( data );
        if( content.data.sensors.length > param.length ) {
            content.data.sensors.shift();
        }

        param.socket.emit( 'update', data );
        //param.relay.addContent( { prefix: content.prefix, content: content.data.sensors } );
    }

    return {
        mac: param.mac,
        update: update
    };
};

