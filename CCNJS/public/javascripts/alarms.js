var alarms = function() {
    // get alarms from database and display the data on website.
    function displayOneAlarm(){
        //sql to get data
        var name = "batman";
        var info = "Fall accident.";
        var infoByEmplyee = "My slingshot broke mid-air.";
        var date = "2019-12-31";
        var div = document.createElement("div");
        $(div).attr("class", "alarmDiv container");
        $(div).html(name +"<br>"+ info +"<br>" + infoByEmplyee +"<br>" + date);
        $("#mainDiv").append(div);
    }
    displayOneAlarm();
    //search for alarms with one person.
    $("#alarms_search_field").keyup(function(event){
        if(event.keyCode == 13){
            var name = $("#workers-alarms").val();
            $("#workers-alarms").val("enter name");
            //filter out alarms associated with that person.
        }
    });
}();