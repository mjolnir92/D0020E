

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
                    var strings = {
                        A: 'heartrate',
                        B: 'CO',
                        C: 'temperature',
                        D: 'battery'
                    };

                    var html = '';
                    var last = data[ data.length - 1 ];

                    for ( key in last ) {
                        if (  key !== 'T' && key !== 'L' ){
                            var tempObj = {
                                sensorKey: key,
                                sensorType: strings[ key ],
                                data: last[ key ]
                            };
                            html += template( tempObj );
                        }
                    }

                    details.html( html );
                    $('.expand-details').bind( 'click', function( event, ui ) {
                        var $info = $(this).parent();
                        var $arrow = $(this).children( '.arrow');
                        var $graphArea = $(this).siblings('.details').children('.graph-area');
                        var sensorKey = $(this).attr('data-key');

                        if( $graphArea.children().length == 0 ){

                            realTime.makeLineGraphArray( data, sensorKey, $graphArea );
                            $info.addClass( 'maximized' );
                            $arrow.addClass('rotated');

                        } else {

                            $graphArea.html( '' );
                            $info.removeClass("maximized");
                            $arrow.removeClass("rotated");

                        }
                    } );

                    info.addClass("maximized");
                    arrow.addClass("rotated");

                }
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
