import Register from './classes/register';
import RegisterSession from './classes/register-session';
import Transport from './classes/Transport';
import { config } from '../config';
import * as _ from 'lodash';
import numeral from 'numeral';

export default class UserInfo {
    init() {
        this.render();
        this.render('session');
    }

    // Render user info
    // @type - local | session
    async render(type = 'local') {
        const Register_ = (type === 'local') ? Register : RegisterSession;
        const lang = config.languages[document.querySelector('html').getAttribute('lang')];
        if (Register_.has(config.store.auth) && Register_.has(config.store.authInfo)) {
            const authInfoModel = Register_.get(config.store.authInfo);
            const access_token = _.get(authInfoModel, 'access_token', null);
            if (!access_token) return;
            const modelResponse = await Transport.getUserInfo(access_token);
            const model = _.get(modelResponse, 'data', null);
            const navbarButtons = $('#navbar-buttons') ? $('#navbar-buttons')[0] : null;
            const userPanel = $('#user-panel') ? $('#user-panel')[0] : null;
            const userLoginElement = $('#user-login') ? $('#user-login')[0] : null;
            const userBalanceElement = $('#user-balance') ? $('#user-balance')[0] : null;
            const logOutButton = $('#log-out-button') ? $('#log-out-button')[0] : null;

            $(navbarButtons).css('display', 'none');
            // Set user info
            if  (userLoginElement && userBalanceElement) {
                $(userLoginElement).text(_.get(model, 'Email', 'user@test.com'));
                $(userBalanceElement).text(numeral(_.get(model, 'Balance', 0)).format(config.numberFormat).replace(config.numberParts[0], config.numberParts[1]));
            }
            // Logout from the cabinet
            if (logOutButton) {
                $(logOutButton).on('click', () => {
                    Register_.remove(config.store.userInfo);
                    Register_.remove(config.store.auth);
                    Register_.remove(config.store.authInfo);
                    if(lang === 'ru') {
                        window.location.replace(config.urls.redirectLogoutRuURL);
                    } else {
                        window.location.replace(config.urls.redirectLogoutEnURL);
                    }
                });
            }
            // Show user info panel
            $(userPanel).show();
        }
    }
}

UserInfo.TYPES = {
    local: 'Register',
    session: 'RegisterSession'
};