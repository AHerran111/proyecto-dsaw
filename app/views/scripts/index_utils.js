"use strict";

let postContainer = document.getElementById('card-container');
let searchBox =document.getElementById("search-box-btn");

function postToHtml(post) {
    return `<div class="card m-2" style="width: 18rem;">
    <div style="height: 17rem; overflow: hidden;">
      <img class="card-img-top img-fluid" style="height: auto; width: 100%;" alt="No attachments" src=${post.imageUrl}>
    </div>
    <div class="card-body">
      <h5 class="card-title">${post.title}</h5>
      <small><i>Summary</i></small>
      <p class="card-text">${post.summary}</p>
      <small><i>By <b>${post.user}</b></i></small>
      <br>
      <a href="./posts/post_detail.html?postId=${post.postId}" class="card-link">See full post</a>
      <br><br>
      <div class="align-bottom">
        <small>Section</small>
        <div class="rounded p-1 text-center shadow w-75 bg-warning">
          ${post.section}
        </div>
      </div>
    </div>
  </div>
  `;
}


function postListtoHtml(postList) {
    postContainer.innerHTML = '<div class="row mt-5">\n' + postList.map(postToHtml).join("\n") + "\n<div>";
}




loadPosts(postsUrl).then(posts => {
    postListtoHtml(posts);
});


function removePost(post) {
    
   deletePost(postsUrl,post,onSucces,onError);

   loadPosts(postsUrl).then(posts => {
    postListtoHtml(posts);
    });
}


searchBox.addEventListener("click", function() {

    var searchQuery = document.getElementById("search-box").value;
    console.log("Search Query: ", searchQuery);
    
    if (searchQuery.trim() !== "") {
        // Redirect to /posts/results.html with the searchQuery as a query parameter
        window.location.href = "./results.html?query=" + encodeURIComponent(searchQuery);
      } else {
        alert("Please enter a search query.");
      }
  });



/*
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
*/
