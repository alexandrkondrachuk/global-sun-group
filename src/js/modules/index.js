import Navigation from './navigation';
import Carousel from './carousel';
import Counter from './counter';
import TopButton from './top-button';
import Form from './form';
import ScrollToElement from './scroll-to-element';
import Modal from './modal';
import Stations from './stations';
import UserInfo from './user-info';
import Boot from './boot';

const navigation = new Navigation();
const carousel = new Carousel();
const counter = new Counter();
const topButton = new TopButton();
const form = new Form();
const scrollToElement = new ScrollToElement();
const modal = new Modal();
const stations = new Stations();
const userInfo = new UserInfo();
const boot = new Boot();
export {
    navigation,
    carousel,
    counter,
    topButton,
    form,
    scrollToElement,
    modal,
    stations,
    userInfo,
    boot,
};