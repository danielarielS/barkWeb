import React from "react";
import axios from "./axios";
import { BrowserRouter, Route, Link } from "react-router-dom";
import { FriendButton } from "./FriendButton";

export class AnotherUser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.getData = this.getData.bind(this);
    }
    getData(arg) {
        axios
            .get(`/userinfo/${arg}`)
            .then((response) => {
                if (response.data.success) {
                    this.setState({
                        first: response.data.first,
                        last: response.data.last,
                        url: response.data.url,
                        bio: response.data.bio,
                        id: response.data.id
                    });
                }
            })
            .catch((err) => {
                console.log(`error in GET/params: ${err}`);
            });
    }

    componentDidMount() {
        this.getData(parseInt(this.props.match.params.userId));
        if (parseInt(this.props.match.params.userId) == this.props.id) {
            return this.props.history.push("/profile");
        }
    }
    componentWillReceiveProps(nextProps) {
        console.log("will receive ", nextProps.match);
        if (parseInt(nextProps.match.params.userId) != this.state.id) {
            this.getData(parseInt(nextProps.match.params.userId));
        }
    }
    render() {
        return (
            <div className="otherUser">
                <div className="otherUserSmall">
                    <div>
                        <img
                            src={this.state.url}
                            alt={`${this.state.first} ${this.state.last}`}
                        />
                    </div>
                    <h3>{`#${this.state.first} ${this.state.last}`}</h3>
                    <div id="otherBio">
                        <p>{this.state.bio}</p>
                    </div>
                    <FriendButton user_id={this.props.match.params.userId} />
                </div>

                <Link to="/profile">Back to my profile</Link>
            </div>
        );
    }
}
