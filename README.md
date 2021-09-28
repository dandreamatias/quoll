# Quoll

## getting started
1) install quoll:
`npm i quoll`
2) import quoll:
`import quoll from 'quoll' `

## example

```js
// generic error interceptor
quoll.onHttpError((res) => {
  console.error('generic http error')
});

// add a custom behaviour on a specific http status
quoll.onStatus(401, (res) => {
  console.log('redirect to login')
});

// get with query params
const data = await quoll.get('https://jsonplaceholder.typicode.com/todos', {userId: 4, completed: true});
```
