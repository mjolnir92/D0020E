$(".more-info").on("click", function () {
  var sensor     = $(this).parent();
  var sensorInfo = sensor.find(".info");
  var moreInfo  = sensor.find(".more-info");
  var arrow      = sensor.find(".more-info").find(".arrow");
  sensorInfo.toggleClass("maximized");
  arrow.toggleClass("rotated");
});
