"use strict";


//require modules
var express = require("express");
var bodyParser = require("body-parser");
var fileUpload = require("express-fileupload");
var session = require("express-session");
var mysql = require("mysql");

var port = 8000;


//Create our express app object
var app = express();


//templating machine
app.use(express.static("assets"));
app.use('/static', express.static('static'));


//Configure middlewares
app.use(session({
    secret: "ttgfhrwgedgnl7qtcoqtcg2uyaugyuegeuagu111",
    resave: false,
    saveUninitialized: true,
    cookie: {maxAge: 1 * 60 * 60 * 1000}
}));
app.set("view-engine", "ejs");
app.set("views", "templates");
app.use(express.static("static"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(fileUpload());


// configure out database connection
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "12345678",
    database: "nodeMySQL_db",
    multipleStatements: true
});

//connect to database
con.connect(function (err) {
    if (err) {
        console.log("Error: " + err);
    } else {
        console.log("Successfully connected to DB");
    }
});

var correctUser = false;
var userHint;

//image info
var imgPath = [];
var imgUploader = [];
var imgUploaderId = [];
var imgName = [];
var imgDate = [];
var likes = [];



//Configure application Routes
app.get("/", function (req, res) {

    var sessionData = req.session.data;
    var searchId = req.query.imageName;

    if (searchId) {

        var sql = `SELECT * FROM images WHERE imageName = "${searchId}";`;
        var sql2 = `SELECT * FROM comments WHERE imageName = "${searchId}";`;

        var content = [];
        var user = [];


        con.query(sql + sql2, function (err, results) {
            if (err) {
                res.send("A database error occurred: " + err);
            } else {

                var detailPath = results[0][0].path;
                var detailImgName = results[0][0].imageName;
                var detailUploader = results[0][0].uploader;
                var detailDate = results[0][0].date;
                var detailLikes = results[0][0].likes;

                if (results[1].length > 0) {

                    for (let i = 0; i < results[1].length; i++) {

                        content.push(results[1][i].content);
                        user.push(results[1][i].username);
                    }

                    console.log(content);
                    console.log(user);

                    if (sessionData) {
                        res.render("details.ejs",
                            {
                                "userGreeting": "Hi" + "  " + sessionData.userFirstname + "." + " " + " You can like and leave comments on photos.",
                                "isLoggedIn": "true",
                                "link": "/profile",
                                "button": "Profile",
                                detailPath, detailImgName, detailUploader, detailDate, detailLikes, content, user
                            });
                    } else {
                        res.render("details.ejs",
                            {
                                "userGreeting": "Hi there. Feel free to browse all images.",
                                "isLoggedIn": "false",
                                "link": "/login",
                                "button": "Log in",
                                detailPath, detailImgName, detailUploader, detailDate, detailLikes, content, user
                            });
                    }
                } else if (results[1].length == 0) {

                    content="No comments yet";
                    user="";

                    console.log(content);
                    console.log(user);

                    if (sessionData) {
                        res.render("details.ejs",
                            {
                                "userGreeting": "Hi" + "  " + sessionData.userFirstname + "." + " " + " You can like and leave comments on photos.",
                                "isLoggedIn": "true",
                                "link": "/profile",
                                "button": "Profile",
                                detailPath, detailImgName, detailUploader, detailDate, detailLikes, content, user
                            });
                    } else {
                        res.render("details.ejs",
                            {
                                "userGreeting": "Hi there. Feel free to browse all images.",
                                "isLoggedIn": "false",
                                "link": "/login",
                                "button": "Log in",
                                detailPath, detailImgName, detailUploader, detailDate, detailLikes, content, user
                            });
                    }
                }
            }
        })

    } else {

        var sql3 = `SELECT * FROM images`;

        con.query(sql3, function (err, results) {
            if (err) {
                res.send("A database error occurred: " + err);
            } else {
                if (results.length > 0) {

                    imgPath = [];
                    imgUploader = [];
                    imgUploaderId = [];
                    imgName = [];
                    imgDate = [];
                    likes = [];

                    let imgInfo = results;

                    for (let i = 0; i < imgInfo.length; i++) {
                        imgPath.push(imgInfo[i]["path"]);
                        imgUploader.push(imgInfo[i]["uploader"]);
                        imgUploaderId.push(imgInfo[i]["username"]);
                        imgName.push(imgInfo[i]["imageName"]);
                        imgDate.push(imgInfo[i]["date"]);
                        likes.push(imgInfo[i]["likes"])

                    }
                }

                if (sessionData) {
                    res.render("home.ejs",
                        {
                            "userGreeting": "Hi" + "  " + sessionData.userFirstname + "." + " " + " You can like and leave comments on photos.",
                            "isLoggedIn": "true",
                            "link": "/profile",
                            "button": "Profile" + " " + "(" + sessionData.userId + ")",
                            imgUploader, imgName, imgDate, imgPath, likes
                        });

                } else {
                    res.render("home.ejs",
                        {
                            "userGreeting": "Hi there. ¿Qué pasa? Feel free to browse all images.",
                            "isLoggedIn": "false",
                            "link": "/login",
                            "button": "Log in",
                            imgUploader, imgName, imgDate, imgPath, likes
                        });
                }
            }
        })

    }
});

