import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../@service/api.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Quiz } from '../../@interface/quiz';
import { MatRadioModule } from '@angular/material/radio';


@Component({
  selector: 'app-quiz-view',
  imports: [MatRadioModule, RouterLink,],
  templateUrl: './quiz-view.component.html',
  styleUrl: './quiz-view.component.css'
})
export class QuizViewComponent implements OnInit {

  quizId!: number;
  isLoading: boolean = true; // 用於顯示載入狀態

  quiz: Quiz = {
    id: 0,
    title: "",
	  description: "",
	  startDate: "",
	  endDate: "",
	  published: false,
    questionList: [],
  }

  // 在建構子中注入ActivatedRoute 以便在ngOnInit中獲取路由參數
  constructor(private apiService : ApiService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.quizId = Number(this.route.snapshot.paramMap.get('id'));
    this.searchQuiz();
  }

  searchQuiz(){
    this.isLoading = true;
    this.apiService.getApi("/quiz/getAll").subscribe((res: any) => {
        let data = res.quizList.find((q: any) => q.id == this.quizId);
        if(data){
          this.quiz = data;
          console.log(this.quiz);
        }
        this.apiService.getApi("/quiz/get_question_list?quizId=" + this.quizId).subscribe((res: any) => {
          // 避免後端資料還沒船回來或是空值，造成崩潰，所以先判斷 res 和 res.questionList 是否存在
          // 如果存在，才將 questionList 賦值給 quiz.questionList，並且對 options 進行處理
          //可以寫成 if(res?.questionList))
          if(res && res.questionList){
              this.quiz.questionList = res.questionList.map((q: any) => {
                // 判斷 q.options 是否為字串且不能為空，如果是，則將其轉換為陣列
                if(q.options !== "" && typeof q.options == "string"){
                  // 後端回傳的選項是以逗號分隔的字串，這裡將其轉換為陣列
                  q.options = q.options.split(",");
                }else{
                  q.options = [];
                }
                return q;
              })
            }
            console.log(this.quiz.questionList);
            this.isLoading = false; // 資料載入完成，更新載入狀態
        });
    });
  }
}
