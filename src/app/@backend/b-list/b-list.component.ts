import { AfterViewInit, Component, OnInit, ViewChild, } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router, RouterLink } from '@angular/router';
import { ChangeDetectionStrategy, } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CreateDialogComponent } from '../../@components/create-dialog/create-dialog.component';
import { ApiService } from '../../@service/api.service';
import { CreateQuiz, Quiz } from '../../@interface/quiz';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { DatePipe, NgClass } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';

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
  selector: 'app-b-list',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    RouterLink,
    FormsModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    DatePipe,
    MatButtonModule,
    MatCheckboxModule,
    NgClass,
  ],
  templateUrl: './b-list.component.html',
  styleUrl: './b-list.component.css',
  providers: [
    provideNativeDateAdapter(),
    // 注入格式設定，這會覆蓋掉瀏覽器預設的語系顯示（如：三月）
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    // 設定日期選擇器的語系為中文
    { provide: MAT_DATE_LOCALE, useValue: 'zh-TW' } // 設定日期選擇器的語系為中文,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class BListComponent implements OnInit, AfterViewInit {
  inputD: string = '';
  quiz: CreateQuiz = {
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    published: false,
  };
  quizIdList: number[] = [];

  displayedColumns: string[] = ['select', 'id', 'title', 'published', 'startDate', 'endDate', 'result'];
  dataSource = new MatTableDataSource<Quiz>([]);

  constructor(private dialog: MatDialog, private apiService: ApiService, private router: Router) { }

  ngOnInit(): void {
    console.log('組件啟動');
    this.searchQuiz();
  }
  // 從後端 API 獲取問卷列表(可在新增或刪除問卷後，加上這方法，重新整理問卷列表)
  searchQuiz() {
    this.apiService.getApi("/quiz/getAll").subscribe((res: any) => {
      this.dataSource.data = res.quizList; // 假設後端回傳的資料格式是陣列，直接賦值給 dataSource.data
      console.log(this.dataSource.data);
    });
  }

  // 使用 @ViewChild 裝飾器來獲取 MatPaginator 的實例，並在 ngAfterViewInit 生命週期鉤子中將其分配給 dataSource.paginator，這樣就可以啟用分頁功能
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  //
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  getxt() {
    console.log('取地的文字: ', this.inputD);
    let filterData = this.inputD.trim().toLocaleLowerCase();  // trim 去掉輸入者輸入的空白  // toLocaleLowerCase 轉換成小寫
    this.dataSource.filter = filterData;
  }
  // 開啟創建問卷對話框
  openCreateDialog() {
    let dialogRef = this.dialog.open(CreateDialogComponent, {
      width: '80vw',
      maxWidth: '90vw',
      height: '80vh',
      maxHeight: '90vh',
      data: { isUpdae: false }
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        console.log(res);
        this.searchQuiz(); // 重新載入問卷列表
      }
    });
  }
  // 判斷是修改還是唯讀
  isUpdateOrReadOnly(element: Quiz) {
    if (element.published && element.startDate <= this.getTodayDate()) {
      alert('問卷已發佈且已開始，進入唯讀模式');
      this.router.navigate(['/b-view/', element.id]);
    } else {
      this.openUpdateDialog(element);

    }
  }

  // 開啟修改問卷對話框
  openUpdateDialog(element: Quiz) {
    let dialogRef = this.dialog.open(CreateDialogComponent, {
      width: '80vw',
      maxWidth: '90vw',
      height: '80vh',
      maxHeight: '90vh',
      data: {
        isUpdate: true,
        quizId: element.id,
        title: element.title,
        description: element.description,
        startDate: element.startDate,
        endDate: element.endDate,
        published: element.published,
      }
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        console.log(res);
        this.searchQuiz(); // 重新載入問卷列表
      }
    });
  }

  // 刪除問卷
  deleteQuestion() {
    console.log('刪除');
    this.quizIdList = [];

    let hasExpiredItem = this.dataSource.data.some(item =>
      (item.select && item.published && item.startDate <= this.getTodayDate())
    );
    if (hasExpiredItem) {
      alert('問卷進行中或已結束，不可刪除');
      return;
    }

    this.quizIdList = this.dataSource.data.filter(item => item.select).map(item => item.id);
    console.log(this.quizIdList);
    if (this.quizIdList.length == 0) {
      alert('請至少選擇一個問卷');
      return;
    }
    if (!confirm('確定要刪除嗎？')) {
      return;
    }
    console.log(this.quizIdList);
    // 呼叫後端 API 刪除問卷
    // {quizIdList:this.quizIdList} this.quizIdList 是一個陣列，後端視需要物件，所以要加上大括號，左邊是後端的Key，右邊是前端的變數
    this.apiService.postApi("/quiz/delete", { quizIdList: this.quizIdList }).subscribe((res: any) => {
      console.log(res);
      this.searchQuiz();
    });
  }

  // 取的今天的日期，格式是 yyyy-MM-dd，這樣才能直接放到 input type="date" 的欄位裡面
  getTodayDate(): string {
    let today = new Date();
    let year = today.getFullYear();
    let month = String(today.getMonth() + 1).padStart(2, '0');
    let day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // 根據問卷的 published、startDate、endDate 來判斷問卷的狀態
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

  // 點擊統計，進入統計頁面
  viewResult(element: Quiz) {
    this.router.navigate(['/b-result/', element.id, element.title]);
  }
}

export interface PeriodicElement {
  id: number;
  title: string;
  published: boolean;
  startDate: string;
  endDate: string;
  result?: string;
  description: string;
  select?: boolean;
}


