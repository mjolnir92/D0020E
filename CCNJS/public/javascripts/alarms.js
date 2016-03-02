var alarms = function() {
    var allAlarms;
    // get alarms from database and display the data on website. repeat function for all alarms.
    function displayOneAlarm(name, date, info){
        var div = document.createElement("div");
        $(div).attr("class", "alarmDiv container");
        $(div).html(name +"<br>"+ info +"<br>" + date);
        $("#mainDiv").append(div);
    }
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
    $("#alarms_search_field").keyup(function(event){
        if(event.keyCode == 13){
            var name = $("#workers-alarms").val();
            $('.alarmDiv').remove();
            name = name.split(" ");
            allAlarms.forEach(function(item){
                var found = 0;
                name.forEach(function(part){

                    if (item.firstName.toLowerCase().indexOf(part.toLowerCase()) == 0){
                        found+=1;
                        console.log("funkade");
                    }
                    else if (item.lastName.toLowerCase().indexOf(part.toLowerCase()) == 0){
                        found+=1;
                        console.log("funkade");
                    }
                    else {
                        found -=1;
                    }
                });
                if(found > 0){

                    displayOneAlarm(item.firstName+" "+item.lastName, item.time, item.type);
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
                displayOneAlarm(item.firstName+" "+item.lastName, item.time, item.type);
            })
    }});
}();