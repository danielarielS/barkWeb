import { connect } from "react-redux";
import React from "react";
import { emit } from "./socket";
import { Link } from "react-router-dom";
function mapStateToProps(state) {
    // console.log("im in mapStateToProps", state);

    return {
        chat: state && state.chat
    };
}

export class Chat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.enterText = this.enterText.bind(this);
        this.runLocation = this.runLocation.bind(this);
    }
    enterText(e) {
        this.runLocation();
        if (e.keyCode == "13" && e.target.value.trim().length > 0) {
            emit("chatMessage", e.target.value);
            e.target.value = "";
            e.preventDefault();
        }
    }
    runLocation() {
        let geo = navigator.geolocation;
        geo.getCurrentPosition((position) => {
            // console.log(
            //     `${position.coords.latitude} ${position.coords.longitude}`
            // );
            alert(
                `${position.coords.latitude} || ${position.coords.longitude}`
            );
        });
        // function geo_success(position) {
        //     // do_something(position.coords.latitude, position.coords.longitude);
        //
        //     console.log(position.coords.latitude);
        //     console.log(position.coords.longitude);
        // }
        //
        // function geo_error() {
        //     // alert("Sorry, no position available.");
        //     console.log("Sorry, no position available.");
        // }
        //
        // var geo_options = {
        //     enableHighAccuracy: true,
        //     maximumAge: 3000000,
        //     timeout: 2700000
        // };
        // var wpid = navigator.geolocation.watchPosition(
        //     geo_success,
        //     geo_error,
        //     geo_options
        // );
    }
    componentDidMount() {
        // if ("geolocation" in navigator) {
        //     console.log("geolocation works");
        //     let geo = navigator.geolocation;
        //     geo.getCurrentPosition(function(position) {
        //         console.log(position.coords.latitude);
        //         console.log(position.coords.longitude);
        //     });
        // }

        this.elem.scrollTop = this.elem.scrollHeight - this.elem.clientHeight;
    }
    componentDidUpdate() {
        this.elem.scrollTop = this.elem.scrollHeight - this.elem.clientHeight;
    }
    render() {
        return (
            <React.Fragment>
                <textarea
                    id="chatText"
                    onKeyDown={this.enterText}
                    placeholder="speak now or forever hold your peace..."
                />

                <div className="chatHolder" ref={(elem) => (this.elem = elem)}>
                    {this.props.chat &&
                        this.props.chat.map((item) => {
                            return (
                                <div className="smallChatHolder" key={item.id}>
                                    <div className="chatUser">
                                        <div>
                                            <img src={item.url} />
                                        </div>
                                        <p className="theNameOfUserComment">
                                            #{item.first} {item.last}
                                        </p>
                                        <p>{item.created_at}</p>
                                    </div>
                                    <div className="theChat">
                                        <p>{item.chat}</p>
                                    </div>
                                </div>
                            );
                        })}
                </div>
            </React.Fragment>
        );
    }
}
export default connect(mapStateToProps)(Chat);
