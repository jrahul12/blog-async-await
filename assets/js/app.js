const cl = console.log;

const blogForm = document.getElementById('blogForm');
const titleControl = document.getElementById('title');
const bodyControl = document.getElementById('body');
const userIdControl = document.getElementById('userId');
const addBtn = document.getElementById('addBtn');
const updateBtn = document.getElementById('updateBtn');
const blogContainer = document.getElementById('blogContainer');

let BASE_URL="https://blog-80452-default-rtdb.firebaseio.com";

let POST_URL=`${BASE_URL}/blog.json`;

function blogObjToArr(obj){
    let arr=[];
    for (const key in obj) {
        obj[key].id=key;
        arr.push(key[obj]);
    }
    return arr;
}

