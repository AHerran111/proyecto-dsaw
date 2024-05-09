

"use strict";

const fs = require('fs');
const Post = require('./post');

const postsPath = './app/data/posts.json';

let content = fs.readFileSync(postsPath);
let posts = JSON.parse(content).map(Post.createFromObject);

function deletePost(postId) {
    
    for (let i = 0; i < posts.length; i++) {
        let elem = posts[i];

        if (elem.postId === postId) {
            // delete it
            posts.splice(i, 1);
            fs.writeFileSync(postsPath, JSON. stringify(posts));
            return true;
        }
    }
    fs.writeFileSync(postsPath, JSON. stringify(posts));

    return false;
}

// fs.readFile("Posts.json", 'utf8', (err, data) => {
//     if (err) {
//         console.error("Error in here reading file");
//         return;
//     }

//     const Posts = JSON.parse(data); // load data
//     console.log(Posts);
// })




function getPosts() {
    return posts;
}


function getPostsById(postId) {
    return posts.find(post => post.postId === postId || post.postId === postId);
}


 function getIdByTitle(title) {
    const post = posts.find(post => post._title === title);

    if (post) {
        return post.postId;
    } else {
        return null; // post with the specified title not found
    }
}



function createPost(post) {
    posts.push(Post.createFromObject(post));
    fs.writeFileSync(postsPath, JSON.stringify(posts));
}

function updatepost(postId, updatedPost) {
    let postFounded = posts.find(post => post.postId === postId);
    let postIndex = posts.findIndex(post => post.postId === postId);

    if (!postFounded) {
        return false;
    }

    let newUpdatedPost = updatedPost;
    if (typeof updatedPost === "string") {
        newUpdatedPost = JSON.parse(newUpdatedPost);
    }

    posts.splice(postIndex, 1);

    console.log("NEW UPDATED post: " + JSON.stringify(newUpdatedPost));

    // migrate properties to post
    postFounded.postId = newUpdatedPost?.postId ?? postFounded.postId;
    postFounded.title = newUpdatedPost?.title ?? postFounded.title;
    postFounded.description = newUpdatedPost?.summary ?? postFounded.summary;
    postFounded.imageUrl = newUpdatedPost?.imageUrl ?? postFounded.imageUrl;
    postFounded.unit = newUpdatedPost?.user ?? postFounded.user;
    postFounded.stock = newUpdatedPost?.section ?? postFounded.section;
    postFounded.pricePerUnit = newUpdatedPost?.content ?? postFounded.content;

    posts.push(newUpdatedPost);
    
    // return if everything ok
    return true;
}


function searchPosts(query) {
   
    query = query.toLowerCase(); // Convert query to lowercase for case-insensitive comparison
        return posts.filter(post => {
            return post._title.toLowerCase().includes(query) || post._content.toLowerCase().includes(query);
        });
    

}


exports.getPosts = getPosts;
exports.getPostsById = getPostsById
exports.createPost = createPost;
exports.updatePost = updatepost;
exports.deletePost = deletePost;
exports.searchPosts = searchPosts;
exports.getIdByTitle = getIdByTitle;