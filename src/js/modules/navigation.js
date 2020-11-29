import { config } from '../config';

const { mobileBreakpoint } = config;

class Navigation {
    setHoverEffect() {
        if ((jQuery(window).width() >= mobileBreakpoint)) {
            const navLink = jQuery(Navigation.NAVIGATION_LINK_SELECTOR);
            if (!navLink) return;
            /** Dropdown on hover */
            jQuery(navLink).hover(function () {
                // Open up the dropdown
                jQuery(this).removeAttr(Navigation.DATA_TOGGLE_ATTR); // remove the data-toggle attribute so we can click and follow link
                jQuery(this).parent().addClass(Navigation.CLASS_TO_SHOW); // add the class show to the li parent
                jQuery(this).next().addClass(Navigation.CLASS_TO_SHOW); // add the class show to the dropdown div sibling
            }, function () {
                // on mouseout check to see if hovering over the dropdown or the link still
                const isDropdownHovered = jQuery(this).next().filter(Navigation.HOVER_FILTER).length; // check the dropdown for hover - returns true of false
                const isThisHovered = jQuery(this).filter(Navigation.HOVER_FILTER).length;  // check the top level item for hover
                if (isDropdownHovered || isThisHovered) {
                    // still hovering over the link or the dropdown
                } else {
                    // no longer hovering over either - lets remove the 'show' classes
                    jQuery(this).attr(Navigation.DATA_TOGGLE_ATTR, Navigation.DATA_DROPDOWN_ATTR); // put back the data-toggle attr
                    jQuery(this).parent().removeClass(Navigation.CLASS_TO_SHOW);
                    jQuery(this).next().removeClass(Navigation.CLASS_TO_SHOW);
                }
            });
            // Check the dropdown on hover
            const dropdownMenu = jQuery(Navigation.DROPDOWN_SELECTOR);
            if (!dropdownMenu) return;
            jQuery(dropdownMenu).hover(function () {
            }, function () {
                const isDropdownHovered = jQuery(this).prev().filter(Navigation.HOVER_FILTER).length; // check the dropdown for hover - returns true of false
                const isThisHovered = jQuery(this).filter(Navigation.HOVER_FILTER).length;  // check the top level item for hover
                if (isDropdownHovered || isThisHovered) {
                    // do nothing - hovering over the dropdown of the top level link
                } else {
                    // get rid of the classes showing it
                    jQuery(this).parent().removeClass(Navigation.CLASS_TO_SHOW);
                    jQuery(this).removeClass(Navigation.CLASS_TO_SHOW);
                }
            });
        }
    }

    addScrollClass() {
        const navigationElement = $(Navigation.NAVIGATION_SELECTOR);
        if (!navigationElement) return;
        jQuery(window).scroll(function () {
            if (jQuery(window).scrollTop() > Navigation.OFFSET) {
                $(navigationElement).addClass(Navigation.CLASS_STICKY);
            } else {
                $(navigationElement).removeClass(Navigation.CLASS_STICKY);
            }
        });
    }

    setActiveLink() {
        // remove any current navbar active classes
        /*jQuery(".navbar .nav-link.active").removeClass(Navigation.CLASS_ACTIVE_LINK);
        // add active class to proper navbar item that matches window.location
        if (location.pathname === '/') {
            jQuery(`.navbar-nav .nav-link[href="/index.html"]`).addClass(Navigation.CLASS_ACTIVE_LINK);
        }
        jQuery('.navbar-nav .nav-link[href="' + location.pathname + '"]').addClass(Navigation.CLASS_ACTIVE_LINK);
        jQuery('.navbar-nav .dropdown-item[href="' + location.pathname + '"]').addClass(Navigation.CLASS_ACTIVE_LINK);
        jQuery('.navbar-buttons a[href="' + location.pathname + '"]').addClass(Navigation.CLASS_ACTIVE_LINK);*/

        if (jQuery(window).width() <= mobileBreakpoint) {
            const dropdownItemsMobile = $(".navbar-nav .dropdown-item.dropdown-item-mobile");
            jQuery(dropdownItemsMobile).each((idx, el) => {
                jQuery(el).css('display', 'block');
            });
        }
    }

    removeSticky() {
        if ((jQuery(window).width() <= mobileBreakpoint)) {
            let mainNavigation = jQuery(Navigation.NAVIGATION_SELECTOR);
            if (mainNavigation[0]) {
                jQuery(mainNavigation[0]).removeClass(Navigation.CLASS_TO_FIX);
            }
        }
    }

    init() {
        this.setHoverEffect();
        this.addScrollClass();
        this.setActiveLink();

        jQuery(window).resize(() => {
            this.setHoverEffect();
        });
    }
}

Navigation.CLASS_TO_SHOW = 'show';
Navigation.CLASS_TO_FIX = 'fixed-top';
Navigation.CLASS_STICKY = 'sticky';
Navigation.CLASS_ACTIVE_LINK = 'active';
Navigation.HOVER_FILTER = ':hover';
Navigation.DATA_TOGGLE_ATTR = 'data-toggle';
Navigation.DATA_DROPDOWN_ATTR = 'dropdown';
Navigation.NAVIGATION_SELECTOR = '#main-navbar';
Navigation.NAVIGATION_LINK_SELECTOR = '.nav-link.dropdown-toggle';
Navigation.DROPDOWN_SELECTOR = '.dropdown-menu';
Navigation.OFFSET = 50;

export default Navigation;