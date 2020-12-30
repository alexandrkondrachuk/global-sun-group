import { config } from '../config';
import { carousel, counter, form, modal, navigation, scrollToElement, topButton, stations, userInfo } from './index';

export default class Boot {
    start() {
        this.detectIOS();
        jQuery(document).ready(function () {
            const spinner = document.getElementById('spinner');
            const main = document.querySelector('main');
            // 10. User info panel
            userInfo.init();
            setTimeout(() => $("#main-navbar").fadeIn(), config.spinnerTimer + 250);

            if (spinner && main) {
                window.setTimeout(() => {
                    jQuery(spinner).fadeOut();
                    jQuery(main).fadeIn();
                    // 1. Navigation
                    navigation.init();
                    // 2. Carousel
                    carousel.init();
                    // 3. Statistic counter
                    counter.init();
                    // 4. To top button
                    topButton.init();
                    // 5. Forms handling
                    form.init();
                    // 6. Scroll to element
                    scrollToElement.init();
                    // 7. Modals
                    modal.init();
                    // 8. Bootstrap init
                    // 8.1. Enable tooltips
                    jQuery('[data-toggle="tooltip"]').tooltip();
                    // 8.2. Enable collapse
                    jQuery('.collapse').collapse('hide');
                }, config.spinnerTimer);
                // Async methods
                // 9. Stations Generator
                stations.init();
            }
        });
    }

    detectIOS() {
        if (navigator.userAgent.match(/(iPad|iPhone|iPod|Android|Silk)/gi)) {
            const body = document.body;
            body.classList.add('IOS');
        }
    }
}