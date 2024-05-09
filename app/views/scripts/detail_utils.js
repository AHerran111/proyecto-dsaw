"use strict";

let postContainer = document.getElementById('postDetails');


const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get('postId');


function postToHtml(post) {
    return `<div class="row">
    <div class="col-md-3">
        <a>
            <img src="{% static 'images/comment.png' %}" alt="Comment post">
            <!-- length of comments goes here -->
        </a>
    </div>
    <!-- if user has a profile image, render this -->
        <div class="col-md-6 shadow-lg rounded p-0">
            <img class="h-100 w-100 rounded" 
                src=${post.imageUrl}
                alt="Thumbnail">
        </div>
    <div class="col-md-3">
        <a>
            <form id="upvote-post-form-{{ post.post_id }}" class="d-inline" method="POST" action="{% url 'blog:vote-post' post.post_id %}?upvote=True">
                
                <a href="javascript:;" onclick="document.getElementById('upvote-post-form-{{ post.post_id }}').submit();">
                    <img src="https://static.thenounproject.com/png/136236-200.png" alt="Upvote">
                </a>
            </form>
            <!-- Render number of likes -->
        </a>
        <a>
            <form id="downvote-post-form-{{ post.post_id }}" class="d-inline" method="POST" action="{% url 'blog:vote-post' post.post_id %}?upvote=False">
                <a href="javascript:;" onclick="document.getElementById('downvote-post-form-{{ post.post_id }}').submit();">
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUzHs10vMoxltLiZ9ESSD4RTsQ50nkbFqLM5vplanKAA&s" alt="Downvote">
                </a>
            </form>
            <!-- Render number of dislikes -->
        </a> 
    </div>
</div>
<br>
<br>
<h2 class="text-center">
${post.title}
</h2>
<p class="text-center">
    by <a href="{% url 'users:user-view' post.user.username %}">
        ${post.user}
        </a>
        <div class="d-flex justify-content-center">
            <div class="rounded p-1 text-center shadow w-10 bg-warning">
            ${post.section}
            </div>
        </div>
</p>
<br>
<div class="card m-2 p-3">
    <p>
        <!-- DEscrioption -->
        ${post.content}
    </p>
</div>
<br>
<h4>
    Attachments
</h4>
<!-- Attachments goes here if for instance, images are going to be rendered -->

<!-- {% with attachments=post.attachments.get_queryset %}
    <div class="container">
        <div class="row">
            <div class="col-md-3"></div>
            <div class="col-md-6 w-50 h-50">
                <div id="carouselExampleIndicators" class="carousel slide" data-ride="carousel">
                    <ol class="carousel-indicators">
                        <li data-target="#carouselExampleIndicators" data-slide-to="0" class="active"></li>
                        {% for attachment in attachments|slice:"1:" %}
                            <li data-target="#carouselExampleIndicators" data-slide-to="{{ attachment.id }}"></li>
                        {% endfor %}
                    </ol>
                    <div class="carousel-inner">
                        <div class="carousel-item active">
                            <img class="d-block w-100 img-fluid" style="height: 17rem;" src="/media/{{ attachments.0.file.name }}" alt="First slide">
                        </div>
                        {% for attachment in attachments|slice:"1:" %}
                            <div class="carousel-item w-100">
                                <img class="d-block img-fluid w-100" style="height: 17rem;" src="/media/{{ attachment.file.name }}" alt="Second slide">
                            </div>
                        {% endfor %}
                    </div>
                    <a class="carousel-control-prev bg-primary" href="#carouselExampleIndicators" role="button" data-slide="prev">
                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span class="sr-only">Previous</span>
                    </a>
                    <a class="carousel-control-next bg-primary" href="#carouselExampleIndicators" role="button" data-slide="next">
                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                        <span class="sr-only">Next</span>
                    </a>
                </div>
            </div>
            <div class="col-md-3"></div>
        </div>
    </div>
    {% endwith %} -->
    <br>
<h4>
    Comments
</h4>
<p id='comment-help-text' class="d-none">
</p>
<form id='post-comment-form' method="POST" action="{% url 'blog:comment-post' post.post_id %}">
    
    <div class="container">
        <textarea name="content" rows="3" class="col-md-9 align-middle"></textarea>
        <!-- <input id='post-input-submit-btn' type="submit" class="col-md-2" value="Post comment"> -->
        <button class="btn btn-primary" onclick="postComment({{ post.post_id }})">
            Post comment
        </button>
    </div>
</form>
<br>
<!-- Render all the comments in here of the post -->

<!-- {% with comments=post.comment_set.get_queryset %}
    {% if comments %}
        <div class="card m-2 p-3">
            {% for comment in comments %}
                {% if not comment.is_reply %}
                    <div class="card h-15 m-2">
                        <div class="container p-1"> 
                            <div class="row m-2">
                                <a href="{% url 'users:user-view' comment.user.username %}">
                                    <img class="rounded-circle mr-2" 
                                    src="{{ comment.user.profile_img }}"
                                    height="60" width="60">
                                </a>
                                
                                <div class="column col-md-9">
                                    <small class="row-md-2">
                                        {{ comment.user.username }}
                                    </small>
                                    <p>
                                        {{ comment.content }}
                                    </p>
                                </div>
                                <button class="btn btn-light" id='{{ comment.comment_id }}' onclick="replyComment(this)">
                                    Reply
                                </button>
                            </div>
                        </div>
                    </div>
                    {% for reply in comment.replies.get_queryset %}
                        <div class="card h-15 m-2 ml-5">
                            <div class="container p-1"> 
                                <div class="row m-2">
                                    <a href="{% url 'users:user-view' reply.user.username %}">
                                        <img class="rounded-circle mr-2" 
                                            src="{{ reply.user.profile_img }}"
                                            height="60" width="60">
                                    </a>
                                    <div class="column col-md-9">
                                        <small class="row-md-2">
                                            {{ reply.user.username }}
                                        </small>
                                        <p>
                                            {{ reply.content }}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    {% endfor %}
                {% endif %}
            {% endfor %}
        </div>
    {% endif %}
{% endwith %} -->
  `;
}





getPost(postId).then(postRes => {
    console.log(postRes);
    postContainer.innerHTML = postToHtml(postRes);
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
