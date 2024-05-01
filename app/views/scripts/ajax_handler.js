"use strict";

async function loadPosts(url) {    
    let response = await fetch(url)
    if (response.status != 200) return [];
    return await response.json();
}

async function getPost(postId) {
    let response = await fetch(postsUrl + postId)
    if (response.status != 200) return [];
    let data = await response.json();
    return data.value;
}


/* function loadCartProducts(url, productList, onSuccess, onError) {
    let xhr = new XMLHttpRequest();
    
    xhr.open('POST', url);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(productList));

    xhr.onload = () => {
        if(xhr.status == 200) {
            getXhrResponse(xhr, onSuccess, onError);
        }
        else {
            onError(xhr.status)
        }
    };
}
*/

function putPost(url,post, onSuccess, onError) {
    let xhr = new XMLHttpRequest();
    
    xhr.open('PUT', url);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(post));
    xhr.onload = () => getXhrResponse(xhr, onSuccess, onError);
}

function deletePost(url,post, onSuccess, onError) {
    let xhr = new XMLHttpRequest();
    
    xhr.open('DELETE', url);
    xhr.send(post._postId);
    xhr.onload = () => getXhrResponse(xhr, onSuccess, onError);
}

function getXhrResponse(xhr, onSuccess, onError) {
    if (xhr.status == 200) {
        onSuccess(xhr.responseText);
    } else {
        onError(xhr.status + ': ' + xhr.statusText);
    }
}