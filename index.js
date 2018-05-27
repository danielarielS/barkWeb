const express = require("express");
const app = express();
const compression = require("compression");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const csurf = require("csurf");
const { upload } = require("./s3");
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const cors = require("cors");
const axios = require("axios");
const fs = require("fs");
const https = require("https");
const {
    checkPassword,
    hashPassword,
    saveRegister,
    getUserInfo,
    saveUserImage,
    getBio,
    saveBio,
    getOtherUserInfo,
    nameOfUser,
    getFriendData,
    friendRequst,
    acceptFriend,
    destroyFriend,
    getWannbesAndFriends,
    getUsersByIds,
    getUserById,
    insertChat,
    getTenChats
} = require("./db");

const diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});
app.use(cors());
const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 4097152
    }
});
app.use(compression());
app.use(bodyParser());

app.use(express.static(__dirname + "/public"));
const server = require("http").Server(app);
const io = require("socket.io")(server, {
    origins:
        "localhost:8080 192.168.50.96:8080 https://thedogweb.herokuapp.com:*"
});
const cookieSessionMiddleware = cookieSession({
    secret: "a very secretive secret",
    maxAge: 1000 * 60 * 60 * 24 * 90
});
app.use(cookieSessionMiddleware);
io.use(function(socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});
app.use(csurf());
function downloadImage(req, res, next) {
    axios
        .get(req.body.url, {
            responseType: "stream"
        })
        .then((result) => {
            let x = uidSafe(24)
                .then((str) => {
                    let fileName = `${str}.${result.headers["content-type"]
                        .split("/")
                        .pop()}`;
                    const writeStream = fs.createWriteStream(
                        `./uploads/${fileName}`
                    );
                    result.data.pipe(writeStream);
                    req.file = {
                        filename: fileName,
                        mimetype: result.headers["content-type"],
                        size: result.headers["content-length"],
                        path: `${__dirname}/uploads/${fileName}`
                    };
                    console.log(req.file);
                    next();
                })
                .catch((err) => {
                    console.log(`requset to get pic error: ${err}`);
                });
        })
        .catch((err) => {
            console.log(`requset to get pic error: ${err}`);
        });
}
function formatDate(date) {
    var monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];

    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();

    return day + " " + monthNames[monthIndex] + " " + year;
}
// function sendReq(path) {
//     return new Promise(function(resolve, reject) {
//         https
//             .request(path, (res) => {
//                 let body = "";
//                 res.on("data", (chunk) => (body += chunk));
//                 res.on("end", () => {
//                     // console.log("this is the body", body);
//                     resolve(body);
//                 });
//                 res.on("error", (err) => reject(err));
//             })
//             .end();
//     });
// }
// function downloadImage(req, res, next) {
//     console.log(req.body.url);
//     sendReq(req.body.url).then((result) => {
//         // console.log("after sendReq", result);
//         let x = uidSafe(24)
//             .then((str) => {
//
//                 let fileName = `${str}.${result.headers["content-type"]
//                     .split("/")
//                     .pop()}`;
//                 const writeStream = fs.createWriteStream(
//                     `./uploads/${fileName}`
//                 );
//                 result.data.pipe(writeStream);
//                 req.file = {
//                     filename: fileName,
//                     mimetype: result.headers["content-type"],
//                     size: result.headers["content-length"],
//                     path: `${__dirname}/uploads/${fileName}`
//                 };
//                 // console.log(req.file);
//                 next();
//             })
//             .catch((err) => {
//                 console.log(`requset to get pic error: ${err}`);
//             });
//     });
// }
app.use(function(req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});
if (process.env.NODE_ENV != "production") {
    app.use(
        "/bundle.js",
        require("http-proxy-middleware")({
            target: "http://localhost:8081/"
        })
    );
} else {
    app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}
