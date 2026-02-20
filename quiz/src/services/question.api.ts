import {QuestionRequest} from "../types/question.type";


export const questionsConfig = {
    category:[9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32],
    difficulty:["easy","medium","hard"],
    type:["multiple","boolean"]
}

const fetchQuestions = async (question: QuestionRequest) => {

    const { noofQuestion, category, difficulty, type } = question;
    if (category && !questionsConfig.category.includes(category)) {
        throw new Error("Invalid category");
    }
    if (difficulty && !questionsConfig.difficulty.includes(difficulty)) {
        throw new Error("Invalid difficulty");
    }
    if (type && !questionsConfig.type.includes(type)) {
        throw new Error("Invalid type");
    }

    const url = `${process.env.REACT_APP_API_URL}${noofQuestion ? `?amount=${noofQuestion}` : ""}${category ? `&category=${category}` : ""}${difficulty ? `&difficulty=${difficulty}` : ""}${type ? `&type=${type}` : ""}`;
    console.log("Fetching questions from URL:", url);
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error("Failed to fetch questions");
    }
    return response.json();
}

export default fetchQuestions;