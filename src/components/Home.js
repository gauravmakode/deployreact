import React from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { changeCurrentUser, changeCurrentUserLevel } from "../actions/action";
import axios from "axios";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      logged_in: localStorage.getItem("token") ? true : false,
      levelList: [],
    };
  }

  componentDidMount() {
    if (this.state.logged_in) {
      let handleErrors = (response) => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        return response;
      };

      fetch("http://localhost:8000/validate/", {
        headers: {
          Authorization: `JWT ${localStorage.getItem("token")}`,
        },
      })
        .then((res) => {
          fetch("http://localhost:8000/user/current", {
            headers: {
              Authorization: `JWT ${localStorage.getItem("token")}`,
            },
          })
            .then(handleErrors)
            .then((res) => res.json())
            .then((json) => {
              if (json.username) {
                this.props.changeusername(json.username);
              }
              fetch("http://localhost:8000/refresh/", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  token: localStorage.getItem("token"),
                }),
              })
                .then(handleErrors)
                .then((res) => res.json())
                .then((json) => {
                  localStorage.setItem("token", json.token);
                })
                .then(() => this.levelList())
                .catch((error) => {
                  console.log(error);
                });
            })
            .catch((error) => {
              localStorage.removeItem("token");
            });
        })
        .catch((error) => {
          localStorage.removeItem("token");
        });
    }
  }

  levelList = () => {
    axios
      .get(
        `http://127.0.0.1:8000/user/level/?user_name=${this.props.newuser}`,
        {
          headers: {
            Authorization: `JWT ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => this.setState({ levelList: res.data }))
      .then(() => {
        const newItems = this.state.levelList;
        return newItems.map((item) => this.props.changeuserlevel(item));
      })
      .catch((err) => console.log(err));
  };

  render() {
    if (this.state.loggedIn === false) {
      return <Redirect to="/logout" />;
    }
    return (
      <div>
        <h1>home page</h1>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    newuser: state.currentUser,
    userlevel: state.currentUserLevel,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    changeusername: (currentUser) => {
      dispatch(changeCurrentUser(currentUser));
    },
    changeuserlevel: (currentUserLevel) => {
      dispatch(changeCurrentUserLevel(currentUserLevel));
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Home);
