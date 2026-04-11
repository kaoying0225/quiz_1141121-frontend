import { FillinService } from './../../@service/fillin.service';
import { Component, OnInit } from '@angular/core';
import { Quiz } from '../../@interface/quiz';
import { ApiService } from '../../@service/api.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatRadioModule } from "@angular/material/radio";
import { FormsModule } from '@angular/forms';
import { User } from '../../@interface/user';
import { MatFormField } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";

@Component({
  selector: 'app-quiz-fill',
  imports: [MatRadioModule, RouterLink, FormsModule, MatFormField, MatInputModule],
  templateUrl: './quiz-fill.component.html',
  styleUrl: './quiz-fill.component.css'
})
export class QuizFillComponent implements OnInit {

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

  user: User = {
    email: localStorage.getItem("userEmail")!,
    name: "",
    phone: "",
    age: "",
  }

  // 在建構子中注入ActivatedRoute 以便在ngOnInit中獲取路由參數
  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private fillinService: FillinService
  ) { }

  ngOnInit(): void {
    this.quizId = Number(this.route.snapshot.paramMap.get('id'));
    this.searchQuiz();
  }


  searchQuiz() {
    this.isLoading = true;
    this.apiService.getApi("/get_user?email=" + this.user.email).subscribe((res: any) => {
      this.user.email = res.email;
      this.user.name = res.name;
      this.user.phone = res.phone;
      this.user.age = res.age;
    })

    this.apiService.getApi("/quiz/getAll").subscribe((res: any) => {
      let data = res.quizList.find((q: any) => q.id == this.quizId);
      if (data) {
        this.quiz = data;
        console.log(this.quiz);
      }
      this.apiService.getApi("/quiz/get_question_list?quizId=" + this.quizId).subscribe((res: any) => {
        // 避免後端資料還沒船回來或是空值，造成崩潰，所以先判斷 res 和 res.questionList 是否存在
        // 如果存在，才將 questionList 賦值給 quiz.questionList，並且對 options 進行處理
        //可以寫成 if(res?.questionList))
        if (res && res.questionList) {
          this.quiz.questionList = res.questionList.map((q: any) => {
            // 判斷 q.options 是否為字串且不能為空，如果是，則將其轉換為陣列
            if (q.options !== "" && typeof q.options == "string") {
              // 後端回傳的選項是以逗號分隔的字串，這裡將其轉換為陣列
              q.options = q.options.split(",");
            } else {
              q.options = [];
            }
            // 初始化 selectedAnswer 和 selectedAnswerList 確保 HTML 可以雙向綁定
            q.selectedAnswer = q.selectedAnswer || "";
            q.selectedAnswerList = [];
            return q;
          })
        }
        console.log(this.quiz.questionList);
        this.isLoading = false; // 資料載入完成，更新載入狀態
      });
    });
  }

  // item: 為該題的資料，option 為該題的選項，$event 為該題的選項是否被選中
  // option: 為該題的選項
  // $event: 為該題的選項是否被選中
  onCheckChange(item: any, option: any, $event: any) {
    if ($event.target.checked) {
      item.selectedAnswerList.push(option);
    } else {
      // 將該題的選項從 selectedAnswerList 中移除 只留下 不等於該題 的選項
      item.selectedAnswerList = item.selectedAnswerList.filter((o: any) => o !== option);
    }
    // 後端，將 selectedAnswerList 轉換為字串
    item.selectedAnswer = item.selectedAnswerList.join(",");
  }
  confirm(){


    //使用 ? 確保有有questionList才執行map
    let answerVoList = this.quiz.questionList?.map((q: any) => {
      let questionReq = {...q};
      // 將 options 轉換為字串
      if(Array.isArray(questionReq.options)){
        questionReq.options = questionReq.options.join(',');
      }
      return{
        question: questionReq,
        // 使用 ?? 如果 selectedAnswer 為 null 或 undefined,則使用空字串
        answer: q.selectedAnswer ?? "",
      }
      // 使用 ?? 如果 selectedAnswer 為 null 或 undefined,則使用空字串

    }) || []; // 如果 questionList 為 null 或 undefined,則使用空陣列

    let data = {
      quizId: this.quizId,
      email: this.user.email,
      name: this.user.name,
      phone: this.user.phone,
      age: this.user.age,
      answerVoList: answerVoList
    }
    this.fillinService.setQuizData(this.quiz);
    console.log(this.quiz);
    this.fillinService.setConfirmData(data);
    console.log(data);
    this.router.navigate(['/fillin-confirm']);
  }


}

