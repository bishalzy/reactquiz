import './quiz.css';
import questions from '../questions.ts';

import { useState, useEffect, useRef } from "react";

type Question = {
  question: string;
  options: string[];
  correct: number;
}

const Single: React.FC = () => {
  const [currentQuiz, setCurrentQuiz] = useState<Question | null>(null);
  const questionLength = questions.length - 1;
  const score = useRef<number>(0);
  const selectedOption = useRef<boolean | null>(false);
  const questionIndex = useRef<number>(0);

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const optionRef = useRef(null);

  const findQuestion = () => {
    if (questionIndex.current <= questionLength) {
      setCurrentQuiz(questions[questionIndex.current]);
      questionIndex.current++;
    } else {
      questionIndex.current = 0;
      setCurrentQuiz(questions[questionIndex.current]);
      questionIndex.current++;
    }
  }
  useEffect(() => {
    findQuestion();
  }, []);

  const handleNextbtn = () => {
    if (selectedOption.current) {
      score.current++

    } else if (selectedOption.current === false) {
      score.current--;
    }
    findQuestion();
    setSelectedIndex(null);

    selectedOption.current = null;
  }

  const handleOptionSelect = (index: number) => {
    console.log(index);
    setSelectedIndex(index);

    if (index == currentQuiz?.correct) {
      selectedOption.current = true;
      console.log(selectedOption.current)

    } else {
      selectedOption.current = false;
    }
  }

  return (
    <>
      <div className="score-board">
        <h2>
          Score
        </h2>
        {score.current}
      </div>
      <div className="quiz-box">
        <div className="question-box">
          {currentQuiz?.question ? currentQuiz?.question : "questoin"}
        </div>
        <div className="option-box">
          {currentQuiz?.options.map((options, index) => {
            return <div key={index} ref={optionRef} className={`${index === selectedIndex ? "selected" : "options"}`} onClick={() => handleOptionSelect(index)}>{options}</div>
          })}

        </div>

        <button className='next-btn' onClick={handleNextbtn}>Next</button>

      </div>
      <div className="controls">THis is single mode</div>

    </>
  )
}

export default Single;
