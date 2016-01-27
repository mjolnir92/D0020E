$(".icon").on("click", function () {

  var sensor = $(this).parent().attr("data-id");

  //Server call to get data from sensor (AJAX?)




  //display data in graph
  $('#myModal').modal('toggle');
  $('.modal-title').html(sensor);
  $('.modal-body').html("<p>Graph for "+sensor+"</p>");
});
