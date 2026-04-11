import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../@service/api.service';

@Component({
  selector: 'app-personal-feedback',
  imports: [],
  templateUrl: './personal-feedback.component.html',
  styleUrl: './personal-feedback.component.css'
})
export class PersonalFeedbackComponent implements OnInit {

  quizId!: number;

  data: any;

  quizData: any;

  constructor(
    private router: Router,
    private apiService: ApiService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.quizId = Number(this.route.snapshot.paramMap.get('id'));
    this.GetQuizInfo();
    this.GetFillinbackUser();

  }

  GetFillinbackUser() {
    let data = {
      quizId: this.quizId,
      email: localStorage.getItem("userEmail")!
    }
    this.apiService.postApi('/open_quiz_view', data).subscribe({
      next: (res) => {
        console.log('後端回傳:', res);
        this.data = res.userVoList[0];
        this.data.answerVoList.forEach((item: any) => {
          item.question.options = item.question.options ? item.question.options.split(',') : [];
        });
        console.log(this.data);

      },
      error: (err) => {
        console.log(this);
        alert('問卷載入失敗');
      }
    });
  }

  GetQuizInfo() {
    this.apiService.getApi("/quiz/getAll").subscribe((res: any) => {
      let data = res.quizList.find((q: any) => q.id == this.quizId);
      if (data) {
        this.quizData = data;
        console.log(this.quizData);
      }
    });
  }

  goBack() {
    this.router.navigate(['/list']);
  }
}
