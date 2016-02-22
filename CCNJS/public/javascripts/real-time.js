var realTime = function(d3){
  var sensor = "pulse";
  $(".more-info").on("click", function () {
    sensor = $(this).parent().attr("data-id");

    //Server call to get data from sensor (AJAX?)




    //display data in graph
    $('#myModal').modal('toggle');
    $('.modal-title').html(sensor);

  });

  //graph with d3js
  function makeRealTimeGraph(phoneData, sensor) {
    $("#graph-area").html("");
    var data = phoneData.sensorData;
      var defaults = {
            bodyTemp:{
              min: 29,
              max: 40
            },
            envTemp:{
              min: -20,
              max: 160
            },
            pulse: {
                min: 40,
                max: 160
            },
            co2:{
                min: 0,
                max: 100
            }
        };

    var margin = {
            top: 30,
            right: 20,
            bottom: 30,
            left: 50
        },
        width = 600 - margin.left - margin.right,
        height = 270 - margin.top - margin.bottom;

// Set the ranges
    var x = d3.time.scale().range([0, width]);
    var y = d3.scale.linear().range([height, 0]);

    // Parse the date / time... does not work!
    var parseDate = d3.time.format.iso.parse;


// Define the axes
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .ticks(5);

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(5);

// Define the line
    var valueline = d3.svg.line()
        .x(function(d) { return x(d.time); })
        .y(function(d) { return y(d[sensor]); });


    var svg = d3.select("#graph-area") //create the svg in the modal-body
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

      data.forEach(function(d) {
          d.time = parseDate(d.time);
          d[sensor] = +d[sensor];
      });

      x.domain(d3.extent(data, function(d) { return d.time; }));
      y.domain([defaults[sensor].min, defaults[sensor].max]);

      svg.append("defs").append("clipPath")
          .attr("id", "clip")
          .append("rect")
          .attr("width", width)
          .attr("height", height);

      var x_handle = svg.append("g")			// Add the X Axis
          .attr("clip-path", "url(#clip)")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);

      svg.append("g")			// Add the Y Axis
          .attr("class", "y axis")
          .call(yAxis);

      var part = width / data.length;

      var path = svg.append("g")
          .attr("clip-path", "url(#clip)")
          .append("path")
          .attr("class", "line")
          .attr("d", valueline(data));
          //.transition()
          //.attr( 'transform', 'translate( ' + -part + ', 0 )' )
          //.duration( 2000 )
          //.ease( 'linear' );

      //x_handle.transition()
      //    .attr( 'transform', 'translate( ' + -part + ', ' + height +' )' )
      //    .duration( 2000 )
      //    .ease( 'linear' );

  }

  client.socket.on( 'phoneData', function(phoneData){
      makeRealTimeGraph(phoneData, sensor);
      var len = phoneData.sensorData.length;
      $("#pulse").html(Math.round(phoneData.sensorData[len-1]['pulse']) + "BPM");
      $("#co2").html(Math.round(phoneData.sensorData[len-1]['co2']) + "PPM");
      $("#envTemp").html(Math.round(phoneData.sensorData[len-1]['envTemp']) + "C°");
      $("#bodyTemp").html(Math.round(phoneData.sensorData[len-1]['bodyTemp']) + "C°");
      $(".time-stamp").html(phoneData.sensorData[len-1]['time']);
      $("#phoneId").html("id = " +phoneData.phoneId);
  } );

  return {minimizeNavBar: minimizeNavBar,
        maximizeNavBar: maximizeNavBar};
}(d3);
