var realTime = function(d3){

  $(".icon").on("click", function () {

    var sensor = $(this).parent().attr("data-id");

    //Server call to get data from sensor (AJAX?)




    //display data in graph
    $('#myModal').modal('toggle');
    $('.modal-title').html(sensor);
    makeRealTimeGraph();
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
  function makeRealTimeGraph(sensor) {
    $("#graph-area").html("");
    if(sensor == "heartrate") { // check wich sensor it should get data from
      var data = [
        {date: "1-May-12", close: "58.13"}, // dummy data
        {date: "30-Apr-12", close: "53.98"},
        {date: "27-Apr-12", close: "67.00"},
        {date: "26-Apr-12", close: "89.70"},
        {date: "25-Apr-12", close: "99.00"}
      ];
    }
    else{//atm it shows same data for each sensor...
      var data = [
        {date: "1-May-12", close: "58.13"},
        {date: "30-Apr-12", close: "53.98"},
        {date: "27-Apr-12", close: "67.00"},
        {date: "26-Apr-12", close: "89.70"},
        {date: "25-Apr-12", close: "99.00"}
      ];
    }
  //margins for graph
    var margin = {top: 30, right: 20, bottom: 30, left: 50},
        width = 600 - margin.left - margin.right,
        height = 270 - margin.top - margin.bottom;

// Set the ranges
    var x = d3.time.scale().range([0, width]);
    var y = d3.scale.linear().range([height, 0]);

    // Parse the date / time
    var parseDate = d3.time.format("%d-%b-%y").parse;


// Define the axes
    var xAxis = d3.svg.axis().scale(x)
        .orient("bottom").ticks(5);

    var yAxis = d3.svg.axis().scale(y)
        .orient("left").ticks(5);

// Define the line
    var valueline = d3.svg.line()
        .x(function(d) { return x(d.date); })
        .y(function(d) { return y(d.close); });


    var svg = d3.select("#graph-area") //create the svg in the modal-body
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    data.forEach(function(d) {
      d.date = parseDate(d.date);
      d.close = +d.close;
    });

      // Scale the range of the data
      x.domain(d3.extent(data, function(d) { return d.date; }));
      y.domain(d3.extent(data, function(d) { return d.close; }));

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

  return {minimizeNavBar: minimizeNavBar,
        maximizeNavBar: maximizeNavBar};
}(d3);




