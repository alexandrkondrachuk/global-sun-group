import Register from './classes/register';
import { config } from '../config';
import * as _ from "lodash";

export default class UserInfo {
    init() {
        if (Register.has(config.store.auth) && Register.has(config.store.userInfo)) {
            const userInfoModel = Register.get(config.store.userInfo);
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
                   Register.remove(config.store.userInfo);
                   Register.remove(config.store.auth);
                   Register.remove(config.store.authInfo);
                    window.location.replace(config.urls.redirectLogoutURL);
                });
            }
            // Show user info panel
            $(userPanel).show();
        }
    }
}