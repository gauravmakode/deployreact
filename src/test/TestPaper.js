import React from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Timer from "./Timer";
import "./TestPaper.css";
import Calculator from "../components/Calculator";

class TestPaper extends React.Component {
  constructor(props) {
    super(props);
    let loggedIn = false;

    const token = localStorage.getItem("token");
    if (token) loggedIn = true;
    this.state = {
      loggedIn,
      questionList: [],
      currentQuestion: "",
      submitTest: false,
      userAnswerList: [],
      userFlagList: [],
      timeLimit: [],
      answeredId: "",
      previousTime: "",
      currentTimeLimit: "",
    };
  }
  componentDidMount() {
    this.List();
    this.getUserAnswers();
    this.getUserFlags();
    this.getTimeLeft();
    setInterval(() => {
      this.updateTimeLeft();
    }, 60000);
  }

  toggle = () => this.setState({ isOpen: !this.state.isOpen });

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

  getUserFlags = () => {
    axios
      .get(
        `https://nitoes.herokuapp.com/testpaper/flag/?user_name=${this.props.newuser}&test_name=${this.props.newtestpaper.test_name}`,
        {
          headers: {
            Authorization: `JWT ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => this.setState({ userFlagList: res.data }))
      .catch((err) => console.log(err));
  };

  getTimeLeft = () => {
    axios
      .get(
        `https://nitoes.herokuapp.com/testpaper/timer/?user_name=${this.props.newuser}&test_name=${this.props.newtestpaper.test_name}`,
        {
          headers: {
            Authorization: `JWT ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => this.setState({ timeLimit: res.data }))
      .then(() => this.submitTimeLimit())
      .then(() => this.previousTime())
      .then(() => this.updateTimeLeft())
      .catch((err) => console.log(err));
  };

  submitTimeLimit = () => {
    const timeleft = this.state.timeLimit.filter(
      (item) => item.test_name === this.props.newtestpaper.test_name
    );
    if (timeleft.length === 0) {
      const item = {
        user_name: this.props.newuser,
        test_name: this.props.newtestpaper.test_name,
        time_left: this.props.newtestpaper.time_limit_in_minutes,
      };
      axios
        .post(`https://nitoes.herokuapp.com/testpaper/timer/`, item, {
          headers: {
            Authorization: `JWT ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => this.getTimeLeft());
    }
  };

  previousTime = () => {
    const timeleft = this.state.timeLimit.filter(
      (item) => item.test_name === this.props.newtestpaper.test_name
    );
    if (timeleft.length !== 0) {
      const newTime = timeleft.map((item) => item.time_left);
      this.setState({ previousTime: newTime, currentTimeLimit: newTime });
    }
  };

  updateTimeLeft = () => {
    const timeleft = this.state.timeLimit;
    const timerId = timeleft[0].id;
    const previousTime = this.state.previousTime;
    const newTime = previousTime - 1;
    const item = {
      user_name: this.props.newuser,
      test_name: this.props.newtestpaper.test_name,
      time_left: newTime,
    };
    axios
      .put(`https://nitoes.herokuapp.com/testpaper/timer/${timerId}/`, item, {
        headers: {
          Authorization: `JWT ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => this.setState({ previousTime: newTime }));
  };

  submitAnswer = (selectedOption) => {
    const answered = this.state.userAnswerList.filter(
      (item) => item.question_no === this.state.currentQuestion.question_no
    );
    if (
      answered.length === 0 &&
      selectedOption === this.state.currentQuestion.correct_answer
    ) {
      const item = {
        user_name: this.props.newuser,
        test_name: this.state.currentQuestion.test_name,
        question_no: this.state.currentQuestion.question_no,
        user_answer: selectedOption,
        correct_answer: this.state.currentQuestion.correct_answer,
        marks: this.props.newtestpaper.positive_marks,
      };
      axios
        .post(`https://nitoes.herokuapp.com/testpaper/useranswers/`, item, {
          headers: {
            Authorization: `JWT ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => this.getUserAnswers());
    } else if (
      answered.length === 0 &&
      selectedOption !== this.state.currentQuestion.correct_answer
    ) {
      const item = {
        user_name: this.props.newuser,
        test_name: this.state.currentQuestion.test_name,
        question_no: this.state.currentQuestion.question_no,
        user_answer: selectedOption,
        correct_answer: this.state.currentQuestion.correct_answer,
        marks: this.props.newtestpaper.negative_marks,
      };
      axios
        .post(`https://nitoes.herokuapp.com/testpaper/useranswers/`, item, {
          headers: {
            Authorization: `JWT ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => this.getUserAnswers());
    } else if (selectedOption === answered[0].user_answer) {
      const ansId = answered[0].id;
      axios
        .delete(
          `https://nitoes.herokuapp.com/testpaper/useranswers/${ansId}/`,
          {
            headers: {
              Authorization: `JWT ${localStorage.getItem("token")}`,
            },
          }
        )
        .then((res) => this.getUserAnswers());
    } else if (selectedOption === this.state.currentQuestion.correct_answer) {
      const ansId = answered[0].id;
      const item = {
        user_name: this.props.newuser,
        test_name: this.state.currentQuestion.test_name,
        question_no: this.state.currentQuestion.question_no,
        user_answer: selectedOption,
        correct_answer: this.state.currentQuestion.correct_answer,
        marks: this.props.newtestpaper.positive_marks,
      };
      axios
        .put(
          `https://nitoes.herokuapp.com/testpaper/useranswers/${ansId}/`,
          item,
          {
            headers: {
              Authorization: `JWT ${localStorage.getItem("token")}`,
            },
          }
        )
        .then((res) => this.getUserAnswers());
    } else if (selectedOption !== this.state.currentQuestion.correct_answer) {
      const ansId = answered[0].id;
      const item = {
        user_name: this.props.newuser,
        test_name: this.state.currentQuestion.test_name,
        question_no: this.state.currentQuestion.question_no,
        user_answer: selectedOption,
        correct_answer: this.state.currentQuestion.correct_answer,
        marks: this.props.newtestpaper.negative_marks,
      };
      axios
        .put(
          `https://nitoes.herokuapp.com/testpaper/useranswers/${ansId}/`,
          item,
          {
            headers: {
              Authorization: `JWT ${localStorage.getItem("token")}`,
            },
          }
        )
        .then((res) => this.getUserAnswers());
    }
  };

  submitFlag = () => {
    const answered = this.state.userFlagList.filter(
      (item) => item.question_no === this.state.currentQuestion.question_no
    );
    if (answered.length === 0) {
      const item = {
        user_name: this.props.newuser,
        test_name: this.state.currentQuestion.test_name,
        question_no: this.state.currentQuestion.question_no,
      };
      axios
        .post(`https://nitoes.herokuapp.com/estpaper/flag/`, item, {
          headers: {
            Authorization: `JWT ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => this.getUserFlags());
    } else {
      const ansId = answered[0].id;
      axios
        .delete(`https://nitoes.herokuapp.com/testpaper/flag/${ansId}/`, {
          headers: {
            Authorization: `JWT ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => this.getUserFlags());
    }
  };

  questionNumberList = () => {
    const flag = this.state.userFlagList.map((item) => item.question_no);
    const answered = this.state.userAnswerList.map((item) => item.question_no);
    const newItems = this.state.questionList;
    return newItems.map((item) => (
      <button
        className={
          flag.includes(item.question_no)
            ? answered.includes(item.question_no)
              ? "button1 selected-flag"
              : "button1 notselected-flag"
            : answered.includes(item.question_no)
            ? "button1 selected"
            : "button1 notselected"
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
    this.setState({ isOpen: false, currentQuestion: item });
  };

  submitTestPaper = () => {
    const answerSheet = this.state.userAnswerList.filter(
      (item) =>
        item.user_name === this.props.newuser &&
        item.test_name === this.state.currentQuestion.test_name
    );
    const finalScore = answerSheet
      .map((item) => item.marks)
      .reduce((a, c) => {
        return a + c;
      });
    const item = {
      user_name: this.props.newuser,
      test_name: this.state.currentQuestion.test_name,
      score: finalScore,
      submitted: true,
    };
    axios
      .post(`https://nitoes.herokuapp.com/testpaper/userresult/`, item, {
        headers: {
          Authorization: `JWT ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => this.setState({ submitTest: true }))
      .catch((err) => console.log(err));
  };

  class_name = (x) => {
    const answered = this.state.userAnswerList.filter(
      (item) => item.question_no === this.state.currentQuestion.question_no
    );
    if (answered.length === 0) {
      return "list-group-item list-group-item-action notselectedOption";
    } else if (x === answered[0].user_answer) {
      return "list-group-item list-group-item-action selectedOption";
    } else {
      return "list-group-item list-group-item-action notselectedOption";
    }
  };

  render() {
    if (this.state.loggedIn === false) {
      return <Redirect to="/logout" />;
    } else if (this.state.submitTest === true) {
      return <Redirect to="/home" />;
    }
    return (
      <div className="topicsheet">
        {this.state.currentTimeLimit !== "" ? (
          <Timer
            time_limit={this.state.currentTimeLimit}
            submitTest={() => this.submitTestPaper()}
          />
        ) : null}
        <div>{this.testName()}</div>
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
            <button
              type="button"
              className={this.class_name("a")}
              onClick={() => this.submitAnswer("a")}
            >
              (A) {this.state.currentQuestion.option_a}
            </button>
            <button
              type="button"
              className={this.class_name("b")}
              onClick={() => this.submitAnswer("b")}
            >
              (B) {this.state.currentQuestion.option_b}
            </button>
            <button
              type="button"
              className={this.class_name("c")}
              onClick={() => this.submitAnswer("c")}
            >
              (C) {this.state.currentQuestion.option_c}
            </button>
            <button
              type="button"
              className={this.class_name("d")}
              onClick={() => this.submitAnswer("d")}
            >
              (D) {this.state.currentQuestion.option_d}
            </button>
          </div>
          <button onClick={() => this.submitFlag()}>Flag</button>
          <div>{this.previous(this.state.currentQuestion.question_no)}</div>
          <div>{this.next(this.state.currentQuestion.question_no)}</div>
        </div>
        <button onClick={() => this.submitTestPaper()}>Submit</button>
        {this.props.newtestpaper.allow_calc ? (
          <button
            onClick={() =>
              this.setState({ isCalcOpen: !this.state.isCalcOpen })
            }
          >
            Calculator
          </button>
        ) : null}
        {this.state.isCalcOpen ? <Calculator /> : null}
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

export default connect(mapStateToProps)(TestPaper);
