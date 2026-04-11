import { Question } from "./question";

export interface CreateQuiz{
  title:String;
	description:String;
	startDate:String;
	endDate:String;
	published:boolean;
	questionList?:Question[];

}

export interface Quiz extends CreateQuiz{
  id:number;
  select?: boolean;
  result?: string;
  isfillIn?: boolean;
}
