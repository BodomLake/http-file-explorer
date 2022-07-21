export class Request {
  constructor(url, params, method, status, exception) {
    this.url = url || ''
    this.params = params || {}
    this.method = method || 'GET'
    this.status = status || 200
    this.exception = exception
  }
}

export class Response {
  constructor(url, headers, body, type, method, status, statusText, exception, redirected) {
    this.url = url || '';
    this.headers = headers || '';
    this.type = type || '';
    this.body = body || {};
    this.method = method || 'GET';
    this.status = status || 200;
    this.exception = exception || {};
    this.statusText = statusText || '';
    this.redirected = redirected || false;
    this.ok = ''
  }
}

/**
 *     readonly headers: Headers;
 *     readonly ok: boolean;
 *     readonly redirected: boolean;
 *     readonly status: number;
 *     readonly statusText: string;
 *     readonly type: ResponseType;
 *     readonly url: string;
 */
