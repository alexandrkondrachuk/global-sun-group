import { config } from '../config';

const { modal } = config;

class Modal {

    initFillModal() {
        const fillButtons = document.querySelectorAll(modal.selector);
        if (!fillButtons) return;
        jQuery(fillButtons).each((idx, el) => {
            jQuery(el).on('click', (e) => {
                jQuery(modal.target).modal(Modal.ACTIVE_CLASS);
            });
        });
    }

    init() {
        this.initFillModal();
    }
}

Modal.ACTIVE_CLASS = 'show';

export default Modal;