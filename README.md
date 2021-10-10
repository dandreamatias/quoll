# Quoll

A tiny http client library build on top of the browser fetch api. In only 0.7Kb Quoll offers:

- a simplified interaction with the most common RESTful API.
- a clean way to handle HTTP errors.
- others utilities to implement interceptors and custom behaviours on specifics http status codes.

[Getting started](#user-content-getting-started)

[Documentation](#user-content-documentation)

[ADVANCED](#user-content-advanced)

---

:warning: **Node.js**:
"fetch" don't exist in node js, if you wanna use quoll-http you have to:

1. install [node-fetch](https://www.npmjs.com/package/node-fetch).
2. patch 'fetch' globally like explained in node-fetch documentation:

```js
import fetch from 'node-fetch';

if (!globalThis.fetch) {
  globalThis.fetch = fetch;
}
```

## Getting started

1. install quoll:

```js
npm i quoll-http
```

2. import and use quoll:

```js
import quoll from 'quoll-http';

// get request in an async function
const basicQuollGet = async () => {
  const [data, error] = await quoll.get('https://jsonplaceholder.typicode.com/todos');
  if (!error) console.log(data);
};

// alternatively using 'then' syntax
quoll
  .get('https://jsonplaceholder.typicode.com/todos')
  .then(([data, error]) => console.log(data, error));
```

## Documentation

### HTTP

All the http methods have the same return. They return a Promise, when it's resolved you have access to an array with two elements: the first one is the data, the second one is the HTTP error. Only one of the two elements in the array has a value:

```js
// http return 404
const [data, error] = await quoll.get('https://jsonplaceholder.typicode.com/wrong-endpoint');
// data is undefined
// error is a class that extend Error (in that way you have access to the response: error.response)

// http return 200
const [data, error] = await quoll.get('https://jsonplaceholder.typicode.com/todos');
// data has the data
// error is undefined
```

#### GET

```js
quoll.get(
  'https://jsonplaceholder.typicode.com/todos',
  { userId: 5, active: false },
  { mode: 'cors' }
);
// GET https://jsonplaceholder.typicode.com/todos?userId=5&active=false
```

the get method take 3 arguments:

1. string - the endpoint url.
2. object - it will automatically be transformed into a query params.
3. object - used for extraconfiguration to overwrite the default settings

#### POST - PUT - PATCH - DELETE

```js
quoll.post(
  'https://jsonplaceholder.typicode.com/users',
  { name: 'John', surname: 'Doe', age: 27 },
  { cache: 'no-cache' }
);
// POST https://jsonplaceholder.typicode.com/users

quoll.put(
  'https://jsonplaceholder.typicode.com/users/8',
  { name: 'John', surname: 'Doe', age: 28 },
  { cache: 'no-cache' }
);
// PUT https://jsonplaceholder.typicode.com/users

quoll.patch('https://jsonplaceholder.typicode.com/users', { age: 29 }, { cache: 'no-cache' });
// PATCH https://jsonplaceholder.typicode.com/users
```

post/put/patch/delete method takes 3 arguments:

1. string - the endpoint url.
2. object - the body with all the data
3. object - used for extraconfiguration to overwrite the default settings

### ADVANCED

#### Custom behaviours on http status code

You can add a callBack to a specific code. The function is going to be executed everytime a response has the same code

```js
quoll.onStatus(401, (response) => console.log('redirect to login'));
quoll.onStatus(500, (response) => console.log('ups... something wrong'));
```

#### Interceptor

Quoll does not have a built in interceptor but you can pass a callBack that run when the Http call start and one that get fired when the promise is fullfilled.

```js
quoll.onHttpStart(() => console.log('mask the UI with loader'));
quoll.onHttpEnd(() => console.log('remove loader'));
```

#### Multiple endpoints

When you are dealing with multiple endpoint can be tedious passing everitime a different configuration. Quoll offers a .create() method, it return a new instance of quoll that you can configure at will. create() take two arguments: a base endpoint and a configuration object used during the request.

```js
const placeholderApi = quoll.create('https://jsonplaceholder.typicode.com/', {
  headers: { 'Content-Type': 'application/json' },
  mode: 'cors',
  ...etc,
});
const githubApi = quoll.create('https://api.github.com/', {
  headers: { 'Content-Type': 'application/json' },
  ...etc,
});

placeholderApi.get('todos'); // GET https://jsonplaceholder.typicode.com/todos
githubApi.get('emojis'); // GET https://api.github.com/emojis
```

#### Others API

`setHeaders({...headersProps})`

setHeaders accept an object as a parameter, it replace the the whole headers property with a new one

`updateHeaders(key, value)`

`updateHeaders` accept two parameters, a key(string) and a value(string).

`setHeaders` and `updateHeaders` very usefull combined with `onHttpStart` to attach a fresh value in a http call:

```js
quoll.onHttpStart(() => {
  quoll.updateHeaders('Authorization', `Bearer ${localStorage.getItem('myToken')}`);
  // read the token from the localstorage on every http request
});
```
