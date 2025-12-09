    
        const links = document.querySelectorAll("#links-container a");
        const toggleBtn = document.getElementById("load-more");
        const defaultVisible = 7;

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

        let showingAll = false;
        updateLinks(false);

        toggleBtn.addEventListener("click", () => {
            showingAll = !showingAll;
            updateLinks(showingAll);
        });

        window.addEventListener("resize", () => {
            updateLinks(showingAll);
        });



        (function () {
            const containerWrapper = document.querySelector('.testimonial-container-wrapper');
            const container = document.querySelector('.testimonial-container');
            const cards = Array.from(document.querySelectorAll('.testimonial-card'));
            const dotsContainer = document.querySelector('.testimonial-dots');
            const total = cards.length;
            let currentIndex = 0;
            const intervalTime = 4000;
            let interval;

            // Clone cards for seamless infinite scroll
            cards.forEach(card => {
                const clone = card.cloneNode(true);
                clone.classList.add('clone');
                container.appendChild(clone);
            });

            const allCards = Array.from(container.querySelectorAll('.testimonial-card'));

            // Create dots
            for (let i = 0; i < total; i++) {
                const dot = document.createElement('span');
                dot.classList.add('dot');
                if (i === 0) dot.classList.add('active');
                dot.dataset.index = i;
                dotsContainer.appendChild(dot);
                dot.addEventListener('click', () => {
                    clearInterval(interval);
                    currentIndex = parseInt(dot.dataset.index);
                    moveCarousel();
                    startAuto();
                });
            }
            const dots = dotsContainer.querySelectorAll('.dot');

            function moveCarousel() {
                const gap = 20;
                const cardWidth = allCards[0].offsetWidth + gap;

                let cardsToShow = 1;
                if (window.innerWidth > 1024) cardsToShow = 3;
                else if (window.innerWidth > 768) cardsToShow = 1;
                else cardsToShow = 1;

                // Loop without jump
                container.style.transition = 'transform 0.5s ease';
                container.style.transform = `translateX(${currentIndex * cardWidth}px)`;

                // Update dots
                dots.forEach(d => d.classList.remove('active'));
                dots[currentIndex % total].classList.add('active');
            }

            function startAuto() {
                interval = setInterval(() => {
                    currentIndex++;
                    moveCarousel();

                    // Reset without transition for seamless loop
                    const gap = 20;
                    const cardWidth = allCards[0].offsetWidth + gap;
                    const totalCards = allCards.length;

                    if (currentIndex >= total) {
                        setTimeout(() => {
                            container.style.transition = 'none';
                            currentIndex = 0;
                            container.style.transform = `translateX(${currentIndex * cardWidth}px)`;
                        }, 500); // بعد انتهاء transition
                    }
                }, intervalTime);
            }

            window.addEventListener('resize', moveCarousel);

            // init
            moveCarousel();
            startAuto();
        })();

        $(window).on("load", function () {
            setTimeout(function () {
                $("#chat-box").css("display", "flex").hide().fadeIn(500);
                $(".messages-content").mCustomScrollbar();
                startTyping();
            }, 1500);
        });

        // Simple JS to open existing chat
        $(".open-chat").click(function (e) {
            e.preventDefault();
            // Show chat box
            $("#chat-bubble").fadeOut(200, function () {
                $("#chat-box").css("display", "flex").hide().fadeIn(300);

                // Start the typing/fake message from existing chat code
                if (typeof fakeMessage === "function") {
                    fakeMessage();
                }
            });
        });

        // Close / reopen chat
        $("#chat-close").click(function () {
            $("#chat-box").fadeOut(300, function () {
                $("#chat-bubble").css("display", "flex").hide().fadeIn(300);
            });
        });

        $("#chat-bubble").click(function () {
            $(this).fadeOut(300, function () {
                $("#chat-box").css("display", "flex").hide().fadeIn(300);
            });
        });

        // Current expert
        var currentExpert = { avatar: "https://pic.esaal.me/images/ChatRevamp_DefaultImage.jpg", name: "مساعد خبير اسأل", role: "مساعد خبير اسأل " };
        var fakeIndex = 0;
        var typingTimer = null;
        var Fake = ["كيف يمكنني مساعدتك؟", "يرجي الإنتظار 3 دقائق"];

        // Always refer to the messages container
        function getMessagesContainer() {
            return $(".mCSB_container");
        }

        // Update scrollbar
        function updateScrollbar() {
            $(".messages-content").mCustomScrollbar("update").mCustomScrollbar("scrollTo", "bottom", { scrollInertia: 10, timeout: 0 });
        }

        // Insert personal message
        function insertMessage() {
            var msg = $(".message-input").val().trim();
            if (!msg) return;

            $('<div class="message message-personal"><div class="text">' + msg + '</div></div>')
                .appendTo(getMessagesContainer()).addClass("new");

            $(".message-input").val('');
            updateScrollbar();

            // Trigger bot typing
            startTyping();
        }

        // Bind send events once
        $(".message-submit").off("click").on("click", insertMessage);
        $(window).off("keydown").on("keydown", function (e) {
            if (e.which === 13) { insertMessage(); return false; }
        });

        // Start bot typing
        function startTyping() {
            if ($(".message-input").val() !== "") return;

            if (typingTimer) clearTimeout(typingTimer);
            $(".message.loading").remove();

            var typing = $(
                '<div class="message loading new">' +
                '<figure class="avatar"><img src="' + currentExpert.avatar + '"/></figure>' +
                '<div class="dots"><span></span><span></span><span></span></div>' +
                '</div>'
            );

            typing.appendTo(getMessagesContainer());
            updateScrollbar();

            typingTimer = setTimeout(function () {
                typing.remove();
                $('<div class="message new"><figure class="avatar"><img src="' + currentExpert.avatar + '"/></figure><div class="text">' + Fake[fakeIndex] + '</div></div>')
                    .appendTo(getMessagesContainer()).addClass("new");
                updateScrollbar();
                fakeIndex = (fakeIndex + 1) % Fake.length;
            }, 1500 + Math.random() * 1000);
        }

        // Switch expert
        function switchExpert(avatar, name, role) {
            currentExpert = { avatar, name, role };
            $("#chat-avatar").attr("src", avatar);
            $("#chat-name").text(name);
            $("#chat-role").text(role);
            $("#chat-bubble img").attr("src", avatar);


            getMessagesContainer().empty();
            $(".message.loading").remove();
            fakeIndex = 0;

            startTyping();
        }

        // Swiper slide click (desktop & mobile)
        $(document).ready(function () {
            let startX = 0;

            $(".swiper-wrapper").on("mousedown touchstart", function (e) {
                startX = e.pageX || e.originalEvent.touches[0].pageX;
            });

            $(".swiper-wrapper").on("mouseup touchend", function (e) {
                let endX = e.pageX || (e.originalEvent.changedTouches ? e.originalEvent.changedTouches[0].pageX : startX);
                if (Math.abs(endX - startX) > 10) return;

                const target = document.elementFromPoint(
                    e.pageX || endX,
                    e.pageY || (e.originalEvent.changedTouches ? e.originalEvent.changedTouches[0].pageY : 0)
                );

                const slide = $(target).closest(".swiper-slide");
                if (!slide.length || slide.hasClass("swiper-slide-duplicate")) return;

                // Extract info
                var img = "https://pic.esaal.me/images/ChatRevamp_DefaultImage.jpg";
                var name = "مساعد خبير اسأل";
                var role = "مساعد خبير اسأل";

                switchExpert(img, name, role);

                $("#chat-bubble").fadeOut(200, function () { $("#chat-box").css("display", "flex").hide().fadeIn(200); });
            });
        });
        (function () {
            const slider = document.querySelector(".mySwiper");
            const wrapper = slider.querySelector(".swiper-wrapper");
            const slides = [...wrapper.querySelectorAll(".swiper-slide")];
            const speed = parseFloat(slider.dataset.speed) || 50;

            wrapper.querySelectorAll('[data-clone="true"]').forEach(e => e.remove());

            function computeWidth(nodes) {
                return nodes.reduce((acc, n) => {
                    const cs = getComputedStyle(n);
                    return acc + n.getBoundingClientRect().width + parseFloat(cs.marginLeft) + parseFloat(cs.marginRight);
                }, 0);
            }

            // Clone slides to ensure smooth infinite scroll
            const containerWidth = slider.clientWidth;
            let totalWidth = computeWidth([...wrapper.children]);
            while (totalWidth < containerWidth * 3) {
                slides.forEach(s => {
                    const cl = s.cloneNode(true);
                    cl.setAttribute("data-clone", "true");
                    wrapper.appendChild(cl);
                });
                totalWidth = computeWidth([...wrapper.children]);
            }

            let x = 0;
            let last = performance.now();
            let isDragging = false;
            let pointerStartX = 0;

            // ----- DRAG -----

            function dragStart(clientX) {
                isDragging = true;
                pointerStartX = clientX;
                wrapper.style.cursor = 'grabbing';
            }

            function dragMove(clientX) {
                if (!isDragging) return;
                const dx = clientX - pointerStartX;
                pointerStartX = clientX;
                x += dx; // drag matches rightward auto-scroll
            }

            function dragEnd() {
                isDragging = false;
                wrapper.style.cursor = 'grab';
            }

            // DESKTOP
            wrapper.addEventListener('pointerdown', e => {
                dragStart(e.clientX);
                wrapper.setPointerCapture(e.pointerId);
            });
            wrapper.addEventListener('pointermove', e => dragMove(e.clientX));
            wrapper.addEventListener('pointerup', dragEnd);
            wrapper.addEventListener('pointerleave', dragEnd);

            // MOBILE TOUCH
            wrapper.addEventListener('touchstart', e => dragStart(e.touches[0].clientX), { passive: true });
            wrapper.addEventListener('touchmove', e => {
                dragMove(e.touches[0].clientX);
                e.preventDefault(); // prevent scrolling on mobile
            }, { passive: false });
            wrapper.addEventListener('touchend', dragEnd);

            // ----- ANIMATE -----
            function animate(now) {
                const dt = now - last;
                last = now;

                if (!isDragging) {
                    x += speed * dt / 1000; // auto-scroll right
                }

                // seamless reset
                if (x >= totalWidth / 2) x -= totalWidth / 2;

                wrapper.style.transform = `translate3d(${x}px,0,0)`;
                requestAnimationFrame(animate);
            }

            requestAnimationFrame(animate);

            // ----- RESIZE -----
            window.addEventListener("resize", () => {
                wrapper.querySelectorAll('[data-clone="true"]').forEach(e => e.remove());
                x = 0;
                last = performance.now();
                totalWidth = computeWidth([...wrapper.children]);
                while (totalWidth < slider.clientWidth * 3) {
                    slides.forEach(s => {
                        const cl = s.cloneNode(true);
                        cl.setAttribute("data-clone", "true");
                        wrapper.appendChild(cl);
                    });
                    totalWidth = computeWidth([...wrapper.children]);
                }
            });
        })();
       $(document).ready(function () {

    // Function to show the subscription modal
    function showSubscriptionModal() {
        // Assuming you are using Bootstrap modal
        $("#modal-subscription").modal("show");
    }

    

});

