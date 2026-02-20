import { Question } from "./types/question.type";


const questions = [
    {
      question: "What is the capital of France?",
      options: ["Berlin", "Madrid", "Paris", "Lisbon"],
      correct: 2,
      key:1,
    },
    {
      question: "Who wrote '1984'?",
      options: ["Orwell", "Shakespeare", "Hemingway", "Austen"],
      correct: 0,
      key:2,
    },
    {
      question: "React is developed by?",
      options: ["Google", "Facebook", "Microsoft", "Twitter"],
      correct: 1,
      key:3,
    },
  ];

  const v2questions:Question[] = [
    { 
      type: "multiple",
      difficulty: "easy",
      category: "General Knowledge",
      question: "What is the capital of France?",
      correct_answer: "Paris",
      incorrect_answers: ["Berlin", "Madrid", "Lisbon"],
      
    },
    {
      type: "multiple",
      difficulty: "medium",
      category: "Literature",
      question: "Who wrote '1984'?",
      correct_answer: "Orwell",
      incorrect_answers: ["Shakespeare", "Hemingway", "Austen"],
      
    },
    {
      type: "multiple",
      difficulty: "hard",
      category: "Technology",
      question: "React is developed by?",
      correct_answer: "Facebook",
      incorrect_answers: ["Google",   "Microsoft", "Twitter"],
    },
  ];

  export { v2questions };
  
  export default questions;
  