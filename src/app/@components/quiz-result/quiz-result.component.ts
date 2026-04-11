import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { FillInRecord } from '../../@interface/result';
import { ApiService } from '../../@service/api.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatIconModule } from "@angular/material/icon";
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-quiz-result',
  imports: [MatTableModule, MatPaginatorModule, RouterLink, MatIconModule, DatePipe,],
  templateUrl: './quiz-result.component.html',
  styleUrl: './quiz-result.component.css'
})
export class QuizResultComponent implements AfterViewInit, OnInit {

  quizId?: number;
  quizTitle?: string;
  fillInRecord: FillInRecord = {
    name: '',
    email: '',
    fillinDate: '',
    result: '',
  };

  displayedColumns: string[] = ['name', 'email', 'fillinDate', 'result'];
  dataSource = new MatTableDataSource<FillInRecord>([]);

  constructor(private apiService: ApiService, private router: Router, private route: ActivatedRoute) { }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    // ActivatedRoute 可以從路由參數獲取 quizId
    this.quizId = Number(this.route.snapshot.paramMap.get('id'));
    this.quizTitle = this.route.snapshot.paramMap.get('title') || '';
    // 從後端獲取填寫紀錄資料
    this.apiService.postApi("/get_all_fillin_users", this.quizId).subscribe((res: any) => {
      this.dataSource.data = res.userVoList;
      console.log(this.dataSource.data);
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  viewResult(element: FillInRecord) {
    // 在這裡可以實現查看問卷回覆的邏輯，例如導航到一個新的頁面，並傳遞必要的參數
    this.router.navigate(['/user-result', this.quizId, element.email]);
  }

  viewChart() {
    // 在這裡可以實現查看統計圖表的邏輯，例如導航到一個新的頁面，並傳遞必要的參數
    this.router.navigate(['/b-chart', this.quizId]);
  }
}



