import React from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Collapse } from "reactstrap";
import ReactPlayer from "react-player";

class TestAnalysis extends React.Component {
  constructor(props) {
    super(props);
    let loggedIn = false;

    const token = localStorage.getItem("token");
    if (token) loggedIn = true;
    this.state = {
      loggedIn,
      questionList: [],
      resultList: [],
      currentQuestion: "",
      isSolutionVideoOpen: false,
      submitTest: false,
      userAnswerList: [],
      answeredId: "",
    };
  }
  componentDidMount() {
    this.List();
    this.getUserAnswers();
    this.Result();
  }

  solutionVideoToggle = () =>
    this.setState({ isSolutionVideoOpen: !this.state.isSolutionVideoOpen });

  Result = () => {
    axios
      .get(
        `https://nitoes.herokuapp.com/testpaper/userresult/?user_name=${this.props.newuser}&test_name=${this.props.newtestpaper.test_name}`,
        {
          headers: {
            Authorization: `JWT ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => this.setState({ resultList: res.data }))
      .catch((err) => console.log(err));
  };

  renderResult = () => {
    const newItems = this.state.resultList;
    return newItems.map((item) => <div>score = {item.score}</div>);
  };

  List = () => {
    axios
      .get(
        `https://nitoes.herokuapp.com/testpaper/questions/?test_name=${this.props.newtestpaper.test_name}/`,
        {
          headers: {
            Authorization: `JWT ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => this.setState({ questionList: res.data }))
      .then(() => this.startTest())
      .catch((err) => console.log(err));
  };

  getUserAnswers = () => {
    axios
      .get(
        `https://nitoes.herokuapp.com/testpaper/useranswers/?user_name=${this.props.newuser}&test_name=${this.props.newtestpaper.test_name}`,
        {
          headers: {
            Authorization: `JWT ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => this.setState({ userAnswerList: res.data }))
      .catch((err) => console.log(err));
  };

  questionNumberList = () => {
    const correctAnswerList = this.state.userAnswerList.filter(
      (item) => item.user_answer === item.correct_answer
    );
    const incorrectAnswerList = this.state.userAnswerList.filter(
      (item) => item.user_answer !== item.correct_answer
    );
    const correctAnswered = correctAnswerList.map((item) => item.question_no);
    const incorrectAnswered = incorrectAnswerList.map(
      (item) => item.question_no
    );
    const newItems = this.state.questionList;
    return newItems.map((item) => (
      <button
        className={
          correctAnswered.includes(item.question_no)
            ? "button-s correct_question"
            : incorrectAnswered.includes(item.question_no)
            ? "button-s incorrect_question"
            : "button-s normal_question"
        }
        onClick={() => this.selectQuestion(item)}
      >
        {item.question_no}
      </button>
    ));
  };

  startTest = () => {
    const newItems = this.state.questionList.filter(
      (item) => item.question_no === 1
    );
    return newItems.map((item) => this.setState({ currentQuestion: item }));
  };

  testName = () => {
    const newItems = this.state.questionList.filter(
      (item) => item.question_no === 1
    );
    return newItems.map((item) => <div>{item.test_name}</div>);
  };

  previous = (current) => {
    const previous = current - 1;
    const newItems = this.state.questionList.filter(
      (item) => item.question_no === previous
    );
    return newItems.map((item) => (
      <button onClick={() => this.selectQuestion(item)}>previous</button>
    ));
  };

  next = (current) => {
    const next = current + 1;
    const newItems = this.state.questionList.filter(
      (item) => item.question_no === next
    );
    return newItems.map((item) => (
      <button onClick={() => this.selectQuestion(item)}>next</button>
    ));
  };

  selectQuestion = (item) => {
    this.setState({ isSolutionVideoOpen: false, currentQuestion: item });
  };

  class_name = (x) => {
    const answered = this.state.userAnswerList.filter(
      (item) => item.question_no === this.state.currentQuestion.question_no
    );
    if (answered.length === 0) {
      return "list-group-item list-group-item-action normal_option";
    } else if (x === answered[0].correct_answer) {
      return "list-group-item list-group-item-action correct_option";
    } else if (x === answered[0].user_answer) {
      return "list-group-item list-group-item-action incorrect_option";
    } else {
      return "list-group-item list-group-item-action normal_option";
    }
  };

  correctIncorrectAnswersCount = () => {
    const correctAnswerList = this.state.userAnswerList.filter(
      (item) => item.user_answer === item.correct_answer
    );
    const incorrectAnswerList = this.state.userAnswerList.filter(
      (item) => item.user_answer !== item.correct_answer
    );
    return (
      <div>
        corret answers = {correctAnswerList.length}
        incorret answers = {incorrectAnswerList.length}
      </div>
    );
  };

  render() {
    if (this.state.loggedIn === false) {
      return <Redirect to="/logout" />;
    } else if (this.state.submitTest === true) {
      return <Redirect to="/home" />;
    }
    return (
      <div className="topicsheet">
        <div>{this.testName()}</div>
        <div>{this.renderResult()}</div>
        <div>{this.correctIncorrectAnswersCount()}</div>
        <div>{this.questionNumberList()}</div>
        <div class="input-group input-group-lg">
          <div class="input-group-prepend">
            <span class="input-group-text" id="inputGroup-sizing-lg">
              Question. {this.state.currentQuestion.question_no}
            </span>
          </div>
          <span
            type="text"
            class="form-control"
            aria-label="Large"
            aria-describedby="inputGroup-sizing-sm"
          >
            {this.state.currentQuestion.question}
            <div>
              <img src={this.state.currentQuestion.question_image} alt="" />
            </div>
          </span>
        </div>
        <div>
          <div class="list-group">
            <button type="button" className={this.class_name("a")}>
              (A) {this.state.currentQuestion.option_a}
            </button>
            <button type="button" className={this.class_name("b")}>
              (B) {this.state.currentQuestion.option_b}
            </button>
            <button type="button" className={this.class_name("c")}>
              (C) {this.state.currentQuestion.option_c}
            </button>
            <button type="button" className={this.class_name("d")}>
              (D) {this.state.currentQuestion.option_d}
            </button>
          </div>
          <div className="solution">
            <label htmlFor="solution">solution</label>
            <div>{this.state.currentQuestion.solution}</div>
            <img src={this.state.currentQuestion.solution_image} alt="" />
          </div>
          <div className="solution_video">
            <button onClick={() => this.solutionVideoToggle()}>
              solution video
            </button>
            <Collapse isOpen={this.state.isSolutionVideoOpen}>
              <div className="form-group">
                <ReactPlayer
                  controls
                  url={`"${this.state.currentQuestion.solution_video}"`}
                />
              </div>
            </Collapse>
          </div>
          <div>{this.previous(this.state.currentQuestion.question_no)}</div>
          <div>{this.next(this.state.currentQuestion.question_no)}</div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    newuser: state.currentUser,
    newtestpaper: state.testpaper,
  };
};

export default connect(mapStateToProps)(TestAnalysis);
