import React from "react";
import axios from "./axios";
import { BrowserRouter, Route, Link } from "react-router-dom";
export class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        if (!this.props.first) {
            return null;
        }
        return (
            <React.Fragment>
                <div>
                    <UserPic
                        newUrl={this.props.newUrl}
                        first={this.props.first}
                        last={this.props.last}
                    />

                    <Route
                        path="/profile"
                        render={() => {
                            return (
                                <div>
                                    <Bio bio={this.props.bio} />
                                </div>
                            );
                        }}
                    />
                    <Route
                        path="/profile/editBio"
                        render={() => {
                            console.log("test");
                            return (
                                <EditBio
                                    bio={this.props.bio}
                                    setBio={this.props.setBio}
                                />
                            );
                        }}
                    />
                </div>
            </React.Fragment>
        );
    }
}
function UserPic(props) {
    if (props.newUrl) {
        return (
            <div className="userPicHolder">
                <div className="UserPic">
                    <img
                        src={props.newUrl}
                        alt={`${props.first} ${props.last}`}
                    />
                </div>
                <p>{`#${props.first} ${props.last}`}</p>
            </div>
        );
    } else {
        return (
            <div className="userPicHolder">
                <div className="UserPic">
                    <img src="/dog.png" alt={`${props.first} ${props.last}`} />
                </div>
                <p>{`#${props.first} ${props.last}`}</p>
            </div>
        );
    }
}
function Bio(props) {
    return (
        <div className="bioHolder">
            <div>
                <p>{props.bio}</p>
            </div>
            <Link className="bioLink" to="/profile/editBio">
                Edit your BIO
            </Link>
        </div>
    );
}
class EditBio extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.handleChange = this.handleChange.bind(this);
        this.submit = this.submit.bind(this);
    }
    submit() {
        console.log(this.state.bio);
        this.props.setBio(this.bio);
    }
    handleChange(e) {
        // this.setState({
        //     bio: e.target.value
        // });
        this[e.target.name] = e.target.value;
    }
    render() {
        return (
            <div className="editBio">
                <div id="editBioSmall">
                    <textarea
                        rows="10"
                        cols="50"
                        name="bio"
                        onChange={this.handleChange}
                        placeholder={this.props.bio}
                    />

                    <Link className="link1" onClick={this.submit} to="/profile">
                        Save
                    </Link>
                    <Link className="link2" to="/profile">
                        Close
                    </Link>
                </div>
            </div>
        );
    }
}
