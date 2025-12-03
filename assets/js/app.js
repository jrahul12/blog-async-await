const cl = console.log;

const blogForm = document.getElementById('blogForm');
const titleControl = document.getElementById('title');
const bodyControl = document.getElementById('body');
const userIdControl = document.getElementById('userId');
const addBtn = document.getElementById('addBtn');
const updateBtn = document.getElementById('updateBtn');
const blogContainer = document.getElementById('blogContainer');

let BASE_URL = "https://blog-80452-default-rtdb.firebaseio.com";

let POST_URL = `${BASE_URL}/blog.json`;

function blogObjToArr(obj) {
    let arr = [];
    for (const key in obj) {
        obj[key].id = key;
        arr.push(obj[key]);
    }
    return arr;
}

async function makeApiCall(apiurl, methodName, msgBody) {
    try {
        msgBody = msgBody ? JSON.stringify(msgBody) : null;
        let res = await fetch(apiurl, {
            method: methodName,
            body: msgBody,
            headers: {
                "Auth": "token from Ls",
                "Content-type": "application/json"
            }
        })
        let data = await res.json();
        if (!res.ok) {
            let err = data.error || res.statusText || "Something Went Wrong";
            throw new Error(err);
        }
        return data;
    } finally {

    }
}

const createBlog = arr => {
    let result = arr.map(blog => {
        return `<div class="card" id="${blog.id}">
                        <div class="card-header">
                            <h3>${blog.title}</h3>
                        </div>
                        <div class="card-body">
                            <p>${blog.body}</p>
                        </div>
                        <div class="card-footer d-flex justify-content-between">
                            <button class="btn btn-sm btn-block btn-success">Edit</button>
                            <button class="btn btn-sm btn-block btn-danger">Delete</button>
                        </div>
                    </div>`
    }).join('');
    blogContainer.innerHTML = result;
}

async function fetchAllBlog(eve) {
    try {
        let data = await makeApiCall(POST_URL, "GET", null)
        let blogArr = blogObjToArr(data)
        createBlog(blogArr);
    } catch(err) {
        cl(err)
    }
}
fetchAllBlog();