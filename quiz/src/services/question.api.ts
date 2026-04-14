import {QuestionRequest,QuestionResponse} from "../types/question.type";
import Endpoints from "../config/endpoints.config";

export const questionsConfig = {
    category:[9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32] as const,
    difficulty:["easy","medium","hard"] as const,
    type:["multiple","boolean"] as const
}

const fetchQuestions: (question: QuestionRequest) => Promise<QuestionResponse> = async (question) => {

    const { noofQuestion, category, difficulty, type } = question;
    if (category && !questionsConfig.category.includes(category as any)) {
        throw new Error("Invalid category");
    }
    if (difficulty && !questionsConfig.difficulty.includes(difficulty as any)) {
        throw new Error("Invalid difficulty");
    }
    if (type && !questionsConfig.type.includes(type as any)) {
        throw new Error("Invalid type");
    }
    try{
        const params = new URLSearchParams();

        if (noofQuestion) params.append("amount", String(noofQuestion));
        if (category) params.append("category", String(category));
        if (difficulty) params.append("difficulty", difficulty);
        if (type) params.append("type", type);

        const url = `${Endpoints.fetchQuestions}?${params.toString()}`;

        console.log("Fetching questions from URL:", url);
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Failed to fetch questions");
        }
        return response.json();
    }catch(error){
        console.error("Error fetching questions:", error);
        throw error;
    }finally{
        console.log("Fetch attempt completed");
    }

}

export default fetchQuestions;