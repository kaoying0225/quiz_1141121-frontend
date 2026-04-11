import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../@service/api.service';

@Component({
  selector: 'app-user-result',
  imports: [],
  templateUrl: './user-result.component.html',
  styleUrl: './user-result.component.css'
})
export class UserResultComponent implements OnInit {

  quizId?: number;
  email?: string;
  data: any;
  quizData: any;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.quizId = Number(this.route.snapshot.paramMap.get('id'));
    this.email = this.route.snapshot.paramMap.get('email') || '';
    this.GetQuizInfo();
    this.GetFillinbackUser();
  }

  GetQuizInfo() {
    let data = {
      quizId: this.quizId,
      email: this.email
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

  GetFillinbackUser() {
    this.apiService.getApi("/quiz/getAll").subscribe((res: any) => {
      let data = res.quizList.find((q: any) => q.id == this.quizId);
      if (data) {
        this.quizData = data;
        console.log(this.quizData);
      }
    });
  }
  goBack() {
    this.router.navigate(['b-result', this.quizId, this.quizData.title]);
  }
}
