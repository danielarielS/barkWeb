import React from "react";
import axios from "./axios";
import { BrowserRouter, Route, Link, Switch } from "react-router-dom";
import { ProfilePicUpload } from "./ProfilePicUpload.js";
import { Profile } from "./profile";
import { AnotherUser } from "./anotherUser";
import { NamesToShow } from "./NamesToShow";
import OnlineUsers from "./onlineUsers";
import Chat from "./chat";

import Friends from "./friends";

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            uploaderVisible: false
        };
        this.setNewImage = this.setNewImage.bind(this);
        this.toggleProfilePic = this.toggleProfilePic.bind(this);
        this.setBio = this.setBio.bind(this);
        this.closeuploader = this.closeuploader.bind(this);
    }
    componentDidCatch(error, info) {
        // Display fallback UI
        this.setState({ hasError: true });
        // You can also log the error to an error reporting service
        logErrorToMyService(error, info);
    }
    componentDidMount() {
        axios
            .get("/user")
            .then((response) => {
                if (response.data.success) {
                    this.setState({
                        first: response.data.first,
                        last: response.data.last,
                        newUrl: response.data.url,
                        bio: response.data.bio,
                        id: response.data.id
                    });
                }
            })
            .catch((err) => {
                console.log(`error in GET/user: ${err}`);
            });
    }
    setBio(arg) {
        axios
            .post("/setBio", { bio: arg })
            .then((response) => {
                if (response.data.success) {
                    this.setState({
                        bio: arg
                    });
                }
            })
            .catch((err) => {
                console.log(`error in POST/setBio: ${err}`);
            });
    }
    setNewImage(arg) {
        this.setState({
            newUrl: arg,
            uploaderVisible: false
        });
    }
    closeuploader() {
        document.querySelector("#popUpload").style.transform =
            "translateY(-50vh)";
        setTimeout(() => {
            document.querySelector("#megaHolder").style.filter = "blur(0px)";
            this.setState({
                uploaderVisible: false
            });
        }, 600);
    }
    toggleProfilePic() {
        this.setState({
            uploaderVisible: true
        });

        // if (!document.querySelector("#popUpload")) {
        //     return null;
        // }
        // document.querySelector("#popUpload").classList.add("show");
        // console.log(document.querySelector(".popUpload"));
    }
    render() {
        if (this.state.hasError) {
            return (
                <h1>
                    Oops something went wrong, we are working on it but for now
                    please refresh this page!
                </h1>
            );
        }
        return (
            <React.Fragment>
                {this.state.uploaderVisible && (
                    <ProfilePicUpload
                        setNewImage={this.setNewImage}
                        closeuploader={this.closeuploader}
                    />
                )}
                <BrowserRouter>
                    <div className="appMain" id="megaHolder">
                        <header>
                            <div className="logout">
                                <a href="/logout">
                                    <img src="/logout.png" />
                                </a>
                            </div>
                            <Link to="/about">
                                <Logo />
                            </Link>
                            <Link to="/profile">
                                <ProfilePic
                                    first={this.state.first}
                                    last={this.state.last}
                                    newUrl={this.state.newUrl}
                                />
                            </Link>
                        </header>

                        <div>
                            <Link to="/about" className="profileNav">
                                About
                            </Link>
                            <Link to="/friends" className="friendsNav">
                                friends
                            </Link>
                            <Link to="/online_users" className="online_search">
                                online users
                            </Link>
                            <Link to="/chat" className="chatNav">
                                chat
                            </Link>
                            <Route path="/about" component={About} />
                            <Route
                                path="/profile"
                                render={() => (
                                    <Profile
                                        first={this.state.first}
                                        last={this.state.last}
                                        newUrl={this.state.newUrl}
                                        bio={this.state.bio}
                                        setBio={this.setBio}
                                        toggleProfilePic={this.toggleProfilePic}
                                    />
                                )}
                            />
                            <Route
                                path="/user/:userId"
                                render={(x) => {
                                    return (
                                        <AnotherUser
                                            id={this.state.id}
                                            match={x.match}
                                            history={x.history}
                                        />
                                    );
                                }}
                            />
                            <Route path="/friends" component={Friends} />
                            <Route
                                path="/online_users"
                                component={OnlineUsers}
                            />
                            <Route path="/chat" component={Chat} />
                            <NamesToShow />
                        </div>
                    </div>
                </BrowserRouter>
            </React.Fragment>
        );
    }
}
function About() {
    return (
        <div id="aboutHolder">
            <div>
                <p>
                    This is a website for dog owners to connect with each other,
                    and talk about their favourite subject, DOGS!!! You first
                    setup your profile and then go and make new friends and even
                    join in on an online chat.{" "}
                </p>
            </div>
        </div>
    );
}
function Logo() {
    return <h1 className="logoText">barkWEB</h1>;
}
function ProfilePic(props) {
    if (!props.first) {
        return (
            <div className="profilePic">
                <img
                    src="https://i.redd.it/ounq1mw5kdxy.gif"
                    alt="spinner..."
                />
            </div>
        );
    } else if (!props.newUrl) {
        return (
            <div className="profilePic">
                <img src="/dog.png" alt={`${props.first} ${props.last}`} />
            </div>
        );
    } else {
        return (
            <div className="profilePic">
                <img src={props.newUrl} alt={`${props.first} ${props.last}`} />
            </div>
        );
    }
}
// React.Fragment
