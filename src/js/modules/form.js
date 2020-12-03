import 'ion-rangeslider';
import { config } from '../config';
import * as _ from 'lodash';
import moment from 'moment';

const { selector, options } = config.rangeSlider;
const { selectors } = config.forms;
const investFormModel = {
    value: options.from,
    power: 0,
    payment: 0,
    roi: 0,
    endInvestment: null,
};
export default class Form {

    handleInvestmentForm() {
        jQuery(selectors.investment).on('submit', (e) => {
            e.preventDefault();
            const cache = window[config.cache];
            const amountElement = $('#power') || $('#power')[0];
            const paymentElement =  $('#payment') || $('#payment')[0];
            const roiElement = $('#roi') || $('#roi')[0];
            const endInvestmentsElement = $('#endInvestment') || $('#endInvestment')[0];

            if (cache && amountElement && paymentElement && roiElement && endInvestmentsElement) {
                const last = (Array.isArray(cache) && cache.length > 0) ? cache[0] : null;
                if (!last) return;
                console.log('station data: ', last);
                const powerAmount = investFormModel.value / _.get(last, 'PricePerKW', 0);
                const payoutAmount = powerAmount * _.get(last, 'PaymentPerKW', 0);
                const roi = _.get(last, 'Roi', 0);
                const endInvestmentDate = _.get(last, 'EndInvestmentDate');

                $(amountElement).val(String((powerAmount).toFixed(config.precision)));
                $(paymentElement).val(String((payoutAmount).toFixed(config.precision)));
                $(roiElement).val(String(roi));
                $(endInvestmentsElement).val(moment(endInvestmentDate).format(config.dateFormat));
            }
        });
    }

    handleInvestmentInputs() {
        const amountInputSelector = '#amount';
        const amountElement = jQuery(amountInputSelector);
        const drsElement = jQuery(selector);
        let drsInstance = null;

        if (jQuery(drsElement)) {
            drsElement.ionRangeSlider(options);
            drsInstance = jQuery(selector).data("ionRangeSlider");
        }

        if (amountElement && drsInstance) {
            jQuery(amountElement).val(investFormModel.value);
            jQuery(amountElement).on('input', function (e) {
                const { value } = e.target;
                if ((+value >= options.min) && (+value <= options.max) && (!isNaN(+value))) {
                    investFormModel.value = value;
                    drsInstance.update({ ...options, from: value });
                } else {
                    jQuery(amountElement).val(options.max);
                    drsInstance.update({ ...options, from: options.max });
                }
            });
            jQuery(drsElement).on('change', function () {
                const $inp = jQuery(this);
                const from2 = $inp.data('from'); // reading input data-from attribute
                jQuery(amountElement).val(from2);
                investFormModel.value = from2;
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