function requireLogin() {
    if (!req.session.userInfo) {
        res.sendStatus(403);
    } else {
        next();
    }
}
app.get("/getWannbesAndFriends", (req, res) => {
    getWannbesAndFriends(req.session.userInfo.id)
        .then((result) => {
            res.json({
                success: true,
                data: result.rows
            });
        })
        .catch((err) => {
            console.log(`error in getWannbesAndFriends: ${err}`);
        });
});
app.post("/acceptFriendRedux", (req, res) => {
    console.log(req.body.id);
    acceptFriend(req.session.userInfo.id, req.body.id)
        .then((result) => {
            res.json({ success: true });
        })
        .catch((err) => {
            console.log(`error in acceptFriendRedux: ${err}`);
        });
});
app.post("/cancelFriendRequst", (req, res) => {
    destroyFriend(req.session.userInfo.id, req.body.id)
        .then((result) => {
            res.json({ success: true });
        })
        .catch((err) => {
            console.log(`error in cancelFriendRequst: ${err}`);
        });
});
app.post("/sendFriendRequset", (req, res) => {
    if (!req.body.status) {
        friendRequst(req.session.userInfo.id, req.body.receiver_id, 1)
            .then((result) => {
                res.json({ status: 1, yourTheSender: true });
            })
            .catch((err) => {
                console.log(`error in friendRequst: ${err}`);
            });
    } else if (req.body.status == 1) {
        acceptFriend(req.session.userInfo.id, req.body.receiver_id)
            .then((result) => {
                res.json({ status: 2 });
            })
            .catch((err) => {
                console.log(`error in acceptFriend: ${err}`);
            });
    } else if (req.body.status == 2) {
        destroyFriend(req.session.userInfo.id, req.body.receiver_id)
            .then((result) => {
                res.json({ status: 0 });
            })
            .catch((err) => {
                console.log(`error in destroyFriend: ${err}`);
            });
    }
});
app.get("/getFriendStatus", (req, res) => {
    getFriendData(req.query.id)
        .then((result) => {
            if (!result.rows[0]) {
                res.json({
                    status: 0
                });
            } else if (req.session.userInfo.id == result.rows[0].sender_id) {
                res.json({
                    status: result.rows[0].status,
                    yourTheSender: true
                });
            } else {
                res.json({
                    status: result.rows[0].status,
                    yourTheSender: false
                });
            }
        })
        .catch((err) => {
            console.log(`error in getFriendData: ${err}`);
        });
});

app.post("/userName", (req, res) => {
    // console.log(req.body.name);
    let str = req.body.name;
    // str = str.slice(0, 1);
    // console.log(str);
    nameOfUser(str)
        .then((result) => {
            console.log(result.rows);
            res.json({
                data: result.rows
            });
        })
        .catch((err) => {
            console.log(`error in POST/userName: ${err}`);
        });
});
app.get("/userinfo/:id", (req, res) => {
    console.log(req.params.id);
    getOtherUserInfo(req.params.id).then((result) => {
        res.json({
            success: true,
            first: result.rows[0].first,
            last: result.rows[0].last,
            email: result.rows[0].email,
            url: result.rows[0].url,
            bio: result.rows[0].bio,
            id: result.rows[0].id
        });
    });
});
app.get("/user", (req, res) => {
    getUserInfo(req.session.userInfo.email)
        .then((result) => {
            res.json({
                success: true,
                first: result.rows[0].first,
                last: result.rows[0].last,
                email: result.rows[0].email,
                url: result.rows[0].url,
                bio: result.rows[0].bio,
                id: result.rows[0].id
            });
        })
        .catch((err) => {
            console.log(`error in GET/user: ${err}`);
        });
});
app.post("/setBio", (req, res) => {
    console.log(req.body.bio);
    saveBio(req.body.bio, req.session.userInfo.id).then((result) => {
        res.json({
            success: true
        });
    });
});

