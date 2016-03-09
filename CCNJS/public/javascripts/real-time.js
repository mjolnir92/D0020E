var realTime = function(d3, socket){


/*************
SEARCH FOR WORKERS
**************/

socket.on('notification', function(id){

    var type = id.type;
    console.log(id);

    if(type === "INFO"){
        toastr.info( "Id: " + id.id, "Info", {onclick: function () {
            //TODO: Go to event
            window.location = "/alarms";
        }});
    }
    else if(type === "MINOR"){
        toastr.warning( "Id: " + id.id, "Warning", {onclick: function () {
            //TODO: Go to event
            window.location = "/alarms";
        }});
    }
    else if(type === "MAJOR"){
        toastr.error( "Id: " + id.id, "Error", {onclick: function () {
            //TODO: Go to event
            window.location = "/alarms";
        }});
    }

});


socket.on('login', function(id){
    console.log("Login");

    toastr.success(id.firstName + ' ' + id.lastName + ' has connected', {onclick: function() {

    }
    });
});

/**
* draws a linear graph,
* data: array with data,
* sensor: which sensor from data it should show,
* gArea: which div to draw the graph in.
 */
  function makeLineGraphArray(data, sensor, gArea){

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


      var svg = d3.select($(gArea).get(0)) //create the svg in the modal-body
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
      var dom = d3.extent(data, function(d) { return d[sensor]; });
      dom[0] -= 2;
      dom[1] += 2;
      y.domain(dom);

      //y.domain([defaults[sensor].min, defaults[sensor].max]);
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

  /*function setIconColor(phoneData){
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
  }*/

  return {makeLineGraphArray: makeLineGraphArray};
}(d3, io());
