var alarms = function() {
    var allAlarms;


    //search for alarms with one person.
    /*$("#alarms_search_field").keyup(function(event){
        if(event.keyCode == 13){
            var name = $("#workers-alarms").val();
            $.ajax({
                url: "/search_alarms",
                type: "POST",
                dataType: "json",
                data: {firstName: name},
                success: function(result){
                    console.log(result[0]);
                    $('.alarmDiv').remove();
                    displayOneAlarm(name,result[0].time, result[0].type);
            }});
        }
    });*/

// Display the data on website. repeat function for all alarms.
    function makeAlarmBox(name, time, type, id){
        var wrapperDiv = document.createElement("div");
        $(wrapperDiv).attr("class", "expandbox wDiv");
            var infoDiv = document.createElement("div");
            $(infoDiv).attr("class", "info");
            $(wrapperDiv).append(infoDiv);
                var previewDiv = document.createElement("div");
                $(previewDiv).attr("class", "preview");
                var previewString = "Name: "+name+"<br>" +
                    "Type: "+type +"<br>" +
                    "Time: "+time;
                $(previewDiv).html(previewString);
                $(infoDiv).append(previewDiv);
                var detailDiv = document.createElement("div");
                $(detailDiv).attr("class", "details");
                //$(detailDiv).attr("id", id);  //vara med?
                $(infoDiv).append(detailDiv);
            var moreDiv = document.createElement("div");
            $(moreDiv).attr("class", "more-info");
            addListenerMoreInfo(id, moreDiv);

                var arrowDiv = document.createElement("div");
                $(arrowDiv).attr("class", "arrow");
                $(moreDiv).append(arrowDiv);
        $(wrapperDiv).append(moreDiv);

        $("#mainDiv").append(wrapperDiv);
    }

    $("#alarms_search_field").keyup(function(event){
        if(event.keyCode == 13){
            var name = $("#workers-alarms").val();
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
    }});
//Get sensor data to alarms from database, and display it when more info is clicked on alarm.
    function addListenerMoreInfo(eventID, div){
        $(div).click(function(){
            $.ajax({
                url: "/get_alarm_data",
                type: "POST",
                dataType: "json",
                data: {eventId: eventID},
                success: function(result){
                    //console.log(result[0]);
                    var sensor = $(this).parent();
                    var sensorInfo = sensor.children(".info");
                    var arrow = $(this).children(".arrow");
                    sensorInfo.toggleClass("maximized");
                    arrow.toggleClass("rotated");
                    result.forEach(function(item){
                        console.log(item);


                        $(div).parent().children(".info").children(".details").html(item.A); //children(".preview")
                    });
                }});
        });

    }
}();

