var realTime = function(){

  $(".icon").on("click", function () {

    var sensor = $(this).parent().attr("data-id");

    //Server call to get data from sensor (AJAX?)




    //display data in graph
    $('#myModal').modal('toggle');
    $('.modal-title').html(sensor);
    $('.modal-body').html("<p>Graph for "+sensor+"</p>");
  });

  function minimizeNavBar(){
    $("#indexmeny").css('width', "10%");
    $("#mainDiv").css('margin-left', "10%");
    $("#mainDiv").css('width', "90%");
  }

  function maximizeNavBar(){
    $("#indexmeny").css('width', "15%");
    $("#mainDiv").css('margin-left', "15%");
    $("#mainDiv").css('width', "85%");
  }

  return {minimizeNavBar: minimizeNavBar,
        maximizeNavBar: maximizeNavBar};
}();




