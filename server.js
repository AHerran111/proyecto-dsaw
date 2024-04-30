"use strict";

const express = require('express');
const router = require('./app/controllers/router');
const app = express()
const port = 3000;
const cors = require('cors');

app.use(express.urlencoded({ extended: true }));  // This line is important!

app.use(express.json());
app.use('/', router);

app.use(cors({
    origin:['http://localhost:5500']
}));


app.listen(port, () => {
    console.log(`Practica 3 corriendo ${port} `);
});
