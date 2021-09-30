import { HTTPError } from "../src/http-error";

it('response is a property of httpError', () => {
  const resMock = {}
  const httpError = new HTTPError(resMock);
  expect(httpError.response).toBe(resMock);
});