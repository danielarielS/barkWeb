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
    }
    enterText(e) {
        if (e.keyCode == "13" && e.target.value.trim().length > 0) {
            emit("chatMessage", e.target.value);
            e.target.value = "";
            e.preventDefault();
        }
    }
    componentDidMount() {
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
