import './quiz.css';
// import questions from '../questions.ts';
import { v2questions } from '../questions.ts';
import {Question} from '../types/question.type.ts';
import { useState, useEffect, useRef } from "react";

// type Question = {
//   question: string;
//   options: string[];
//   correct: number;
// }

const Single: React.FC = () => {
  const [currentQuiz, setCurrentQuiz] = useState<Question | null>(null);
  const [answers, setAnswers] = useState<string[]>([]);
  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const questionLength = v2questions.length - 1;
  const score = useRef<number>(0);
  const selectedOption = useRef<boolean | null>(false);

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const optionRef = useRef(null);

  const findQuestion = () => {
    let currentQuestion;
    if (questionIndex <= questionLength) {
      console.log(questionIndex);
      setCurrentQuiz(v2questions[questionIndex]);
      currentQuestion = v2questions[questionIndex];
      setQuestionIndex(prev => prev + 1);
    } else {
      //TODO : show result and reset quiz
      console.log("Quiz ended. Final score:", score.current);
      setQuestionIndex(0);
      setCurrentQuiz(v2questions[0]);
      currentQuestion = v2questions[0];
      setQuestionIndex(1);
    }

    const options = [...currentQuestion?.incorrect_answers!, currentQuestion?.correct_answer!];
    setAnswers(options.sort(() => Math.random() - 0.5));
  }
  useEffect(() => {
    findQuestion();
  }, []);

  const handleNextbtn = () => {
    setSelectedIndex(null);
    if (selectedIndex === null) return;

    if (selectedOption.current) {
      score.current++

    } else if (selectedOption.current === false) {
      score.current--;
    }
    findQuestion();

    selectedOption.current = null;
  }

  const handleOptionSelect = (index: number) => {
    console.log(index);
    setSelectedIndex(index);

    if (index == answers.indexOf(currentQuiz?.correct_answer!)) {
      selectedOption.current = true;
      console.log(selectedOption.current)

    } else {
      selectedOption.current = false;
    }
  }

  return (
    <>
      <div className="quiz-box">
        <div className="question-option-container">
          <div className="question-box">
            <h2>{currentQuiz?.question ? currentQuiz?.question : "questoin"}</h2>
          </div>
          <div className="option-box">
            {answers.map((options, index) => {
              return <div key={index} ref={optionRef} className={`${index === selectedIndex ? "selected" : "options"}`} onClick={() => handleOptionSelect(index)}>{options}</div>
            })}

          </div>
        </div>

        <div className="btn-container">
          <button className='next-btn' onClick={handleNextbtn}>Next</button>
        </div>
      </div>
      <div className="score-board">
        <h2>
          Score
        </h2>
        <h2>{score.current}</h2>
      </div>
      {/*<div className="controls">THis is single mode</div>*/}
    </>
  )
}

export default Single;
