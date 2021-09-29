class HTTPError extends Error {
  constructor(response) {
    super(`HTTP Error Response: ${response.status} ${response.statusText}`);
    this.response = response;
  }
}

class  QuollHTTP {
  _statusMap = new Map();

  constructor(baseUrl = '', headers = {}) {
    this._baseUrl = baseUrl
    this.headers = headers;
  }

  onStart(callBack) {
    this._onStart = callBack
  }

  onEnd(callBack) {
    this._onEnd = callBack
  }


  onStatus(statusCode, callBack) {
    this._statusMap.set(statusCode, callBack)
  }

  setHeader(header = {}) {
    this.headers = header
  }

  async get(url, obj = {}) {
    if (this._onStart) this._onStart();
    const hasParams = Object.keys(obj).length !== 0;
    const fullUrl = (this._baseUrl + url) + (hasParams ? `?${Object.keys(obj).map(key => key + '=' + obj[key]).join('&')}` : '');
    const res = await fetch(fullUrl);
    return this._handleResponse(res);
  }

  async delete(url, options) {
    const res = await fetch(this._baseUrl + url, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    });
    return this._handleResponse(res);
  }

  async post(url, body, options) {
    return this._httpMethod('POST')(this._baseUrl + url, body, options);
  }

  async put(url, body, options) {
    return this._httpMethod('PUT')(this._baseUrl + url, body, options);
  }

  async patch(url, body, options) {
    return this._httpMethod('PATCH')(this._baseUrl + url, body, options);
  }

  _httpMethod(method) {
    return async (url, body = {}, options = {}) => {
      const res = await fetch(url, {
        method,
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' }
      });
      return this._handleResponse(res);
    }
  }

  async _handleResponse(res) {
    if (this._onEnd) this._onEnd();
    if (!res.ok) {
      if (this._statusMap.has(res.status)) {
        return [undefined, this._statusMap.get(res.status)(res)];
      }
      return [undefined, new HTTPError(res)]
    }
    const data = await res['json']();
    return [data, undefined]
  }
}


class Quoll extends QuollHTTP {
  constructor(baseUrl = '', headers = {}) {
    super(baseUrl, headers);
  }
  
  create(baseUrl, header) {
    return new QuollHTTP(baseUrl, header)
  }
}

const quoll = new Quoll();
export default quoll;