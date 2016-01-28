var exec = require('child_process').exec;
var networkInterfaces = require('os').networkInterfaces();
var debug = require('debug')('ccnjs');
var S = require('string');
var fs = require('fs');
var path = require('path');

var LOGS = {
    RELAY : 'relay.log',
    CTRL  : 'ctrl.log',
    MKC   : 'mkC.log'
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

var ccnjs = ccnjs || {};

/**
 * @param relay_config Relay connection config.
 * @param {String} relay_config.debug Debug level.
 * @param {String} relay_config.udp UDP Port.
 * @param {String} relay_config.tcp TCP Port for Web-server.
 * @param {String} relay_config.socket UNIX-socket.
 * @returns {{addRoute: addRoute, addContent: addContent, getContent: getContent, close: close}}
 * @constructor
 */
ccnjs.Relay = function(relay_config){
    /**
     * @param {Object} process
     * @param {String} file_name
     * @return {Object} process
     */
    function toFile(process, file_name){
        var flags = { flags: 'a' };
        var out_path = path.join(__dirname, 'public/logs/', file_name);
        var err_path = path.join(__dirname, 'public/logs/', 'err_' + file_name);
        var stdout = fs.createWriteStream(out_path, flags);
        var stderr = fs.createWriteStream(err_path, flags);

        process.stdout.pipe(stdout);
        process.stderr.pipe(stderr);

        return process;
    }


    relay_config = relay_config || {};

    var local = {
        debug  : relay_config.debug  || 'debug',
        udp    : relay_config.udp    || '9999',
        socket : relay_config.socket || '/tmp/mgmt-relay-a.sock',
        tcp    : relay_config.tcp    || '6363'
    };

    var relay_template = "$CCNL_HOME/bin/ccn-lite-relay -v {{debug}} -s ndn2013 -u {{udp}} -t {{tcp}} -x {{socket}}";
    var string = S(relay_template).template(local).s;
    var process = toFile(exec(string), LOGS.RELAY);



    process.on('close', function(code){
        console.log('closing with code: ' + code);
    });
    process.on('exit', function(code){
        console.log('exiting with code: ' + code);
    });

    function close(){
        process.kill('SIGTERM');
    }

    /**
     * @param {String} route_config.udp udp port of host
     * @param {String} route_config.ip ip address of host
     * @param {String} route_config.prefix prefix to host
     */
    function addRoute(route_config){
        route_config.udp = route_config.udp || '9999';

        var config_template = "$CCNL_HOME/bin/ccn-lite-ctrl -x {{socket}} newUDPface any {{ip}} {{udp}} | $CCNL_HOME/bin/ccn-lite-ccnb2xml | grep FACEID",
            string = S(config_template).template({socket: local.socket, ip: route_config.ip, udp: route_config.udp}).s,
            process = toFile(exec(string), LOGS.CTRL);

        process.stdout.on('data', function(data){

            var forwarding_template = "$CCNL_HOME/bin/ccn-lite-ctrl -x {{socket}} prefixreg {{prefix}} {{face_id}} ndn2013 | $CCNL_HOME/bin/ccn-lite-ccnb2xml",
                face_id = data.replace(/[^0-9.]/g, ""),
                string = S(forwarding_template).template({socket: local.socket, prefix: route_config.prefix, face_id: face_id}).s,
                set_routing = toFile(exec(string), LOGS.CTRL);
        });
    }

    function addContent(prefix, content){

        var createMkc_template = '$CCNL_HOME/bin/ccn-lite-mkC -s ndn2013 "{{prefix}}" > $CCNL_HOME/{{file}}.ndntlv',
            command_template   = '$CCNL_HOME/bin/ccn-lite-ctrl -x {{socket}} addContentToCache $CCNL_HOME/{{file}}.ndntlv | $CCNL_HOME/bin/ccn-lite-ccnb2xml';

        var file = prefix.replace(/\//g,"");

        console.log( file );
        var string = S(createMkc_template).template({prefix: prefix, file: file}).s;
        var process = toFile(exec(string), LOGS.MKC);

        process.stdin.write(JSON.stringify(content));

        process.on('close', function(code){

            var string2 = S(command_template).template({socket: local.socket, file: file}).s;
            var process2 = toFile(exec(string2), LOGS.CTRL);
            //process2.on('exit', console.log);
        });

    }

    function getContent(prefix, callback){
        networkInterfaces['eth0'].forEach(function(iface){

            if ('IPv4' === iface.family && iface.internal === false) {

                var peekTemplate = '$CCNL_HOME/bin/ccn-lite-peek -u {{host}}/{{port}} "{{prefix}}" | $CCNL_HOME/bin/ccn-lite-pktdump -f 2';
                var string = S(peekTemplate).template({host: iface.address, port: local.udp, prefix: prefix}).s;

                var process = exec(string);
                process.stdout.on('data', callback);
            }
        });
    }

    return {
        addRoute: addRoute,
        addContent: addContent,
        getContent: getContent,
        close: close};
};


/**
 *
 * @param prefix
 * @param relay
 * @returns {{update: update}}
 * @constructor
 */
ccnjs.Simulation = function( prefix ,relay ) {
    /**
     *
     * @param {number} domain.min
     * @param {number} domain.max
     * @returns {number} random number between domain.min and domain.max
     */
    function randValue( domain ) {
        return Math.random() * (domain.max - domain.min) + domain.min;
    }

    function createSensorData( ) {
        return {
            time: new Date(),
            bodyTemp: randValue({min: 29, max: 40}),
            envTemp: randValue({min: -20, max: 35}),
            pulse: randValue({min: 40, max: 160}),
            co2: randValue({min: 0, max: 100})
        };
    }

    var mContent = {
        phoneId: prefix.hashCode( ),
        sensorData: []
    };


    function update( ) {
        mContent.sensorData.push(createSensorData());
        relay.addContent( prefix, mContent);
    }

    return {
        update: update
    };
};

ccnjs.SimulationManager = function( interval ) {
    var simulations = [];
    var intervalId = 0;

    function start( ) {
        intervalId = setInterval(function( ) {
            simulations.forEach( function( simulation ) {
                simulation.update( );
            } );
        }, interval );
    }

    function stop( ) {
        clearInterval( intervalId );
    }

    function addSimulation( simulation ) {
        simulations.push( simulation );
    }

    return {
        addSimulation: addSimulation,
        start: start,
        stop: stop
    };
};


module.exports = ccnjs;
