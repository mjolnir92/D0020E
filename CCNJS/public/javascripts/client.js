var client = function(socket){
    var prefix_input = document.getElementById('prefix');
    var value_input  = document.getElementById('value');
    var key_input    = document.getElementById('key');
    var ip_port      = document.getElementById('ip');
    var ul           = document.getElementById('content_list');

    socket.on('content', function(content){
        var contentString = JSON.stringify(content);
        var li = document.createElement('LI');

        li.innerHTML = contentString;
        ul.appendChild(li);

    });

    function submitForm(){
        var sendThis = {};
        sendThis[key_input.value] = value_input.value;

        socket.emit('setContent', {prefix: prefix_input.value, content: sendThis} );

    }

    function addRoute(){
        var strings = ip_port.value.split(":");
        socket.emit('addRoute', {prefix: prefix_input.value, ip: strings[0], udp: strings[1]});

    }

    function getContent(){
        socket.emit('getContent', {prefix: prefix_input.value});
    }

    return { submitForm: submitForm,
             getContent: getContent,
             addRoute: addRoute}

}(io());