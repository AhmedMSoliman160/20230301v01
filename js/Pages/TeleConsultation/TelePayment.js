$(function () {
    $("#btnContinue").click(function (e) {
        $("#formTeleConsPay").submit()
    })

    $("#formTeleConsPay").submit(function (e) {
        e.preventDefault()
        grecaptcha.ready(function () {
            grecaptcha.execute('6LcZkfAeAAAAAPRkqHEOavi3gjCX-Vt4qCuobuRN', { action: 'submit' }).then(function (token) {
                $.ajax({
                    type: 'POST',
                    url: 'TeleSubscribe',
                    data: {
                        capToken: token,
                    },
                    beforeSend: function (e) {
                        e.setRequestHeader("RequestVerificationToken", $('#formTeleConsPay input[name="__RequestVerificationToken"]').val());
                        $(".loader").show()
                    },
                    success: function (res) {
                        if ((res.message || "").toLocaleLowerCase().trim() == "LoginRedirect".toLocaleLowerCase().trim())
                            window.location.href = 'TeleSubscribeRedirect'
                        else if (!res.isSuccess) {
                            $.toaster({ priority: 'danger', title: '', message: res.message })
                            $(".loader").hide()
                        }
                        else
                            window.location.href = 'TeleCallIntiate'
                    }
                })
            })
        })
    })
})