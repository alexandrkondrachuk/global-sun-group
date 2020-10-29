import { CountUp } from 'countup.js';
import { config } from '../config';

const { counter } = config;
const { selector, offset, options } = counter;


class Counter {
    init() {
        const statisticElement = document.getElementById(selector);
        let start = true;
        if (!statisticElement) return;
        jQuery(window).scroll(function () {
            if ((jQuery(window).scrollTop() > (statisticElement.offsetTop - offset)) && start) {
                const countersElements = jQuery(Counter.COUNTER_SELECTOR);
                jQuery(countersElements).each((idx, el) => {
                    const data = jQuery(el).attr(Counter.TARGET_ATTR);
                    const counterInstance = new CountUp(el, data, options);
                    counterInstance.start();
                });
                start = false;
            }
        });
    }
}

Counter.COUNTER_SELECTOR = '.statistic-timer-number';
Counter.TARGET_ATTR = 'data-target';

export default Counter;