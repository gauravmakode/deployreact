import React, { Component } from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { changeSheet } from "../actions/action";
import "./TopicSheet.css";

class TopicFilter extends Component {
  constructor(props) {
    super(props);
    let loggedIn = false;

    const token = localStorage.getItem("token");
    if (token) loggedIn = true;
    this.state = {
      level: "",
      subject: "",
      topic: "",
      sheet_type: "",
      viewPublished: true,
      topicList: [],
      sheetList: [],
      completedSheetList: [],
      startsheet: false,
      loggedIn,
      filterOn: true,
    };
  }
  componentDidMount() {
    this.topicList();
    this.sheetList();
    this.completedSheetList();
  }

  topicList = () => {
    axios
      .get(`https://nitoes.herokuapp.com/sheet/topic/`, {
        headers: {
          Authorization: `JWT ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => this.setState({ topicList: res.data }))
      .catch((err) => console.log(err));
  };

  sheetList = () => {
    axios
      .get(
        `https://nitoes.herokuapp.com/sheet/sheetname/?level=${this.props.userlevel.level}&subject=${this.state.subject}&topic=${this.state.topic}&sheet_type=${this.state.sheet_type}`,
        {
          headers: {
            Authorization: `JWT ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => this.setState({ sheetList: res.data, filterOn: false }))
      .catch((err) => console.log(err));
  };

  completedSheetList = () => {
    axios
      .get(
        `https://nitoes.herokuapp.com/sheet/index/?user_name=${this.props.newuser}`,
        {
          headers: {
            Authorization: `JWT ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => this.setState({ completedSheetList: res.data }))
      .catch((err) => console.log(err));
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value, filterOn: true });
  };

  renderTopics = () => {
    const subject = this.state.subject;
    const level = this.props.userlevel.level;
    const newItems = this.state.topicList.filter(
      (item) => (item.level === level) & (item.subject === subject)
    );
    return newItems.map((item) => <option>{item.topic}</option>);
  };

  renderSheets = () => {
    const { viewPublished } = this.state;
    const submittedSheet = this.state.completedSheetList.map(
      (item) => item.sheet_name
    );
    const newItems = this.state.sheetList.filter(
      (item) => item.published === viewPublished
    );
    return newItems.map((item) => (
      <tr
        className={
          submittedSheet.includes(item.sheet_name) ? "repeat" : "start"
        }
      >
        <th scope="row">{item.level}</th>
        <td>{item.subject}</td>
        <td>{item.topic}</td>
        <td>{item.sheet_type}</td>
        <td>
          {submittedSheet.includes(item.sheet_name) ? (
            <button
              type="button"
              class="btn btn-outline-success"
              onClick={() => this.gotoSheet(item)}
            >
              Repeat
            </button>
          ) : (
            <button
              type="button"
              class="btn btn-outline-success"
              onClick={() => this.gotoSheet(item)}
            >
              Start
            </button>
          )}
        </td>
      </tr>
    ));
  };

  renderFilter = () => {
    return (
      <form className="listingform">
        <div className="row">
          <div className="listingform__section">
            <label className="listingform__label" htmlFor="subject">
              SUBJECT
            </label>
            <select
              className="listingform__select"
              name="subject"
              onChange={this.handleChange}
              value={this.state.subject}
            >
              <option></option>
              <option>QA</option>
              <option>LR</option>
              <option>DI</option>
              <option>VA</option>
              <option>GA</option>
            </select>
          </div>
          <div className="listingform__section">
            <label className="listingform__label" htmlFor="topic">
              TOPIC
            </label>
            <select
              className="listingform__select"
              name="topic"
              onChange={this.handleChange}
              value={this.state.topic}
            >
              <option></option>
              {this.renderTopics()}
            </select>
          </div>
          <div className="listingform__section">
            <label className="listingform__label" htmlFor="sheet_type">
              SHEET TYPE
            </label>
            <select
              className="listingform__select"
              name="sheet_type"
              onChange={this.handleChange}
              value={this.state.sheet_type}
            >
              <option></option>
              <option>main</option>
              <option>practice</option>
            </select>
          </div>
        </div>
      </form>
    );
  };
  gotoSheet = (item) => {
    this.props.changesheet(item);
    this.setState({ startsheet: true });
  };
  render() {
    if (this.state.loggedIn === false) {
      return <Redirect to="/logout" />;
    } else if (this.state.startsheet) {
      return (
        <div>
          <Redirect to="/topicsheet" />
        </div>
      );
    } else
      return (
        <div>
          {this.state.filterOn ? this.sheetList() : null}
          {this.renderFilter()}

          <table class="table table-hover">
            <thead>
              <tr>
                <th scope="col">level</th>
                <th scope="col">subject</th>
                <th scope="col">topic</th>
                <th scope="col">sheet type</th>
                <th scope="col">action</th>
              </tr>
            </thead>
            <tbody>{this.renderSheets()}</tbody>
          </table>
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
    changesheet: (sheet) => {
      dispatch(changeSheet(sheet));
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(TopicFilter);
