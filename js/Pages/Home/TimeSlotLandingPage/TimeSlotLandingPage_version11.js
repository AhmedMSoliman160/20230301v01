let _EmailPattern = /^\b[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b$/i
let _PhonePattern = /([0-9]{10})|(\([0-9]{3}\)\s+[0-9]{3}\-[0-9]{4})/
const links = document.querySelectorAll("#links-container a");
const toggleBtn = document.getElementById("load-more");
const defaultVisible = 7;
let showingAll = false;

$(document).ready(function () {
    updateLinks(false)

    toggleBtn.addEventListener("click", () => {
        showingAll = !showingAll;
        updateLinks(showingAll);
    })

    window.addEventListener("resize", () => {
        updateLinks(showingAll);
    })

    document.addEventListener('click', function (e) {
        if (e.target.closest('.password-toggle')) {
            const toggle = e.target.closest('.password-toggle');
            const input = toggle.previousElementSibling;
            const icon = toggle.querySelector('.password-icon');

            if (input.type === 'password') {
                input.type = 'text';
                icon.innerHTML = '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>';
            } else {
                input.type = 'password';
                icon.innerHTML = '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>';
            }
        }
    })

    document.addEventListener('focus', function (e) {
        if (e.target.classList.contains('form-input')) {
            e.target.parentElement.classList.add('focused');
        }
    }, true)

    document.addEventListener('blur', function (e) {
        if (e.target.classList.contains('form-input')) {
            e.target.parentElement.classList.remove('focused');
        }
    }, true)

    $("#modal-SignUp").on('hide.bs.modal', function () {
        $("#modal-SignUp").find("input[type='text'],input[type='password'],input[type='tel']").val('')
    })

    $(".timeslot").on('click', function (e) {
        debugger
        var SessionId = $(this).attr('attr-SessionId')
        var MainCategoryId = $(this).attr('attr-Cat')
        if (IsSignedInUser) {
            $(".loader-overlay").addClass('loader-Displayed')
            window.location.href = "/ar/payment/" + parseInt(SessionId) + "/session?cat=" + parseInt(MainCategoryId)
        }
        else {
            $("#hdnSessionId").val(SessionId)
            $("#hdnCatId").val(MainCategoryId)
            $("#modal-SignUp").modal('show')
        }
    })

    $("#signupForm").on("submit", function (e) {
        e.preventDefault()
        $("div.loader").show()
        grecaptcha.ready(function () {
            grecaptcha.execute('6LcZkfAeAAAAAPRkqHEOavi3gjCX-Vt4qCuobuRN', { action: 'submit' }).then(function (token) {
                var Obje = $("#signupForm").serializeJSON()
                Obje.ConfirmPassword = Obje.Password
                Obje.Token = token
                $.ajax({
                    async: false,
                    type: 'POST',
                    url: '/LPSignUp',
                    data: { client: Obje },
                    beforeSend: function (e) {
                        e.setRequestHeader("RequestVerificationToken", $('#signupForm input[name="__RequestVerificationToken"]').val());
                        $("div.loader").show()
                    },
                    success: function (response) {
                        $("div.loader").hide()
                        if (response.isSuccess == false) {
                            $.toaster({ priority: 'danger', title: 'بيانات خاطئة', message: response.errorMsg });
                            return false
                        }
                        $(".loader-overlay").addClass('loader-Displayed')
                        window.location.href = "/ar/payment/" + parseInt($("#hdnSessionId").val()) + "/session?cat=" + parseInt($("#hdnCatId").val())
                    },
                    error: function (e) {
                        $("div.loader").hide()
                    }
                })
            })
        });
    })

    $("#signInForm").on("submit", function (e) {
        e.preventDefault()
        $(".loader").show()
        //$("div.loader").show()
        var SignInObj = {
            Email: "",
            Phone: "",
            Password: $("#txtSignInPassword").val()
        }
        var Email_Phone = $("#txtSignInEmail_Phone").val()
        SignInObj.Email = Email_Phone
        SignInObj.Phone = Email_Phone
        grecaptcha.ready(function () {
            grecaptcha.execute('6LcZkfAeAAAAAPRkqHEOavi3gjCX-Vt4qCuobuRN', { action: 'submit' }).then(function (token) {
                SignInObj.Token = token
                $.ajax({
                    async: false,
                    type: 'POST',
                    url: '/ar/SignIn',
                    data: { signInViewModel: SignInObj },
                    beforeSend: function (e) {
                        e.setRequestHeader("RequestVerificationToken", $('#signInForm input[name="__RequestVerificationToken"]').val());
                    },
                    success: function (response) {
                        $(".loader").hide()
                        if (response != null && response != undefined && response.result == 'Success') {
                            if ($("#hdnSessionId").val() == '') {
                                $("#btnHdrSignup").hide()
                                $(".loader").hide()
                                $("#modal-SignUp").modal('hide')
                                return
                            }
                            else {
                                $(".loader-overlay").addClass('loader-Displayed')
                                window.location.href = "/ar/payment/" + parseInt($("#hdnSessionId").val()) + "/session?cat=" + parseInt($("#hdnCatId").val())
                                return;
                            }
                        }
                        else {
                            var message = _EmailPattern.test(Email_Phone) ? "كلمة السر غير صحيحة او البريد الإلكتروني غير صحيح"
                                : "كلمة السر غير صحيحة او الموبايل غير صحيح"
                            $.toaster({ priority: 'danger', title: 'بيانات خاطئة', message: message });
                            $(".loader").hide()
                            return false
                        }
                    },
                    error: function (e) {
                        $("div.loader").hide()
                    }
                })
            })
        })
    })

    $(document).on('shown.bs.modal', function (e) {
        const modal = $(e.target);
        const id = modal.attr('id');
        if (id && id.startsWith("Exp_")) {
            $("#" + modal.attr("data-attr-StartupTab")).click()
        }
    });
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

function isMobile() {
    return window.innerWidth <= 768;
}

function updateLinks(showAll) {
    if (isMobile()) {
        links.forEach((link, index) => {
            if (showAll || index < defaultVisible) link.classList.add("show");
            else link.classList.remove("show");
        });
        toggleBtn.textContent = showAll ? "عرض أقل" : "عرض المزيد";
        toggleBtn.style.display = "block";
    } else {
        links.forEach(link => link.classList.add("show"));
        toggleBtn.style.display = "none";
    }
}

function flipForm() {
    const container = document.getElementById('formContainer');
    container.classList.toggle('flipped');
}