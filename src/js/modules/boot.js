import { carousel, counter, form, modal, navigation, scrollToElement, topButton } from './index';

export default class Boot {
    start() {
        jQuery(document).ready(function () {
            const spinner = document.getElementById('spinner');
            const main = document.querySelector('main');
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
                }, 1000);
            }
        });
    }
}