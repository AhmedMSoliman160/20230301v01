$(document).ready(function () {
 
    $('.owl-carouselsteps').owlCarousel({
        rtl: false,
        autoplay: true,
        loop: true,
        dotsEach: true,
        smartSpeed: 800,
        autoplayTimeout: 6000,
		margin: 30,
        responsiveClass: true,
        responsive: {
            0: {
                items: 1,
				nav: true
            },
            768: {
                items: 1,
				nav: true
            },
            1000: {
                items: 1,
                nav: true,
                loop: true,
				margin: 30
            }
        }
    });

});