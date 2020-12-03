import { config } from '../config';
import * as _ from 'lodash';
import moment from 'moment';
import { Autoplay, Lazy, Navigation, Pagination, Swiper } from 'swiper';
import Transport from './classes/Transport';

const { selector, options } = config.carousel;

export default class Carousel {
    async init() {
        try {
            const mergedData = await Transport.getStations();
            Swiper.use([Navigation, Autoplay, Pagination, Lazy]);

            if (!document.querySelector(selector)) return;

            const swiper = new Swiper(selector, options);
            if (mergedData) {
                window[config.cache] = mergedData;
                mergedData.forEach((slide) => {
                    const s = `
                    <div class="swiper-slide" data-target="power-plant" data-index="${_.get(slide, 'Id')}">
                        <div class="swiper-slide-mark-left">
                            <p><span class="amount">${_.get(slide, 'MinPower')}</span><span class="unit">kWt</span></p>
                        </div>
                        <div class="swiper-slide-mark-right">
                            <p><span class="prefix">roi: </span><span class="amount">${_.get(slide, 'Roi')}</span><span
                                    class="unit">%</span></p>
                        </div>
                        <img data-src="${_.get(slide, 'fimg_url')}" class="swiper-lazy">
                        <div class="swiper-slide-info">
                            <h3><span class="swiper-slide-info-icon icon-place"></span>${_.get(slide, 'Address')}</h3>
                            <h4><span class="swiper-slide-info-icon icon-name"></span>${_.get(slide, 'StationName')}</h4>
                        </div>
                        <div class="swiper-lazy-preloader"></div>
                    </div>
                        `;
                    swiper.appendSlide(s);
                    swiper.update(true);
                });
            }

            // Show Station By Id
            const slides = jQuery('.swiper-slide[data-target="power-plant"]');
            const lang = config.languages[document.querySelector('html').getAttribute('lang')];
            const modalId = config.contentModal[lang];
            const slideModal = jQuery(modalId);

            if (slides && slideModal) {
                jQuery(slides).each(function (idx, element) {
                    const el = jQuery(element);
                    el.on('click', function (e) {
                        const index = el.attr('data-index');
                        const current = mergedData.filter((el) => el.Id === +index)[0];
                        const dataMap = {
                            'pp-name': 'StationName',
                            'pp-address': 'Address',
                            'pp-roi': 'Roi',
                            'pp-min-power': 'MinPower',
                            'pp-price-per-kwt': 'PaymentPerKW',
                            'pp-price': 'PricePerKW',
                            'pp-start-date': 'StartBuildingDate',
                            'pp-end-date': 'EndBuildingDate',
                            'pp-investment-date': 'EndInvestmentDate',
                        };
                        const dateFormat = ['StartBuildingDate', 'EndBuildingDate', 'EndInvestmentDate'];

                        Object.keys(dataMap).forEach((s) => {
                            jQuery(slideModal).find(`[data-value="${s}"]`).each(function (idx, el) {
                                if (dateFormat.includes(dataMap[s])) {
                                    jQuery(el).text(moment(_.get(current, dataMap[s])).format(config.dateFormat));
                                } else {
                                    jQuery(el).text(_.get(current, dataMap[s]));
                                }
                            });
                        });

                        jQuery(modalId).modal('show');
                    });
                });
            }

        } catch (err) {
            throw new Error(err)
        }
    }
}