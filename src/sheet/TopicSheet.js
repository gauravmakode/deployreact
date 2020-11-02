import React from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Collapse } from "reactstrap";
import ReactPlayer from "react-player";
import "./TopicSheet.css";
import Calculator from "../components/Calculator";

class TopicSheet extends React.Component {
  constructor(props) {
    super(props);
    let loggedIn = false;

    const token = localStorage.getItem("token");
    if (token) loggedIn = true;
    this.state = {
      loggedIn,
      questionList: [],
      currentQuestion: "",
      isConceptOpen: false,
      isConceptVideoOpen: false,
      isHintOpen: false,
      isHintVideoOpen: false,
      submitSheet: false,
      userAnswerList: [],
      userFlagList: [],
      answeredId: "",
    };
  }
  componentDidMount() {
    this.List();
    this.getUserAnswers();
    this.getUserFlags();
  }

  conceptToggle = () =>
    this.setState({ isConceptOpen: !this.state.isConceptOpen });
  conceptVideoToggle = () =>
    this.setState({ isConceptVideoOpen: !this.state.isConceptVideoOpen });
  hintToggle = () => this.setState({ isHintOpen: !this.state.isHintOpen });
  hintVideoToggle = () =>
    this.setState({ isHintVideoOpen: !this.state.isHintVideoOpen });

