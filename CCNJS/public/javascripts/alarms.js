var alarms = function() {
    // get alarms from database and display the data on website. repeat function for all alarms.
    function displayOneAlarm(name, date, info){
        var div = document.createElement("div");
        $(div).attr("class", "alarmDiv container");
        $(div).html(name +"<br>"+ info +"<br>" + date);
        $("#mainDiv").append(div);
    }
    //search for alarms with one person.
    $("#alarms_search_field").keyup(function(event){
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
    });
    $.ajax({
        url: "/all_alarms",
        type: "POST",
        dataType: "json",
        success: function(result){
            console.log(result[0]);
            result.forEach(function(item){
                displayOneAlarm(item.firstName+" "+item.lastName, item.time, item.type);
            })
    }});
}();