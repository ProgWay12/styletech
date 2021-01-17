const express = require('express')
const mysql = require('mysql2')
const bodyParser = require('body-parser')
var session = require('express-session');
const hbs = require('hbs')
const expressHbs = require("express-handlebars");
const e = require('express');
var Robokassa = require('robokassa');
var  r = new Robokassa({login: "styletechru", password: "rqyZ2O1ysAg86a4ZsJBL"});
const app = express();

const jsonParser = express.json();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const PORT = process.env.PORT || 5000
app.set('port', PORT);

app.engine("hbs", expressHbs(
    {
        layoutsDir: "views/layouts", 
        defaultLayout: "ask_layout",
        extname: "hbs"
    }
))
app.set("view engine", "hbs");

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use('/static', express.static(__dirname + '/static'));

const pool = mysql.createPool({
    socketPath: "/var/run/mysqld/mysqld.sock",
    user: "c31565_styletech_me",
    password: "JeSvuKudramux13",
    database: "c31565_styletech_me"
});
         
app.get("/", (req, res) => {
    if (typeof(req.session.user_id) == "undefined") {
        pool.query("insert into users (email, phone_number, user_name, ask_id, straight, dramatic, classic, romantic) values (?, ?, ?, ?, ?, ?, ?, ?)", ["", "", "", 1, 0, 0, 0, 0], (err, results) => {
            if (err) {
                console.log(err)
                res.sendStatus(502)
            } else {
                pool.query("select * from users where id = ?", [results.insertId], (err1, results1) => {
                    if (err1) {
                        console.log(err1)
                        res.sendStatus(502)
                    } else {
                        req.session.user_id = results1[0].id
                        pool.query("select * from asks where id = ?", [results1[0].ask_id], (err, result) => {
                            if (err) {
                                console.log(err)
                                res.sendStatus(502)
                            } else {
                                if (typeof(result[0]) != "undefined") {
                                    res.render("ask.hbs", {
                                        ask: result[0]
                                    })
                                    
                                } else {
                                    res.sendStatus(502)
                                }
                            }
                        })
                    }
                })
            }
        })
    } else {
        pool.query("select * from users where id = ?", [req.session.user_id], (err1, results1) => {
            if (err1) {
                console.log(err1)
                res.sendStatus(502)
            } else {
                if (results1[0].ask_id <= 100) {
                    pool.query("select * from asks where id = ?", [results1[0].ask_id], (err, result) => {
                        if (err) {
                            console.log(err)
                            res.sendStatus(502)
                        } else {
                            if (typeof(result[0]) != "undefined") {
                                res.render("ask.hbs", {
                                    ask: result[0]
                                })
                            } else {
                                res.sendStatus(502)
                            }
                        }
                    })
                } else if (results1[0].ask_id == 101) {
                    res.redirect("/form")
                } else if (results1[0].ask_id == 102) {
                    res.redirect("/end_page")
                }
            }
        })
    }
})

app.post("/count_of_points", jsonParser, (req, res) => {
    var answer = req.body.answer;
    var new_value;
    var new_ask_id;
    pool.query("select * from users where id = ?", [req.session.user_id], (err1, results1) => {
        if (err1) {
            console.log(err1)
            res.sendStatus(502)
        } else {
            if (answer == "straight") {
                new_value = results1[0].straight + 1;
                new_ask_id = results1[0].ask_id + 1;
                pool.query("update users set straight = ?, ask_id = ? where id = ?", [new_value, new_ask_id, req.session.user_id], (err2, results2) => {
                    if (err2) {
                        console.log(err2)
                        res.sendStatus(502)
                    } else {
                        res.json({
                            reload: true
                        })
                    }
                })
            } else if (answer == "dramatic") {
                new_value = results1[0].dramatic + 1;
                new_ask_id = results1[0].ask_id + 1;
                pool.query("update users set dramatic = ?, ask_id = ? where id = ?", [new_value, new_ask_id, req.session.user_id], (err2, results2) => {
                    if (err2) {
                        console.log(err2)
                        res.sendStatus(502)
                    } else {
                        res.json({
                            reload: true
                        })
                    }
                })
            } else if (answer == "classic") {
                new_value = results1[0].classic + 1;
                new_ask_id = results1[0].ask_id + 1;
                pool.query("update users set classic = ?, ask_id = ? where id = ?", [new_value, new_ask_id, req.session.user_id], (err2, results2) => {
                    if (err2) {
                        console.log(err2)
                        res.sendStatus(502)
                    } else {
                        res.json({
                            reload: true
                        })
                    }
                })
            } else if (answer == "romantic") {
                new_value = results1[0].romantic + 1;
                new_ask_id = results1[0].ask_id + 1;
                pool.query("update users set romantic = ?, ask_id = ? where id = ?", [new_value, new_ask_id, req.session.user_id], (err2, results2) => {
                    if (err2) {
                        console.log(err2)
                        res.sendStatus(502)
                    } else {
                        res.json({
                            reload: true
                        })
                    }
                })
            }
        }
    })
})

app.get("/form", (req, res) => {
    pool.query("select * from users where id = ?", [req.session.user_id], (err, results) => {
        if (err) {
            console.log(err)
            res.sendStatus(502)
        } else {
            if (results[0].ask_id == 101) {
                res.render("form.hbs")
            }
        }
    })
})

