import React from "react";
import axios from "./axios";
import { BrowserRouter, Route, Link } from "react-router-dom";

export class NamesToShow extends React.Component {
    constructor(props) {
        super(props);
        this.state = { arrayOfNames: [] };
        this.handleChange = this.handleChange.bind(this);
        this.submit = this.submit.bind(this);
        this.search = this.search.bind(this);
        this.stop = this.stop.bind(this);
    }
    handleChange(e) {
        // this.setState({
        //     name: e.target.value
        // });
        this[e.target.name] = e.target.value;
        if (this.name) {
            axios
                .post("/userName", { name: this.name })
                .then((response) => {
                    let arr = response.data.data;
                    console.log("the post response", arr);
                    this.setState({ arrayOfNames: arr, showNames: true });
                })
                .catch((err) => {
                    console.log(`error in post/userName: ${err}`);
                });
        } else {
            this.setState({ showNames: null });
        }
    }
    search() {
        if (!this.state.showTextArea) {
            this.setState({ showTextArea: true });
        } else {
            this.setState({ showTextArea: null });
        }
    }
    stop() {
        this.setState({ showTextArea: null });
    }
    submit() {
        console.log("log in submit", this.state.name);
        // axios
        //     .post("/userName", { name: this.state.name })
        //     .then((response) => {
        //         let arr = response.data.data;
        //         console.log("the post response", arr);
        //         this.setState({ arrayOfNames: arr, showNames: true });
        //     })
        //     .catch((err) => {
        //         console.log(`error in post/userName: ${err}`);
        //     });
    }
    render() {
        return (
            <React.Fragment>
                <p id="searchUsers" onClick={this.search}>
                    Search users
                </p>
                {this.state.showTextArea && (
                    <div id="searchUsersBox">
                        <textarea
                            rows="2"
                            cols="15"
                            name="name"
                            onChange={this.handleChange}
                            placeholder="name?"
                        />
                        {this.state.showNames && (
                            <ListOfNames
                                names={this.state.arrayOfNames}
                                stop={this.stop}
                            />
                        )}
                    </div>
                )}
            </React.Fragment>
        );
    }
}
function ListOfNames(props) {
    return (
        <div className="searchUsers">
            {props.names.map((item) => {
                return (
                    <Link
                        className="theNamesToShowInSearch"
                        to={`/user/${item.id}`}
                        key={item.id}
                        onClick={props.stop}
                    >{`${item.first} ${item.last}`}</Link>
                );
            })}
        </div>
    );
}
