import 'ion-rangeslider';
import { config } from '../config';

const { selector, options } = config.rangeSlider;
const { selectors } = config.forms;

export default class Form {

    handleInvestmentForm() {
        jQuery(selectors.investment).on('submit', (e) => {
            e.preventDefault();
        });
    }

    handleInvestmentInputs() {
        const amountInputSelector = '#amount';
        const amountElement = jQuery(amountInputSelector);
        const drsElement = jQuery(selector);
        let drsInstance = null;
        const formModel = {
            value: options.from,
        };

        if (jQuery(drsElement)) {
            drsElement.ionRangeSlider(options);
            drsInstance = jQuery(selector).data("ionRangeSlider");
        }

        if (amountElement && drsInstance) {
            jQuery(amountElement).val(formModel.value);
            jQuery(amountElement).on('input', function (e) {
                const { value } = e.target;
                console.log('input', value);
                if ((+value >= options.min) && (+value <= options.max) && (!isNaN(+value))) {
                    formModel.value = value;
                }
                drsInstance.update({ ...options, from: value });
            });
            jQuery(drsElement).on('change', function () {
                const $inp = jQuery(this);
                const from2 = $inp.data('from'); // reading input data-from attribute
                jQuery(amountElement).val(from2);
            });
        }
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
        // Forms
        // 1. Investment form
        this.handleInvestmentInputs();
        this.handleInvestmentForm();
        // 2. Contacts form
        this.handleContactsForm();
        // 3. Login form
        this.handleLoginForm();
        // 4. Registration form
        this.handleRegistrationForm();
    }
}