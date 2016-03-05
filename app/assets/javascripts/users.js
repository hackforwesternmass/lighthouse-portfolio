$(document).on('page:change', function(){

  var studentId = "";

	$("input#user_avatar").change(function(){
  	readURL(this);
	});

  $(".modal-trigger").click(function(){

    studentId = this.dataset.studentId;
    var text = $(".meeting-time-" + studentId)[0].textContent;
    $("#user_meeting_time").val( text );
    $("#user_meeting_time").trigger("change");

  });

  $(".set-meeting-time").click(function(){

    var meetingTime = $("#user_meeting_time").val();

    $.ajax({
      url: "/users/" + studentId,
      dataType: "JSON",
      type: "PATCH",
      data: {user: { meeting_time: meetingTime } },
      success: function(data) {
        $(".meeting-time-" +  studentId)[0].innerText = meetingTime;
      }.bind(this),
      error: function(data) {
        Materialize.toast("Failed to update meeting time.", 3500, "red darken-4");
      }
    });

  });


});
