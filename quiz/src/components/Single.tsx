import './quiz.css';
// import questions from '../questions.ts';
// import { v2questions } from '../questions.ts';
import fetchQuestions from '../services/question.api.ts';
import {Question} from '../types/question.type.ts';
import { useRef,useState, useEffect, useCallback } from "react";

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
  const [isQuizReady, setIsQuizReady] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<boolean | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const v2questions = useRef<Question[]>([]);

  const loadQuestion = useCallback(async (index: number) => {
    // v2questions.current = await fetchQuestions({});

    if (index >= v2questions.current.length) {
      setGameOver(true);
      setCurrentQuiz(null);
      setAnswers([]);
      return;
    }

    const question = v2questions.current[index];
    const options = [...question.incorrect_answers, question.correct_answer];
    setQuestionIndex(index);
    setCurrentQuiz(question);
    setAnswers(options.sort(() => Math.random() - 0.5));
    setSelectedIndex(null);
    setSelectedOption(null);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const initializeQuiz = async () => {
      try {
        const questions = await fetchQuestions({});
        if (!isMounted) return;
        
        // Add validation to check if results exists
        if (questions && questions.results && Array.isArray(questions.results)) {
          v2questions.current = questions.results;
          setIsQuizReady(questions.results.length > 0);
        } else {
          console.error("Invalid response structure:", questions);
          setIsQuizReady(false);
        }
      } catch (error) {
        if (!isMounted) return;
        console.error("Error initializing quiz:", error);
        setIsQuizReady(false);
      }
    };

    initializeQuiz();

    return () => {
      isMounted = false;
    };
  }, [loadQuestion]);

  const handleNextbtn = () => {
    if (selectedIndex === null || selectedOption === null) return;

    const nextScore = score + (selectedOption ? 1 : -1);
    setScore(nextScore);
    const nextIndex = questionIndex + 1;

    if (nextIndex >= v2questions.current.length) {
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
    if (!isQuizReady || v2questions.current.length === 0) return;
    setScore(0);
    setGameOver(false);
    loadQuestion(0);
  }

  return (
    <>

      {gameOver ? (
        <div className="game-over">
          <h2>Start new Game</h2>
          <button onClick={startGame} disabled={!isQuizReady}>Start Quiz</button>
        </div>
      ):(<div className="quiz-box">
          <div className="question-option-container">
            <div className="question-box">
              <h2>{currentQuiz?.question ? currentQuiz?.question : "question"}</h2>
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
