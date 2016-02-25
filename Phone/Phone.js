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
 * @param {string} [param.prefix] Prefix to phone.
 * @param {number} [param.length] Amount of data elements to keep
 * @returns {{update: update}}
 * @constructor
 */
module.exports = function( param ) {

    function randomMac() {
        return "XX:XX:XX:XX:XX:XX".replace(/X/g, function() {
            return "0123456789ABCDEF".charAt(Math.floor(Math.random() * 16))
        });
    }

    var content = {
        mac: randomMac(),
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

    function createSensorData( last ) {
        last = last || target;

        var element = { };

        for( var k in last ) {
            element[k] = .9 * last[k] + .1 * target[k];
        }

        return element;
    }

    function setTarget( key, value ) {
        target[ key ] = value;
    }

    function update( ) {

        var last = content.data.sensors.last();
        var data = createSensorData( last );

        content.data.sensors.push( data );
        if( content.data.sensors.length > param.length ) {
            content.data.sensors.shift();
        }
    }

    function getContent( callback ) {
        callback( content );
    }

    function generateContent( times ) {
        for ( var i = 0; i < times; i++ ){
            update();
        }
    }

    return {
        mac: content.mac,
        update: update,
        generate: generateContent,
        getContent: getContent
    };
};

