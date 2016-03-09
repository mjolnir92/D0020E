var alarms = function() {
    var allAlarms;      // holds info on all alarms in database.

/*
  Display the data on website. repeat function for all alarms.
 */
    function makeAlarmBox(name, time, type, id){
        var wrapperDiv = document.createElement("div");
        $(wrapperDiv).attr("class", "expandbox wDiv");
            var infoDiv = document.createElement("div");
            $(infoDiv).attr("class", "info-alarms");
            $(wrapperDiv).append(infoDiv);
                var previewDiv = document.createElement("div");
                $(previewDiv).attr("class", "preview-alarms");
                var previewString = "<h3>Name: "+name+"<br>" +
                    "Type: "+type +"<br>" +
                    "Time: "+time +"</h3>";
                $(previewDiv).html(previewString);
                $(infoDiv).append(previewDiv);
                var detailDiv = document.createElement("div");
                $(detailDiv).attr("class", "details");
                //$(detailDiv).attr("id", id);  //vara med?
                $(infoDiv).append(detailDiv);
            var moreDiv = document.createElement("div");
            $(moreDiv).attr("class", "more-info");
            drawSensorDivs(detailDiv, "A");
            drawSensorDivs(detailDiv, "B");
            drawSensorDivs(detailDiv, "C");
            drawSensorDivs(detailDiv, "D");

            addListenerMoreInfo(id, moreDiv, detailDiv);
                var arrowDiv = document.createElement("div");
                $(arrowDiv).attr("class", "arrow");
                $(moreDiv).append(arrowDiv);
        $(wrapperDiv).append(moreDiv);

        $(".result").append(wrapperDiv);
    }
/*
search for workers with names starting with text in searchfield.
Display those on page.

 */
    $("#search-div").keyup(function(event){
        if(event.keyCode == 13){
            var name = $(this).children(".workers-alarms").val();
            $('.wDiv').remove();
            name = name.split(" ");
            allAlarms.forEach(function(item){
                var found = 0;
                name.forEach(function(part){

                    if (item.firstName.toLowerCase().indexOf(part.toLowerCase()) == 0){
                        found+=1;
                    }
                    else if (item.lastName.toLowerCase().indexOf(part.toLowerCase()) == 0){
                        found+=1;
                    }
                    else {
                        found -=1;
                    }
                });
                if(found > 0){
                    makeAlarmBox(item.firstName+" "+item.lastName, item.time, item.type, item.eventId);
                }
            });
        }
    });


/*
 get all alarms from database.
 Display those on page.
  */
    $.ajax({
        url: "/all_alarms",
        type: "POST",
        dataType: "json",
        success: function(result){
            allAlarms = result;
            console.log(result[0]);
            result.forEach(function(item){
                makeAlarmBox(item.firstName+" "+item.lastName, item.time, item.type, item.eventId);
            });
            //realTime.drawGraphOnClick();
    }});


//Get sensor data to alarms from database, and display it when more info is clicked on alarm.
    function addListenerMoreInfo(eventID, div, detailDiv){
        $(div).click(function(){
            $.ajax({
                url: "/get_alarm_data",
                type: "POST",
                dataType: "json",
                data: {events_eventId: eventID},
                success: function(result){
                    console.log(result);

                    var sensor = $(div).parent();
                    var sensorInfo = sensor.children(".info-alarms");
                    var arrow = $(div).children(".arrow");
                    sensorInfo.toggleClass("maximized");
                    arrow.toggleClass("rotated");
                    var graphMore = $(detailDiv).children(".sensor").children(".more-info");
                    $(graphMore).click(function(){
                        var sensor = $(this).parent();
                        var sensorInfo = sensor.children(".info");
                        var arrow = $(this).children(".arrow");
                        sensorInfo.toggleClass("maximized");
                        arrow.toggleClass("rotated");
                        var sensorId = sensor.attr("data-id");
                        console.log(sensorId);
                        var gArea = $(this).parent().children(".info").children(".details").children(".graph-area");
                        $(gArea).html("");
                        realTime.makeLineGraphArray(result, sensorId, gArea); //gives error
                    });
                }});
        });

    }
/*
creates a box for the sensors in the alarms div "details"
div: where to put the box,
sensor: which sensor is this box for?
 */
    function drawSensorDivs(div, sensor){
        if(sensor == "A"){
            var sensorIcon = "heartrate";
        }
        else if(sensor == "B"){
            var sensorIcon = "temperature";
        }
        else if(sensor == "C"){
            var sensorIcon = "temperature";
        }
        else if(sensor == "D"){
            var sensorIcon = "CO";
        }
        var wrapperDiv = document.createElement("div");
        $(wrapperDiv).attr("class", "expandbox sensor alarm-sensor");
        $(wrapperDiv).attr("data-id", sensor);
            var infoDiv = document.createElement("div");
            $(infoDiv).attr("class", "info");
                var previewDiv = document.createElement("div");
                $(previewDiv).attr("class", "preview");

                $(previewDiv).html();

                    //icon for sensor
                    var iconDiv = document.createElement("div");
                    $(iconDiv).attr("class", "icon");
                        var heartRateDiv = document.createElement("div");
                        $(heartRateDiv).attr("class", sensorIcon);
                    $(iconDiv).append(heartRateDiv);

                    var dataDiv = document.createElement("div");
                    $(dataDiv).attr("class", "data");
                        var mDiv = document.createElement("div");
                        $(mDiv).attr("class", "main"); //TODO make variable for pulse?
                        $(mDiv).html(sensorIcon);
                    $(dataDiv).append(mDiv);

                $(previewDiv).append(iconDiv);
                $(previewDiv).append(dataDiv);

                var detailDiv = document.createElement("div");
                $(detailDiv).attr("class", "details");
                    var graphDiv = document.createElement("div");
                    $(graphDiv).attr("class", "graph-area");

                $(detailDiv).append(graphDiv);
            $(infoDiv).append(previewDiv);
            $(infoDiv).append(detailDiv);
            var moreDiv = document.createElement("div");
            $(moreDiv).attr("class", "more-info");

                var arrowDiv = document.createElement("div");
                $(arrowDiv).attr("class", "arrow");
            $(moreDiv).append(arrowDiv);
        $(wrapperDiv).append(infoDiv);
        $(wrapperDiv).append(moreDiv);

        $(div).append(wrapperDiv);
    }

}();
