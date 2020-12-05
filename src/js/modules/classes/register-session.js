export default class RegisterSession {
    static has(name) {
        /* eslint no-undef: "off" */
        /* eslint no-unused-expressions: "off" */
        return window.sessionStorage && window.sessionStorage.getItem(name) !== null;
    }

    static set(name, obj) {
        window.sessionStorage && window.sessionStorage.setItem(name, JSON.stringify(obj));
    }

    static get(name, defaultValue = null) {
        let data = defaultValue;
        const objJSON = window.sessionStorage && window.sessionStorage.getItem(name);
        if (typeof objJSON === 'string') {
            try {
                data = JSON.parse(objJSON);
            } catch (e) {
                throw new Error(e);
            }
        }

        return data;
    }
}
