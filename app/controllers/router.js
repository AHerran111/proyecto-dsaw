"use strict";

const express = require('express');
const router = express.Router();
const productRouter = require('./../routes/products');
const adminProductRouter = require('./../routes/admin_products');
const firebaseHelper = require('./helpers/firebase_helper');
const userHelpers = require('./helpers/user_helpers');
const path = require('path');

router.use('/admin/products/', validateAdmin, adminProductRouter);
router.use('/products/', productRouter);

router.get(['/', '/home'], (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'index.html'));
});



router.get(['/posts-d/:username/:postId'], (req, res) => {
    res.sendFile(path.join(__dirname, '../views/posts', 'post_detail.html'));
});



router.get(['/about'], (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'about.html'));
});

router.get('/shopping_cart', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'cart.html'));
});


router.get('/users/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'login.html'));
});



router.get('/users-d/:username', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'user_detail.html'));
});


router.post('/users/login', async (req, res) => {
    const userId = req.body.username;
    const password = req.body.password; // Ensure password is securely handled and stored
    let resDB = await firebaseHelper.setUserLoginData(userId, password);

    console.log(resDB);
    if (resDB) {
        // validate password
        let isValidPassword = await firebaseHelper.validatePassword(userId, password);
        if (!isValidPassword) {
            // redirect to index()
            return res.status(400).send('{"state" : "error", "message" : "Password incorrect" ');
            return res.redirect('/'); // ADRIAN esta es una opcion, si es que quieres cargar desde el front
        }
    }

    // this model is defined under controllers/models, and is the 
    // base for the API responses 

    const userTOKEN = userHelpers.generateUUID(); // random access token for temp sess
    resDB = firebaseHelper.setUserToken(userId, userTOKEN);
    // push that token into the database
    // res.status(200).send('{"state" : "success", "message" : "' + userTOKEN + '" }');

    res.set('X-user-token', userTOKEN);

    // Send the HTML file
    return res.redirect(`/users-d/${userId}/`);
    // res.sendFile(path.join(__dirname, '../views', 'my-profile.html'));
});




router.post('/users/is-logged-in-or-register', async (req, res) => {
    const userId = req.body.username;
    const userTOKEN = req.body.userTOKEN;  // Extracts userTOKEN from request

    try {
        // First, check if the user exists
        const userExists = await firebaseHelper.checkUserExists(userId);

        if (!userExists) {
            // If the user does not exist, redirect to a registration form
            return res.status(302).json({
                state: "redirect",
                message: "User not found, please register",
                redirectUrl: "/users/register" //redirect to registry
            });
        }

        // If user exists, then validate the token
        let tokenIsValid = await firebaseHelper.validateToken(userId, userTOKEN);
        if (!tokenIsValid) {
            return res.status(400).json({ state: "error", message: "Token does not match" });
        }

        return res.status(200).json({ state: "success", message: "Token matches" });
    } catch (error) {
        // Handle potential errors in validation or user existence check
        console.error("Error during login or registration process:", error);
        return res.status(500).json({ state: "error", message: "Server error" });
    }
});

// routes for database update
router.get('/write_database', (req, res) => {
    firebaseHelper.writeFirebase();
    res.status(200).send("Todo excelente");
});


// routes for user
// IMPORTANT: every route requires the 'userTOKEN' field to validate data
// that field should be stores in localStorage or sessionStorage inside the browser
// and when doing requests, use that field inside the api requests and done!



// routes for post detail
router.get('/my-posts/:username', (req, res) => {
    const username = req.params.username;
    const token = req.headers['authorization']; // Commonly tokens are passed in the 'Authorization' header

    // Check if the token is present
    if (!token) {
        return res.status(401).send("Access denied. No token provided.");
    }

    // Proceed with your Firebase function if token validation passes
    firebaseHelper.getUserPosts(username, token)
        .then(posts => {
            res.status(200).json(posts);
        })
        .catch(error => {
            console.error("Error fetching user posts", error);
            res.status(500).send("Error processing your request");
        });
});



// CRUD POSTS
router.get('/users/:username/:post_id', async (req, res) => {
    const username = req.params.username;
    const post_id = req.params.post_id;

    // now check if the post exists
    let post_info = await firebaseHelper.getPostById(username, post_id);
    if (post_info === undefined) {
        // post does not exist
        // we can send them to a 404 page
        // ADRIAN, aqui si retorna 404, mandalo a un not found
        return res.status(404).send('{"state" : "error", "message" : "Post not found" ');
    }

    let postDetailOnString = JSON.stringify(post_info);
    return res.status(200).send(`{"state" : "success", "message" : "${postDetailOnString}"`);

    // ADRIAN, aqui se va a retornar toda la info del post, por lo tanto es importante que
    // cuando el usuario habra el post detail siempre se verifique que
    // si el es el owner del post, entonces pueda modificar la info en el html, de lo contrario
    // le aparecera en readonly, eso lo haces con el userTOKEN

    // para validar si es el owner, simplemente manda a llamar al endpoint de /is-logged-in/ 
    // donde le pasas por parametro el username del post que se acaba de abrir, mas el userTOKEN
    // que tienes guardado en el session storage y si sale bien, es por que es su post y puede editarlo!

});



