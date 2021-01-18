import * as scrollTo from 'scroll-to-element';
import { config } from '../config';

const { emitter: emitterFirst, target: targetFirst, options: optionsFirst } = config.scrollToElement;
const { emitter: emitterSecondary, target: targetSecondary, options: optionsSecondary } = config.scrollToElementSecondary;

export default class ScrollToElement {

    scrollToCalculator() {
        const toCalculatorButton = document.querySelector(emitterFirst);
        const toDescriptionButton = document.querySelector(emitterSecondary);

        if (toCalculatorButton) {
            jQuery(toCalculatorButton).on('click', (e) => {
                scrollTo(targetFirst, optionsFirst);
            });
        }

        if (toDescriptionButton) {
            jQuery(toDescriptionButton).on('click', (e) => {
                console.error('description button');
                scrollTo(targetSecondary, optionsSecondary);
            });
        }
    }

    init() {
        this.scrollToCalculator();
    }
}