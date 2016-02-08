var realTime = function(d3){
  var sensor = "pulse";
  $(".icon").on("click", function () {

    sensor = $(this).parent().attr("data-id");

    //Server call to get data from sensor (AJAX?)




    //display data in graph
    $('#myModal').modal('toggle');
    $('.modal-title').html(sensor);
    $(function() {
      $( "#datepicker1" ).datepicker();
      $( "#datepicker2" ).datepicker();
    });

  });

  // when a worker is selected, change to his information(more to be added)
  $(".workers").click(function(){
    var person = $(this).html();
    $("#worker-name").html(person);
  })

  //makes the navbar smaller when visiting real-time page
  function minimizeNavBar(){
    $("#indexmeny").css('width', "10%");
    $("#mainDiv").css('margin-left', "10%");
    $("#mainDiv").css('width', "90%");
  }

  minimizeNavBar();

  function maximizeNavBar(){
    $("#indexmeny").css('width', "15%");
    $("#mainDiv").css('margin-left', "15%");
    $("#mainDiv").css('width', "85%");
  }

  //graph with d3js
  function makeRealTimeGraph(phoneData, sensor) {
    $("#graph-area").html("");
    var data = phoneData.sensorData;
      //bodyTemp: randValue( 29, 40, last.bodyTemp),
      //    envTemp:  randValue(-20, 35, last.envTemp),
      //    pulse:    randValue( 40, 160, last.pulse),
      //    co2:      randValue(  0, 100, last.co2)
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
        }

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

      // Scale the range of the data
      x.domain(d3.extent(data, function(d) { return d.time; }));
      y.domain([defaults[sensor].min, defaults[sensor].max]);

      svg.append("path")		// Add the valueline path.
          .attr("class", "line")
          .attr("d", valueline(data));

      svg.append("g")			// Add the X Axis
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);

      svg.append("g")			// Add the Y Axis
          .attr("class", "y axis")
          .call(yAxis);

  }

  client.socket.on( 'phoneData', function(phoneData){
      makeRealTimeGraph(phoneData, sensor);
  } );

  return {minimizeNavBar: minimizeNavBar,
        maximizeNavBar: maximizeNavBar};
}(d3);




