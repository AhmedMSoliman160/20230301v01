let _EmailPattern = /^\b[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b$/i
let _PhonePattern = /([0-9]{10})|(\([0-9]{3}\)\s+[0-9]{3}\-[0-9]{4})/
$(document).ready(function () {
    setTimeout(function () {
        $('#sale').modal('show');
    }, 1000);
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

    // ===== SIGNUP FORM =====
    $("#signupForm").on("submit", function (e) {
        e.preventDefault();
        $(".loader").show();

        grecaptcha.ready(function () {
            grecaptcha.execute('6LcZkfAeAAAAAPRkqHEOavi3gjCX-Vt4qCuobuRN', { action: 'submit' })
                .then(function (token) {
                    var Obje = $("#signupForm").serializeJSON();
                    Obje.ConfirmPassword = Obje.Password;
                    Obje.Token = token;

                    $.ajax({
                        async: false,
                        type: 'POST',
                        url: '/LPSignUp',
                        data: { client: Obje },
                        beforeSend: function (xhr) {
                            xhr.setRequestHeader("RequestVerificationToken", $('#signupForm input[name="__RequestVerificationToken"]').val());
                        },
                        success: function (response) {
                            $(".loader").hide();
                            if (response.result !== "Success") {
                                var message = _EmailPattern.test(Email_Phone)
                                    ? "كلمة السر غير صحيحة او البريد الإلكتروني غير صحيح"
                                    : "كلمة السر غير صحيحة او الموبايل غير صحيح";

                                toastr.error(message);
                                return;
                            }
                            IsSignedInUser = true;
                            $(".loader-overlay").addClass('loader-Displayed');
                            SubscribeNow(BundleId);
                          
                        },
                        error: function (e) {
                            $(".loader").hide();
                        }
                    });
                });
        });
    });

    // ===== SIGNIN FORM =====
    $("#signInForm").on("submit", function (e) {
        e.preventDefault();
        $(".loader").show();

        var SignInObj = {
            Email: $("#txtSignInEmail_Phone").val(),
            Phone: $("#txtSignInEmail_Phone").val(),
            Password: $("#txtSignInPassword").val()
        };

        grecaptcha.ready(function () {
            grecaptcha.execute('6LcZkfAeAAAAAPRkqHEOavi3gjCX-Vt4qCuobuRN', { action: 'submit' })
                .then(function (token) {
                    SignInObj.Token = token;

                    $.ajax({
                        async: false,
                        type: 'POST',
                        url: '/ar/SignIn',
                        data: { signInViewModel: SignInObj },
                        beforeSend: function (xhr) {
                            xhr.setRequestHeader("RequestVerificationToken", $('#signInForm input[name="__RequestVerificationToken"]').val());
                        },
                        success: function (response) {
                            $(".loader").hide();
                            if (response && response.result === 'Success') {
                                IsSignedInUser = true;
                                CheckSubscription(BundleId); // check subscription after sign in
                            } else {
                                var message = _EmailPattern.test(SignInObj.Email)
                                    ? "كلمة السر غير صحيحة او البريد الإلكتروني غير صحيح"
                                    : "كلمة السر غير صحيحة او الموبايل غير صحيح";
                                toastr.error(message);
                            }
                        },
                        error: function (e) {
                            $(".loader").hide();
                        }
                    });
                });
        });
    });

    $(document).on('shown.bs.modal', function (e) {
        const modal = $(e.target);
        const id = modal.attr('id');
        if (id && id.startsWith("Exp_")) {
            $("#" + modal.attr("data-attr-StartupTab")).click()
        }
    });

    document.querySelectorAll('.specialities-btn').forEach(a => {
        a.addEventListener('click', function (e) {
            e.preventDefault()
            const randomScroll = Math.floor(Math.random() * 1000) + 200;
            window.scrollBy({
                top: randomScroll,
                behavior: "smooth"
            })
        })
    })

    $("#sendBtn").on("click", function (e) {
        e.preventDefault();
        showSubscriptionModal();
    });

    $(".message-input").on("keydown", function (e) {
        if (e.key === "Enter") {
            e.preventDefault();
            showSubscriptionModal();
        }
    });
});
  

function showSubscriptionModal() {
    $("#modal-subscription").modal('show');
    $("#modal-SignUp").modal('hide');
}
window.Subscribe = function (id) {
    BundleId = id;

    if (!IsSignedInUser) {
        $("#modal-SignUp").modal('show');
        $("#modal-subscription").modal('hide');
        return;
    }

    CheckSubscription(BundleId);
};
function CheckSubscription(BundleId) {
    $.ajax({
        url: "/ar/IsSubscriber",
        type: "GET",
        dataType: "json",
        success: function (response) {
            if (response.isSubscriber) {
                // Subscriber → redirect to chat
                window.location.href = response.url;
            } else {
                // Not subscriber → redirect to payment/subscription
                $(".loader-overlay").addClass('loader-Displayed');
                SubscribeNow(BundleId);
            }
        },
        error: function (xhr, status, error) {
            console.error("❗ AJAX error:", error);
        }
    });
}
function SubscribeNow(BundleId) {
    var message = getLastUserMessage(); // your chat function
    grecaptcha.ready(function () {
        grecaptcha.execute('6LcZkfAeAAAAAPRkqHEOavi3gjCX-Vt4qCuobuRN', { action: 'submit' })
            .then(function (token) {
                var mtk = $('input[name="__RequestVerificationToken"]').val();

                $.ajax({
                    url: '/ar/SubsciberLPBundle',
                    type: "POST",
                    data: { BundleId: BundleId, Message: message, tk: token },
                    beforeSend: function (request) {
                        request.setRequestHeader("RequestVerificationToken", mtk);
                    },
                    success: function (res) {
                        if (res.message && res.message.trim() !== "") {
                            $("#modal-subscription").modal('hide');
                            $("#chat-close").click();
                            toastr.error(res.message);
                        } else {
                            $("#modal-subscription").modal('hide');
                            $(".loader-overlay").addClass('loader-Displayed');
                            window.location.href = res.redirectToUrl; // redirect to payment
                        }
                    },
                    error: function (e) {
                        $(".loader-overlay").removeClass('loader-Displayed');
                        console.error("❗ SubscribeNow AJAX error:", e);
                    }
                });
            });
    });
}
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
function flipForm() {
    const container = document.getElementById('formContainer');
    container.classList.toggle('flipped');
}
function CopyToClipboard(containerid) {
    var btnCopy = document.getElementById("copy");
    var main = document.getElementById("maincontent");
    // Create a new textarea element and give it id='temp_element'
    var textarea = document.createElement("textarea");
    textarea.id = "temp_element";
    // Optional step to make less noise on the page, if any!
    textarea.style.height = 0;
    // Now append it to your page somewhere, I chose <body>
    document.body.appendChild(textarea);
    // Give our textarea a value of whatever inside the div of id=containerid
    textarea.value = document.getElementById(containerid).innerText;
    // Now copy whatever inside the textarea to clipboard
    var selector = document.querySelector("#temp_element");
    selector.select();
    document.execCommand("copy");
    // Remove the textarea
    document.body.removeChild(textarea);
    // Add copied text after click
    if (document.execCommand("copy")) {
        btnCopy.classList.add("copied");

        var temp = setInterval(function () {
            btnCopy.classList.remove("copied");
            clearInterval(temp);
        }, 600);

    } else {
        console.info("document.execCommand went wrong…");
    }

}
function getLastUserMessage() {
    let lastMsg = $(".mCSB_container .message-personal").last().find(".text").text();
    return lastMsg || null;
}

