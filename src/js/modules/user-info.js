import Register from './classes/register';
import RegisterSession from './classes/register-session';
import { config } from '../config';
import * as _ from 'lodash';

export default class UserInfo {
    init() {
        this.render();
        this.render('session');
    }

    // Render user info
    // @type - local | session
    render(type = 'local') {
        const Register_ = (type === 'local') ? Register : RegisterSession;
        if (Register_.has(config.store.auth) && Register_.has(config.store.userInfo)) {
            const userInfoModel = Register_.get(config.store.userInfo);
            const navbarButtons = $('#navbar-buttons') ? $('#navbar-buttons')[0] : null;
            const userPanel = $('#user-panel') ? $('#user-panel')[0] : null;
            const userLoginElement = $('#user-login') ? $('#user-login')[0] : null;
            const userBalanceElement = $('#user-balance') ? $('#user-balance')[0] : null;
            const logOutButton = $('#log-out-button') ? $('#log-out-button')[0] : null;

            $(navbarButtons).css('display', 'none');
            // Set user info
            if  (userLoginElement && userBalanceElement) {
                $(userLoginElement).text(_.get(userInfoModel, 'Email', 'user@test.com'));
                $(userBalanceElement).text(_.get(userInfoModel, 'Balance', 0));
            }
            // Logout from the cabinet
            if (logOutButton) {
                $(logOutButton).on('click', (e) => {
                    Register_.remove(config.store.userInfo);
                    Register_.remove(config.store.auth);
                    Register_.remove(config.store.authInfo);
                    window.location.replace(config.urls.redirectLogoutURL);
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