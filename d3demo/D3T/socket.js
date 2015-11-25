module.exports = function(server){
    var io = require('socket.io')(server);
    var udp = require('dgram').createSocket('udp4');
    //var host = '192.168.0.102';
    //var host = '54.229.198.98';
    var host = '172.31.18.120';

    var sockets = [];

    udp.on('listening', function () {
        var address = udp.address();
        console.log('UDP Server listening on ' + address.address + ":" + address.port);
    });

    udp.on('message', function (message, remote) {
        sockets.forEach(function(socket){
            socket.emit('values',  JSON.parse(message.toString()));
        });
    });

    udp.bind(12345, host);

    io.on('connection', function(socket){
        sockets.push(socket);
        console.log('user connected');
    });
};
