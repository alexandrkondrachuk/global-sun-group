import Navigation from './navigation';
import Carousel from './carousel';
import Counter from './counter';
import TopButton from './top-button';
import Form from './form';
import ScrollToElement from './scroll-to-element';
import Modal from './modal';
import Boot from './boot';

const navigation = new Navigation();
const carousel = new Carousel();
const counter = new Counter();
const topButton = new TopButton();
const form = new Form();
const scrollToElement = new ScrollToElement();
const modal = new Modal();
const boot = new Boot();
export {
    navigation,
    carousel,
    counter,
    topButton,
    form,
    scrollToElement,
    modal,
    boot,
};