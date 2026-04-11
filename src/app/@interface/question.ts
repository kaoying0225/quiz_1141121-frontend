export interface Question{
  quizId?:number;
  questionId?:number;
  question:String;
  type:String;
  required:boolean;
  options:String[];
  selected?: boolean; // 這個屬性用來標記是否被選中，預設為 false
  selectedAnswer?: string;
  selectedAnswerList?: string[];
}
