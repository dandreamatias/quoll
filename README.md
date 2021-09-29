# Quoll

A tiny http library build on top of the browser fetch api. In only 0.7Kb Quoll offers: 
- a simplified interaction with the most common RESTful API.
- a clean way to handle HTTP errors.
- others utilities to implement interceptors and custom behaviours on specifics http status codes.

## Getting started

1) install quoll:   
`npm i quoll`

2) import quoll:   
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

- GET
```js
quoll.get('https://jsonplaceholder.typicode.com/todos', {userId: 5, active: false}, { mode: 'cors'});
// GET https://jsonplaceholder.typicode.com/todos?userId=5&active=false
```
the get method take 3 arguments: 
1) string - the endpoint url.
2) object - it will automatically be transformed into a query params.
3) object - used for extraconfiguration to ovverwrite the default settings

- POST   
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
