
export type QuestionRequest = {
  noofQuestion?: number;
  category?: number;
  difficulty?: string;
  type?: string;
}

export type Question = {
  type: "multiple" | "boolean"; // if you also expect true/false questions
  difficulty: "easy" | "medium" | "hard";
  category: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

export type QuestionResponse = {
  response_code: number;
  results: Question[];
}
