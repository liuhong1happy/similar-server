export default class Model {
    constructor(data) {
        this.data = data || {};
    }
    set(key, value) {
        this.data[key] = value;
    }
    get(key) {
        return this.data[key];
    }
    getData() {
        return this.data;
    }
    setData(data) {
        this.data = data || [];
    }
}