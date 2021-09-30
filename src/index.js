import { QuollHTTP } from "./quoll-http";

class Quoll extends QuollHTTP {
  constructor(baseUrl = '', headers = {}) {
    super(baseUrl, headers);
  }

  create(baseUrl, header) {
    return new QuollHTTP(baseUrl, header)
  }

  extend(quollClass, baseUrl, header) {

  }
}

const quoll = new Quoll();
export default quoll;