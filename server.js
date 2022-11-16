/*********************************************************************************
*  WEB322 – Assignment 04
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part 
*  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Parth Vyas Student ID: 153646211 Date: 11 November 2022
*
*  Online (Heroku) Link: 
*
********************************************************************************/ 


const HTTP_PORT = process.env.PORT || 8080;
const express = require("express");
const path = require("path");
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

app.engine('.hbs', exphbs.engine({ extname: ".hbs", defaultLayout: "main",
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

// call this function after the http server starts listening for requests
function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}

app.use(express.static('public'));

app.use(bodyParser.urlencoded({extended:true}));

app.use(function(req, res, next){
    let route = req.baseUrl + req.path;
    app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
    next();
});

app.get('/', (req, res) => {
    res.render(path.join(__dirname + "/views/home.hbs"));
});

app.get('/home', (req, res) => {
    res.render(path.join(__dirname + "/views/home.hbs"));
});

// setup another route to listen on /about
app.get("/about", function(req,res){
  res.render(path.join(__dirname, "/views/about.hbs"));
});

app.get("/intlstudents", (req, res) => {
    dataservice.getInternationalStudents().then((data) => {
        res.json({data});
    }).catch((err) => {
        res.json({message: err});
    })
});



app.get('/students', (req,res) => {
    if (req.query.status) {
        dataservice.getStudentsByStatus(req.query.status).then((data) => {
            res.render("students", {students: data})
        }).catch((err) => {
            res.render("students", {message: "no results"});
        })
    }
    else if (req.query.program) {
        dataservice.getStudentsByProgramCode(req.query.program).then((data) => {
            res.render("students", {students: data})
        }).catch((err) => {
            res.render("students", {message: "no results"});
        })
    }
    else if (req.query.credential) {
        dataservice.getStudentsByExpectedCredential(req.query.credential).then((data) => {
            res.render("students", {students: data})
        }).catch((err) => {
            res.render("students", {message: "no results"});
        })
    }
    else {
        dataservice.getAllStudents().then((data) => {
            res.render("students", {students: data})
        }).catch((err) => {
            res.render("students", {message: "no results"});
        })
    }
});

app.post('/students/add', (req,res) => {
    dataservice.addStudent(req.body).then(() => {
        res.redirect("/students");
    })
});

app.get('/students/add',(req,res) => {
    res.render(path.join(__dirname + "/views/addStudent.hbs"));
});

app.get('/student/:sid', (req,res) => {
    dataservice.getStudentById(req.params.sid).then((data) => {
        res.render("student", {student: data})
    }).catch((err) => {
        res.render("student", {message: "no results"});
    })
});

app.post("/student/update", (req, res) => {
    dataservice.updateStudent(req.body).then(() => {
        res.redirect("/students");
    })
});

app.get("/programs", (req, res) => {
    dataservice.getPrograms().then((data) => {
        res.render("programs", {programs: data});
    }).catch((err) => {
        res.render("programs", {message: "no results"});
    })
});

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


app.use((req, res) => {
    res.status(404).end('404 PAGE NOT FOUND');
});

dataservice.initialize().then(() => {
    app.listen(HTTP_PORT, onHttpStart());
}).catch (() => {
    console.log('promises unfulfilled');
});


