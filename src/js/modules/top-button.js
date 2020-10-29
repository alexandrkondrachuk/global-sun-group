import { config } from '../config';

const { topButton } = config;
const { selector, offset, timeout } = topButton;

class TopButton {
    init() {
        const btn = jQuery(selector);
        jQuery(window).scroll(function () {
            if (jQuery(window).scrollTop() > offset) {
                btn.addClass(TopButton.ACTIVE_CLASS);
            } else {
                btn.removeClass(TopButton.ACTIVE_CLASS);
            }
        });

        btn.on('click', function (e) {
            e.preventDefault();
            jQuery('html, body').animate({ scrollTop: 0 }, timeout);
        });
    }
}

TopButton.ACTIVE_CLASS = 'show';

export default TopButton;