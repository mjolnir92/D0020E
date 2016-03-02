

$(document).ready( function() {

//Expands expandbox:s when '.more-info' is clicked.
<<<<<<< HEAD
function addListener() {
  $(".more-info").on("click", function () {
    var sensor = $(this).parent();
    var sensorInfo = sensor.children(".info");
    var arrow = $(this).children(".arrow");

    sensorInfo.toggleClass("maximized");
    arrow.toggleClass("rotated");

  });
}
addListener();

=======
    $(".more-info").on("click", function () {

        var sensor = $(this).parent();
        var that = $(this);
        var mac = $(this).attr( 'data-id' );


        $.ajax({
            type: "POST",
            url: "/getSensorData",
            data: {
                mac: mac
            },
            success: function( data ) {

                var template = Handlebars.templates['sensor.hbs'];
                var sensorInfo = sensor.children(".info");
                var arrow = that.children(".arrow");
                var details = that.parent().children(".details");

                var obj = {
                    sensorType: 'hearthrate',
                    data: data[0].A
                };

                details.html( template( obj ) );
                sensorInfo.toggleClass("maximized");
                arrow.toggleClass("rotated");
            },
            dataType: 'json'
        });

    });
>>>>>>> 3cb3d14a933df0caee350a78767f4e8e948fcd51


//Click outside expandbox:s invokes this function. Minimizes all expandbox:s.
    $(document).on('click', function(event) {

        if (!$(event.target).closest('.expandbox').length) {

            var sensorInfo = $(this).find(".maximized");

            if(sensorInfo.hasClass("maximized")){
                sensorInfo.removeClass("maximized");
                $(this).find(".arrow").removeClass("rotated");
            }
        }
    });


//ESC invokes this function. Minimizes all expandbox:s
    $(document).keyup(function(e) {
        if (e.keyCode == 27) {
            var sensorInfo = $(".result").find(".maximized");
            if(sensorInfo.hasClass("maximized")){
                sensorInfo.removeClass("maximized");
                $(this).find(".arrow").removeClass("rotated");
            }
        }
    });

})
