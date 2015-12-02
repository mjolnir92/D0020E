var exec = require('child_process').exec;
var S = require('string');

var ccnjs = ccnjs || {};

/*
 @arg args.debug = debug level
 @arg args.udp = udp port
 @arg args.socket = unix socket
 */
ccnjs.Relay = function(args){

    args = args || {};

    var local = {
        debug  : args.debug  || 'debug',
        udp    : args.udp    || '9999',
        socket : args.socket || '/tmp/mgmt-relay-a.sock',
        tcp    : args.tcp    || '6363'
    };

    var relay_template = "$CCNL_HOME/bin/ccn-lite-relay -v {{debug}} -s ndn2013 -u {{udp}} -t {{tcp}} -x {{socket}}";
    var string = S(relay_template).template(local).s;
    console.log(string);
    var process = exec(string);

    process.stderr.on('data', console.log);
    process.stdout.on('data', console.log);

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

            set_routing.stdout.on('data', function(data){
                console.log('stdout: ' + data);
            });

            set_routing.stderr.on('data', function(data){
                console.log('stderr: ' + data);
            });

        });

        process.stderr.on('data', function(data){
            console.log(data);
        });


    }

    function addContent(prefix, content){
        var createMkc_template = '$CCNL_HOME/bin/ccn-lite-mkC -s ndn2013 "{{prefix}}" > $CCNL_HOME/test.ndntlv',
            command_template   = '$CCNL_HOME/bin/ccn-lite-ctrl -x {{socket}} addContentToCache $CCNL_HOME/test.ndntlv | $CCNL_HOME/bin/ccn-lite-ccnb2xml';

        var string = S(createMkc_template).template({prefix: prefix}).s;
        var process = exec(string);


        process.stdin.write(JSON.stringify(content));

        process.stdout.on('data', console.log);
        process.stderr.on('data', console.log);

        process.on('close', function(code){

            var string2 = S(command_template).template({socket: local.socket}).s;
            console.log(string2);
            var process2 = exec(string2);

            process2.stdout.on('data', console.log);
            process2.stderr.on('data', console.log);
            process2.on('exit', console.log);
        });

    }

    function getContent(prefix, callback){

        var getHostIp = exec("ifconfig eth0 | sed -n 's/.*inet addr:\(.*\) Bcast.*/\1/p'");

        getHostIp.stdout.on('data', function(host_ip){

            console.log('host ip: ' + host_ip);
            var peekTemplate = '$CCNL_HOME/bin/ccn-lite-peek -u {{host}}/{{port}} "{{prefix}}" | $CCNL_HOME/bin/ccn-lite-pktdump -f 2';
            var string = S(peekTemplate).template({host: host_ip, port: local.udp, prefix: prefix});

            console.log(string);
            var process = exec(string);

            process.stdout.on('data', callback);
            process.stderr.on('data', console.log);

        });

        getHostIp.stderr.on('data', console.log);


        //process.stdout.on('data', function(data){
        //    callback(JSON.parse(data))
        //});
        //process.stderr.on('data', function(data){
        //    callback(JSON.parse(data));
        //});

    }

    return {
        addRoute: addRoute,
        addContent: addContent,
        getContent: getContent,
        close: close};
};

//var node_a = new Relay();
//var node_b = new Relay({ udp: '9998', socket: '/tmp/mgmt-relay-b.sock', tcp: '6364' });
//var node_c = new Relay({ udp: '9997', socket: '/tmp/mgmt-relay-c.sock', tcp: '6365' });
//
//node_c.addContent('/ndn/yolo', {name: 'node c', service: 'temperature'});
//node_a.addContent('/ndn/more/', {name: 'node a', service: 'accelerometer'});
//
//node_a.addRoute({prefix: '/local', ip: '10.45.108.111', udp: '6363'});
//
//node_b.addRoute({prefix: '/ndn',   ip: '127.0.0.1', udp: '9999'});
//node_b.addRoute({prefix: '/local', ip: '127.0.0.1', udp: '9999'});
//
//node_b.getContent('/ndn/yolo', function(obj){
//    console.log(obj);
//});
//node_b.getContent('/local/echo', function(obj){
//    console.log(obj);
//});
//
//setTimeout(function(){
//    node_a.close();
//    node_b.close();
//}, 5000);


module.exports = ccnjs;
