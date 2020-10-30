import React from "react";
import { Redirect } from "react-router-dom";

export default class Logout extends React.Component {
  constructor() {
    super();
    localStorage.removeItem("token");
  }

  render() {
    return <Redirect to="/" />;
  }
}
