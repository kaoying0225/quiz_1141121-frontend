import { AfterViewInit, ChangeDetectionStrategy, Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ApiService } from '../@service/api.service';
import { CreateQuiz, Quiz } from '../@interface/quiz';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { CommonModule } from '@angular/common';

// 定義純數字的日期格式
export const MY_FORMATS = {
  parse: {
    dateInput: 'YYYY/MM/DD',
  },
  display: {
    dateInput: 'YYYY/MM/DD',      // 畫面顯示：2026/03/06
    monthYearLabel: 'YYYY MMM',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-list',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    FormsModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    CommonModule,
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css',
  providers: [
    provideNativeDateAdapter(),
    // 注入格式設定，這會覆蓋掉瀏覽器預設的語系顯示（如：三月）
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    // 設定日期選擇器的語系為中文
    { provide: MAT_DATE_LOCALE, useValue: 'zh-TW' } // 設定日期選擇器的語系為中文,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class ListComponent implements OnInit, AfterViewInit {

  inputD: string = '';
  startData: string = '';
  endData: string = '';
  isfillIn: boolean = false;
  quiz: CreateQuiz = {
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    published: false,
  };
  quizIdList: number[] = [];

  constructor(private router: Router, private apiService: ApiService) { }

  displayedColumns: string[] = ['id', 'title', 'published', 'startDate', 'endDate', 'isfill', 'result'];
  dataSource = new MatTableDataSource<Quiz>([]);

  ngOnInit(): void {
    console.log('組件啟動');
    this.searchQuiz();
  }

  searchQuiz() {
    this.apiService.getApi("/quiz/getAll").subscribe((res: any) => {
      // 假設後端回傳的資料格式是陣列，直接賦值給 dataSource.data
      this.dataSource.data = res.quizList.filter((q: Quiz) => q.published);
      console.log(this.dataSource.data);
    });
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  // 取的今天的日期，格式是 yyyy-MM-dd，這樣才能直接放到 input type="date" 的欄位裡面
  getTodayDate(): string {
    let today = new Date();
    let year = today.getFullYear();
    let month = String(today.getMonth() + 1).padStart(2, '0');
    let day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  getxt() {
    console.log('取地的文字: ', this.inputD);
    let filterData = this.inputD.trim().toLocaleLowerCase();  // trim 去掉輸入者輸入的空白  // toLocaleLowerCase 轉換成小寫
    this.dataSource.filter = filterData;
  }

  publishState(element: Quiz) {
    let state = '';
    if (!element.published) {
      state = '未發佈';
    } else if (element.startDate > this.getTodayDate()) {
      state = '未開始';
    } else if (element.endDate < this.getTodayDate()) {
      state = '已結束';
    } else {
      state = '進行中';
    }
    return state;
  }
  openPersonalFeedback(element: Quiz) {
    let data = {
      email: localStorage.getItem("userEmail")!,
      quizId: element.id
    }
    console.log(data);
    this.apiService.postApi("/count", data).subscribe((res: any) => {
      console.log(res);
      if (res > 0) {
        this.router.navigate(['/personal-feedback/', element.id]);
      } else {
        alert('您尚未填寫過該問卷，無法查看個人回饋');
      }
    })
  }

  logout() {
    localStorage.removeItem('userEmail');
    this.router.navigate(['/login']);
  }

  // 填寫 在填寫之前先呼叫後端 API，檢查該使用者是否已經填寫過了，如果已經填寫過了，就不能再次填寫
  fillIn(element: Quiz) {
    let data = {
      email: localStorage.getItem("userEmail")!,
      quizId: element.id
    }
    console.log(data);

    if (element.startDate > this.getTodayDate() || element.endDate < this.getTodayDate()) {
      alert('該問卷尚未開始或已結束');
      return;
    }

    this.apiService.postApi("/count", data).subscribe((res: any) => {
      console.log(res);
      if (res > 0) {
        alert('您已經填寫過了，無法再次填寫');
      } else {
        this.router.navigate(['/quiz-fill/', element.id]);
      }
    })
  }
}




