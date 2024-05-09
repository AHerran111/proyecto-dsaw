"use strict";

let postForm = document.getElementById('postForm');
let postData;



postForm.addEventListener('submit', function(event) {
    event.preventDefault();
    postData = {
      postId:"",
      title: document.getElementById('title').value,
      summary: document.getElementById('summary').value,
      imageUrl: document.getElementById('imageUrl').value,
      user:"test",
      section: document.getElementById('section').value,
      content: document.getElementById('content').value,
      upvotes:0,
      downvotes:0
    };

    console.log(postData);
    
    postPost(postsUrl,postData,onSuccess => {
        console.log('Post created successfully!');
    },
    onError => {
        console.log('Post not created succesfully');
    });
     // You can send this data to a server or process it further
    
    // You can redirect to another page or perform any other action here
});