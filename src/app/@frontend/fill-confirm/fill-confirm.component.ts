import { Component, OnInit } from '@angular/core';
import { FillinService } from '../../@service/fillin.service';
import { Router } from '@angular/router';
import { ApiService } from '../../@service/api.service';

@Component({
  selector: 'app-fill-confirm',
  imports: [],
  templateUrl: './fill-confirm.component.html',
  styleUrl: './fill-confirm.component.css'
})
export class FillConfirmComponent implements OnInit {

  data: any;
  quiz: any;

  constructor(
    private fillinService: FillinService,
    private router: Router,
    private apiService: ApiService
  ) { }

  ngOnInit() {
    this.data = this.fillinService.getConfirmData();
    this.quiz = this.fillinService.getQuizData();
    console.log("data: ", this.data);
    console.log("quiz: ", this.quiz);
  }

  goBack(){
    this.router.navigate(['/quiz-fill/', this.quiz.id]);
  }
  submit(){
    this.apiService.postApi('/quiz/fillin', this.data).subscribe({
        next: (res) => {
          alert('問卷送出成功！！');
          console.log('前端送出:', this.data);
          console.log('後端回傳:', res);
          this.router.navigate(['/list']);
        },
        error: (err) => {
          console.log(this);
          alert('問卷送出失敗');
        }
      });
  }
}
