import  { isFunction, isString }  from '../src/utils';

const functionParams = [
  [() => { }, true],
  ['hello', false],
  [{}, false],
  [undefined, false]
]
test.each(functionParams)(
  'isFunction(%s) to be %s', (type, expected) => {
  expect(isFunction(type)).toBe(expected);
});

test('isString("hello") to be true', () => {
  expect(isString('hello')).toBe(true);
});
