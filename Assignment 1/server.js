/*********************************************************************************
* WEB322: Assignment 1
* I declare that this assignment is my own work in accordance with Seneca Academic Policy.
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students. *
* Name: Edward Vuong Student ID: 120246186 Date: Jan 18, 2019 *
* Online (Heroku) URL: https://boiling-retreat-80144.herokuapp.com/
* ********************************************************************************/
var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var app = express();

// setup a 'route' to listen on the default url path
app.get("/", (req, res) => {
    res.send("Edward Vuong - 120246186");
});

// setup http server to listen on HTTP_PORT
app.listen(HTTP_PORT);