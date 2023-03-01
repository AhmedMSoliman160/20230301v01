let _EmailPattern = /^\b[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b$/i
let _PhonePattern = /([0-9]{10})|(\([0-9]{3}\)\s+[0-9]{3}\-[0-9]{4})/
$(document).ready(function () {
    //clear inserted data after closing the popup modal
    $("#modal-SignUp").on('hide.bs.modal', function () {
        $("#modal-SignUp").find("input[type='text'],input[type='password'],input[type='tel']").val('')
    })

    //setting  Selected session id  into Hidden field to re-use it again after signup
    $(".timeslot").on('click', function (e) {
        var SessionId = $(this).attr('attr-SessionId')
        var MainCategoryId = $(this).attr('attr-Cat')
        $("#hdnSessionId").val(SessionId)
        $("#hdnCatId").val(MainCategoryId)
    })

    // submit signup Form
    $("#signupForm").on("submit", function (e) {
        e.preventDefault()
        $("div.loader").show()
        var Obje = $("#signupForm").serializeJSON()
        Obje.ConfirmPassword = Obje.Password
        $.ajax({
            async: false,
            type: 'POST',
            url: '/ar/SignUp',
            data: { client: Obje },
            beforeSend: function (e) {
                $("div.loader").show()
            },
            success: function (response) {
                if (response == false) {
                    $.toaster({ priority: 'danger', title: 'بيانات خاطئة', message: "يرجى إدخال بيانات صحيحة!!!" });
                    $("div.loader").hide()
                    return false
                }
                window.location.href = "/ar/payment/" + $("#hdnSessionId").val() + "/session?cat=" + $("#hdnCatId").val()
            },
            error: function (e) {
                $("div.loader").hide()
            }
        })
    })

    //submit SigIn Form
    $("#signInForm").on("submit", function (e) {
        e.preventDefault()
        $("div.loader").show()
        var SignInObj = {
            Email: "",
            Phone: "",
            Password: $("#txtSignInPassword").val()
        }
        var Email_Phone = $("#txtSignInEmail_Phone").val()
        if (_EmailPattern.test(Email_Phone)) // cheching if the inserted value has the email pattern
            SignInObj.Email = Email_Phone
        else
            SignInObj.Phone = Email_Phone
        $.ajax({
            async: false,
            type: 'POST',
            url: '/ar/SignIn',
            data: { signInViewModel: SignInObj },
            beforeSend: function (e) {
                $("div.loader").show()
            },
            success: function (response) {
                if (response == false || response == null) {
                    var message = _EmailPattern.test(Email_Phone) ? "كلمة السر غير صحيحة او البريد الإلكتروني غير صحيح"
                        : "كلمة السر غير صحيحة او الموبايل غير صحيح"
                    $.toaster({ priority: 'danger', title: 'بيانات خاطئة', message: message });
                    $("div.loader").hide()
                    return false
                }
                window.location.href = "/ar/payment/" + $("#hdnSessionId").val() + "/session?cat=" + $("#hdnCatId").val()
            },
            error: function (e) {
                $("div.loader").hide()
            }
        })
    })
})

function checkEmail(element) {
    var $mail = $(element)
    var Mail = $mail.val().trim()
    if (!_EmailPattern.test(Mail)) {
        $mail.get(0).setCustomValidity("يجب إدخال بريد إلكتروني صحيح!!")
        return false
    }
    $.ajax({
        url: "/checkEmailExistance?email=" + Mail,
        async: false,
        success: function (result) {
            $('#mailErrMsg').empty();
            if (result === true)
                $mail.get(0).setCustomValidity("عفوا هذا البريد الإلكتروني مستخدم مسبقا")
            else
                $mail.get(0).setCustomValidity("")
        }
    })
}

function checkPhone(element) {
    var $phone = $(element)
    var Phone = $phone.val().trim();
    if (!_PhonePattern.test(Phone)) {
        $phone.get(0).setCustomValidity("يجب إدخال موبايل صحيح!!")
        return
    }
    $.ajax({
        url: "/checkPhoneExistance?phone=" + Phone,
        async: false,
        success: function (result) {
            $('#phoneErrMsg').empty();
            if (result === true) {
                $phone.get(0).setCustomValidity("عفوا هذا الرقم مستخدم مسبقا")
            }
            else
                $phone.get(0).setCustomValidity("")
        }
    })
}

function checkSignInEmail_Phone(element) {
    var $element = $(element)
    var Value = $element.val().trim()
    if (!_PhonePattern.test(Value) && !_EmailPattern.test(Value)) {
        $element.get(0).setCustomValidity("يجب إدخال موبايل صحيح او بريد إلكتروني صحيح !!")
        return
    }
    $element.get(0).setCustomValidity("")
}