import 'ion-rangeslider';
import { config } from '../config';
import * as _ from 'lodash';
import moment from 'moment';
import * as validator from 'validator';
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
let registrationModelValidation = {
    Email: (value) => (!validator.isEmpty(value) && validator.isEmail(value)),
    Password: (value) => (!validator.isEmpty(value) && validator.isLength(value, { min: 6, max: 100 })),
    ConfirmPassword: (value) => (!validator.isEmpty(value) && validator.isLength(value, { min: 6, max: 100 })),
    PhoneNumber: (value) => (!validator.isEmpty(value) && validator.isMobilePhone(value)),
    FirstName: (value) => (!validator.isEmpty(value) && validator.isLength(value, { min: 3, max: 100 })),
    LastName: (value) => (!validator.isEmpty(value) && validator.isLength(value, { min: 3, max: 100 })),
};
let errors = {};
let registrationModel = {
    Email: '',
    Password: '',
    ConfirmPassword: '',
    PhoneNumber: '',
    FirstName: '',
    LastName: '',
};

let registrationShowModel = {
    Password: false,
    ConfirmPassword: false,
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
                const main = (Array.isArray(cache) && cache.length > 0) ? cache.find((s) => !!_.get(s, 'IsForMainPage', false)) : null;

                if (!main) return;

                const powerAmount = investFormModel.value / _.get(main, 'PricePerKW', 0);
                const payoutAmount = powerAmount * _.get(main, 'PaymentPerKW', 0);
                const roi = _.get(main, 'Roi', 0);
                const endInvestmentDate = investFormModel.value / payoutAmount;
                $(amountElement).val(String((powerAmount).toFixed(config.precision)));
                $(paymentElement).val(String((payoutAmount).toFixed(config.precision)));
                $(roiElement).val(String(roi));
                $(endInvestmentsElement).val(String(Math.ceil(+endInvestmentDate.toFixed(config.precision))));
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

    // Contact Form Handlers
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
        // Check redirect after registration
        if (RegisterSession.has(config.store.registrationInfo)) {
            const registrationInfo = RegisterSession.get(config.store.registrationInfo);
            const Email = _.get(registrationInfo, 'Email', '');
            const Password = _.get(registrationInfo, 'Password', '');
            $(loginField).val(Email);
            $(passwordField).val(Password);
            _.set(loginFormModel, 'username', Email);
            _.set(loginFormModel, 'password', Password);
        }

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
            const lang = config.languages[document.querySelector('html').getAttribute('lang')];
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
                            if (lang === 'ru') {
                                _.delay(() => window.location.replace(config.urls.redirectLoginRuURL), config.loginRedirectDelay);
                            } else {
                                _.delay(() => window.location.replace(config.urls.redirectLoginEnURL), config.loginRedirectDelay);
                            }
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

    // Register Form Handlers
    handleRegistrationFormInputs() {
        // Handle registration inputs
        Object.keys(registrationModel).forEach((key) => {
            const element = $(`#${key}`)[0];
            if (element) {
                $(element).on('input', (e) => {
                    const name = _.get(e, 'target.name', null);
                    const value = _.get(e, 'target.value', '');
                    if (!name) return;
                    _.set(registrationModel, name, value);
                });
            }
        });
        // Handle password visibility
        const visibilityElements = $('.visibility');
        if (visibilityElements.length > 0) {
            $(visibilityElements).each((idx, element) => {
                const target = $(element);
                target.on('click', (e) => {
                    const dataTarget = target.attr('data-target');
                    const status = _.get(registrationShowModel, dataTarget);
                    _.set(registrationShowModel, dataTarget, !status);

                    target.toggleClass('active');

                    if (_.get(registrationShowModel, dataTarget)) {
                        $(`#${dataTarget}`).attr('type', 'text');
                    } else {
                        $(`#${dataTarget}`).attr('type', 'password');
                    }
                });
            });
        }
    }

    handleRegistrationForm() {
        jQuery(selectors.registration).on('submit', async (e) => {
            e.preventDefault();
            const lang = config.languages[document.querySelector('html').getAttribute('lang')];
            errors = {};
            let isFormValid = false;
            let isPasswordMatch = (_.get(registrationModel, 'Password') === _.get(registrationModel, 'ConfirmPassword'));
            Object.keys(registrationModel).forEach((key) => {
                const isValid = registrationModelValidation[key](registrationModel[key]);
                if (!isValid) {
                    errors[key] = true;
                    $(`#${key}`).addClass('error');
                } else {
                    $(`#${key}`).removeClass('error');
                }
            });
            if(isPasswordMatch) {
                $(`#ConfirmPassword`).removeClass('error');
            } else {
                $(`#ConfirmPassword`).addClass('error');
            }
            isFormValid = ((Object.keys(errors).length === 0) && isPasswordMatch);
            if (isFormValid) {
                $('#register-validation-error').hide();
                $('#register-server-error').hide();
                try {
                    const registration = await Transport.registerUser(registrationModel);
                    const status = _.get(registration, 'status');
                    if (status === Transport.STATUS_OK) {
                        RegisterSession.set(config.store.registrationInfo, registrationModel);
                        if (lang === 'ru') {
                            _.delay(() => window.location.replace(config.urls.redirectRegistrationRu), 100);
                        } else {
                            _.delay(() => window.location.replace(config.urls.redirectRegistrationEn), 100);
                        }
                    }
                } catch(e) {
                    $('#register-server-error').show();
                    throw new Error(e);
                }
            } else {
                $('#register-validation-error').show();
            }
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
        this.handleRegistrationFormInputs();
        this.handleRegistrationForm();
    }
}