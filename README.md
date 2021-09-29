# Quoll

A tiny http library build on top of the browser fetch api. In only 0.7Kb Quoll offers: 
- a simplified interaction with the most common RESTful API.
- a clean way to handle HTTP errors.
- others utilities to implement interceptors and custom behaviours on specifics http status codes.

## Getting started

1) install quoll:   
```js
npm i quoll
```

2) import and use quoll:   
 ```js
import quoll from 'quoll';
 
// get request in an async function
const basicQuollGet = async () => {
   const [data, error] = await quoll.get('https://jsonplaceholder.typicode.com/todos');
   if(!error) console.log(data)
}

// alternatively using 'then' syntax
quoll.get('https://jsonplaceholder.typicode.com/todos')
   .then(([data, error]) => console.log(data, error))
```

## Documentation

All the http methods have the same return. They return a Promise, when it's resolved you have access to an array with two elements: the first one is the data, the second one is the HTTP error. Only one of the two elements in the array has a value: 
```js
// http return 404
const [data, error] = await quoll.get('https://jsonplaceholder.typicode.com/wrong-endpoint');
// data is undefined
// error is a class that extend Error 

// http return 200
const [data, error] = await quoll.get('https://jsonplaceholder.typicode.com/todos');
// data has the data
// error is undefined
```

### GET

```js
quoll.get('https://jsonplaceholder.typicode.com/todos', {userId: 5, active: false}, { mode: 'cors'});
// GET https://jsonplaceholder.typicode.com/todos?userId=5&active=false
```
the get method take 3 arguments: 
1) string - the endpoint url.
2) object - it will automatically be transformed into a query params.
3) object - used for extraconfiguration to ovverwrite the default settings


### POST

```js
quoll.post('https://jsonplaceholder.typicode.com/users', {name: 'John', surname: 'Doe', age: 27}, { cache: 'no-cache' });
// POST https://jsonplaceholder.typicode.com/users
```
the get method take 3 arguments: 
1) string - the endpoint url.
2) object - the body with all the data
3) object - used for extraconfiguration to ovverwrite the default settings



#### soon...

- PUT
- PATCH
- DELETE
