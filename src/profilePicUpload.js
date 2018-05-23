import React from "react";
import axios from "./axios";
export class ProfilePicUpload extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.handleChange = this.handleChange.bind(this);
        this.submit = this.submit.bind(this);
        this.upload = this.upload.bind(this);
        this.upload2 = this.upload2.bind(this);
        this.setFile = this.setFile.bind(this);
    }
    handleChange(e) {
        this.setState({
            url: e.target.value
        });
    }
    setFile(e) {
        this.setState({
            file: e.target.files[0]
        });
    }
    upload(e) {
        const formData = new FormData();
        formData.append("file", this.state.file);
        axios
            .post("/upload", formData)
            .then((response) => {
                this.setState({
                    newUrl: response.data.url
                });
            })
            .catch(function(err) {
                console.log("there was an error in upload", err);
            });
    }
    upload2() {
        axios
            .post("/upload2", { url: this.state.url })
            .then((response) => {
                console.log(response.data);
                this.setState({
                    newUrl: response.data.url
                });
            })
            .catch(function(err) {
                console.log("there was an error in upload2", err);
            });
    }
    submit() {
        document.querySelector("#popUpload").style.transform =
            "translateY(-50vh)";
        // this.setState({
        //     show: "hide"
        // });

        setTimeout(() => {
            document.querySelector("#megaHolder").style.filter = "blur(0px)";
            this.props.setNewImage(this.state.newUrl);
        }, 600);
    }
    componentDidMount() {
        setTimeout(() => {
            document.querySelector("#megaHolder").style.filter = "blur(10px)";
            this.setState({
                show: "show"
            });
        }, 100);
    }
    render() {
        return (
            <div id="popUpload" className={this.state.show}>
                <p>want to change your pic?</p>
                <div className="fileUp">
                    <input
                        id="inputfile"
                        className="inputfile"
                        type="file"
                        name="file"
                        onChange={this.setFile}
                        data-multiple-caption="{count} files selected"
                        multiple
                    />
                    <label htmlFor="inputfile">Your Own Pic</label>
                    <button onClick={this.upload}>Upload</button>
                </div>
                <div className="urlPic">
                    <p>put your own URL</p>
                    <input
                        type="text"
                        name="url"
                        placeholder="Enter URL"
                        onChange={this.handleChange}
                    />
                    <button id="Upload2" onClick={this.upload2}>
                        Upload2
                    </button>
                </div>
                <button onClick={this.props.closeuploader}>Close</button>
                <button id="submit" className="button" onClick={this.submit}>
                    Submit
                </button>
            </div>
        );
    }
}
