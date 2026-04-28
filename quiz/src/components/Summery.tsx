
import './allcomponent.css';
import { SummeryProps } from '../types/general.type';

const Summery = ({ show, quiz, disableSummery }: SummeryProps) => {
    return (
        <div className={show ? 'summery-show' : 'summery-hide'}>
            <div className="summery-backdrop" onClick={() => disableSummery(false)} />
            <div className="summery-panel">
                <div className="summery-header">
                    <div>
                        <p className="summery-eyebrow">Round review</p>
                        <h2>Question summary</h2>
                    </div>
                    <button className="summery-close" onClick={() => disableSummery(false)}>
                        Close
                    </button>
                </div>

                <div className="summery-list">
                    {quiz.map((question, questionIndex) => (
                        <section key={`${question.question}-${questionIndex}`} className="summery-card">
                            <div className="summery-card-head">
                                <span className="summery-step">{questionIndex + 1}</span>
                                <div>
                                    <h3>{question.question}</h3>
                                    <p>{question.selectedAnswer === question.correct_answer ? 'Correct answer' : 'Review the highlighted answer'}</p>
                                </div>
                            </div>

                            <div className="summery-options">
                                {question.options.map((option, optionIndex) => {
                                    const isCorrect = option === question.correct_answer;
                                    const isUserChoice = option === question.selectedAnswer;
                                    const optionClassName = [
                                        'summery-option',
                                        isCorrect ? 'summery-option-correct' : '',
                                        isUserChoice && !isCorrect ? 'summery-option-wrong' : '',
                                        isUserChoice && isCorrect ? 'summery-option-picked-correct' : '',
                                    ]
                                        .filter(Boolean)
                                        .join(' ');

                                    return (
                                        <div key={`${question.question}-${questionIndex}-${optionIndex}`} className={optionClassName}>
                                            <span>{option}</span>
                                            {isCorrect ? <strong>Correct</strong> : null}
                                            {isUserChoice && !isCorrect ? <strong>Your pick</strong> : null}
                                        </div>
                                    );
                                })}
                            </div>
                        </section>
                    ))}
                </div>
            </div>
        </div>
    );
};


export default Summery;