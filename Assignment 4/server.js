/*********************************************************************************
* WEB322 – Assignment 04
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students. *
* Name: Edward Vuong Student ID: 120246186 Date: March 8, 2019 *
* Online (Heroku) Link: https://still-atoll-80136.herokuapp.com/
* ********************************************************************************/

const HTTP_PORT = process.env.PORT || 8080;
const express = require('express');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();
const dataservice = require(__dirname + "/data-service.js");
const exphbs = require('express-handlebars');

const storage = multer.diskStorage({
    destination: "./public/images/uploaded",
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
      }
});

const upload = multer({storage: storage});

app.engine('.hbs', exphbs({ 
    extname: ".hbs", 
    defaultLayout: "main",
    helpers: {
        navLink: function(url, options){
            return '<li' + 
                ((url == app.locals.activeRoute) ? ' class="active" ' : '') + '><a href="' + url + '">' + options.fn(this) + '</a></li>'; },
        equal: function (lvalue, rvalue, options) {
            if (arguments.length < 3)
                throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) {
                return options.inverse(this);
            } else {
                return options.fn(this);
            }
        }           
    } 
}));

app.set('view engine', '.hbs');

onHttpStart = () => {
    console.log('Express http server listening on port ' + HTTP_PORT);
}

//use
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));

app.use(function(req,res,next) {
    let route = req.baseUrl+req.path;
    app.locals.activeRoute = (route == "/") ? "/":route.replace(/\/$/,"");
    next();
});

//home
app.get('/', (req, res) => {
    res.render(path.join(__dirname + "/views/home.hbs"));
});

//otherwise /home would return an error
app.get('/home', (req, res) => {
    res.render(path.join(__dirname + "/views/home.hbs"));
});


//about
app.get('/about', (req, res) => {
    res.render(path.join(__dirname + "/views/about.hbs"));
});


//employees
app.get("/employees", (req, res) => {
    if (req.query.status) {
        dataservice.getEmployeeByStatus(req.query.status).then((data) => {
            res.render("employees",{employees: data});
        }).catch((err) => {
            res.render({message: "no results"});
        })
    }
    else if (req.query.department) {
        dataservice.getEmployeesByDepartment(req.query.department).then((data) => {
            res.render("employees",{employees: data});
        }).catch((err) => {
            res.render({message: "no results"});        
        })
    }
    else if (req.query.manager) {
        dataservice.getEmployeesByManager(req.query.manager).then((data) => {
            res.render("employees",{employees: data});
        }).catch((err) => {
            res.render({message: "no results"});
        })
    }
    else {
        dataservice.getAllEmployees().then((data) => {
            res.render("employees",{employees: data});
        }).catch((err) => {
            res.render({message: "no results"});
        })
    }
});

app.get('/employee/:value', (req,res) => {
    dataservice.getEmployeeByNum(req.params.value).then((data) => {
        res.render("employee", { employee: data });
    }).catch((err) => {
        res.render("employee",{message:"no results"});
    })
});

app.get('/employees/add',(req,res) => {
    res.render(path.join(__dirname + "/views/addEmployee.hbs"));
});

app.post('/employees/add', (req,res) => {
    dataservice.addEmployee(req.body).then(() => {
        res.redirect("/employees");
    })
});

app.post('/employee/update', (req, res) => {
    dataservice.updateEmployee(req.body).then(() => {
        res.redirect("/employees");
    })
});


//images
app.get('/images/add',(req,res) => {
    res.render(path.join(__dirname + "/views/addImage.hbs"));
});

app.post("/images/add", upload.single("imageFile"), (req,res) => {
    res.redirect("/images");
});

app.get("/images", (req,res) => {
    fs.readdir("./public/images/uploaded", function(err,items) {
        res.render("images", { data: items });
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
        res.render("departments", {departments:data});
    }).catch((err) => {
        res.render({message: "no results"});
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