app.post("/comments", function (req, res) {

    var sessionData = req.session.data;
    let username = sessionData.userId;

    let com = req.body.userComment;
    let img = req.body.imgName;

    let datacomment = "@"+username + ": " + " " + " " + " "+ com;

    var sql = `INSERT INTO comments (imageName, content, username)
    VALUES ("${img}","${com}","${username}")`;

    con.query(sql, function (err, results) {
        if (err) {
            res.send("Database error " + err);
        } else {
            res.json(datacomment);
        }
    });
});

app.post("/likes", function (req, res) {
    var sessionData = req.session.data;
    let username = sessionData.userId;
    let img = req.body.imgName;
    var likes = 0;

    var checkUserCom = `SELECT * FROM likes WHERE username = "${username}" AND imageName = "${img}"`;
    var insertUserCom = `INSERT INTO likes (imageName, username) VALUES ("${img}","${username}")`;
    var currentLikes = `SELECT COUNT(imageName) AS numOfLikes FROM likes WHERE imageName = "${img}" `;
    var insertLikes = `SELECT likes FROM images where imageName = "${img}"`;

    con.query(checkUserCom, function (err, results) {
        if (err) {
            res.send("A database error occurred: " + err);
        } else {
            console.log(results.length);
            if (results.length == 0) {
                con.query(insertUserCom, function (err, results) {
                    if (err) {
                        res.send("A database error occurred: " + err);
                    }
                    con.query(currentLikes, function (err, results) {
                        if (err) {
                            res.send("A database error occurred: " + err);
                        } else {
                            console.log(results);
                            likes = results[0].numOfLikes;
                            con.query(insertLikes, function (err, results) {
                                if (err) {
                                    res.send("A database error occurred: " + err);
                                } else {
                                    let updateLikes = `UPDATE images SET likes = ${likes} WHERE imageName = "${img}"`;
                                    con.query(updateLikes);
                                    res.json(likes + " " + "users liked this photo");
                                }
                            })
                        }
                    })
                })
            } else {
                res.json("It seems that you have already liked this photo!")
            }
        }
    })


});

app.get("/login", function (req, res) {
    res.render("login.ejs");
});

app.get("/profile", function (req, res) {
    var sessionData = req.session.data;
    console.log(sessionData);
    console.log(sessionData.userId);

    var sql = `SELECT * FROM images where username = "${sessionData.userId}"`;

    con.query(sql, function (err, results) {
        if (err) {
            res.send("A database error occurred: " + err);
        } else {
             console.log(results);
            if (results.length > 0) {

                imgPath = [];
                imgUploader = [];
                imgUploaderId = [];
                imgName = [];
                imgDate = [];
                likes = [];

                let imgInfo = results;

                for (let i = 0; i < imgInfo.length; i++) {
                    imgPath.push(imgInfo[i]["path"]);
                    imgUploader.push(imgInfo[i]["uploader"]);
                    imgUploaderId.push(imgInfo[i]["username"]);
                    imgName.push(imgInfo[i]["imageName"]);
                    imgDate.push(imgInfo[i]["date"]);
                    likes.push(imgInfo[i]["likes"])

                }
                if (sessionData) {
                    res.render("profile.ejs",
                        {
                            "username": sessionData.userFirstname,
                            "hasPhotos" : "true",
                            imgUploader, imgName, imgDate, imgPath, likes
                        });
                } else {
                    res.redirect("/");
                }
            } else if (results.length==0) {

                if (sessionData) {
                    res.render("profile.ejs",
                        {
                            "username": sessionData.userFirstname,
                            "hasPhotos" : "false",
                            imgUploader, imgName, imgDate, imgPath, likes
                        });
                } else {
                    res.redirect("/");
                }
            }

        }
    })

});

