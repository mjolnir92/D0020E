

//Expands expandbox:s when '.more-info' is clicked.
$(".more-info").on("click", function () {

  var sensor     = $(this).parent();
  var sensorInfo = sensor.children(".info");
  var arrow      = $(this).children(".arrow");

  sensorInfo.toggleClass("maximized");
  arrow.toggleClass("rotated");

});


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