// TODO PENDING ANDRES!
router.post('/users/:username/post/', async (req, res) => {
    const username = req.params.username;
    const post_id = req.params.post_id;

    const token = req.headers['authorization']; // Commonly tokens are passed in the 'Authorization' header

    // Check if the token is present
    if (!token) {
        return res.status(401).send("Access denied. No token provided.");
    }

    // now check if the post exists
    let post_info = await firebaseHelper.getPostById(username, post_id);
    if (post_info === undefined) {
        // post does not exist
        // we can send them to a 404 page
        // ADRIAN, aqui si retorna 404, mandalo a un not found
        return res.status(404).send('{"state" : "error", "message" : "Post not found" ');
    }

    let postDetailOnString = JSON.stringify(post_info);
    return res.status(200).send(`{"state" : "success", "message" : "${postDetailOnString}"`);

    // ADRIAN, aqui se va a retornar toda la info del post, por lo tanto es importante que
    // cuando el usuario habra el post detail siempre se verifique que
    // si el es el owner del post, entonces pueda modificar la info en el html, de lo contrario
    // le aparecera en readonly, eso lo haces con el userTOKEN

    // para validar si es el owner, simplemente manda a llamar al endpoint de /is-logged-in/ 
    // donde le pasas por parametro el username del post que se acaba de abrir, mas el userTOKEN
    // que tienes guardado en el session storage y si sale bien, es por que es su post y puede editarlo!

});

// TODO PENDING! ANDRES
router.put('/users/username:/post_id:/', async (req, res) => {
    const username = req.params.username;
    const post_id = req.params.post_id;

    const token = req.headers['authorization']; // Commonly tokens are passed in the 'Authorization' header

    // Check if the token is present
    if (!token) {
        return res.status(401).send("Access denied. No token provided.");
    }

    // now check if the post exists
    let post_info = await firebaseHelper.getPostById(username, post_id);
    if (post_info === undefined) {
        // post does not exist
        // we can send them to a 404 page
        // ADRIAN, aqui si retorna 404, mandalo a un not found
        return res.status(404).send('{"state" : "error", "message" : "Post not found" ');
    }

    let postDetailOnString = JSON.stringify(post_info);
    return res.status(200).send(`{"state" : "success", "message" : "${postDetailOnString}"`);

    // ADRIAN, aqui se va a retornar toda la info del post, por lo tanto es importante que
    // cuando el usuario habra el post detail siempre se verifique que
    // si el es el owner del post, entonces pueda modificar la info en el html, de lo contrario
    // le aparecera en readonly, eso lo haces con el userTOKEN

    // para validar si es el owner, simplemente manda a llamar al endpoint de /is-logged-in/ 
    // donde le pasas por parametro el username del post que se acaba de abrir, mas el userTOKEN
    // que tienes guardado en el session storage y si sale bien, es por que es su post y puede editarlo!

});


router.delete('/users/username:/post_id:/', async (req, res) => {
    const username = req.params.username;
    const post_id = req.params.post_id;

    const token = req.headers['authorization']; // Commonly tokens are passed in the 'Authorization' header

    // Check if the token is present
    if (!token) {
        return res.status(401).send("Access denied. No token provided.");
    }

    // now check if the post exists
    let resDB = await firebaseHelper.deletePostById(username, post_id, token);
    if (resDB === false) {
        // cannot delete post, probably beacuse of ownership
        return res.status(400).send('{"state" : "error", "message" : "Could not delete post" ');
    }

    return res.status(200).send(`{"state" : "success", "message" : "Post deleted"`);

    // ADRIAN, aqui se regresa al /my-posts/ del usuario logueado

});



// CRUD POSTS
// router.get('/posts/', async (req, res) => {

//     // now check if the post exists
//     let post_info = await firebaseHelper.getPostById(username, post_id);
//     if (post_info === undefined) {
//         // post does not exist
//         // we can send them to a 404 page
//         // ADRIAN, aqui si retorna 404, mandalo a un not found
//         return res.status(404).send('{"state" : "error", "message" : "Post not found" ');
//     }

//     let postDetailOnString = JSON.stringify(post_info);
//     return res.status(200).send(`{"state" : "success", "message" : "${postDetailOnString}"`);

//     // ADRIAN, aqui se va a retornar toda la info del post, por lo tanto es importante que
//     // cuando el usuario habra el post detail siempre se verifique que
//     // si el es el owner del post, entonces pueda modificar la info en el html, de lo contrario
//     // le aparecera en readonly, eso lo haces con el userTOKEN

//     // para validar si es el owner, simplemente manda a llamar al endpoint de /is-logged-in/ 
//     // donde le pasas por parametro el username del post que se acaba de abrir, mas el userTOKEN
//     // que tienes guardado en el session storage y si sale bien, es por que es su post y puede editarlo!

