"use strict";

let postContainer = document.getElementById('card-container');


function postDetailsToHtml(post) {
    return `<div class="card m-2 h-25" style="width: 18rem;">
    <div class="h-25">
      <img class="card-img-top img-fluid" style="height: 17rem;" alt="No attachments"
        src=${post._imageUrl}>
    </div>
    <div class="card-body">
      <h5 class="card-title">${post._title}</h5>
      <small><i>Summary</i></small>
      <p class="card-text">
      ${post._summary}
      </p>
      <small><i>By <b>${post._user}/b></i></small>
      <br>
      <a href="./posts/post_detail.html" class="card-link">
        See full post
      </a>`;
}


function postListtoHtml(postList) {
    postContainer.innerHTML = '<div class="row mt-5">\n' + postList.map(postToHtml).join("\n") + "\n<div>";
}

function priceSummaryToHtml(post,amount) {
    return `
    <p> ${post._title}: ${amount} x ${post._pricePerUnit}</p>
    <hr class="dashed">`;
}

function shoppingCartToHtml() {
    let cart = readShoppingCart();
    console.log(cart);
    postContainer.innerHTML = cart._postProxies.map((proxy) => {
        const post = cart._posts.find((p) => p._uuid === proxy.postUuid);
        return postDetailsToHtml(post, proxy.ammount);
      });
}

function totalToHtml(){
    let cart = readShoppingCart();
    let total = 0;

    postTotalContainer.innerHTML = cart._postProxies.map((proxy) => {
        const post = cart._posts.find((p) => p._uuid === proxy.postUuid);
        total += (post._pricePerUnit*proxy.ammount);
        return priceSummaryToHtml(post, proxy.ammount);
      }) + `<p>Monto a pagar : ${total} </p><br></br>`;

      
}

function preloadShoppingCart() {

}




//

function removePost(event) {
    let cart = readShoppingCart();

    const postTitle = event.target.closest("li").querySelector("[id=postTitle]").innerText;
    console.log(postTitle);

    const postIndex = cart._posts.findIndex(post => post._title === postTitle);
    cart._posts.splice(postIndex, 1);
    cart._postProxies.splice(postIndex, 1);
    writeShoppingCart(cart);
    shoppingCartToHtml();
    totalToHtml();
    eventCreator();
}

let oldAmount = 0;

function enableAmount(event) {

    let media_body = event.target.closest("li");
    media_body.querySelector("[id=amountInput]").removeAttribute('readonly');
    media_body.querySelector("[id=pencil]").style.display = 'none';
    media_body.querySelector("[id=check]").style.display = 'block';
    media_body.querySelector("[id=cancel]").style.display = 'block';

    oldAmount = media_body.querySelector("[id=amountInput]").value;
}

function disableAmount(event) {

    let media_body = event.target.closest("li");
    media_body.querySelector("[id=amountInput]").setAttribute('readonly', true);
    media_body.querySelector("[id=pencil]").style.display = 'block';
    media_body.querySelector("[id=check]").style.display = 'none';
    media_body.querySelector("[id=cancel]").style.display = 'none';
    
    media_body.querySelector("[id=amountInput]").value = oldAmount;
}

function confirmAmount(event) {

    let media_body = event.target.closest("li");
    media_body.querySelector("[id=amountInput]").setAttribute('readonly', true);
    media_body.querySelector("[id=pencil]").style.display = 'block';
    media_body.querySelector("[id=check]").style.display = 'none';
    media_body.querySelector("[id=cancel]").style.display = 'none';

    let amount = media_body.querySelector("[id=amountInput]").value;

    if (amount == 0){
        removePost(event);
        return;
    }

    let cart = readShoppingCart();

    const postTitle = media_body.querySelector("[id=postTitle]").innerText;

    const postIndex = cart._posts.findIndex(post => post._title === postTitle);
    cart._postProxies[postIndex].ammount = parseInt(amount);

    writeShoppingCart(cart);
    totalToHtml();
}


shoppingCartToHtml();
totalToHtml();

function eventCreator() {
    let amountInput = document.querySelectorAll("[id='amountInput']");
    let pencilButton = document.querySelectorAll("[id='pencil']");
    let checkButton = document.querySelectorAll("[id='check']");
    let cancelButton = document.querySelectorAll("[id='cancel']");
    let deleteButton = document.querySelectorAll("[id='trashButton']");

    for(var i = 0; i < amountInput.length; i++) {
        deleteButton[i].addEventListener('click',removePost);
        pencilButton[i].addEventListener('click',enableAmount);
        cancelButton[i].addEventListener('click',disableAmount);
        checkButton[i].addEventListener('click',confirmAmount);
    }
}

eventCreator();

