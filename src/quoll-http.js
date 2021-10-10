import { isFunction } from './utils.js';
import { HTTPError } from './http-error.js';

export class QuollHTTP {
  constructor(baseUrl = '', headers) {
    this._statusMap = new Map();
    this._baseUrl = baseUrl;
    this._headers = headers || { 'Content-Type': 'application/json' };
  }

  onStart(callBack) {
    if (!isFunction(callBack)) throw new Error('param sholud be a function');
    this._onStart = callBack;
  }

  onEnd(callBack) {
    if (!isFunction(callBack)) throw new Error('param sholud be a function');
    this._onEnd = callBack;
  }

  onStatus(statusCode, callBack) {
    if (!isFunction(callBack)) throw new Error('param sholud be a function');
    this._statusMap.set(statusCode, callBack);
  }

  setHeader(header = {}) {
    this._headers = header;
  }

  async get(url, obj = {}, options = {}) {
    const { headers, ...rest } = options;
    if (this._onStart) this._onStart();
    const hasParams = Object.keys(obj).length !== 0;
    const fullUrl =
      `${this._baseUrl}${url}` +
      (hasParams
        ? `?${Object.keys(obj)
            .map((key) => key + '=' + obj[key])
            .join('&')}`
        : '');
    const res = await fetch(fullUrl, {
      method: 'GET',
      headers: { ...this._header, ...(headers || {}) },
      ...rest,
    });
    return this._handleResponse(res);
  }

  async delete(url, options) {
    const { headers, ...rest } = options;
    const res = await fetch(this._baseUrl + url, {
      method: 'DELETE',
      headers: { ...this._header, ...headers },
      ...rest,
    });
    return this._handleResponse(res);
  }

  async post(url, body, options) {
    return this._httpMethodWithBody('POST')(this._baseUrl + url, body, options);
  }

  async put(url, body, options) {
    return this._httpMethodWithBody('PUT')(this._baseUrl + url, body, options);
  }

  async patch(url, body, options) {
    return this._httpMethodWithBody('PATCH')(this._baseUrl + url, body, options);
  }

  _httpMethodWithBody(method) {
    return async (url, body = {}, options = {}) => {
      const { headers, ...rest } = options;
      const res = await fetch(url, {
        method,
        body: JSON.stringify(body),
        headers: { ...this._header, ...(headers || {}) },
        ...rest,
      });
      return this._handleResponse(res);
    };
  }

  async _handleResponse(res) {
    if (this._onEnd) this._onEnd();
    if (this._statusMap.has(res.status)) {
      await this._statusMap.get(res.status)(res);
    }
    if (!res.ok) {
      return [undefined, new HTTPError(res)];
    }

    const data = await res.json(); // TODO this._getResponseType(res)
    return [data, undefined];
  }

  _getResponseType() {
    // todo
    return 'json';
    return 'text';
  }
}
