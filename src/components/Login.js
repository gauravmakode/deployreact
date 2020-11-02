import React from "react";
import { Redirect } from "react-router-dom";
import "./Login.css";
export default class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      currentUserName: "",
      username: "",
      password: "",
      loggedIn: localStorage.getItem("token") ? true : false,
    };
    this.onChange = this.onChange.bind(this);
  }

  handle_login = (e) => {
    e.preventDefault();
    let data = {
      username: this.state.username,
      password: this.state.password,
    };

    let handleErrors = (response) => {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response;
    };

    fetch("https://nitoes.herokuapp.com/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then(handleErrors)
      .then((res) => res.json())
      .then((json) => {
        localStorage.setItem("token", json.token);
        this.setState({ currentUserName: json.user.username, loggedIn: true });
      })
      .catch((error) => alert(error));
  };

  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  render() {
    if (this.state.loggedIn === true) {
      return <Redirect to="/home" />;
    }
    return (
      <div className="auth-wrapper">
        <div className="auth-inner">
          <form onSubmit={this.handle_login}>
            <h3>Sign In .</h3>

            <div className="form-group">
              <label>Email address</label>
              <input
                type="text"
                className="form-control"
                placeholder="username"
                value={this.state.username}
                onChange={this.onChange}
                name="username"
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="password"
                value={this.state.password}
                onChange={this.onChange}
                name="password"
              />
            </div>
            <button type="submit" className="btn btn-primary btn-block">
              Submit
            </button>
            {this.state.error}
          </form>
        </div>
      </div>
    );
  }
}
