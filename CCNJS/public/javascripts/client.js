var client = function(socket, d3){
    var prefix_input = document.getElementById('prefix');
    var value_input  = document.getElementById('value');
    var key_input    = document.getElementById('key');
    var ip_port      = document.getElementById('ip');
    var ul           = document.getElementById('content_list');
    var div          = document.getElementById('client_div');




    socket.on('content', function(content){
        console.log(content);
        var contentString = JSON.stringify(content);
        var li = document.createElement('LI');

        li.innerHTML = contentString;
        ul.appendChild(li);

    });

    socket.on('calculated', function(object){
        div.innerHTML = object.calculated;
    });

    socket.on( 'phoneData', function( phoneData ) {
        console.log( phoneData );
    } );

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

    function clientButton(){
        var value = parseInt(div.innerHTML);
        socket.emit('clientButton', { value: value});
    }
//----------------------------------d3.js testing-------------------------------
    function createGraph() {

        var data = [ { "x": 1,   "y": 5},  { "x": 20,  "y": 20},
            { "x": 40,  "y": 10}, { "x": 60,  "y": 40},
            { "x": 80,  "y": 5},  { "x": 100, "y": 60}];

        var width = 200;
        var height = 200;

        var svg = d3.select("body").append("svg").attr("width", width + "px").attr("height", height + "px");
        var x = d3.scale.linear().range([0, width]);
        var y = d3.scale.linear().range([height, 0]);

        var valueline = d3.svg.line()
            .x(function(d) { return d.x; })
            .y(function(d) { return d.y; })
            .interpolate("linear");

        svg.append("path")
            .attr("d", valueline(data))
            .attr("stroke", "blue")
            .attr("stroke-width", 2)
            .attr("fill", "none");
    }

    function createBarChart(){
        var data = [15, 32, 12, 22, 64, 37];

        var x = d3.scale.linear()
            .domain([0, d3.max(data)])
            .range([0, 420]);

        d3.select(".chart")
            .selectAll("div")
            .data(data)
            .enter().append("div")
            .style("width", function(d) { return x(d) + "px"; })
            .text(function(d) { return d; });


    }

    function logData( ) {
        socket.emit( 'getPhoneData' );
    }


    return {
        createBarChart: createBarChart,
        createGraph: createGraph,
        clientButton: clientButton,
        submitForm: submitForm,
        getContent: getContent,
        addRoute: addRoute,
        logData: logData
    }

}(io(), d3);

