module.exports = function(server){
    var io = require('socket.io')(server);
    var ccnjs = require('./ccnjs.js');
    var relay = ccnjs.Relay();

    // start demo stuff
    var prefix = '/a/prefix/of/some/kind';
    var phone = ccnjs.Simulation({ prefix: prefix,values: 10 });
    var manager = ccnjs.SimulationManager();
    manager.addSimulation( phone );
    manager.start( 2000 );
    //

    io.on('connection', function(socket){

        socket.on( 'getPhoneData', function( ) {
            manager.getSimulation( prefix).getContent( function( content ) {
                socket.emit( 'phoneData', content);
            } );
        } );

        socket.on('getContent', function(message){
            console.log("getContent{");
            console.log(message);
            console.log("}getContent");
            relay.getContent(message.prefix, function(content){
                socket.emit('content', content);
            })
        });

        socket.on('addRoute', function(message){
            console.log(message);
            relay.addRoute(message);
        });

        socket.on('setContent', function(message){
            console.log(message);
            relay.addContent(message.prefix, message.content);
        });

        socket.on('clientButton', function(object){

            var out = { calculated: object.value * 4};
            socket.emit('calculated', out);

        });

    });
};