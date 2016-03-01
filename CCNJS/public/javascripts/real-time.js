var realTime = function(d3){
  var sensor = "pulse";
  $(".more-info").on("click", function () {
    sensor = $(this).parent().attr("data-id");
    var gArea = $(this).parent().children(".details").children("#graphArea");

    //Server call to get data from sensor (AJAX?)
    var firstValue = {
        T:  new Date("October 13, 2014 11:13:00") , //time
        L: "Here", //location
        A: 39.5, //sensor A
        B: 20.0, // ...
        C: 68.0,
        D: 30.0
    };
    var secondValue = {
        T:  new Date() , //time
        L: "Here", //location
        A: 31.5, //sensor A
        B: 24.0, // ...
        C: 62.0,
        D: 33.0
    };

    var someArray = [firstValue, secondValue];
    makeLineGraphArray(someArray, sensor);


    //display data in graph
    $('#myModal').modal('toggle');
    $('.modal-title').html(sensor);

  });


    //search for workers
  $("#search-bar").keyup(function(event){
      if(event.keyCode == 13){
          //repeat following for all matches, add when database ready
          var fullName = $("#search-bar").val();
          var res = fullName.split(" ");
          var fName = res[0];
          if(res[1] != null) {
              var lName = res[1];
              $.ajax({
                  url: "/search_workers_two_names",
                  type: "POST",
                  dataType: "json",
                  data: {
                      firstName: fName,
                      lastName: lName
                  },
                  success: function (result) {
                      if(result.length) {
                          //make expandboxes
                      }
                      else{
                          alert("No such person employed here!");
                      }
                  }
              });
          }
          else{
              $.ajax({
                  url: "/search_workers_one_name",
                  type: "POST",
                  dataType: "json",
                  data: {
                      Name: fullName
                  },
                  success: function (result) {
                      if(result.length) {
                          //TODO make expandaboxes
                      }
                      else{
                          alert("No such person employed here!");
                      }
                  }
              });
          }

      }
  });

  function makeLineGraphArray(data, sensorOriginal){
      $("#graph-area").html("");
      if(sensorOriginal == "bodyTemp"){
          var sensor = "A";
      }
      else if(sensorOriginal == "envTemp"){
          var sensor = "B";
      }
      else if(sensorOriginal == "pulse"){
          var sensor = "C";
      }
      else if(sensorOriginal == "co2"){
          var sensor = "D";
      }
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

      // Parse the date
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
          .x(function(d) { return x(d.T); })
          .y(function(d) { return y(d[sensor]); });


      var svg = d3.select("#graph-area") //create the svg in the modal-body
          .append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

      data.forEach(function(d) {
          d.T = parseDate(d.T);
          d[sensor] = +d[sensor];
      });

      x.domain(d3.extent(data, function(d) { return d.T; }));
      y.domain([defaults[sensorOriginal].min, defaults[sensorOriginal].max]);

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
  }

  function setIconColor(phoneData){
      var warnings = {
          bodyTemp:{
              min: 34,
              max: 37
          },
          envTemp:{
              min: -7,
              max: 45
          },
          pulse: {
              min: 50,
              max: 145
          },
          co2:{
              min: 10,
              max: 30
          }
      };
      var pData = phoneData.sensorData[phoneData.sensorData.length-1];
      var ok = 0;
      if(warnings['pulse'].min < pData['pulse'] && pData['pulse'] < warnings['pulse'].max){
          $("#pulse-icon").css("background", "green");
          ok += 1;
      }
      else{
          $("#pulse-icon").css("background", "red");
      }
      if(warnings['bodyTemp'].min < pData['bodyTemp'] && pData['bodyTemp'] < warnings['bodyTemp'].max){
          $("#bodyTemp-icon").css("background", "green");
          ok += 1;
      }
      else{
          $("#bodyTemp-icon").css("background", "red");
      }
      if(warnings['envTemp'].min < pData['envTemp'] && pData['envTemp'] < warnings['envTemp'].max){
          $("#envTemp-icon").css("background", "green");
          ok += 1;
      }
      else{
          $("#envTemp-icon").css("background", "red");
      }
      if(pData['co2'] < warnings['co2'].max){
          $("#co2-icon").css("background", "green");
          ok += 1;
      }
      else{
          $("#co2-icon").css("background", "red");

      }
      if(ok == 4){
          $("#health-status").html("Health status OK!");
      }
      else{
          $("#health-status").html("Health status <b>not</b> OK!");
      }
  }

  client.socket.on( 'phoneData', function(phoneData){
      makeRealTimeGraph(phoneData, sensor);
      var len = phoneData.sensorData.length;
      setIconColor(phoneData);
      $("#pulse").html(Math.round(phoneData.sensorData[len-1]['pulse']) + "BPM");
      $("#co2").html(Math.round(phoneData.sensorData[len-1]['co2']) + "PPM");
      $("#envTemp").html(Math.round(phoneData.sensorData[len-1]['envTemp']) + "C°");
      $("#bodyTemp").html(Math.round(phoneData.sensorData[len-1]['bodyTemp']) + "C°");
      $(".time-stamp").html(phoneData.sensorData[len-1]['time']);
      $("#phoneId").html("id = " +phoneData.phoneId);
  } );

  return {};
}(d3);
