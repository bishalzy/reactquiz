import './quiz.css';
// import questions from '../questions.ts';
import { v2questions } from '../questions.ts';
import {Question} from '../types/question.type.ts';
import { useState, useEffect, useCallback } from "react";

// type Question = {
//   question: string;
//   options: string[];
//   correct: number;
// }

const Single: React.FC = () => {
  const [currentQuiz, setCurrentQuiz] = useState<Question | null>(null);
  const [answers, setAnswers] = useState<string[]>([]);
  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(true);
  const [score, setScore] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<boolean | null>(null);

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const loadQuestion = useCallback((index: number) => {
    if (index >= v2questions.length) {
      setGameOver(true);
      setCurrentQuiz(null);
      setAnswers([]);
      return;
    }

    const question = v2questions[index];
    const options = [...question.incorrect_answers, question.correct_answer];
    setQuestionIndex(index);
    setCurrentQuiz(question);
    setAnswers(options.sort(() => Math.random() - 0.5));
    setSelectedIndex(null);
    setSelectedOption(null);
  }, []);

  useEffect(() => {
    loadQuestion(0);
  }, [loadQuestion]);

  const handleNextbtn = () => {
    if (selectedIndex === null || selectedOption === null) return;

    const nextScore = score + (selectedOption ? 1 : -1);
    setScore(nextScore);
    const nextIndex = questionIndex + 1;

    if (nextIndex >= v2questions.length) {
      alert(`Quiz Over! Your final score is: ${nextScore}`);
      setGameOver(true);
      return;
    }

    loadQuestion(nextIndex);
  }

  const handleOptionSelect = (index: number) => {
    if (!currentQuiz) return;
    setSelectedIndex(index);
    setSelectedOption(index === answers.indexOf(currentQuiz.correct_answer));
  }

  const startGame = (): void => {
    setScore(0);
    setGameOver(false);
    loadQuestion(0);
  }

  return (
    <>

      {gameOver ? (
        <div className="game-over">
          <h2>Start new Game</h2>
          <button onClick={startGame}>Start Quiz</button>
        </div>
      ):(<div className="quiz-box">
          <div className="question-option-container">
            <div className="question-box">
              <h2>{currentQuiz?.question ? currentQuiz?.question : "questoin"}</h2>
            </div>
            <div className="option-box">
              {answers.map((options, index) => {
                return <div key={index} className={`${index === selectedIndex ? "selected" : "options"}`} onClick={() => handleOptionSelect(index)}>{options}</div>
              })}

            </div>
          </div>

          <div className="btn-container">
            <button className='next-btn' onClick={handleNextbtn}>Next</button>
          </div>
        </div>)}

      <div className="score-board">
        <h2>
          Score
        </h2>
        <h2>{score}</h2>
      </div>
      {/*<div className="controls">THis is single mode</div>*/}
    </>
  )
}

export default Single;
