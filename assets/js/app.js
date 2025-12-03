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
                            <button class="btn btn-sm btn-block btn-success" onClick="onEdit(this)">Edit</button>
                            <button class="btn btn-sm btn-block btn-danger" onClick="onRemove(this)">Delete</button>
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
    } catch (err) {
        cl(err)
    }
}
fetchAllBlog();

const onSubmitBlog = async (eve) => {
    eve.preventDefault();
    let createObj = {
        title: titleControl.value,
        body: bodyControl.value,
        userId: userIdControl.value
    };
    try {
        let data = await makeApiCall(POST_URL, "POST", createObj);
        let card = document.createElement('div');
        card.classList = `card`;
        card.innerHTML = `<div class="card-header">
                            <h3>${createObj.title}</h3>
                        </div>
                        <div class="card-body">
                            <p>${createObj.body}</p>
                        </div>
                        <div class="card-footer d-flex justify-content-between">
                            <button class="btn btn-sm btn-block btn-success" onClick="onEdit(this)">Edit</button>
                            <button class="btn btn-sm btn-block btn-danger" onClick="onRemove(this)">Delete</button>
                        </div>`
        blogContainer.append(card);
        blogForm.reset();
    } catch (err) {
        cl(err)
    }
}

async function onRemove(eve) {
    try {
        let REMOVE_ID = eve.closest('.card').id;
        let REMOVE_URL = `${BASE_URL}/blog/${REMOVE_ID}.json`;
        let data = await makeApiCall(REMOVE_URL, "DELETE", null);
        eve.closest('.card').remove();
    } catch {
        cl(err);
    }
}

async function onEdit(eve) {
    let EDIT_ID = eve.closest('.card').id;
    localStorage.setItem('EDIT_ID', EDIT_ID);
    let EDIT_URL = `${BASE_URL}/blog/${EDIT_ID}.json`;
    try {
        let data = await makeApiCall(EDIT_URL, "GET", null);
        titleControl.value = data.title;
        bodyControl.value = data.body;
        userIdControl.value = data.userId;

        addBtn.classList.add('d-none')
        updateBtn.classList.remove('d-none');
    } catch {
        cl(err)
    }
}

const onUpdate = async (eve) => {
    eve.preventDefault();
    let UPDATE_ID = localStorage.getItem("EDIT_ID");
    let UPDATE_URL = `${BASE_URL}/blog/${UPDATE_ID}.json`;
    let updateObj = {
        title: titleControl.value,
        body: bodyControl.value,
        userId: userIdControl.value
    };
    try {
        let data = await makeApiCall(UPDATE_URL, "PATCH", updateObj);
        let card = document.getElementById(UPDATE_ID);
        card.querySelector('h3').innerText = updateObj.title;
        card.querySelector('p').innerText = updateObj.body;

        updateBtn.classList.add('d-none');
        addBtn.classList.remove('d-none');
        blogForm.reset();   
    } catch {
        cl(err)
    }
}

updateBtn.addEventListener('click', onUpdate);
blogForm.addEventListener('submit', onSubmitBlog);