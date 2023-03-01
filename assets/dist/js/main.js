$(".openform").on("click", function () {
    $(this).next(".sub-dropdown").addClass("active-sub");
});

//removes the "active" class to .popup and .popup-content when the "Close" button is clicked
$(".closesub, .navbar-toggler, .dropdown-toggle").on("click", function () {
    $(".sub-dropdown").removeClass("active-sub");
});

$(".opensub").on("click", function () {
    $(this).next(".subsub-dropdown").addClass("active-sub");
});

$(".closesubsub, .navbar-toggler, .dropdown-toggle").on("click", function () {
    $(".subsub-dropdown").removeClass("active-sub");
});

$(".logfn").on("click", function () {
    $(".essalmodal").removeClass("show");
});

$(".parentfiled").on("click", function () {
    $(".subfileds").addClass("active-fields");
});

//removes the "active" class to .popup and .popup-content when the "Close" button is clicked
$("ul.subfileds .dropdown-item").on("click", function () {
    $(".subfileds").removeClass("active-fields");
});

$(".filterbtn").on("click", function () {
    $(".filterside").addClass("active-filter");
});

//removes the "active" class to .popup and .popup-content when the "Close" button is clicked
$(".closefilter").on("click", function () {
    $(".filterside").removeClass("active-filter");
});

$(".filterbtn").on("click", function () {
    $(".alert-notification").addClass("hide-alert");
});

//removes the "active" class to .popup and .popup-content when the "Close" button is clicked
$(".closefilter").on("click", function () {
    $(".alert-notification").removeClass("hide-alert");
});

$(".iq-chat-ui li a").on("click", function () {
    $(".tab-pane.fade").addClass("openchat");
});

//removes the "active" class to .popup and .popup-content when the "Close" button is clicked
$(".closechate").on("click", function () {
    $(".tab-pane.fade").removeClass("openchat");
});

$("a.pluschat").on("click", function () {
    $("#chatbox5").addClass("opennewchat");
});

//removes the "active" class to .popup and .popup-content when the "Close" button is clicked
$(".closenewchat, .iq-chat-ui li a").on("click", function () {
    $("#chatbox5").removeClass("opennewchat");
});

$(".filedselector").on("click", function () {
    $(".tabslid").addClass("showtop");
});

//removes the "active" class to .popup and .popup-content when the "Close" button is clicked
$("ul.find-home li button, ul.subfileds li button.dropdown-item, .nav-essal, a.nav-link").on("click", function () {
    $(".tabslid").removeClass("showtop");
});

$(".filterbtn").on("click", function () {
    $(".ourexperts").addClass("showtop");
});

$(".closefilter").on("click", function () {
    $(".ourexperts").removeClass("showtop");
});

$(".mob-show-details").on("click", function () {
    $(".sessioncard").addClass("show-session");
});

$(".mob-hide-details").on("click", function () {
    $(".sessioncard").removeClass("show-session");
});

$(".dropdown-menu li button").click(function () {
    $(this).parents(".dropdown").find('.btn').html($(this).text() + ' <span class="caret"></span>');
    $(this).parents(".dropdown").find('.btn').val($(this).data('value'));
});

$(".nav-essal ul.navbar-nav li.nav-item a.dropdown-toggle i.easynav").on("click", function () {
    $(".btn-header").addClass("becoo");
});

$("body, .nav-essal ul.navbar-nav li a.nav-link i.closenav, .currencyset, .nav-essal .dropdown-item").on("click", function () {
    $(".btn-header").removeClass("becoo");
});

$(".navbar-dark.nav-essal .navbar-toggler .navbar-toggler-icon").on("click", function () {
    $(".btn-header").addClass("becoo");
});

$(".changedatachange span").on("click", function () {
    $(this).parents(".changedatachange").addClass("show-changes");
});

$(".changedatachange button").on("click", function () {
    $(this).parents(".changedatachange").removeClass("show-changes");
});


// $('ul li:has(ul.child)').addClass('has_child');

function navFunction() {
    var element = document.getElementById("myDIV");
    element.classList.remove("navstart");
}

function changeLangAr() {
    document.documentElement.setAttribute("dir", "rtl")
    getText()
}
function changeLangEn() {
    document.documentElement.setAttribute("dir", "ltr")
    getText()
}

function getText() {
    var node = document.getElementById('text')
}