new WOW().init();
$( document ).ready(function() {


var weight, height, gender;
var BMI, range;
var page = 1;




$(".male").click(function () {
	gender = "male";
	$(".male").addClass("genderClicked");
	$(".female").removeClass("genderClicked");
});

$(".female").click(function () {
	gender = "female";
	$(".female").addClass("genderClicked");
	$(".male").removeClass("genderClicked");
});

$(".calculateBtn").click(function () {
        height = $(".heightInput").val();
        weight = $(".weightInput").val();
        if (gender && height && weight && page == 1) {
		$(".screen_2").css("left", "0%");
		$(".screen_1").css("right", "100%");
		BMI = weight / ((height / 100) * (height / 100));
		BMI = Math.round(BMI * 10) / 10;
        
		console.log("call function success!");
		if (BMI < 18.5) {
			range = "نقصان في الوزن";
            $('.resultParent').css("background", "#efbac6")
            // $('.resultRange').css({ "text-shadow": "rgb(0 0 0) 3px 2px, rgb(103 92 110) 7px 2px", 'color': '#efbac6' });
            $('.suggestion , .resultRange').css("color", "#efbac6");
			$(".suggestion").text("نقصان الوزن سيؤدي إلي ضعف المناعة ");
            $('.esaaltip').text('تقدر توصل لوزنك المثالي بطريقة صحية مع أفضل خبراء التغذية ');
            

		}else if  (BMI >= 25 && BMI <29.9) {
            range = "زيادة في الوزن";
			$('.resultParent').css("background", "#FCCB28")
			$(".resultRange").css("color", "#FCCB28");
			$('.suggestion , .resultRange').css("color", "#FCCB28");
			$(".suggestion").text("     زيادة الوزن تسبب المشكلات الصحية و النفسية    ");
            $('.esaaltip').text('تقدر توصل لوزنك المثالي بطريقة صحية مع أفضل خبراء التغذية ');
           
        } else if (BMI > 25) {
			range = "سمنة مفرطة";
			$('.resultParent').css("background", "#c93957")
			$(".resultRange").css("color", "#c93957");
			$('.suggestion , .resultRange').css("color", "#c93957");
			$(".suggestion").text("   السمنة المفرطة تؤثر علي جميع وظائف الجسم    ");
            $('.esaaltip').text('تقدر توصل لوزنك المثالي بطريقة صحية مع أفضل خبراء التغذية ');
            
		}
         else if (BMI >= 18.5 && BMI <24.9 ) {
			range = "وزن مثالي";
            $('.resultParent').css("background", "#3fbca1")
			$(".resultRange").css("color", "#3fbca1");
			$('.suggestion , .resultRange').css("color", "#3fbca1");
			$(".suggestion").text("  الوزن المثالي يحتاج دائما للحفاظ عليه ");
            $('.esaaltip').text('تقدر تحافظ علي وزنك المثالي بطريقة صحية مع أفضل خبراء التغذية ');
           
		}


		$(".resultRange").text(range);
		$(".resultBMI").html(BMI +"<small> كجم/م</small>" + "<small><sup>2</sup></small>");     
		// $(".calculateBtn").text("العودة إلي الحاسبة");
		$(".screen_2").css({"bottom": "57px" ,"height": "85%" });
		$(".calculateBtn").css("z-index", "-1");
        setTimeout(function() { 
			$(".calculateBtn").css("z-index", "1");
			$(".calculateBtn").text("العودة إلي الحاسبة");
			$(".screen_2").css({"bottom": "83px" ,"height": "75%" });
            $('.screen_3').css("display", "block");
            }, 5000);
		page = 2;

        // ajax call to collect ehr data and send it to the back end
        /*
            weight - height - gender - bmi - bmi status
         */
            var bmiStatus = "";
            if (BMI < 18.5)
                bmiStatus = 'Underweight';

            if (BMI >= 18.5 && BMI <= 24.9)
                bmiStatus = 'Normal';

            if (BMI >= 25.0 && BMI <= 29.9)
                bmiStatus = 'Overweight';

            if (BMI >= 30.0)
                bmiStatus = 'Obese';

            var info =
            {
                "weight": weight,
                "height": height,
                "gender": gender,
                "bmi": BMI,
                "bmiStatus": bmiStatus,
                "token" : ""
            };


            grecaptcha.ready(function () {
                grecaptcha.execute('6LcZkfAeAAAAAPRkqHEOavi3gjCX-Vt4qCuobuRN', { action: 'submit' }).then(function (token) {
                    info.token = token;
                    var infoJson = JSON.stringify(info);

                    $.ajax({
                        url: "/SaveEHRRecord",
                        type: "POST",
                        contentType: "application/json",
                        data: infoJson,
                        beforeSend: function (e) {
                            e.setRequestHeader("RequestVerificationToken", $('input[name="__RequestVerificationToken"]').val());
                        },
                        success: function (data) {
                        }


                    });

                });
            });


            
    } 
    else {
        $('.title ').text('برجاء التأكد من ادخال جميع البيانات المطلوبة!!  ');
        $(".title").css("color", "rgb(231 69 102)");
		$(".screen_2").css("left", "101%");
		$(".screen_1").css("right", "0%");
		$(".calculateBtn").text("احسب مؤشر كتلة الجسم");
		page = 1;
	}
});
$('.calculateBtn').click (function () {
    $('.screen_3').css("display", "none");  


});
}); 
  