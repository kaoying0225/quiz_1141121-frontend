import { Question } from "./question";

export interface AnswerVo {
  question: Question;
  answer: string;
}

export interface FillinReq {
  quiz_id: number;
  email: string;
  name: string;
  phone: string;
  age: string;
  answerList: AnswerVo[];
}