app.post("/form", (req, res) => {
    const user_name = req.body.user_name
    const number = req.body.number
    const email = req.body.mail
    var new_ask_id;
    pool.query("select * from users where id = ?", [req.session.user_id], (err1, results1) => {
        if (err1) {
            console.log(err1)
            res.sendStatus(502)
        } else {
            new_ask_id = results1[0].ask_id + 1
            pool.query("update users set email = ?, phone_number = ?, user_name = ?, ask_id = ? where id = ?", [email, number, user_name, new_ask_id, req.session.user_id], (err, results) => {
                if (err) {
                    console.log(err1)
                    res.sendStatus(502)
                } else {
                    res.redirect("/end_page")
                }
            })
        }
    })
    
})

app.get("/end_page", (req, res) => {
    if (typeof(req.session.user_id) == "undefined") {
        res.redirect("/")
    } else {
        pool.query("select * from users where id = ?", [req.session.user_id], (err, results) => {
            if (err) {
                console.log(err)
                res.sendStatus(502)
            } else {
                var results_of_test= [{
                    type: "Натурал",
                    points: results[0].straight
                },{
                    type: "Драматик",
                    points: results[0].dramatic
                },{
                    type: "Гамин",
                    points: results[0].classic
                },{
                    type: "Романтик",
                    points: results[0].romantic
                },
                ]
                var class_of_man;
    
                var result_for_view = [{
                    type: "",
                    points: 0,
                    isstraight : false,
                    isdramatic : false,
                    isclassic : false,
                    isromantic : false,
                    ismain: false
                },{
                    type: "",
                    points: 0,
                    isstraight : false,
                    isdramatic : false,
                    isclassic : false,
                    isromantic : false,
                    ismain: false
                },{
                    type: "",
                    points: 0,
                    isstraight : false,
                    isdramatic : false,
                    isclassic : false,
                    isromantic : false,
                    ismain: false
                },{
                    type: "",
                    points: 0,
                    isstraight : false,
                    isdramatic : false,
                    isclassic : false,
                    isromantic : false,
                    ismain: false
                },]
    
                results_of_test.forEach((elem, i) => {
                    if (result_for_view[1].type == "") {
                        result_for_view[1].type = elem.type
                        result_for_view[1].points = elem.points
                    } else {
                        if (elem.points > result_for_view[1].points) {
                            if (result_for_view[3].type == "" || result_for_view[3].points > result_for_view[1].points) {
                                result_for_view[3].points = result_for_view[1].points
                                result_for_view[3].type = result_for_view[1].type
                            }
                            
                            result_for_view[1].points = elem.points
                            result_for_view[1].type = elem.type
                        } else if (elem.points < result_for_view[3].points || result_for_view[3].type == "") {
                            result_for_view[3].type = elem.type
                            result_for_view[3].points = elem.points
                        }
                    }
                })
                results_of_test.forEach((elem, i) => {
                    if (elem.type != result_for_view[1].type && elem.type != result_for_view[3].type) {
                        if (result_for_view[0].type == "") {
                            result_for_view[0].type = elem.type
                            result_for_view[0].points = elem.points
                        } else {
                            if (elem.points > result_for_view[0].points) {
                                if (result_for_view[2].type == "" || result_for_view[2].points > result_for_view[0].points) {
                                    result_for_view[2].points = result_for_view[0].points
                                    result_for_view[2].type = result_for_view[0].type
                                }
                                
                                result_for_view[0].points = elem.points
                                result_for_view[0].type = elem.type
                            } else if (elem.points < result_for_view[2].points || result_for_view[2].type == "") {
                                result_for_view[2].type = elem.type
                                result_for_view[2].points = elem.points
                            }
                        }
                    }
                })
                
                if (result_for_view[0].points < result_for_view[1].points) {
                    result_for_view[0].points = "-" + String(result_for_view[0].points)
                    result_for_view[0].ismain = true
                    class_of_man = "мягкий " + result_for_view[0].type.toLowerCase()
                    result_for_view[1].points = "+" + String(result_for_view[1].points)
                    result_for_view[2].points = "-" + String(result_for_view[2].points)
                    result_for_view[3].points = "+" + String(result_for_view[3].points)
                } else {
                    result_for_view[0].points = "+" + String(result_for_view[0].points)
                    result_for_view[0].ismain = true
                    class_of_man = "яркий " + result_for_view[0].type.toLowerCase()
                    result_for_view[1].points = "-" + String(result_for_view[1].points)
                    result_for_view[2].points = "+" + String(result_for_view[2].points)
                    result_for_view[3].points = "-" + String(result_for_view[3].points)
                }
                result_for_view.forEach((elem, i) => {
                    
                    if (elem.type == "Натурал") {
                        elem.isstraight = true
                    } else if (elem.type == "Драматик") {
                        elem.isdramatic = true
                    } else if (elem.type == "Гамин") {
                        elem.isclassic = true
                    } else if (elem.type == "Романтик") {
                        elem.isromantic = true
                    } 
                    console.log(elem)
                })
    
                res.render("end_page.hbs", {
                    layout: "end_layout",
                    results: result_for_view,
                    class_of_man: class_of_man
                })
            }
        })
    }
})

app.get("/buy_full", (req, res) => {
    link = r.merchantUrl({ id: 1, summ: 1, description: "description"});
    res.render("form.hbs", {
        paymentLink: link
    })
})

app.get('/payment/result', function (req, res){
    if(r.checkPayment(req.params)){
        console.log("PAYMENT SUCCESS!");
    }else{
    	console.log("PAYMENT NOT SUCCESS!");
    }
});

app.get('/payment/true', function (req, res){
    res.render('payment_true');
});
 
app.get('/payment/false', function (req, res){
    res.render('payment_false');
});

app.listen(process.env.APP_PORT, process.env.APP_IP, () => {
    console.log(PORT)
})