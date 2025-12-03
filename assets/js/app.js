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

async function makeApiCall(apiurl,methodName,msgBody) {
    try{
        msgBody=msgBody?JSON.stringify(msgBody):null;
        let res = await fetch(apiurl,{
            method : methodName,
            body : msgBody,
            headers:{
                "Auth":"token from Ls",
                "Content-type":"application/json"
            }
        })
        let data=await res.json();
        if (!res.ok) {
            let err=data.error||res.statusText||"Something Went Wrong";
            throw new Error(err);
        }
        return data;
    }finally{
        
    }
}