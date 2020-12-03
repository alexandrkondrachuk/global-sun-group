const server = 'http://globalsungroup.com/';
const apiServer = 'http://globalsungroup.com/sunserver/';
const config = {
    spinnerTimer: 2 * 1000,
    cache: 'stationsCache',
    precision: 2,
    urls: {
        serverURL: server,
        contentApiURL: `${server}wp-json/wp/v2/`,
        contentPostsApiURL: `${server}wp-json/wp/v2/posts`,
        stationsApiURL: `${apiServer}api/PowerPlants/`,
        registrationApiURL: `${apiServer}api/Account/Register`,
        authAPIURL: `${apiServer}/Token`,
    },
    api: {
        categories: [45], // WP categories
    },
    languages: {
        'ru-RU': 'ru',
        'en-US': 'en',
    },
    contentModal: {
        'ru': '#powerPlantModal',
        'en': '#powerPlantModalEN',
    },
    dateFormat: 'DD.MM.YYYY',
    mobileBreakpoint: 992,
    carousel: {
        selector: '.swiper-container',
        options: {
            // Disable preloading of all images
            preloadImages: false,
            // Enable lazy loading
            lazy: true,
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
        }
    },
    counter: {
        selector: 'power-plants-statistic',
        offset: 400,
        options: {
            startVal: 0,
            duration: 4,
            separator: ' ',
        },
    },
    topButton: {
        selector: '#button',
        offset: 300,
        timeout: 300,
    },
    rangeSlider: {
        selector: '.js-range-slider',
        options: {
            type: "single",
            grid: false,
            min: 0,
            max: 100000,
            from: 10000,
            to: 800,
            prefix: "$"
        },
    },
    forms: {
        selectors: {
            investment: '#investment-form',
            contacts: '#contacts-form',
            login: '#login-form',
            registration: '#registration-form',
        }
    },
    scrollToElement: {
        emitter: '.btn-first',
        target: '#power-plants-investment-calculator',
        options: {
            offset: -60,
            ease: 'out-circ',
            duration: 1500
        },
    },
    modal: {
        selector: 'button[data-action="fill"]',
        target: '#fillModal',
    }
};

export {
    config,
};