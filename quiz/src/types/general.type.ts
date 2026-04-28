import { Question } from './question.type';

export type QuizReviewQuestion = Question & {
	options: string[];
	selectedAnswer: string | null;
};

export type SummeryProps = {
	show: boolean;
	quiz: QuizReviewQuestion[];
	disableSummery: (value: boolean) => void;
};