app.post("/profile", function (req, res) {
    var inputUser = req.body.username; // get the username
    var inputPass = req.body.password; // get the user password

    var sql = `SELECT * FROM users`;

    con.query(sql, function (err, results) {
        if (err) {
            res.send("A database error occurred: " + err);
        } else {
            if (results.length > 0) {
                var users = results;

                //check if the user input correspond to the database
                var data = users.filter(function (u) {
                    return (u.username == inputUser && u.password == inputPass);
                });

                //validation of credentials
                if (data[0] == null) {
                    for (let i = 0; i < users.length; i++) {
                        if (users[i].username == inputUser) {
                            correctUser = true;
                            userHint = users[i].hint;
                            break;
                        } else {
                            correctUser = false;
                            userHint = "User not found";
                        }
                    }
                    res.redirect("/invalid");

                } else {
                    for (let i = 0; i < users.length; i++) {
                        if (users[i].username == inputUser) {
                            var firstname = users[i].firstname;
                            var surname = users[i].surname;
                            var username = users[i].username;

                            var inputData = {
                                userFirstname: firstname,
                                userSurname: surname,
                                password: inputPass,
                                userId: username,
                            };
                            req.session.data = inputData;
                        }
                    }
                    res.redirect("/");
                }
            } else {
                res.send("No results returned");
            }
        }
    });
});

app.get("/upload", function (req, res) {
    var sessionData = req.session.data;
    res.render("upload.ejs", {"username": sessionData.userFirstname});
});

app.get("/invalid", function (req, res) {
    res.render("error.ejs", {"hint": userHint});

})

app.post("/uploaded", function (req, res) {
    var file = req.files.userImg;
    file.mv("static/uploads/" + file.name);
    var sessionData = req.session.data;

    // image info
    let imageName = file.name;
    let path = "static/uploads/" + file.name;
    let uploader = sessionData.userFirstname + " " + sessionData.userSurname;
    let username = sessionData.userId;
    let currentdate = new Date();
    let date = currentdate.getDate() + "/"
        + (currentdate.getMonth() + 1) + "/"
        + currentdate.getFullYear() + " at "
        + currentdate.getHours() + ":"
        + currentdate.getMinutes() + ":"
        + currentdate.getSeconds();

    let initialLikes = 0;

    //update db
    var sql = `INSERT INTO images ( path, imageName, uploader, username, date, likes)
    VALUES ("${path}","${imageName}","${uploader}","${username}", "${date}", "${initialLikes}")`;

    con.query(sql, function (err, results) {
        if (err) {
            res.send("Database error " + err);
        } else {
            res.render("uploaded.ejs",
                {
                    "filename": file.name,
                    "username": sessionData.userFirstname,
                    "uploaded": "true"
                });

        }
    });

    //pass image info to array
    var sql2 = `SELECT * FROM images`;

    con.query(sql2, function (err, results) {
        if (err) {
            res.send("A database error occurred: " + err);
        } else {
            if (results.length > 0) {
                let imgInfo = results;

                for (let i = 0; i < imgInfo.length; i++) {
                    imgPath.push(imgInfo[i]["path"]);
                    imgUploader.push(imgInfo[i]["uploader"]);
                    imgUploaderId.push(imgInfo[i]["username"]);
                    imgName.push(imgInfo[i]["imageName"]);
                    imgDate.push(imgInfo[i]["date"]);
                    likes.push(imgInfo[i]["likes"]);
                }

            } else {
                res.send("No results returned");
            }
        }
    });


});


app.get("/delete", function (req, res) {
    req.session.destroy();
    res.redirect("/");
});

app.get("/signup", function (req, res) {
    res.render("signup.ejs", {"repeated": 'false', 'specialChars': 'false', 'success': 'false'});
});

