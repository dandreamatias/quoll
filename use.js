import quoll from "./index.js";

quoll.onHttpError((res) => {
    console.error('generic http error')
});
quoll.onStatus(401, (res) => {
    console.log('redirect to login')
});

// get with params
quoll.get('https://jsonplaceholder.typicode.com/todos', { userId: 4, completed: true }).then(res => console.log(res));

// post with body
quoll.post('https://jsonplaceholder.typicode.com/todos', { user: 'Pippo', mail: 'qweqwe@gmail.com' }).then(res => console.log(res));

// 404
quoll.get('https://jsonplaceholder.typicode.com/qweqweqweqweqwe').then(res => console.log(res));