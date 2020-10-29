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

                if (response.data) {
                    response.data.forEach((slide) => {
                        const s = `
                    <div class="swiper-slide">
                        <div class="swiper-slide-mark-left">
                            <p><span class="amount">${slide.MinPower}</span><span class="unit">mw</span></p>
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
            })
            .catch((e) => {
                throw new Error(e);
            });
    }
}