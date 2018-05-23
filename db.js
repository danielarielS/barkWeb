const spicedPg = require("spiced-pg");
const bcrypt = require("bcryptjs");
// let db = spicedPg("postgres:postgres:postgres@localhost:5432/social");
let db;
if (process.env.DATABASE_URL) {
    db = spicedPg(process.env.DATABASE_URL);
} else {
    db = spicedPg("postgres:postgres:postgres@localhost:5432/social");
}
function saveRegister(first, last, email, password) {
    return db.query(
        "INSERT INTO users (first, last, email, password) VALUES ($1, $2, $3, $4) RETURNING *",
        [first, last, email, password]
    );
}
function getUserInfo(email) {
    return db.query("SELECT * FROM users WHERE email=$1", [email]);
}
function saveUserImage(url, id) {
    return db.query("UPDATE users SET url=$1 WHERE id=$2", [url, id]);
}

function saveBio(bio, id) {
    return db.query("UPDATE users SET bio=$1 WHERE id=$2", [bio, id]);
}
function getOtherUserInfo(id) {
    return db.query("SELECT * FROM users WHERE id=$1", [id]);
}
function nameOfUser(name) {
    name = name + "%";
    // name = "`%${name}`";
    console.log(name);
    return db.query("SELECT * FROM users WHERE first LIKE $1", [name]);
}
function getFriendData(id) {
    return db.query(
        "SELECT * FROM friends WHERE (sender_id=$1 OR receiver_id=$1)",
        [id]
    );
}
function friendRequst(sender_id, receiver_id, status) {
    return db.query(
        "INSERT INTO friends (sender_id, receiver_id, status) VALUES ($1, $2, $3)",
        [sender_id, receiver_id, status]
    );
}
function acceptFriend(sender_id, receiver_id) {
    return db.query(
        "UPDATE friends SET status=2 WHERE status=1 AND ((sender_id=$1 AND receiver_id=$2) OR (sender_id=$2 AND receiver_id=$1))",
        [sender_id, receiver_id]
    );
}
function destroyFriend(sender_id, receiver_id) {
    return db.query(
        "DELETE FROM friends WHERE (sender_id=$1 AND receiver_id=$2) OR (sender_id=$2 AND receiver_id=$1)",
        [sender_id, receiver_id]
    );
}
function getWannbesAndFriends(id) {
    return db.query(
        `SELECT users.id, first, last, url, status,receiver_id  FROM friends JOIN users ON (status = 1 AND receiver_id = $1 AND sender_id = users.id) OR (status = 2 AND receiver_id = $1 AND sender_id = users.id)
    OR (status = 2 AND sender_id = $1 AND receiver_id = users.id)`,
        [id]
    );
}
function getUsersByIds(arrayOfIds) {
    return db.query("SELECT * FROM users WHERE id = ANY($1)", [arrayOfIds]);
}
function getUserById(id) {
    return db.query("SELECT * FROM users WHERE id = $1", [id]);
}
function insertChat(chat, id) {
    return db.query(
        "INSERT INTO chat (chat, user_id) VALUES ($1, $2) RETURNING *",
        [chat, id]
    );
}
function getTenChats() {
    return db.query(
        "SELECT chat, chat.created_at, first, last, url, chat.id from chat LEFT JOIN users ON chat.user_id=users.id ORDER BY chat.created_at DESC LIMIT 10"
    );
}
exports.saveRegister = saveRegister;
exports.checkPassword = checkPassword;
exports.hashPassword = hashPassword;
exports.saveUserImage = saveUserImage;
exports.getUserInfo = getUserInfo;
exports.saveBio = saveBio;
exports.getOtherUserInfo = getOtherUserInfo;
exports.nameOfUser = nameOfUser;
exports.getFriendData = getFriendData;
exports.friendRequst = friendRequst;
exports.acceptFriend = acceptFriend;
exports.destroyFriend = destroyFriend;
exports.getWannbesAndFriends = getWannbesAndFriends;
exports.getUsersByIds = getUsersByIds;
exports.getUserById = getUserById;
exports.insertChat = insertChat;
exports.getTenChats = getTenChats;

function hashPassword(plainTextPassword) {
    return new Promise(function(resolve, reject) {
        bcrypt.genSalt(function(err, salt) {
            if (err) {
                return reject(err);
            }
            bcrypt.hash(plainTextPassword, salt, function(err, hash) {
                if (err) {
                    return reject(err);
                }
                resolve(hash);
            });
        });
    });
}

function checkPassword(textEnteredInLoginForm, hashedPasswordFromDatabase) {
    return new Promise(function(resolve, reject) {
        bcrypt.compare(
            textEnteredInLoginForm,
            hashedPasswordFromDatabase,
            function(err, doesMatch) {
                if (err) {
                    reject(err);
                } else {
                    resolve(doesMatch);
                }
            }
        );
    });
}
