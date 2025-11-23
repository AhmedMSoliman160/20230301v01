let _EmailPattern = /^\b[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b$/i
let _PhonePattern = /([0-9]{10})|(\([0-9]{3}\)\s+[0-9]{3}\-[0-9]{4})/
const links = document.querySelectorAll("#links-container a");
const toggleBtn = document.getElementById("load-more");
const defaultVisible = 7;
let showingAll = false;


(function () {
    function setupTwoLineExpand(wrapper) {
        const bio = wrapper.querySelector('.bio');
        const fullText = bio.textContent.trim();
        if (!fullText) return;
        const measurer = document.createElement('div');
        measurer.className = 'measurer';
        document.body.appendChild(measurer);
        const comp = getComputedStyle(wrapper);
        measurer.style.fontSize = comp.fontSize;
        measurer.style.fontFamily = comp.fontFamily;
        measurer.style.lineHeight = comp.lineHeight;
        measurer.style.fontWeight = comp.fontWeight;
        measurer.style.letterSpacing = comp.letterSpacing;
        measurer.style.width = comp.maxWidth || comp.width || wrapper.offsetWidth + 'px';
        measurer.textContent = 'X';
        const singleLineH = Math.ceil(measurer.getBoundingClientRect().height);
        const twoLinesH = singleLineH * 2;
        measurer.textContent = fullText;
        const fullH = Math.ceil(measurer.getBoundingClientRect().height);
        if (fullH <= twoLinesH + 0.5) {
            bio.textContent = fullText;
            document.body.removeChild(measurer);
            return;
        }
        const suffixHtml = '<span class="ellipsis">…</span><a role="button" tabindex="0" class="more-link">عرض المزيد</a>';
        const suffixText = '… عرض المزيد';
        let lo = 0;
        let hi = fullText.length;
        let best = 0;
        function fitsWithLength(len) {
            const candidate = fullText.slice(0, len).replace(/\s+$/, ''); // trim trailing space
            measurer.innerHTML = escapeHtml(candidate) + ' ' + escapeHtml(suffixText);
            const h = Math.ceil(measurer.getBoundingClientRect().height);
            return h <= twoLinesH + 0.5;
        }
        while (lo <= hi) {
            const mid = Math.floor((lo + hi) / 2);
            if (fitsWithLength(mid)) {
                best = mid;
                lo = mid + 1;
            } else {
                hi = mid - 1;
            }
        }
        if (best <= 0) best = Math.max(1, Math.floor(fullText.length * 0.25));
        let displayText = fullText.slice(0, best);
        const lastSpace = displayText.lastIndexOf(' ');
        if (lastSpace > Math.floor(best * 0.6)) {
            displayText = displayText.slice(0, lastSpace);
        }
        bio.innerHTML = escapeHtml(displayText) + ' ' + suffixHtml;
        const moreLink = bio.querySelector('.more-link');
        function expand() {
            wrapper.classList.add('expanded');
            // replace with full text + " Show less"
            bio.innerHTML = escapeHtml(fullText) + ' <a role="button" tabindex="0" class="more-link">عرض أقل</a>';
            bio.querySelector('.more-link').addEventListener('click', collapse);
            bio.querySelector('.more-link').addEventListener('keydown', function (e) {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); collapse(); }
            });
        }
        function collapse() {
            wrapper.classList.remove('expanded');
            bio.innerHTML = escapeHtml(displayText) + ' ' + suffixHtml;
            const newLink = bio.querySelector('.more-link');
            newLink.addEventListener('click', expand);
            newLink.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); expand(); }
            });
        }
        moreLink.addEventListener('click', expand);
        moreLink.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); expand(); }
        });
        document.body.removeChild(measurer);
    }
    function escapeHtml(s) {
        return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }
    document.addEventListener('DOMContentLoaded', function () {
        document.querySelectorAll('.bio-wrapper').forEach(setupTwoLineExpand);
    });
})();

$(document).ready(function () {
    setTimeout(function () {
        $('#sale').modal('show');
    }, 1000);

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