var exec = require('child_process').exec;
var networkInterfaces = require('os').networkInterfaces();
var S = require('string');
var fs = require('fs');
var path = require('path');
var flags = {flags: "a"};

var logContent = fs.createWriteStream(path.join(__dirname, 'public/logs/', 'content.log'), flags);
var logRelay   = fs.createWriteStream(path.join(__dirname, 'public/logs/', 'relay.log'), flags);
var logCtrl    = fs.createWriteStream(path.join(__dirname, 'public/logs/', 'ctrl.log'), flags);

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

    relay_config = relay_config || {};

    var local = {
        debug  : relay_config.debug  || 'debug',
        udp    : relay_config.udp    || '9999',
        socket : relay_config.socket || '/tmp/mgmt-relay-a.sock',
        tcp    : relay_config.tcp    || '6363'
    };

    var relay_template = "$CCNL_HOME/bin/ccn-lite-relay -v {{debug}} -s ndn2013 -u {{udp}} -t {{tcp}} -x {{socket}}";
    var string = S(relay_template).template(local).s;
    var process = exec(string);


    process.stderr.pipe(logRelay);
    process.stdout.pipe(logRelay);

    process.on('close', function(code){
        console.log('closing with code: ' + code);
    });
    process.on('exit', function(code){
        console.log('exiting with code: ' + code);
    });

    function close(){
        process.kill('SIGTERM');
    }

    /*
     @args.prefix = route
     @args.ip = ip of target
     @args.udp = port of target
     */
    function addRoute(args){
        args.udp = args.udp || '9999';

        var config_template = "$CCNL_HOME/bin/ccn-lite-ctrl -x {{socket}} newUDPface any {{ip}} {{udp}} | $CCNL_HOME/bin/ccn-lite-ccnb2xml | grep FACEID",
            string = S(config_template).template({socket: local.socket, ip: args.ip, udp: args.udp}).s,
            process = exec(string);

        process.stdout.on('data', function(data){

            var forwarding_template = "$CCNL_HOME/bin/ccn-lite-ctrl -x {{socket}} prefixreg {{prefix}} {{face_id}} ndn2013 | $CCNL_HOME/bin/ccn-lite-ccnb2xml",
                face_id = data.replace(/[^0-9.]/g, ""),
                string = S(forwarding_template).template({socket: local.socket, prefix: args.prefix, face_id: face_id}).s,
                set_routing = exec(string);

            set_routing.stdout.pipe(logCtrl);
            set_routing.stderr.pipe(logCtrl);

        });
        process.stderr.pipe(logCtrl);
    }

    function addContent(prefix, content){

        var createMkc_template = '$CCNL_HOME/bin/ccn-lite-mkC -s ndn2013 "{{prefix}}" > $CCNL_HOME/{{file}}.ndntlv',
            command_template   = '$CCNL_HOME/bin/ccn-lite-ctrl -x {{socket}} addContentToCache $CCNL_HOME/test.ndntlv | $CCNL_HOME/bin/ccn-lite-ccnb2xml';

        var file = prefix.replace(/\//,"");

        var string = S(createMkc_template).template({prefix: prefix, file: file}).s;
        var process = exec(string);


        process.stdin.write(JSON.stringify(content));

        process.stdout.pipe(logContent);
        process.stderr.pipe(logContent);

        process.on('close', function(code){

            var string2 = S(command_template).template({socket: local.socket}).s;
            console.log(string2);
            var process2 = exec(string2);

            process2.stdout.pipe(logContent);
            process2.stderr.pipe(logContent);

            process2.on('exit', console.log);
        });

    }

    function getContent(prefix, callback){
        networkInterfaces['eth0'].forEach(function(iface){

            if ('IPv4' === iface.family && iface.internal === false) {

                var peekTemplate = '$CCNL_HOME/bin/ccn-lite-peek -u {{host}}/{{port}} "{{prefix}}" | $CCNL_HOME/bin/ccn-lite-pktdump -f 2';
                var string = S(peekTemplate).template({host: iface.address, port: local.udp, prefix: prefix});

                console.log(string);
                var process = exec(string);


                process.stdout.on('data', callback);
                process.stderr.pipe(logContent);
            }

        });

    }

    return {
        addRoute: addRoute,
        addContent: addContent,
        getContent: getContent,
        close: close};
};


module.exports = ccnjs;
