import './quiz.css';
import questions from '../questions.ts';


import { useState, useEffect, useRef } from "react";

type Question = {
    question: string;   
    options: string[];
    correct: number;
}



const Quiz:React.FC = () => {
    const [currentQuiz,setCurrentQuiz] = useState<Question|null>(null);
    // const [score,setScore] = useState<number>();
    // const [timeLeft,setTimeLeft] = useState<number>(10);
    // const [selected,setSelected] = useState<number>(-1);   
    const questionIndex = useRef<number>(0);
    const questionLength = questions.length-1;
    const score = useRef<number>(0);
    const selectedOption = useRef<boolean | null>(false);
    
    const [selectedIndex,setSelectedIndex] = useState<number| null>(null);
    const optionRef = useRef(null);

    // const initQuestion = ()=> {
        
    //     setCurrentQuiz(questions);
    // }
    // useEffect(()=>{
    //     initQuestion();
    // })
    const findQuestion = ()=>{
        if(questionIndex.current<=questionLength){
            setCurrentQuiz(questions[questionIndex.current]);
            questionIndex.current++;
        }else{
            questionIndex.current = 0;
            setCurrentQuiz(questions[questionIndex.current]);
            questionIndex.current++;
        }
    }
    useEffect(()=>{
        findQuestion();
    },[]);



    const handleNextbtn = () =>{
        if(selectedOption.current){
            score.current++
            
        }else if (selectedOption.current === false){
            score.current--;
        }
        findQuestion();
        setSelectedIndex(null);
       
        selectedOption.current = null;
    }

    const handleOptionSelect = (index:number) =>{
        console.log(index);
        setSelectedIndex(index);
        
       
        
        if(index == currentQuiz?.correct){
            selectedOption.current = true;
            console.log(selectedOption.current)

        }else{
            selectedOption.current = false;
        }
    }

    // setCurrentQuiz(findQuestion);
    // console.log(currentQuiz?.question);


    return(
        <div className="quiz">
            <div className="nav-bar">This is navigation bar</div>
            <div className="box">
                <div className="score-board">
                    
                   {score.current}
                   
                    
                </div>
                <div className="quiz-box">
                    <div className="question-box">
                        {currentQuiz?.question ? currentQuiz?.question : "questoin"}
     
                    </div>
                    <div className="option-box">
                        {currentQuiz?.options.map((options,index) => {
                            return <div key={index} ref={optionRef} className={`${index === selectedIndex ? "selected" : "options"}`} onClick={() => handleOptionSelect(index)}>{options}</div>
                        })}
                        
                    </div>

                        <button className='next-btn' onClick={handleNextbtn}>Next</button>

                </div>
                <div className="controls">score of another player</div>
            </div>

            <div className="footer">Thiss is footer</div>

        </div>
    )
}


export default Quiz;