// });

//Aqui empieza CRUD de Crear y Actualizar con sus respectivos Middleware

// Middleware para validar que el usuario está autenticado
function isAuthenticated(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({ state: 'error', message: 'Access denied. No token provided.' });
    }
    //Lógica para validar el token
    firebaseHelper.validateToken(req.params.username, token)
        .then(isValid => {
            if (!isValid) {
                return res.status(403).json({ state: 'error', message: 'Invalid token.' });
            }
            next();
        })
        .catch(error => {
            console.error('Token validation error:', error);
            res.status(500).json({ state: 'error', message: 'Internal server error.' });
        });
}

// Ruta POST para crear un nuevo post
router.post('/users/:username/posts', isAuthenticated, async (req, res) => {
    const { title, content } = req.body;
    const username = req.params.username;

    if (!title || !content) {
        return res.status(400).json({ state: 'error', message: 'Se requiere agregar titulo y contenido.' });
    }

    try {
        const newPost = {
            title,
            content,
            date_created: new Date().toISOString(),
            username: username // Asegúrate de que el nombre de usuario está correctamente asociado al post
        };

        const postId = await firebaseHelper.createPost(newPost);
        res.status(201).json({ state: 'success', message: 'Post creado exitosamente.', postId: postId });
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ state: 'error', message: 'Error al crear el post.', error: error.message });
    }
});


// Middleware para validar que el usuario está autenticado y autorizado para actualizar el post 
function isAuthenticatedAndAuthorized(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({ state: 'error', message: 'Acceso denegado,No se proporciono el token.'});
    }
    // Asumimos que 'validateToken' verifica la validez del token y la autorización para actualizar un post específico
    firebaseHelper.validateToken(req.params.username, token, req.params.postId)
        .then(isValid => {
            if (!isValid) {
                return res.status(403).json({ state: 'error', message: 'No estas autorizado para actualizar este post' });
            }
            next();
        })
        .catch(error => {
            console.error('Token validation error:', error);
            res.status(500).json({ state: 'error', message: 'Internal server error.' });
        });
}

// Ruta PUT para actualizar un post existente del usuario 
router.put('/users/:username/posts/:postId', isAuthenticatedAndAuthorized, async (req, res) => {
    const { title, content } = req.body;
    const { username, postId } = req.params;

    if (!title || !content) {
        return res.status(400).json({ state: 'error', message: 'Se requiere titulo y contenido.'});
    }

    try {
        const updatedPost = {
            title,
            content,
            date_updated: new Date().toISOString(),
        };

        const result = await firebaseHelper.updatePost(postId, updatedPost);
        res.status(200).json({ state: 'success', message: 'Post actualizado correctamente.', postId: postId, updatedPost: result });
    } catch (error) {
        console.error('Error al actualizar el post:', error);
        res.status(500).json({ state: 'error', message: 'Error al actualizar el post.', error: error.message });
    }
});

//Aqui termina CRUD de Crear y Actualizar con sus respectivos Middleware

router.get('/api/posts', async (req, res) => {
    try {
        // Obtener todos los posts desde la base de datos
        const allPosts = await firebaseHelper.getAllPosts();

        // Verifica si hay posts
        if (allPosts.length === 0) {
            return res.status(404).json({ state: 'error', message: 'No posts found' });
        }

        // Responder con todos los posts
        return res.status(200).json({ state: 'success', message: allPosts });
    } catch (error) {
        // Manejo de errores
        console.error('Error fetching posts:', error);
        return res.status(500).json({ state: 'error', message: 'Server error', error: error.message });
    }
});


router.get('/api/posts/:username/:postId', async (req, res) => {
    const username = req.params.username;
    const postId = req.params.postId;

    try {
        // Llamar a la función que obtendrá el post por ID
        const post = await firebaseHelper.getPostById(username, postId);

        if (!post) {
            return res.status(404).json({ state: 'error', message: 'Post not found' });
        }

        // Devolver el post como JSON
        res.status(200).json({ state: 'success', message: post });
    } catch (error) {
        console.log(error);
        res.status(500).json({ state: 'error', message: 'Server error', error: error.message });
    }
});



router.get('/api/users/:username', async (req, res) => {
    const username = req.params.username;

    try {
        const userInfo = await firebaseHelper.getUserInfo(username);

        if (userInfo) {
            res.json({ state: 'success', message: userInfo }); 
        } else {
            res.status(404).json({ state: 'error', message: 'Not Found' });
        }
    } catch (error) {
        console.error('Error fetching user info:', error);
        res.status(500).json({ state: 'error', message: 'Server error', error: error.message });
    }
});



function validateAdmin(req, res, next) {
    let adminToken = req.get("x-auth");
    if (!adminToken || adminToken !== "admin") {
        res.status(403).send("");
    }
    next();
}



module.exports = router;
