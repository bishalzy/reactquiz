import { Question } from '../types/question.type';

const decodeHtmlEntities = (value: string): string => {
	const textarea = document.createElement('textarea');
	textarea.innerHTML = value;
	return textarea.value;
};

const cleanQuestions = (questions: Question[]): Question[] => {
	return questions.map((question) => ({
		...question,
		question: decodeHtmlEntities(question.question),
		correct_answer: decodeHtmlEntities(question.correct_answer),
		incorrect_answers: question.incorrect_answers.map(decodeHtmlEntities),
	}));
};

export default cleanQuestions;
