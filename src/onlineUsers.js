import { connect } from "react-redux";
import React from "react";
// import axios from "./axios";
import { Link } from "react-router-dom";
function mapStateToProps(state) {
    console.log("im in mapStateToProps", state);

    return {
        onlineUsers: state && state.online
    };
}

export class OnlineUsers extends React.Component {
    render() {
        console.log("im in the render", this.props.onlineUsers);
        if (!this.props.onlineUsers) {
            return <h1 id="noUsersOnline">no users are currently on-line</h1>;
        } else {
            return (
                <React.Fragment>
                    <div className="onlineHolder">
                        {this.props.onlineUsers.map((item) => {
                            return (
                                <div key={item.id} className="userHolder">
                                    <div>
                                        <img src={item.url} />
                                    </div>
                                    <Link to={`/user/${item.id}`}>
                                        <p>
                                            #{item.first} {item.last}
                                        </p>
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                </React.Fragment>
            );
        }
    }
}
export default connect(mapStateToProps)(OnlineUsers);
