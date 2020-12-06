import 'ion-rangeslider';
import { config } from '../config';
import * as _ from 'lodash';
import moment from 'moment';
import Transport from './classes/Transport';
import Register from './classes/register';
import RegisterSession from './classes/register-session';

const { selector, options } = config.rangeSlider;
const { selectors } = config.forms;
const investFormModel = {
    value: options.from,
    power: 0,
    payment: 0,
    roi: 0,
    endInvestment: null,
};
const loginFormModel = {
    username: '',
    password: '',
    grant_type: 'password',
    save: true,
    show: false,
};
let userInfoModel = {
    BTCAddress: '',
    Balance: 0,
    BirthDate: null,
    Email: '',
    FirstName: '',
    LastName: '',
    PhoneNumber: '',
    Sex: 1,
};

export default class Form {
    // Invest Form Handlers
    handleInvestmentForm() {
        jQuery(selectors.investment).on('submit', (e) => {
            e.preventDefault();
            const cache = window[config.cache];
            const amountElement = $('#power') || $('#power')[0];
            const paymentElement = $('#payment') || $('#payment')[0];
            const roiElement = $('#roi') || $('#roi')[0];
            const endInvestmentsElement = $('#endInvestment') || $('#endInvestment')[0];

            if (cache && amountElement && paymentElement && roiElement && endInvestmentsElement) {
                const last = (Array.isArray(cache) && cache.length > 0) ? cache[0] : null;
                if (!last) return;

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

    // Login Form Handlers
    handleLoginFormInputs() {
        const loginField = $('#login') ? $('#login')[0] : null;
        const passwordField = $('#password') ? $('#password')[0] : null;
        const saveField = $('#save') ? $('#save')[0] : null;
        const visibilityElement = $('#visibility') ? $('#visibility')[0] : null;
        const submitButton = $('#login-submit') ? $('#login-submit')[0] : null;
        const isReadyElements = !!(loginField) && !!(passwordField) && !!(saveField) && !!(visibilityElement) && !!(submitButton);

        // Check auth info in store
        this.setAuthData('local', loginField, passwordField, loginFormModel);
        this.setAuthData('session', loginField, passwordField, loginFormModel);

        if (isReadyElements) {
            $(loginField).on('input', (e) => {
                const value = _.get(e, 'target.value', '');
                _.set(loginFormModel, 'username', value);
            });
            $(passwordField).on('input', (e) => {
                const value = _.get(e, 'target.value', '');
                _.set(loginFormModel, 'password', value);
            });
            $(saveField).on('change', (e) => {
                const value = _.get(e, 'target.checked', '');
                _.set(loginFormModel, 'save', value);
            });
            $(visibilityElement).on('click', (e) => {
                const value = !(_.get(loginFormModel, 'show'));
                if (value) {
                    $(visibilityElement).addClass('active');
                    $(passwordField).attr('type', 'text');
                } else {
                    $(visibilityElement).removeClass('active');
                    $(passwordField).attr('type', 'password');
                }
                _.set(loginFormModel, 'show', value);
            });
        }
    }

    handleLoginForm() {
        jQuery(selectors.login).on('submit', async (e) => {
            e.preventDefault();
            const submitButton = $('#login-submit') ? $('#login-submit')[0] : null;
            const loginError = $('#login-error') ? $('#login-error')[0] : null;
            const navbarButtons = $('#navbar-buttons') ? $('#navbar-buttons')[0] : null;
            const userPanel = $('#user-panel') ? $('#user-panel')[0] : null;
            // Disable Submit button
            if (submitButton) {
                $(submitButton).attr('disabled', 'disabled');
            }
            try {
                // Auth process
                const auth = await Transport.doAuth(loginFormModel);
                const authInfo = _.get(auth, 'data', null);
                const authStatus = _.get(auth, 'status', 404);
                const isSave = _.get(loginFormModel, 'save', false);

                if (authInfo && authStatus === Transport.STATUS_OK) {
                    if (loginError) {
                        $(loginError).fadeOut();
                    }
                    // Save Auth info to local storage or session storage
                    if (isSave) {
                        Register.set(config.store.auth, loginFormModel);
                        Register.set(config.store.authInfo, authInfo);
                    } else {
                        RegisterSession.set(config.store.auth, loginFormModel);
                        RegisterSession.set(config.store.authInfo, authInfo);
                    }
                    // Get user info and handle it
                    const userInfo = await Transport.getUserInfo(_.get(authInfo, 'access_token'));
                    const userInfoStatus = _.get(userInfo, 'status', 404);
                    const userInfoData = _.get(userInfo, 'data', null);
                    // Work with DOM
                    const userLoginElement = $('#user-login') ? $('#user-login')[0] : null;
                    const userBalanceElement = $('#user-balance') ? $('#user-balance')[0] : null;
                    if (userInfoStatus === Transport.STATUS_OK && userInfoData) {
                        userInfoModel = _.merge(userInfoModel, userInfoData);
                        if (isSave) {
                            Register.set(config.store.userInfo, userInfoModel);
                        } else {
                            RegisterSession.set(config.store.userInfo, userInfoModel);
                        }
                        // Set user info
                        if (userLoginElement && userBalanceElement) {
                            $(userLoginElement).text(_.get(userInfoModel, 'Email', 'user@test.com'));
                            $(userBalanceElement).text(_.get(userInfoModel, 'Balance', 0));
                        }
                    }
                    // Show user info panel
                    if (navbarButtons && userPanel) {
                        $(navbarButtons).fadeOut('slow', function () {
                            $(userPanel).fadeIn('slow');
                            // Redirect after login
                            _.delay(() => window.location.replace(config.urls.redirectLoginURL), config.loginRedirectDelay);
                        });
                    }
                }
            } catch (err) {
                if (submitButton && loginError) {
                    $(submitButton).removeAttr('disabled');
                    $(loginError).fadeIn();
                }
                throw new Error(err);
            }
        });
    }

    handleRegistrationForm() {
        jQuery(selectors.registration).on('submit', (e) => {
            e.preventDefault();
        });
    }

    setAuthData(type = 'local', loginField, passwordField, loginFormModel) {
        const Register_ = (type === 'local') ? Register : RegisterSession;
        if (Register_.has(config.store.auth)) {
            const auth = Register_.get(config.store.auth);
            const username = _.get(auth, 'username');
            const password = _.get(auth, 'password');
            $(loginField).val(username);
            $(passwordField).val(password);
            _.set(loginFormModel, 'username', username);
            _.set(loginFormModel, 'password', password);
        }
    }

    init() {
        // Forms
        // 1. Investment form
        this.handleInvestmentInputs();
        this.handleInvestmentForm();
        // 2. Contacts form
        this.handleContactsForm();
        // 3. Login form
        this.handleLoginFormInputs();
        this.handleLoginForm();
        // 4. Registration form
        this.handleRegistrationForm();
    }
}