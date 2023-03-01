
var no = 1;

$(document).ready(function () {
    $("#subBtn").click(function (e) {
        e.preventDefault();
        var frmValues = $("#frm").serializeJSON();
        var frmData = JSON.stringify(frmValues);

        if (no == 1) {
            no = 2;
            $.ajax({
                url: "/session/lp/save",
                type: "POST",
                contentType: "application/json",
                data: frmData,
                success: function (data) {
                    if (data.isSuccess == true) {
                        window.location.href = data.url;
                    }

                    else if (data.isSuccess == false) {
                        $(".field-validation-error").text("");
                        $("#dataEx").text("phone number or email existed");
                    }

                    else
                        $("#divFrm").html(data);

                },
                complete: function () {
                    no = 1;
                }



            });

        }
        

    });
});