  List = () => {
    axios
      .get(
        `https://nitoes.herokuapp.com/sheet/questions/?select_sheet_name=${this.props.newsheet.id}`,
        {
          headers: {
            Authorization: `JWT ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => this.setState({ questionList: res.data }))
      .then(() => this.startSheet())
      .catch((err) => console.log(err));
  };

  getUserAnswers = () => {
    axios
      .get(
        `https://nitoes.herokuapp.com/sheet/useranswers/?user_name=${this.props.newuser}&sheet_name=${this.props.newsheet.sheet_name}`,
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
        `https://nitoes.herokuapp.com/sheet/flag/?user_name=${this.props.newuser}&sheet_name=${this.props.newsheet.sheet_name}`,
        {
          headers: {
            Authorization: `JWT ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => this.setState({ userFlagList: res.data }))
      .catch((err) => console.log(err));
  };

  submitAnswer = (selectedOption) => {
    const answered = this.state.userAnswerList.filter(
      (item) => item.question_no === this.state.currentQuestion.question_no
    );
    if (answered.length === 0) {
      const item = {
        user_name: this.props.newuser,
        sheet_name: this.state.currentQuestion.sheet_name,
        question_no: this.state.currentQuestion.question_no,
        user_answer: selectedOption,
        correct_answer: this.state.currentQuestion.correct_answer,
      };
      axios
        .post(`https://nitoes.herokuapp.com/sheet/useranswers/`, item, {
          headers: {
            Authorization: `JWT ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => this.getUserAnswers());
    } else {
      alert("you cannot change your answer");
    }
  };

  submitFlag = () => {
    const answered = this.state.userFlagList.filter(
      (item) => item.question_no === this.state.currentQuestion.question_no
    );
    if (answered.length === 0) {
      const item = {
        user_name: this.props.newuser,
        sheet_name: this.state.currentQuestion.sheet_name,
        question_no: this.state.currentQuestion.question_no,
      };
      axios
        .post(`https://nitoes.herokuapp.com/sheet/flag/`, item, {
          headers: {
            Authorization: `JWT ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => this.getUserFlags());
    } else {
      const ansId = answered[0].id;
      axios
        .delete(`https://nitoes.herokuapp.com/sheet/flag/${ansId}/`, {
          headers: {
            Authorization: `JWT ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => this.getUserFlags());
    }
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
    const flag = this.state.userFlagList.map((item) => item.question_no);
    const newItems = this.state.questionList;
    return newItems.map((item) => (
      <button
        className={
          flag.includes(item.question_no)
            ? correctAnswered.includes(item.question_no)
              ? "button-s correct_question-flag"
              : incorrectAnswered.includes(item.question_no)
              ? "button-s incorrect_question-flag"
              : "button-s normal_question-flag"
            : correctAnswered.includes(item.question_no)
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

  startSheet = () => {
    const newItems = this.state.questionList.filter(
      (item) => item.question_no === 1
    );
    return newItems.map((item) => this.setState({ currentQuestion: item }));
  };

  previous = (current) => {
    const previous = current - 1;
    const newItems = this.state.questionList.filter(
      (item) => item.question_no === previous
    );
    return newItems.map((item) => (
      <button className="button2" onClick={() => this.selectQuestion(item)}>
        previous
      </button>
    ));
  };

  next = (current) => {
    const next = current + 1;
    const newItems = this.state.questionList.filter(
      (item) => item.question_no === next
    );
    return newItems.map((item) => (
      <button className="button2" onClick={() => this.selectQuestion(item)}>
        next
      </button>
    ));
  };

  selectQuestion = (item) => {
    this.setState({
      isConceptOpen: false,
      isConceptVideoOpen: false,
      isHintOpen: false,
      isHintVideoOpen: false,
      currentQuestion: item,
    });
  };

  submitSheet = () => {
    const item = {
      user_name: this.props.newuser,
      sheet_name: this.state.currentQuestion.sheet_name,
    };
    axios
      .post(`https://nitoes.herokuapp.com/sheet/index/`, item, {
        headers: {
          Authorization: `JWT ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => this.setState({ submitSheet: true }))
      .catch((err) => console.log(err));
  };

  closeSheet = () => this.setState({ submitSheet: true });

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

  render() {
    if (this.state.loggedIn === false) {
      return <Redirect to="/logout" />;
    } else if (this.state.submitSheet) {
      return <Redirect to="/home" />;
    }
    return (
      <div className="topicsheet">
        <div>{this.props.newsheet.sheet_name}</div>
        <div className="concept">
          <button className="button2" onClick={() => this.conceptToggle()}>
            concept
          </button>
          <Collapse isOpen={this.state.isConceptOpen}>
            <div>{this.props.newsheet.concept}</div>
            <img src={this.props.newsheet.concept_image} alt="" />
          </Collapse>
        </div>
        <div className="concept_video">
          <button className="button2" onClick={() => this.conceptVideoToggle()}>
            concept video
          </button>
          <Collapse isOpen={this.state.isConceptVideoOpen}>
            <div className="wrapper">
              <ReactPlayer
                controls
                url={`"${this.props.newsheet.concept_video}"`}
                width="100%"
                height="100%"
                className="player"
              />
            </div>
          </Collapse>
        </div>
        <div>{this.questionNumberList()}</div>
        <button className="button2" onClick={() => this.submitFlag()}>
          Flag
        </button>
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
            <div className="bottombuttons">
              <div>{this.previous(this.state.currentQuestion.question_no)}</div>
              <div className="hint">
                <button className="button2" onClick={() => this.hintToggle()}>
                  hint
                </button>
                <Collapse isOpen={this.state.isHintOpen}>
                  <div>{this.state.currentQuestion.hint}</div>
                  <img src={this.state.currentQuestion.hint_image} alt="" />
                </Collapse>
              </div>
              <div className="hint_video">
                <button
                  className="button2"
                  onClick={() => this.hintVideoToggle()}
                >
                  hint video
                </button>
              </div>
              <div>{this.next(this.state.currentQuestion.question_no)}</div>
            </div>
          </div>
          <button className="button2" onClick={() => this.submitSheet()}>
            Submit Sheet
          </button>
          <button className="button2" onClick={() => this.closeSheet()}>
            Close Sheet
          </button>
          <Collapse isOpen={this.state.isHintVideoOpen}>
            <div className="wrapper">
              <ReactPlayer
                controls
                url={`"${this.state.currentQuestion.hint_video}"`}
                width="100%"
                height="100%"
                className="player"
              />
            </div>
          </Collapse>
        </div>
        {this.props.newsheet.allow_calc ? (
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
    newsheet: state.sheet,
    newuser: state.currentUser,
  };
};

export default connect(mapStateToProps)(TopicSheet);
