"use strict";

const express = require('express');
const router = express.Router();
const dataHandler = require('./data_handler');
const productRouter = require('./../routes/products');
const adminProductRouter = require('./../routes/admin_products');
const path = require('path');

router.use('/admin/products/', validateAdmin, adminProductRouter);
router.use('/products/', productRouter);

router.get(['/', '/home'], (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'index.html'));
});

//la puse aqui para testear los post
router.get(['/posts'],(req, res) => {
    //let query = req.query.filter;

    let posts;

    try {
        posts = dataHandler.getPosts();

    } catch(e) {
        res.status(400).send("Error obtaining posts",e);
    }
    res.status(200).json(posts);

});


router.get('/shopping_cart', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'cart.html'));
});



function validateAdmin(req, res, next) {
    let adminToken = req.get("x-auth");
    if (!adminToken || adminToken !== "admin") {
        res.status(403).send("");
    }
    next();
}

module.exports = router;