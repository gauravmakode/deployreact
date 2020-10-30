import React, { Component } from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { changeTestPaper } from "../actions/action";

class CompletedTestPapers extends Component {
  constructor(props) {
    super(props);
    let loggedIn = false;

    const token = localStorage.getItem("token");
    if (token) loggedIn = true;
    this.state = {
      exam: "",
      test_type: "",
      viewPublished: true,
      examList: [],
      testList: [],
      completedTestList: [],
      startTest: false,
      analyse: false,
      loggedIn,
      filterOn: true,
    };
  }
  componentDidMount() {
    this.examList();
    this.testList();
    this.completedTestList();
  }

  examList = () => {
    axios
      .get(`http://127.0.0.1:8000/testpaper/exam/`, {
        headers: {
          Authorization: `JWT ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => this.setState({ examList: res.data }))
      .catch((err) => console.log(err));
  };

  testList = () => {
    axios
      .get(
        `http://127.0.0.1:8000/testpaper/testpaper/?test_type=${this.state.test_type}&exam=${this.state.exam}`,
        {
          headers: {
            Authorization: `JWT ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => this.setState({ testList: res.data, filterOn: false }))
      .catch((err) => console.log(err));
  };

  completedTestList = () => {
    axios
      .get(
        `http://localhost:8000/testpaper/userresult/?user_name=${this.props.newuser}`,
        {
          headers: {
            Authorization: `JWT ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => this.setState({ completedTestList: res.data }))
      .catch((err) => console.log(err));
  };

  renderExams = () => {
    const newItems = this.state.examList;
    return newItems.map((item) => <option>{item.topic}</option>);
  };

  handleChange = (e) =>
    this.setState({ [e.target.name]: e.target.value, filterOn: true });

  gotoTest = (item) => {
    this.props.changeTest(item);
    this.setState({ startTest: true });
  };

  analyseTest = (item) => {
    this.props.changeTest(item);
    this.setState({ analyse: true });
  };

  renderTestPapers = () => {
    const completedTest = this.state.completedTestList.map(
      (item) => item.test_name
    );
    const newItems = this.state.testList;
    return newItems.map((item) => (
      <tbody>
        {completedTest.includes(item.test_name) ? (
          <tr>
            <th scope="row">{item.test_name}</th>
            <td>{item.level}</td>
            <td>{item.exam}</td>
            <td>{item.type}</td>
            <td>
              <button
                type="button"
                class="btn btn-outline-success"
                onClick={() => this.analyseTest(item)}
              >
                Analyse
              </button>
            </td>
          </tr>
        ) : null}
      </tbody>
    ));
  };

  renderFilter = () => {
    return (
      <form className="listingform" onSubmit={this.testList()}>
        <div className="row">
          <div className="listingform__section">
            <label className="listingform__label" htmlFor="exam">
              EXAM
            </label>
            <select
              className="listingform__select"
              name="exam"
              onChange={this.handleChange}
              value={this.state.exam}
            >
              <option>none</option>
              {this.renderExams()}
            </select>
          </div>
          <div className="listingform__section">
            <label className="listingform__label" htmlFor="test_type">
              TEST TYPE
            </label>
            <select
              className="listingform__select"
              name="test_type"
              onChange={this.handleChange}
              value={this.state.test_type}
            >
              <option>none</option>
              <option>weekly</option>
              <option>mock</option>
              <option>subject</option>
              <option>topic</option>
              <option>previous year paper</option>
            </select>
          </div>
        </div>
      </form>
    );
  };

  render() {
    if (this.state.loggedIn === false) {
      return <Redirect to="/logout" />;
    } else if (this.state.startTest) {
      return (
        <div>
          <Redirect to="/testpaper" />
        </div>
      );
    } else if (this.state.analyse) {
      return (
        <div>
          <Redirect to="/testanalysis" />
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
                <th scope="col">exam</th>
                <th scope="col">type</th>
                <th scope="col">action</th>
              </tr>
            </thead>
            {this.renderTestPapers()}
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
    changeTest: (testpaper) => {
      dispatch(changeTestPaper(testpaper));
    },
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CompletedTestPapers);
