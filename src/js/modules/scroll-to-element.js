import * as scrollTo from 'scroll-to-element';
import { config } from '../config';

const { emitter, target, options } = config.scrollToElement;

export default class ScrollToElement {

    scrollToCalculator() {
        const toCalculatorButton = document.querySelector(emitter);
        if (toCalculatorButton) {
            jQuery(toCalculatorButton).on('click', (e) => {
                scrollTo(target, options);
            });
        }
    }

    init() {
        this.scrollToCalculator();
    }
}