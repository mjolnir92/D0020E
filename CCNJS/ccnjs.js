var exec = require('child_process').exec;
var networkInterfaces = require('os').networkInterfaces();
var debug = require('debug')('ccnjs');
var S = require('string');
var fs = require('fs');
var path = require('path');

var LOGS = {
    RELAY : 'relay',
    CTRL  : 'ctrl',
    MKC   : 'mkC'
};

var CONTENT = path.join( __dirname, 'ndntlv' );

function fileExists( filePath ){
    try{
        fs.statSync( filePath );
    }catch(err){
        if( err.code == 'ENOENT' ) {
            return false;
        }
    }
    return true;
}

var counter = 0;


var ccnjs = ccnjs || {};

ccnjs.DOCKER = false;

/**
 * @param {object} [relay_config] Relay connection config.
 * @param {String} [relay_config.debug] Debug level.
 * @param {Boolean}[relay_config.keepAlive] Should relay restart on crash.
 * @param {String} [relay_config.udp] UDP Port.
 * @param {String} [relay_config.tcp] TCP Port for Web-server.
 * @param {String} [relay_config.socket] UNIX-socket.
 * @param {Boolean} [relay_config.content] Should relay add content objects at creation
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
        var out_path = path.join(__dirname, 'public/logs/', file_name + local.udp + '.log' );
        var err_path = path.join(__dirname, 'public/logs/', 'err_' + file_name + local.udp + '.log' );
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
        tcp    : relay_config.tcp    || '6363',
        content: relay_config.content|| false
    };

    function start() {
        var template = "$CCNL_HOME/bin/ccn-lite-relay -v " +
            "{{debug}} -s ndn2013 -u " +
            "{{udp}} -t " +
            "{{tcp}} -x " +
            "{{socket}}";

        if ( local.content ) {
            template += " -d " + CONTENT;
        }

        var command = S( template ).template( local ).s;
        var process = exec( command );
        toFile( process, LOGS.RELAY );
        console.log( command );

        process.on('close', function( err, code ){
            console.log('closing with code: ' + code);
            if ( relay_config.keepAlive && code == 'SIGTERM' ) {
                start();
            }
        });
        process.on('exit', function( err, code ){
            console.log('exiting with code: ' + code);
        });
    }

    start();


    function close( callback ){
        var template = "$CCNL_HOME/bin/ccn-lite-ctrl -x " +
            "{{socket}} debug halt | $CCNL_HOME/bin/ccn-lite-ccnb2xml";

        var command = S( template ).template( local );
        var process = exec( command );
        if ( callback ){
            process.stdout.on( 'data', callback );
        }
    }

    /**
     * @param {String} route_config.udp udp port of host
     * @param {String} route_config.ip ip address of host
     * @param {String} route_config.prefix prefix to host
     */
    function addRoute(route_config){
        route_config.udp = route_config.udp || '9999';
        route_config.socket = local.socket;

        var template = "$CCNL_HOME/bin/ccn-lite-ctrl -x " +
            "{{socket}} newUDPface any " +
            "{{ip}} " +
            "{{udp}} | $CCNL_HOME/bin/ccn-lite-ccnb2xml | grep FACEID";

        var command  = S(template).template( route_config ).s;
        var process = exec( command );
        toFile( process, LOGS.CTRL );

        process.stdout.on('data', function( data ){
            route_config.face_id = data.replace(/[^0-9.]/g, "");

            var forwarding_template = "$CCNL_HOME/bin/ccn-lite-ctrl -x " +
                "{{socket}} prefixreg " +
                "{{prefix}} " +
                "{{face_id}} ndn2013 | $CCNL_HOME/bin/ccn-lite-ccnb2xml";

            var command = S(forwarding_template).template( route_config ).s;
            var process = exec( command );
            toFile( process, LOGS.CTRL );
        });
    }

    /**
     *
     * @param {string} config.prefix content addr
     * @param {object} config.content JSON-object
     */
    function addContent( config ){
        var filePath = config.prefix.replace(/\//g,"");
        config.file_name = path.join( CONTENT, filePath ) + '.ndntlv';
        config.socket = local.socket;

        console.log( 'Counter: ' + ++counter);

        var make_content_template = '$CCNL_HOME/bin/ccn-lite-mkC -s ndn2013 "' +
            '{{prefix}}" > ' +
            '{{file_name}}';

        var make_content_command = S( make_content_template ).template( config ).s;
        var make_content_process = exec( make_content_command );

        make_content_process.stdin.write(JSON.stringify( config.content ));
        toFile( make_content_process, LOGS.MKC );

        make_content_process.on('close', function(){
            var add_content_template   = '$CCNL_HOME/bin/ccn-lite-ctrl -x ' +
                '{{socket}} addContentToCache ' +
                '{{file_name}}';//| $CCNL_HOME/bin/ccn-lite-ccnb2xml';

            var add_content_command = S( add_content_template ).template( config ).s;
            var add_content_process = exec( add_content_command );
            toFile( add_content_process, LOGS.CTRL );
        });
    }

    function getContent(prefix, callback){
        var inter = ( ccnjs.DOCKER ) ? 'eth0' : 'en0';
        networkInterfaces[ inter ].forEach(function(iface){

            if ('IPv4' === iface.family && iface.internal === false) {

                var template = '$CCNL_HOME/bin/ccn-lite-peek -u ' +
                    '{{host}}/{{port}} "' +
                    '{{prefix}}" | $CCNL_HOME/bin/ccn-lite-pktdump -f 2';

                var obj = {
                    host: iface.address,
                    port: local.udp,
                    prefix: prefix
                };

                var command = S( template ).template( obj ).s;
                var process = exec( command );

                process.stderr.on( 'data', console.log );
                process.stdout.on( 'data', function( data ) {
                    var json = JSON.parse( data );
                    callback( json );
                });
                process.stdout.on( 'exit', console.log );
            }
        });
    }

    return {
        addRoute: addRoute,
        addContent: addContent,
        getContent: getContent,
        close: close };
};

module.exports = ccnjs;
