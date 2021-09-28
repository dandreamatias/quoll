import fetch from 'node-fetch';
class Quoll {
    _statusMap = new Map();
    _httpError = (res) => undefined;

    constructor() {
        if (Quoll._instance) {
            return Quoll._instance
        }
        Quoll._instance = this;
    }

    onStatus(statusCode, callBack) {
        this._statusMap.set(statusCode, callBack)
    }

    onHttpError(callBack) {
        this._httpError = callBack;
    }

    setHeader(header = {}) {
        this.headers = header
    }

    async get(url, obj = {}) {
        const hasParams = Object.keys(obj).length !== 0;
        const fullUrl = url + (hasParams ? `?${Object.keys(obj).map(key => key + '=' + obj[key]).join('&')}` : '');
        const res = await fetch(fullUrl);
        return this._handleResponse(res);
    }

    async post(url, body = {}) {
        const res = await fetch(url, {
            method: 'post',
            body: JSON.stringify(body),
            headers: { 'Content-Type': 'application/json' }
        });
        return this._handleResponse(res);
    }

    _handleResponse(res) {
        console.log(res)
        if (!res.ok) {
            if (this._statusMap.has(res.status)) {
                this._statusMap.get(res.status)(res);
                return;
            }
            return this._httpError(res)
        }
        return res['json']();
    }
}
const quoll = new Quoll();
export default quoll;