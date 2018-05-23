import { connect } from "react-redux";
import React from "react";
import axios from "./axios";
import { BrowserRouter, Route, Link } from "react-router-dom";
import {
    receiveWannabesAndFriends,
    acceptFriend,
    destroyMyFriend
} from "./actions";

function mapStateToProps(state) {
    console.log("mapStateToProps", state.users);
    return {
        friends: state.users && state.users.filter((user) => user.status == 2),
        wannabes:
            state.users &&
            state.users.filter(
                (user) => user.status == 1 && user.receiver_id != user.id
            )
    };
}
class Friends extends React.Component {
    componentDidMount() {
        this.props.dispatch(receiveWannabesAndFriends());
    }
    // componentwillreceiveprops() {
    //     this.props.dispatch(receiveWannabesAndFriends());
    // }
    render() {
        if (!this.props.friends && !this.props.wannabes) {
            return <h1 id="dudeText">go make some friends dude!!!</h1>;
        } else {
            return (
                <React.Fragment>
                    <div className="usersContainer">
                        {<h1 id="pending">pending friend requests</h1>}
                        {<h1 id="approved">here are your friends</h1>}
                        <div id="wannabeHolder">
                            {this.props.wannabes.map((wannabe) => {
                                return (
                                    <div key={wannabe.id} className="wannabe">
                                        <div>
                                            <img src={wannabe.url} />
                                        </div>
                                        <p>
                                            #{wannabe.first} {wannabe.last}
                                        </p>
                                        <button
                                            onClick={() =>
                                                this.props.dispatch(
                                                    acceptFriend(wannabe.id)
                                                )
                                            }
                                        >
                                            Accept
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                        <div id="friendsHolder">
                            {this.props.friends.map((friend) => {
                                return (
                                    <div key={friend.id} className="friend">
                                        <div>
                                            <img src={friend.url} />
                                        </div>
                                        <p>
                                            #{friend.first} {friend.last}
                                        </p>
                                        <button
                                            onClick={() =>
                                                this.props.dispatch(
                                                    destroyMyFriend(friend.id)
                                                )
                                            }
                                        >
                                            End Friendship
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </React.Fragment>
            );
        }
    }
}

export default connect(mapStateToProps)(Friends);
