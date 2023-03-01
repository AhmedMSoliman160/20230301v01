var _IsResend = false
const BundlePhoneField = document.querySelector("#txtPhone");
const BundleErrorMsg = document.querySelector("#BundleErrorMsg")
const BundleIntl = window.intlTelInput(BundlePhoneField, {
    initialCountry: "eg",
    preferredCountries: ["eg", "sa", "us", "ae", "ly"],
    utilsScript:
        "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
});

$(function () {
   
    BundlePhoneField.addEventListener('blur', function () {
        //debugger
        ValidatePhone()
    });
    // Reset on keyup/change event
    BundlePhoneField.addEventListener('change', BundleReset);
    BundlePhoneField.addEventListener('keyup', BundleReset);

    $("#bntResend").click(function () {
        _IsResend = true
        $("#formSendPIN").submit()
    })

    $("#btnCloseVerify").click(function () {
        _IsResend = false
        $("#divActivationCode").modal('hide')
        $("#divSubsc").modal('show')
    })

    $("#formSendPIN").submit(function (e) {
        e.preventDefault()
        var IsValidPh = ValidatePhone()
        if (!IsValidPh)
            return false
        //debugger
        grecaptcha.ready(function () {
            grecaptcha.execute('6LcZkfAeAAAAAPRkqHEOavi3gjCX-Vt4qCuobuRN', { action: 'submit' }).then(function (token) {
                $.ajax({
                    type: 'POST',
                    url: 'TeleSendPin',
                    data: { capToken: token, phone: BundleIntl.getNumber(intlTelInputUtils.numberFormat.E164).replace("+", "") },
                    beforeSend: function (e) {
                        e.setRequestHeader("RequestVerificationToken", $('#signupform input[name="__RequestVerificationToken"]').val());
                        $(".loader").show()
                    },
                    success: function (res) {
                        res = res.generalAPIReturn
                        $(".loader").hide()
                        if (!res.isSuccess) {
                            $.toaster({ priority: 'danger', title: '', message: res.message })
                            return
                        }
                        if (!_IsResend) {
                            $("#divSubsc").modal('hide')
                            $("#divActivationCode input[type='text']").val('')
                            $("#divActivationCode").modal('show')
                            setTimeout(function () {
                                $("#FirstNumberpin").focus()
                            }, 500)
                        }
                    }
                })
            })
        })
    })

    $("#formPinVerify").submit(function (e) {
        e.preventDefault()
        grecaptcha.ready(function () {
            grecaptcha.execute('6LcZkfAeAAAAAPRkqHEOavi3gjCX-Vt4qCuobuRN', { action: 'submit' }).then(function (token) {
                $.ajax({
                    type: 'POST',
                    url: 'TelePinVerify',
                    data: {
                        capToken: token,
                        pin: $("#FirstNumberpin").val() + $("#SecondNumberpin").val() + $("#ThirdNumberpin").val() + $("#FourthNumberpin").val(),
                        subscriptionType: $("#hdnSubType").val()
                    },
                    beforeSend: function (e) {
                        e.setRequestHeader("RequestVerificationToken", $('#formPinVerify input[name="__RequestVerificationToken"]').val());
                        $(".loader").show()
                    },
                    success: function (res) {
                        if (!res.isSuccess) {
                            $.toaster({ priority: 'danger', title: '', message: res.message })
                            $(".loader").hide()
                        }
                        else
                            window.location.href = 'TelePayment'
                    }
                })
            })
        })
    })
})

function Subscribe(type) {
    $("#hdnSubType").val(type)
    $("#divSubsc").modal('show')
}

function BundleReset() {
    //debugger
    BundlePhoneField.classList.remove("error");
    BundleErrorMsg.innerHTML = "";
    BundleErrorMsg.classList.add("hide");
    document.getElementById('txtPhone').setCustomValidity("");
}

function ValidatePhone() {
    BundleReset();
    if (BundlePhoneField.value.trim()) {
        if (BundleIntl.isValidNumber()) {
            document.getElementById('txtPhone').setCustomValidity("");
        } else {
            BundlePhoneField.classList.add("error");
            var errorCode = BundleIntl.getValidationError();
            BundleErrorMsg.innerHTML = errorMap[errorCode];
            BundleErrorMsg.classList.remove("hide");
            document.getElementById('txtPhone').setCustomValidity(errorMap[errorCode]);
            return false
        }
    }
    return true
}