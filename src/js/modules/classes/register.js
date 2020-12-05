export default class Register {
    static has(name) {
        /* eslint no-undef: "off" */
        /* eslint no-unused-expressions: "off" */
        return window.localStorage && window.localStorage.getItem(name) !== null;
    }

    static set(name, obj) {
        window.localStorage && window.localStorage.setItem(name, JSON.stringify(obj));
    }

    static get(name, defaultValue = null) {
        let data = defaultValue;
        const objJSON = window.localStorage && window.localStorage.getItem(name);
        if (typeof objJSON === 'string') {
            try {
                data = JSON.parse(objJSON);
            } catch (e) {
                throw new Error(e);
            }
        }

        return data;
    }

    static remove(name) {
        window.localStorage && window.localStorage.removeItem(name);
    }
}
