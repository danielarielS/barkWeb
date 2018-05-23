import * as io from "socket.io-client";
import { onlineUsers, userJoined, userLeft, chatMessage } from "./actions";

let socket;

export function init(store) {
    if (!socket) {
        socket = io.connect();

        socket.on("onlineUsers", (data) => {
            // console.log("onlineUsers", data);
            store.dispatch(onlineUsers(data));
        });

        socket.on("userJoined", (data) => {
            // console.log("userJoined", data);

            store.dispatch(userJoined(data));
        });

        socket.on("userLeft", (data) => {
            // console.log("userLeft", data);

            store.dispatch(userLeft(data));
        });
        socket.on("chatMessage", (data) => {
            // console.log("chatMessage", data);

            store.dispatch(chatMessage(data));
        });
    }
    return socket;
}

export function emit(eventName, data) {
    socket.emit(eventName, data);
}
