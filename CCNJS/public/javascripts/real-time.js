var realTime = function(d3){


/*************
SEARCH FOR WORKERS
**************/
$("#search-bar").keyup(function(event){
    if(event.keyCode == 13){

        //Store result from search-bar
        var fullName = $("#search-bar").val();
        var res = fullName.split(" ");
        var fName = res[0];

        //clear old result
        $(".result").html("");
        $("#search-bar").val("");

        //repeat following for all matches, add when database ready
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
                        printPersons(result);
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
                      printPersons(result);
                    }
                    else{
                        alert("No such person employed here!");
                    }
                }
            });
        }

    }
});

/*function printPersons(result) {
  result.forEach(function(item) {

    var wrapperDiv = document.createElement("div");
    $(wrapperDiv).attr("class", "expandbox");

    var infoDiv = document.createElement("div");
    $(infoDiv).attr("class", "info");
    $(wrapperDiv).append(infoDiv);

    var previewDiv = document.createElement("div");
    $(previewDiv).attr("class", "preview");
    $(infoDiv).append(previewDiv);

    var workerName = document.createElement("h1");
    $(workerName).attr("class", "worker-name");
    $(workerName).html(item.firstName + " " + item.lastName);
    $(previewDiv).append(workerName);

    var phoneId = document.createElement("p");
    $(phoneId).html("MAC: " + item.mac);
    $(previewDiv).append(phoneId);

    var detailDiv = document.createElement("div");
    $(detailDiv).attr("class", "details");
    $(infoDiv).append(detailDiv);

    var moreDiv = document.createElement("div");
    $(moreDiv).attr("class", "more-info more-real-time");

    var arrowDiv = document.createElement("div");
    $(arrowDiv).attr("class", "arrow");
    $(moreDiv).append(arrowDiv);
    $(wrapperDiv).append(moreDiv);

    $(".result").append(wrapperDiv);

  });
}*/
/*
draws a linear graph,
data: array with data,
sensor: which sensor from data it should show,
gArea: which div to draw the graph in.
 */
  function makeLineGraphArray(data, sensor, gArea){
      var defaults = {
          A:{
              min: 29,
              max: 40
          },
          B:{
              min: -20,
              max: 160
          },
          C: {
              min: 40,
              max: 160
          },
          D:{
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

  return {makeLineGraphArray: makeLineGraphArray};
}(d3);
