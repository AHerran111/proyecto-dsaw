"use strict";

const utils = require('./utils');

class Post {

    constructor(postId,title, summary, imageUrl, user,section,content) {
        this._postId = postId;
        this._title = title;
        this._summary = summary;
        this._imageUrl = imageUrl;
        this._user = user;
        this._section = section;
        this._content = content;
    }

    toJSON() {
        return {
            postId:this._postId,
            title:this._title,
            summary:this._summary,
            imageUrl:this._imageUrl,
            user:this._user,
            section:this._section,
            content:this._content
        };
    }

    get postId () {
        return  this._postId;
    }

    set postId(value) {
        this._postId= value;
    }

    get title() {
        return this._title;
    }

    set title(value) {
        if (typeof value !== "string" || value === "") {
            throw new PostException("Product title cannot be empty");
        }
        else this._title = value;
    }

    get summary() {
        return this._summary;
    }

    set summary(value) {
        if (typeof value !== "string" || value === "") {
            throw new PostException("Product description cannot be empty");
        }
        else this._summary = value;
    }

    get imageUrl() {
        return this._imageUrl;
    }

    set imageUrl(value) {
        if (typeof value !== "string" || value === "") {
            throw new PostException("Product imageUrl cannot be empty");
        }
        this._imageUrl = value;
    }

    set user(value) {
        this._user = user;
    }

    get user() {
        return this._user;
    }

    set section(value) {
        this._section = section;
    }

    get section() {
        return this._section;
    }

    set content(value) {
        this._content = value;
    }

    get content(){ 
        return this._content;
    }

   
    static createFromJson(jsonValue) {
        let obj = JSON.parse(jsonValue);
        return Post.createFromObject(obj);

    }


    static createFromObject(obj) {
        let newPost = {};
        Object.assign(newPost, obj);

        let post = new Post(
            newPost.postId,
            newPost.title,
            newPost.summary,
            newPost.imageUrl, 
            newPost.user, 
            newPost.section, 
            newPost.content
        )
        
        if (newPost.postId !== undefined) {
            newPost.postId = utils.idGenerator();
        }
        
        return post;
    }


    static cleanObject(obj) {
        const productProperties = [
            "uuid", "title", "description", "imageUrl", "unit", "stock", "pricePerUnit", "category"
        ]
        
        for (let prop in obj) {
            if (!productProperties.includes(prop)) {
                // clean the property
                delete obj[prop];
            }
        }
    }
}


class PostException {
    constructor(errorMessage) {
        this.errorMessage = errorMessage;
    }
}


module.exports = Post;