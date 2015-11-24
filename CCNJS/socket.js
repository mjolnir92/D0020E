module.exports = function(server){
    var io = require('socket.io')(server);
    var relay = require('./ccnjs').Relay();

    io.on('connection', function(socket){

        socket.on('getContent', function(message){
            console.log(message);
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

    });
};