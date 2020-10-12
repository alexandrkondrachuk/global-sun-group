import './scss/index.scss';
import { Swiper, Navigation, Autoplay, Pagination } from 'swiper';
import { CountUp } from 'countup.js';
// Navbar

jQuery(document).ready(function () {

    const mobileBreakpoint = 992;

    // 1. - Navbar hover effect

    function setNavbarHoverEffect(mobileBreakpoint = 992) {
        if ((jQuery(window).width() >= mobileBreakpoint)) {
            /** Dropdown on hover */
            jQuery(".nav-link.dropdown-toggle").hover(function () {
                // Open up the dropdown
                jQuery(this).removeAttr('data-toggle'); // remove the data-toggle attribute so we can click and follow link
                jQuery(this).parent().addClass('show'); // add the class show to the li parent
                jQuery(this).next().addClass('show'); // add the class show to the dropdown div sibling
            }, function () {
                // on mouseout check to see if hovering over the dropdown or the link still
                const isDropdownHovered = jQuery(this).next().filter(":hover").length; // check the dropdown for hover - returns true of false
                const isThisHovered = jQuery(this).filter(":hover").length;  // check the top level item for hover
                if (isDropdownHovered || isThisHovered) {
                    // still hovering over the link or the dropdown
                } else {
                    // no longer hovering over either - lets remove the 'show' classes
                    jQuery(this).attr('data-toggle', 'dropdown'); // put back the data-toggle attr
                    jQuery(this).parent().removeClass('show');
                    jQuery(this).next().removeClass('show');
                }
            });
// Check the dropdown on hover
            jQuery(".dropdown-menu").hover(function () {
            }, function () {
                const isDropdownHovered = jQuery(this).prev().filter(":hover").length; // check the dropdown for hover - returns true of false
                const isThisHovered = jQuery(this).filter(":hover").length;  // check the top level item for hover
                if (isDropdownHovered || isThisHovered) {
                    // do nothing - hovering over the dropdown of the top level link
                } else {
                    // get rid of the classes showing it
                    jQuery(this).parent().removeClass('show');
                    jQuery(this).removeClass('show');
                }
            });
        }
    }

    // 2. - Navbar remove sticky effect for mobile

    function navbarRemoveSticky(mobileBreakpoint = 992, navbarId = '#main-navbar') {
        if ((jQuery(window).width() <= mobileBreakpoint)) {
            let mainNavbar = jQuery(navbarId);
            if (mainNavbar[0]) {
                jQuery(mainNavbar[0]).removeClass('fixed-top');
            }
        }
    }

    // 3. Init navbar

    function initNavbar() {
        setNavbarHoverEffect(mobileBreakpoint);
        // navbarRemoveSticky(mobileBreakpoint);
    }

    initNavbar();

    // 4. Init navbar if window change width

    jQuery(window).resize(function () {
        initNavbar();
    });

    // 5. Enable tooltips
    jQuery('[data-toggle="tooltip"]').tooltip();

    // 6. Power Plants Carousel
    // @todo Get data from the server
    function initSwiper() {
        Swiper.use([Navigation, Autoplay, Pagination]);

        const swiper = new Swiper('.swiper-container', {
            slidesPerView: 3,
            spaceBetween: 30,
            slidesPerGroup: 1,
            autoplay: {
                delay: 3000,
            },
            loop: true,
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            breakpoints: {
                // when window width is >= 320px
                320: {
                    slidesPerView: 1,
                    spaceBetween: 10
                },
                // when window width is >= 480px
                768: {
                    slidesPerView: 2,
                    spaceBetween: 10
                },
                // when window width is >= 640px
                992: {
                    slidesPerView: 3,
                    spaceBetween: 15
                }
            }
        });
    }

    // 7. Statistic counters
    // @todo start on scroll, get data from the server
    function initCounters() {
        const statisticElement = document.getElementById('power-plants-statistic');
        const offset = 400;
        const options = {
            startVal: 0,
            duration: 4,
            separator: ' ',
        };
        let start = true;
        jQuery(window).scroll(function () {
            if ((jQuery(window).scrollTop() > (statisticElement.offsetTop - offset)) && start) {
                const countersElements = jQuery('.statistic-timer-number');
                jQuery(countersElements).each((idx, el) => {
                    const data = jQuery(el).attr('data-target');
                    const counterInstance = new CountUp(el, data, options);
                    counterInstance.start();
                });
                start = false;
            }
        });
    }

    // 8. To top button
    const btn = jQuery('#button');
    const btnOffset = 300;
    jQuery(window).scroll(function () {
        if (jQuery(window).scrollTop() > btnOffset) {
            btn.addClass('show');
        } else {
            btn.removeClass('show');
        }
    });

    btn.on('click', function (e) {
        e.preventDefault();
        jQuery('html, body').animate({ scrollTop: 0 }, 300);
    });

    // 9. Spinner
    const spinner = document.getElementById('spinner');
    const main = document.querySelector('main');
    if (spinner && main) {
        window.setTimeout(() => {
            jQuery(spinner).fadeOut();
            jQuery(main).fadeIn();
            initSwiper();
            initCounters();
        }, 3000);
    }

    // 10. Navbar class
    const navbarElement = $('#main-navbar');
    jQuery(window).scroll(function () {
        if (jQuery(window).scrollTop() > 135) {
            console.log('add class');
            $(navbarElement).addClass('sticky');
        } else {
            $(navbarElement).removeClass('sticky');
        }
    });

});