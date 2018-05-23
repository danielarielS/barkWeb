import axios from "./axios";

export async function receiveWannabesAndFriends() {
    const { data } = await axios.get("/getWannbesAndFriends");
    return {
        type: "RECEIVE_FRIENDS_WANNABES",
        users: data.data
    };
}
export async function acceptFriend(id) {
    // console.log("acceptFriend", id);
    const { data } = await axios.post("/acceptFriendRedux", { id });

    return {
        type: "ACCEPT_FRIEND_REQUEST",
        id
    };
}
export async function destroyMyFriend(id) {
    // console.log("destroyMyFriend", id);
    try {
        const { data } = await axios.post("/cancelFriendRequst", { id });
        return {
            type: "UNFRIEND",
            id
        };
    } catch (err) {
        console.log("cancelFriendRequst", err);
    }
}
export function onlineUsers(data) {
    // console.log(`action onlineUsers: ${data}`);
    return {
        type: "ONLINE_USERS",
        online: data.online
    };
}
export function userJoined(data) {
    // console.log(`action userJoined: ${data}`);
    return {
        type: "USER_JOINED",
        newUser: data.newUser
    };
}
export function userLeft(data) {
    // console.log(`action userLeft: ${data.userId}`);
    return {
        type: "USER_LEFT",
        // online: data.online
        userId: data.userId
    };
}
export function chatMessage(data) {
    // console.log("from action", data);
    return {
        type: "NEW_CHAT",

        chat: data.chat
    };
}
