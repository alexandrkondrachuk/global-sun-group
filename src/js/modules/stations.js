import Transport from './classes/Transport';
import * as _ from 'lodash';
import moment from 'moment';
import { config } from '../config';

export default class Stations {
    async init() {
        try {
            const stations = await Transport.getStations();
            const stationElements = $('.power-plant-column');
            const dataMap = {
                'station-name': 'StationName',
                'station-address': 'Address',
                'station-roi': 'Roi',
                'station-min-power': 'MinPower',
                'station-power-price': 'PricePerKW',
                'station-build-start': 'StartBuildingDate',
                'station-build-end': 'EndBuildingDate',
                'station-investment-end': 'EndInvestmentDate'
            };
            const dateToFormat = ['StartBuildingDate', 'EndBuildingDate', 'EndInvestmentDate'];

            if (stationElements && stationElements.length > 0) {
                $(stationElements).each(function (idx, el) {
                    const activeIndex = +($(el).attr('data-index'));
                    const activeData = stations.find((s) => s.Id === activeIndex);
                    Object.keys(dataMap).forEach((s) => {
                        const target = $(el).find(`[data-target=${s}]`)[0];
                        const targetInfo = _.get(activeData, dataMap[s]);
                        if (!target || !targetInfo) return;
                        if (dateToFormat.includes(dataMap[s])) {
                            $(target).text(moment(targetInfo).format(config.dateFormat));
                        } else {
                            $(target).text(targetInfo);
                        }
                    });
                });
            }
        } catch (err) {
            throw new Error(err);
        }
    }
}