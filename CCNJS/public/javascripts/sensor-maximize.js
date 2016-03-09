

$(document).ready( function() {



    //Expands expandbox:s when '.more-info' is clicked on real time page.
    $(".users-info").on("click", function () {

        var expandbox   = $(this).parent().parent();
        var info        = $(this).parent();
        var arrow       = info.find(".arrow");
        var details     = info.children(".details");
        var mac         = $(this).attr( 'data-id' );

        if(expandbox.hasClass("expandbox") && details.children().length == 0){

            $.ajax({
                type: "POST",
                url: "/getSensorData",
                dataType: 'json',
                data: {
                    mac: mac
                },
                success: function( data ) {

                    var template = Handlebars.templates['sensor.hbs'];

                    var obj = {
                        sensorType: 'heartrate',
                        data: data[0].A
                    };

                    console.log(template(obj));

                    details.html( template( obj ) );
                    info.addClass("maximized");
                    arrow.addClass("rotated");

                },
            });

        } else {

            if(details.find(".sensor").length > 0)
                details.empty();

            info.removeClass("maximized");
            arrow.removeClass("rotated");

        }

    });


    /**
     * Minimize if click outside expandbox
     */
    $(document).on('click', function(event) {

        if (!$(event.target).closest('.expandbox').length)
            minimizeAllExpandbox();

    });


    /**
     * Minimize if ESC i pressed
     */
    $(document).keyup(function(e) {

        if (e.keyCode == 27)
            minimizeAllExpandbox();

    });

    /**
     * Minimizes all expandboxes recursively
     */
    function minimizeAllExpandbox(){
        var info = $(".result").find(".maximized");
        var details = info.children(".details");

        if(info.hasClass("maximized")){

            if(details.find(".sensor").length > 0)
                details.empty();

            info.removeClass("maximized");
            $(".result").find(".arrow").removeClass("rotated");
        }
    }








});
