import 'ion-rangeslider';
import { config } from '../config';

const { selector, options } = config.rangeSlider;
const { selectors } = config.forms;

export default class Form {

    setRangeSlider() {
        jQuery(selector).ionRangeSlider(options);
    }

    handleInvestmentForm() {
        jQuery(selectors.investment).on('submit', (e) => {
            e.preventDefault();
        });
    }

    handleContactsForm() {
        jQuery(selectors.contacts).on('submit', (e) => {
            e.preventDefault();
        });
    }

    handleLoginForm() {
        jQuery(selectors.login).on('submit', (e) => {
            e.preventDefault();
        });
    }

    handleRegistrationForm() {
        jQuery(selectors.registration).on('submit', (e) => {
            e.preventDefault();
        });
    }

    init() {
        this.setRangeSlider();
        // Forms
        this.handleInvestmentForm();
        this.handleContactsForm();
        this.handleLoginForm();
        this.handleRegistrationForm();
    }
}