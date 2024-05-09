"use strict";


let postsContainer = document.getElementById('postsContainer');
const urlParams = new URLSearchParams(window.location.search);
const query = urlParams.get('query');




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
      postsContainer.innerHTML = '<div class="row mt-5">\n' + postList.map(postToHtml).join("\n") + "\n<div>";
  }
  
  searchPosts(query).then(posts => {
    postListtoHtml(posts);
});
  
  
  