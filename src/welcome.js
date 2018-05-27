import React from "react";
import { HashRouter, Route, Link } from "react-router-dom";
import axios from "./axios";

export class Welcome extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <HashRouter>
                <div className="welcomeMain">
                    <h1>barkWEB</h1>
                    <div id="textHolder">
                        <span id="reg">
                            <p>New to the site? Register</p>
                            <Link to="/register">
                                <div className="arrow">
                                    <img src="/arrow.png" />
                                </div>
                            </Link>
                            <Route
                                exact
                                path="/register"
                                component={Register}
                            />
                        </span>
                        <span id="log">
                            <p>Already a member? LogIn</p>
                            <Link to="/login">
                                <div className="arrow">
                                    <img src="/arrow.png" />
                                </div>
                            </Link>
                            <Route path="/login" component={Login} />
                        </span>
                    </div>
                    <div id="dogLogo">
                        <img src="/dog.png" />
                    </div>
                </div>
            </HashRouter>
        );
    }
}

export class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.handleChange = this.handleChange.bind(this);
        this.submit = this.submit.bind(this);
    }
    handleChange(e) {
        this[e.target.name] = e.target.value;
    }
    submit() {
        // document.querySelector(".arrow").style.backgroundColor = "grey";
        axios
            .post("/register", {
                first: this.first,
                last: this.last,
                email: this.email,
                password: this.password
            })
            .then((resp) => {
                if (resp.data.success) {
                    location.replace("/chat");
                } else {
                    this.setState({
                        error: true
                    });
                }
            });
    }
    render() {
        return (
            <div className="register">
                {this.state.error && (
                    <div className="errmsg">
                        Something went wrong, try again.
                    </div>
                )}

                <label htmlFor="first">#First Name:</label>
                <input name="first" onChange={this.handleChange} />
                <label htmlFor="last">#Last Name:</label>
                <input name="last" onChange={this.handleChange} />
                <label htmlFor="email">#e-mail:</label>
                <input name="email" onChange={this.handleChange} />
                <label htmlFor="password">#Password:</label>
                <input
                    name="password"
                    type="password"
                    onChange={this.handleChange}
                />
                <div className="arrow" onClick={this.submit}>
                    <img src="/arrow.png" />
                </div>
            </div>
        );
    }
}

export class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.handleChange = this.handleChange.bind(this);
        this.submit = this.submit.bind(this);
    }
    handleChange(e) {
        this[e.target.name] = e.target.value;
    }
    submit() {
        // document.querySelector(".arrow").style.backgroundColor = "grey";

        axios
            .post("/login", {
                email: this.email,
                password: this.password
            })
            .then((resp) => {
                if (resp.data.success) {
                    location.replace("/chat");
                } else {
                    this.setState({
                        wrong: true
                    });
                }
            });
    }
    render() {
        return (
            <div className="register">
                {this.state.wrong && (
                    <div className="errmsg">
                        Wrong email or password, try again.
                    </div>
                )}
                <label htmlFor="email">#e-mail:</label>
                <input name="email" onChange={this.handleChange} />
                <label htmlFor="password">#Password:</label>
                <input
                    name="password"
                    type="password"
                    onChange={this.handleChange}
                />
                <div className="arrow" onClick={this.submit}>
                    <img src="/arrow.png" />
                </div>
            </div>
        );
    }
}
