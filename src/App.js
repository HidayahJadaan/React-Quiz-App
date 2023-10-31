import { useEffect, useReducer } from "react";
import "./App.css";
import DateCounter from "./components/DateCounter";
import Header from "./components/Header";
import Main from "./components/Main";
import Loader from "./components/Loader";
import Error from "./components/Error";
import ReadyScreen from "./components/ReadyScreen";
import Question from "./components/Question";
import NextButton from "./components/NextButton";



const initialState = {
  questions: [],
  // loading, error, ready, active, finihsed
  status: "loading",
  index: 0,
  answer: null,
  points : 0,
};

function reducer(state, action) {
  switch (action.type) {
    case "dataRecieved":
      return {
        ...state,
        questions: action.payload,
        status: "ready",
      };

    case "dataFailed":
      return {
        ...state,
        status: "error",
      };

    case "start":
      return {
        ...state,
        status: "active",
      };

      case "newAnswer":
const question = state.questions.at(state.index)

        return {
          ...state, 
          answer : action.payload,
          points :
           action.payload === question.correctOption ? 
           state.points + question.points : state.points
        };

        case "nextQuestion":
      return { ...state, index: state.index + 1, answer: null };
    

    default:
      throw new Error("Action UnKnown");
  }
}

// json-server npm package provide us with a Fake API
function App() {
  const [{ questions, status , index, answer, points}, dispatch] = useReducer(reducer, initialState);

  const numQuestions = questions.length;

  useEffect(function () {
    fetch("http://localhost:9000/questions")
      .then((res) => res.json())
      .then((data) => dispatch({ type: "dataRecieved", payload: data }))
      .catch((err) => dispatch({ type: "dataFailed" }));
  }, []);

  return (
    <div className="app">
      {/* <DateCounter /> */}

      <Header />

      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && (
          <ReadyScreen numQuestions={numQuestions} dispatch={dispatch} />
        )}

        {status === "active" &&
        
      <>
        <Question
              question={questions[index]}
              dispatch={dispatch}
              answer={answer}
            />
         
       <NextButton dispatch = {dispatch}
       answer = {answer}
       />
         </>
         }
      </Main>
    </div>
  );
}

export default App;
