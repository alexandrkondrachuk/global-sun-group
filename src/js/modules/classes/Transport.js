import { config } from '../../config';
import * as axios from 'axios';
import * as _ from 'lodash';
import * as qs from 'querystring';

export default class Transport {
    // Get stations info from two servers
    static async getStations() {
        try {
            // Get Stations from the WP REST API
            const wpData = await axios.get(config.urls.contentPostsApiURL, {
                params: {
                    categories: config.api.categories.join(','),
                }
            });
            // Get Stations from the API
            const apiData = await axios.get(config.urls.stationsApiURL);
            // Get Merged Data
            let mergedData = null;
            if (_.get(wpData, 'status') === Transport.STATUS_OK && _.get(apiData, 'status') === Transport.STATUS_OK) {
                const parsedWpData = _.get(wpData, 'data', null);
                const parsedApiData = _.get(apiData, 'data', null);
                if (!parsedWpData || !parsedApiData) return null;

                mergedData = parsedWpData.map((p) => {
                    const apiP = parsedApiData.find((el) => _.get(el, Transport.DATA_ATTR_KEY) === +(_.get(p, Transport.DATA_ATTR_FOREIGN_KEY)));
                    return _.merge(p, apiP);
                });
            }
            return mergedData;
        } catch (err) {
            throw new Error(err);
        }
    }

    // Auth Process to the sun server
    static async doAuth(model = null) {
        try {
            if (!model) return;
            return await axios({
                url: config.urls.authAPIURL,
                method: Transport.AUTH_METHOD,
                headers: Transport.AUTH_HEADERS,
                data: qs.stringify(model)
            });
        } catch (e) {
            throw new Error(e);
        }
    }

    // Get user info
    static async getUserInfo(token = null) {
        if (!token) return;
        try {
            return await axios.get(config.urls.userDataURL, { headers: _.merge(Transport.TOKEN_HEADER, { 'Authorization': `Bearer ${token}` }) });
        } catch (e) {
            throw new Error(e);
        }
    }

    // User registration
    static async registerUser(model = null) {
        if (!model) return;
        try {
            return await axios.post(config.urls.registrationApiURL, model);
        } catch (e) {
            throw new Error(e);
        }
    }
}

Transport.STATUS_OK = 200;
Transport.DATA_ATTR_FOREIGN_KEY = 'acf.power-plant-foreign-id';
Transport.DATA_ATTR_KEY = 'Id';
Transport.AUTH_METHOD = 'POST';
Transport.AUTH_HEADERS = {
    'Content-Type': 'application/x-www-form-urlencoded'
};
Transport.TOKEN_HEADER = {
    'Authorization': 'Bearer '
};