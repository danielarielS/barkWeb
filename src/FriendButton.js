import React from "react";
import axios from "./axios";
import { BrowserRouter, Route, Link } from "react-router-dom";

export class FriendButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = { status: 0 };
        this.sendFriendRequset = this.sendFriendRequset.bind(this);
        this.cancelFriendRequst = this.cancelFriendRequst.bind(this);
    }
    cancelFriendRequst() {
        axios
            .post("/cancelFriendRequst", { receiver_id: this.props.user_id })
            .then((response) => {
                if (response.data.success) {
                    this.setState({ status: 0 });
                }
            })
            .catch((err) => {
                console.log(`error in cancelFriendRequst: ${err}`);
            });
    }
    sendFriendRequset() {
        axios
            .post("/sendFriendRequset", {
                receiver_id: this.props.user_id,
                status: null
            })
            .then((response) => {
                console.log(response.data);
                if (response.data.yourTheSender) {
                    this.setState({
                        status: response.data.status,
                        yourTheSender: response.data.yourTheSender
                    });
                } else {
                    this.setState({ status: response.data.status });
                }
            })
            .catch((err) => {
                console.log(`error in sendFriendRequset: ${err}`);
            });
    }
    componentDidMount() {
        axios
            .get("/getFriendStatus", { params: { id: this.props.user_id } })
            .then((response) => {
                console.log(response.data);
                if (response.data.yourTheSender) {
                    this.setState({
                        status: response.data.status,
                        yourTheSender: response.data.yourTheSender
                    });
                } else {
                    this.setState({
                        status: response.data.status
                    });
                }
            })
            .catch((err) => {
                console.log(`error in componentDidMount: ${err}`);
            });
    }
    render() {
        if (!this.state.status) {
            return (
                <button onClick={this.sendFriendRequset}>
                    Make Friend Requset
                </button>
            );
        } else if (this.state.status == 1 && this.state.yourTheSender) {
            return (
                <button onClick={this.cancelFriendRequst}>
                    Cancel Friend Requset
                </button>
            );
        } else if (this.state.status == 1 && !this.state.yourTheSender) {
            return (
                <button onClick={this.sendFriendRequset}>
                    Accept Friend Requset
                </button>
            );
        } else if (this.state.status == 2) {
            return (
                <button onClick={this.sendFriendRequset}>End Friendship</button>
            );
        } else {
            return null;
        }
    }
}
