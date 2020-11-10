/*********************************************************************************
* WEB322 – Assignment 03
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students. *
* Name: Edward Vuong Student ID: 120246186 Date: Feb 16, 2019 *
* Online (Heroku) Link: https://shrouded-beyond-43152.herokuapp.com/
* ********************************************************************************/

const HTTP_PORT = process.env.PORT || 8080;
const express = require('express');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();
const dataservice = require(__dirname + "/data-service.js");

const storage = multer.diskStorage({
    destination: "./public/images/uploaded",
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
      }
});

const upload = multer({storage: storage});

onHttpStart = () => {
    console.log('Express http server listening on port ' + HTTP_PORT);
}

//use
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));


//home
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + "/views/home.html"));
});

//otherwise /home would return an error
app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname + "/views/home.html"));
});


//about
app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname + "/views/about.html"));
});


//employees
app.get("/employees", (req, res) => {
    if (req.query.status) {
        dataservice.getEmployeeByStatus(req.query.status).then((data) => {
            res.json({data});
        }).catch((err) => {
            res.json({message: err});
        })
    }
    else if (req.query.department) {
        dataservice.getEmployeesByDepartment(req.query.department).then((data) => {
            res.json({data});
        }).catch((err) => {
            res.json({message: err});
        })
    }
    else if (req.query.manager) {
        dataservice.getEmployeesByManager(req.query.manager).then((data) => {
            res.json({data});
        }).catch((err) => {
            res.json({message: err});
        })
    }
    else {
        dataservice.getAllEmployees().then((data) => {
            res.json({data});
        }).catch((err) => {
            res.json({message: err});
        })
    }
});

app.get('/employee/:value', (req,res) => {
    dataservice.getEmployeeByNum(req.params.value).then((data) => {
        res.json({data});
    }).catch((err) => {
        res.json({message: err});
    })
});

app.get('/employees/add',(req,res) => {
    res.sendFile(path.join(__dirname + "/views/addEmployee.html"));
});

app.post('/employees/add', (req,res) => {
    dataservice.addEmployee(req.body).then(() => {
        res.redirect("/employees");
    })
});


//images
app.get('/images/add',(req,res) => {
    res.sendFile(path.join(__dirname + "/views/addImage.html"));
});

app.post("/images/add", upload.single("imageFile"), (req,res) => {
    res.redirect("/images");
});

app.get("/images", (req,res) => {
    fs.readdir("./public/images/uploaded", function(err,items) {
        res.json(items);
    })
});


//managers
app.get("/managers", (req, res) => {
    dataservice.getManagers().then((data) => {
        res.json({data});
    }).catch((err) => {
        res.json({message: err});
    })
});


//departments
app.get("/departments", (req, res) => {
    dataservice.getDepartments().then((data) => {
        res.json({data});
    }).catch((err) => {
        res.json({message: err});
    })
});


app.use((req, res) => {
    res.status(404).end('404 PAGE NOT FOUND');
});

dataservice.initialize().then(() => {
    app.listen(HTTP_PORT, onHttpStart())
}).catch (() => {
    console.log('promises unfulfilled');
});