app.post("/signup", function (req, res) {
    var inputUser = req.body.username;
    var inputPass = req.body.password;
    var hint = req.body.hintForPassword;
    var firstname = req.body.firstname;
    var surname = req.body.surname;

    //confirm four fields are filled
    if (inputUser == '' || inputPass == '' || firstname == '' || surname == '') {
        res.send("Please fill in all mandatory fields");
    } else {
        var specialChars = /[^a-zA-Z0-9 ]/g;

        if (inputUser.match(specialChars) || inputPass.match(specialChars) || firstname.match(specialChars) || surname.match(specialChars)) {
            res.render("signup.ejs", {"repeated": 'false', 'specialChars': 'true', 'success': 'false'});

            //add only when there is no special characters
        } else {

            //check whether there are repeated username in the database

            var repeating = false;
            var sql = `SELECT * FROM users`;

            //return variable 'repeating' with true when repeated information found in the database
            con.query(sql, function (err, results) {
                if (err) {
                    res.send("A database error occurred: " + err);
                } else {
                    var users = results;
                    if (users.length > 0) {
                        for (var i in users) {
                            if (users[i].username == inputUser) {
                                repeating = true;
                                break;
                            }
                        }

                        //add new user information only when the username has not been entered
                        if (!repeating) {

                            var sql2 = `INSERT INTO users (username, firstname, surname, password, hint) 
                                        VALUES ("${inputUser}", "${firstname}","${surname}" ,"${inputPass}", "${hint}")`;

                            con.query(sql2, function (err, results) {
                                if (err) {
                                    res.send("Database error " + err);
                                } else {
                                    res.render("signup.ejs", {
                                        "repeated": 'false',
                                        'success': 'true',
                                        'specialChars': 'false'
                                    });
                                    // give the user a clue that they have signed up successfully
                                }
                            });
                        } else {
                            res.render("signup.ejs", {"repeated": 'true', 'success': 'false', 'specialChars': 'false'});
                        }
                    }
                }
            });
        }

    }


});

//parameters to show comments and image information on page
app.get("/images/:imageName", function (req, res) {
    var sessionData = req.session.data;
    var img = req.params.imageName;

    var sql = `SELECT * FROM images WHERE imageName = "${img}";`;
    var sql2 = `SELECT * FROM comments WHERE imageName = "${img}";`;

    var content = [];
    var user = [];

    con.query(sql + sql2, function (err, results) {
        if (err) {
            res.send("A database error occurred: " + err);
        } else {

            // console.log(results[1][0]);
            // console.log(results[1][1]);
            console.log(results[1][2]);
            console.log(results[1].length);
            //
            var detailPath = results[0][0].path;
            var detailImgName = results[0][0].imageName;
            var detailUploader = results[0][0].uploader;
            var detailDate = results[0][0].date;
            var detailLikes = results[0][0].likes;

            if (results[1].length > 0) {

                for (let i = 0; i < results[1].length; i++) {

                    content.push(results[1][i].content);
                    user.push(results[1][i].username);
                }

                console.log(content);
                console.log(user);

                if (sessionData) {
                    res.render("details.ejs",
                        {
                            "userGreeting": "Hi" + "  " + sessionData.userFirstname + "." + " " + " You can like and leave comments on photos.",
                            "isLoggedIn": "true",
                            "link": "/profile",
                            "button": "Profile",
                            detailPath, detailImgName, detailUploader, detailDate, detailLikes, content, user
                        });
                } else {
                    res.render("details.ejs",
                        {
                            "userGreeting": "Hi there. Feel free to browse all images.",
                            "isLoggedIn": "false",
                            "link": "/login",
                            "button": "Log in",
                            detailPath, detailImgName, detailUploader, detailDate, detailLikes, content, user
                        });
                }
            } else if (results[1].length == 0) {

                content="No comments yet for this photo";
                user=" ";


                if (sessionData) {
                    res.render("details.ejs",
                        {
                            "userGreeting": "Hi" + "  " + sessionData.userFirstname + "." + " " + " You can like and leave comments on photos.",
                            "isLoggedIn": "true",
                            "link": "/profile",
                            "button": "Profile",
                            detailPath, detailImgName, detailUploader, detailDate, detailLikes, content, user
                        });
                } else {
                    res.render("details.ejs",
                        {
                            "userGreeting": "Hi there. Feel free to browse all images.",
                            "isLoggedIn": "false",
                            "link": "/login",
                            "button": "Log in",
                            detailPath, detailImgName, detailUploader, detailDate, detailLikes, content, user
                        });
                }

            }

        }
    })

});


//Start the server
app.listen(port);
console.log("Server running on http://localhost:" + port);
