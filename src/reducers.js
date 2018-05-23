export function reducer(state = {}, action) {
    if (action.type == "RECEIVE_FRIENDS_WANNABES") {
        state = { ...state, users: action.users };
    }

    if (action.type == "ACCEPT_FRIEND_REQUEST") {
        state = {
            ...state,
            users: state.users.map((user) => {
                if (user.id == action.id) {
                    return { ...user, status: 2 };
                } else {
                    return user;
                }
            })
        };
    }
    if (action.type == "UNFRIEND") {
        state = {
            ...state,
            users: state.users.map((user) => {
                if (user.id == action.id) {
                    return { ...user, status: null };
                } else {
                    return user;
                }
            })
        };
    }
    if (action.type == "ONLINE_USERS") {
        state = { ...state, online: action.online };
    }
    if (action.type == "USER_JOINED") {
        return {
            ...state,
            online: state.online.concat(action.newUser)
        };
    }
    if (action.type == "USER_LEFT") {
        // console.log("this is when the user left", state.online);
        const online = state.online.filter((user) => {
            return user.id != action.userId;
        });
        // console.log(online);
        state = { ...state, online };
        // state = { ...state, online: action.online };
    }
    if (action.type == "NEW_CHAT") {
        // console.log("in the reducer", state);
        state = {
            ...state,
            chat: action.chat
        };
    }
    return state;
}