app.post("/upload", uploader.single("file"), upload, function(req, res) {
    let url = `https://s3.amazonaws.com/danielsocial/${req.file.filename}`;
    saveUserImage(url, req.session.userInfo.id)
        .then((result) => {
            res.json({
                success: true,
                url: url
            });
        })
        .catch((err) => {
            console.log(`error in POST/upload: ${err}`);
        });
});
app.post("/upload2", downloadImage, upload, (req, res) => {
    let url = `https://s3.amazonaws.com/danielsocial/${req.file.filename}`;
    saveUserImage(url, req.session.userInfo.id)
        .then((result) => {
            res.json({
                success: true,
                url: url
            });
        })
        .catch((err) => {
            console.log(`error in upload2: ${err}`);
        });
});
app.post("/image", (req, res) => {
    saveUserImage(req.body.url, req.session.userInfo.id)
        .then((result) => {
            res.json({ success: true });
        })
        .catch((err) => {
            console.log(`error in POST/image: ${err}`);
        });
});
app.post("/login", (req, res) => {
    getUserInfo(req.body.email)
        .then((result) => {
            checkPassword(req.body.password, result.rows[0].password).then(
                (bool) => {
                    if (bool) {
                        req.session.userInfo = {
                            first: req.body.first,
                            last: req.body.last,
                            email: req.body.email,
                            id: result.rows[0].id
                        };
                        res.json({ success: true });
                    } else {
                        res.json({
                            success: false
                        });
                    }
                }
            );
        })
        .catch((err) => {
            console.log(`There was an error in POST /login ${err}`);
            res.json({
                success: false
            });
        });
});
app.post("/register", (req, res) => {
    if (
        req.body.first &&
        req.body.last &&
        req.body.email &&
        req.body.password
    ) {
        hashPassword(req.body.password)
            .then((hash) => {
                saveRegister(
                    req.body.first,
                    req.body.last,
                    req.body.email,
                    hash
                ).then((result) => {
                    req.session.userInfo = {
                        first: req.body.first,
                        last: req.body.last,
                        email: req.body.email,
                        id: result.rows[0].id
                    };

                    res.json({ success: true });
                });
            })
            .catch((err) => {
                console.log(`There was an error in POST /register ${err}`);
            });
    } else {
        res.json({
            success: false
        });
    }
});
app.get("/logout", (req, res) => {
    req.session = null;
    res.redirect("/welcome");
});
app.get("/welcome", function(req, res) {
    if (req.session.userInfo) {
        res.redirect("/chat");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});
app.get("*", function(req, res) {
    if (!req.session.userInfo) {
        res.redirect("/welcome");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});
server.listen(process.env.PORT || 8080, function() {
    console.log("I'm listening on 8080.");
});
let arrayOfOnlineUsers = [];
let arrayOfIds = [];

io.on("connection", function(socket) {
    if (!socket.request.session || !socket.request.session.userInfo) {
        return socket.disconnect(true);
    }
    //// get the chat history //////////
    let chatArray = [];
    if (chatArray.length > 10) {
        chatArray.pop();
    }
    getTenChats().then((result) => {
        // console.log("getTenChats", result.rows);
        chatArray = [...result.rows].reverse();
        // console.log("this is chatArray", chatArray);
        for (var i = 0; i < chatArray.length; i++) {
            chatArray[i].created_at = formatDate(chatArray[i].created_at);
        }
        io.emit("chatMessage", {
            chat: chatArray
        });
    });

    // console.log(arrayOfOnlineUsers);
    // console.log(`socket with the id ${socket.id} is now connected`);
    let session = socket.request.session.userInfo;
    let cookieId = socket.request.session.userInfo.id;
    // console.log(`user number ${cookieId}`);

    let user = {
        socketId: socket.id,
        userId: cookieId
    };
    arrayOfOnlineUsers.unshift(user);

    // console.log(arrayOfOnlineUsers);

    for (let i = 0; i < arrayOfOnlineUsers.length; i++) {
        arrayOfIds.push(arrayOfOnlineUsers[i].userId);
    }
    getUsersByIds(arrayOfIds)
        .then((result) => {
            // console.log(result.rows);
            socket.emit("onlineUsers", {
                online: result.rows
            });
        })
        .catch((err) => {
            console.log(`error in getUsersByIds: ${err}`);
        });

    if (
        arrayOfIds.filter((v) => v == cookieId).length == 1 &&
        arrayOfIds.length > 1
    ) {
        // console.log("from user joined", cookieId);
        getUserById(cookieId)
            .then((response) => {
                // console.log(response.rows[0]);
                socket.broadcast.emit("userJoined", {
                    newUser: response.rows[0]
                });
            })
            .catch((err) => {
                console.log(`error in getUserById: ${err}`);
            });
    }

    socket.on("disconnect", function() {
        console.log(`socket with the id ${socket.id} is now disconnected!!!!`);
        // console.log("in disconnect", arrayOfOnlineUsers, cookieId, arrayOfIds);
        arrayOfOnlineUsers = arrayOfOnlineUsers.filter((item) => {
            // console.log(item.socketId, socket.id);
            return item.socketId != socket.id;
        });
        // console.log("after the filter:", arrayOfOnlineUsers);
        if (
            !arrayOfOnlineUsers.find((item) => {
                item.userId == cookieId;
            })
        ) {
            arrayOfIds = arrayOfIds.filter((v) => {
                v != cookieId;
            });
            io.emit("userLeft", {
                userId: cookieId
                // online: arrayOfOnlineUsers
            });
        }
    });
    socket.on("chatMessage", (data) => {
        // console.log(data);
        insertChat(data, cookieId)
            .then(() => {
                getTenChats().then((result) => {
                    // console.log("getTenChats", result.rows);
                    chatArray = [...result.rows].reverse();
                    // console.log("this is chatArray", chatArray);
                    for (var i = 0; i < chatArray.length; i++) {
                        chatArray[i].created_at = formatDate(
                            chatArray[i].created_at
                        );
                    }
                    io.emit("chatMessage", {
                        chat: chatArray
                    });
                });
                // getUserById(cookieId).then((response) => {
                //     let obj = {
                //         ...result.rows[0],
                //         last: response.rows[0].last,
                //         first: response.rows[0].first,
                //         url: response.rows[0].url
                //     };
                //     // console.log("here is obj", obj);
                //     // console.log("here is session", session);
                //     chatArray.push(obj);
                //
                //     console.log(chatArray);
                //     io.emit("chatMessage", {
                //         chat: chatArray
                //     });
                // });
            })
            .catch((err) => {
                console.log(`error in insertChat: ${err}`);
            });
    });
});
