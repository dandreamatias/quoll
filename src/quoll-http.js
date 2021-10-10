import { isFunction } from './utils.js';
import { HTTPError } from './http-error.js';

export class QuollHTTP {
  constructor(baseUrl = '', options = {}) {
    this._statusMap = new Map();
    this._baseUrl = baseUrl;
    const { headers, method, ...rest } = options;
    this._options = rest;
    this._headers = headers || { 'Content-Type': 'application/json' };
  }

  onHttpStart(callBack) {
    if (!isFunction(callBack)) throw new Error('param sholud be a function');
    this._onStart = callBack;
  }

  onHttpEnd(callBack) {
    if (!isFunction(callBack)) throw new Error('param sholud be a function');
    this._onEnd = callBack;
  }

  onStatus(statusCode, callBack) {
    if (!isFunction(callBack)) throw new Error('param sholud be a function');
    this._statusMap.set(statusCode, callBack);
  }

  setHeaders(header = {}) {
    this._headers = header;
  }

  updateHeaders(key, value) {
    if (key === null || key === undefined) throw new Error('invalid key');
    this._headers[key] = value;
  }

  async get(url, obj = {}, options = {}) {
    const { headers, ...rest } = options;
    if (this._onStart) this._onStart();
    const fullUrl = `${this._baseUrl}${url}${this._buildQueryParams(obj)}`;
    const res = await fetch(fullUrl, {
      method: 'GET',
      headers: new Headers({ ...this._headers, ...(headers || {}) }),
      ...this._options,
      ...rest,
    });
    return this._handleResponse(res);
  }

  _buildQueryParams(obj) {
    const hasParams = Object.keys(obj).length !== 0;
    return hasParams
      ? `?${Object.keys(obj)
          .map((key) => key + '=' + obj[key])
          .join('&')}`
      : '';
  }

  async delete(url, body, options) {
    return this._httpMethodWithBody('DELETE')(this._baseUrl + url, body, options);
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
        headers: new Headers({ ...this._headers, ...(headers || {}) }),
        ...this._options,
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

    try {
      const data = await res.json();
      return [data, undefined];
    } catch (e) {
      return [res, undefined];
    }
  }
}
