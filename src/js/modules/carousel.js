import * as axios from 'axios';
import { config } from '../config';
import { Autoplay, Lazy, Navigation, Pagination, Swiper } from 'swiper';

const { src, selector, options } = config.carousel;

export default class Carousel {
    init() {
        axios.get(src)
            .then((response) => {
                Swiper.use([Navigation, Autoplay, Pagination, Lazy]);

                if (!document.querySelector(selector)) return;

                const swiper = new Swiper(selector, options);
                const { data } = response;
                if (data) {
                    data.forEach((slide) => {
                        const s = `
                    <div class="swiper-slide" data-target="power-plant" data-index="${slide.Id}">
                        <div class="swiper-slide-mark-left">
                            <p><span class="amount">${slide.MinPower}</span><span class="unit">kWt</span></p>
                        </div>
                        <div class="swiper-slide-mark-right">
                            <p><span class="prefix">roi: </span><span class="amount">${slide.Roi}</span><span
                                    class="unit">%</span></p>
                        </div>
                        <img data-src="public/assets/images/${slide.imgPath}" class="swiper-lazy">
                        <div class="swiper-slide-info">
                            <h3><span class="swiper-slide-info-icon icon-place"></span>${slide.Address}</h3>
                            <h4><span class="swiper-slide-info-icon icon-name"></span>${slide.StationName}</h4>
                        </div>
                        <div class="swiper-lazy-preloader"></div>
                    </div>
                        `;
                        swiper.appendSlide(s);
                        swiper.update(true);
                    });
                }

                const slides = jQuery('.swiper-slide[data-target="power-plant"]');
                const slideModal = jQuery('#powerPlantModal');

                if (slides && slideModal) {
                    jQuery(slides).each(function (idx, element) {
                        const el = jQuery(element);
                        el.on('click', function (e) {
                            const index = el.attr('data-index');
                            const current = data.filter((el) => el.Id === +index)[0];

                            jQuery(slideModal).find('[data-value="pp-name"]').each(function (idx, el) {
                                jQuery(el).text(current.StationName);
                            });
                            jQuery(slideModal).find('[data-value="pp-address"]').each(function (idx, el) {
                                jQuery(el).text(current.Address);
                            });
                            jQuery(slideModal).find('[data-value="pp-roi"]').each(function (idx, el) {
                                jQuery(el).text(current.Roi);
                            });
                            jQuery(slideModal).find('[data-value="pp-min-power"]').each(function (idx, el) {
                                jQuery(el).text(current.MinPower);
                            });
                            jQuery(slideModal).find('[data-value="pp-price"]').each(function (idx, el) {
                                jQuery(el).text(current.PricePerKW);
                            });
                            jQuery(slideModal).find('[data-value="pp-start-date"]').each(function (idx, el) {
                                jQuery(el).text(current.StartBuildingDate);
                            });
                            jQuery(slideModal).find('[data-value="pp-end-date"]').each(function (idx, el) {
                                jQuery(el).text(current.EndBuildingDate);
                            });
                            jQuery(slideModal).find('[data-value="pp-investment-date"]').each(function (idx, el) {
                                jQuery(el).text(current.EndInvestmentDate);
                            });
                            jQuery('#powerPlantModal').modal('show');
                        });
                    });
                }

            })
            .catch((e) => {
                throw new Error(e);
            });
    }
}