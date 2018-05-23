import React from "react";
import ReactDOM from "react-dom";
import { Welcome } from "./welcome";
import App from "./app";
import { createStore, applyMiddleware } from "redux";
import reduxPromise from "redux-promise";
import { composeWithDevTools } from "redux-devtools-extension";
import { reducer } from "./reducers";
import { Provider } from "react-redux";
import * as io from "socket.io-client";
import { init } from "./socket";

const store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(reduxPromise))
);
init(store);
let elem = (
    <Provider store={store}>
        <App />
    </Provider>
);
if (location.pathname == "/welcome") {
    ReactDOM.render(<Welcome />, document.querySelector("main"));
} else {
    ReactDOM.render(elem, document.querySelector("main"));
}
