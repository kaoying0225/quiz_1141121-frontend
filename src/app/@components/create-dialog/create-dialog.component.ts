import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogContent, MatDialogActions, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from "@angular/material/tabs";
import { MatIconModule } from "@angular/material/icon";
import { ApiService } from '../../@service/api.service';
import { MatRadioModule } from '@angular/material/radio';
import { Question } from '../../@interface/question';

@Component({
  selector: 'app-create-dialog',
  imports: [MatDialogContent,
    FormsModule,
    MatDialogActions,
    MatTabsModule,
    MatTableModule,
    MatIconModule,
    MatRadioModule,],
  templateUrl: './create-dialog.component.html',
  styleUrl: './create-dialog.component.css'
})
export class CreateDialogComponent {

  // 控制當前顯示哪一個分頁，0是第一個分頁，1是第二個分頁
  selectedIndex: number = 0;
  // 問卷的標題、描述、開始時間、結束時間
  title: string = '';
  description: string = '';
  startDate: string = '';
  endDate: string = '';
  published: boolean = false;

  question: string = '';
  required: boolean = false;
  type: string = '';
  options: string[] = [];
  // optionsList: string[] = [""];
  optionsList: { option: string, selected: boolean }[] = [{ option: "", selected: false }];

  // 問題的表格欄位
  displayedColumns: string[] = ['questionId', 'question', 'required', 'type', 'options', 'select'];
  dataSource: Question[] = [];

  constructor(private dialogRef: MatDialogRef<CreateDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private apiService: ApiService) { }

  ngOnInit(): void {
    if (this.data.isUpdate == true) {
      let quizId = this.data.quizId;
      this.title = this.data.title;
      this.description = this.data.description;
      this.startDate = this.data.startDate;
      this.endDate = this.data.endDate;
      this.published = this.data.published;
      this.searchQuestion(quizId);
    }
  }

  searchQuestion(quizId: number) {
    this.apiService.getApi("/quiz/get_question_list?quizId=" + quizId).subscribe((res: any) => {
      this.dataSource = res.questionList.map((item: any) => {
        // 把後端回傳的選項字串轉成陣列 需用三原運算式判斷是否有選項，沒有的話就給空陣列
        item.options = item.options ? item.options.split(',') : [];
        if (item.type == 'Single') {
          item.type = 'radio';
        } else if (item.type == 'Multi') {
          item.type = 'checkbox';
        } else {
          item.type = 'Text';
        }
        return item;
      })
      console.log(this.dataSource);
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

  parmCheck() {
    if (this.title.trim() == '' || // 這裡的 trim() 是為了去掉字串前後的空白，確保使用者沒有只輸入空格
    this.description.trim() == '' ||
    this.startDate.trim() == '' ||
    this.endDate.trim() == '' ||
    this.dataSource.length == 0) {
      alert('請填寫完整的問卷資訊');
      return false;
    }
    return true;
  }

  onCancel() {
    this.dialogRef.close();
  }
  onNext(num: number) {
    this.selectedIndex = num;
  }
  onBack(num: number) {
    this.selectedIndex = num;
  }

  addOption() {
    this.optionsList.push({ option: "", selected: false });
  }

  delOption() {
    this.optionsList = this.optionsList.filter(item => !item.selected);
  }

  delOptions() {
    // 這裡的邏輯是從 dataSource 中過濾掉被選中的項目，留下未被選中的項目
    let newDataSource = this.dataSource.filter(item => !item.selected);
    newDataSource.forEach((item, index) => { item.questionId = index + 1 }); // 這裡的邏輯是重新給每個問題編號，從 1 開始遞增
    this.dataSource = newDataSource;
  }

  addQuestion() {

    for (let item of this.optionsList) {
      this.options.push(item.option);
    }
    // 建立一個新的問題物件，暫存輸入的內容
    let newQuestion: Question = {
      // 這裡的 questionId 是簡單地用 dataSource 的長度加 1 來生成的
      questionId: this.dataSource.length + 1,
      question: this.question,
      required: this.required,
      type: this.type,
      options: this.options
    }
    this.dataSource.push(newQuestion);
    this.dataSource = [...this.dataSource]; // 這行是為了觸發 Angular 的變更檢測
    console.log(this.dataSource);
    // 清空輸入欄位，準備新增下一個問題
    this.question = '';
    this.required = false;
    this.type = '';
    this.options = [];
    this.optionsList = [{ option: "", selected: false }];
  }
  onSend() {
    if(this.parmCheck() == false){
      return;
    }
    for (let item of this.dataSource) {
      switch (item.type) {
        case ("radio"):
          item.type = 'Single';
          break;
        case ("checkbox"):
          item.type = 'Multi';
          break;
        case ("text"):
          item.type = 'Text';
          break;
      }
    }
    let finalData = {
      title: this.title,
      description: this.description,
      startDate: this.startDate,
      endDate: this.endDate,
      published: this.published,

      // 這行會覆蓋掉原本的 questionList，改用 map 處理過的新陣列
      questionList: this.dataSource.map(q => ({
        questionId: q.questionId, // 保留題目 ID
        required: q.required, // 保留是否必填
        question: q.question, // 保留題目名稱
        type: q.type,           // 保留類型
        // 這裡最重要：把前端的陣列轉成 Java 要的字串
        options: q.options.join(',') // 把選項陣列轉成逗號分隔的字串
      }))
    };
    // isUpdate 用來判斷是新增還是修改
    if (this.data.isUpdate == true) {
      let updateList = {
        ...finalData,
        // 這邊的 quizId 外層的，但選項裡是沒有的，所以還要寫下面哪個程式碼，將 quizId 加到每個選項裡
        quizId: this.data.quizId,
        // 在每個選項中加入 quizId，這樣後端就知道這些問題是屬於哪個問卷的
        questionList: finalData.questionList.map(q => ({
          ...q,
          quizId: this.data.quizId,
        }))
      }
      this.apiService.postApi('/quiz/update', updateList).subscribe({
        next: (res) => {
          alert('問卷修改成功！！');
          console.log('後端回傳:', res);
          this.dialogRef.close(updateList);
        },
        error: (err) => {
          alert('問卷修改失敗');
        }
      });
    } else {
      this.apiService.postApi('/quiz/create', finalData).subscribe({
        next: (res) => {
          alert('問卷儲存成功！');
          console.log(finalData);
          console.log('後端回傳:', res);
          this.dialogRef.close(finalData);
        },
        error: (err) => {
          alert('問卷儲存失敗');
        }
      });
    }
  }
  onSendPublish() {
    this.published = true;
    this.onSend();
  }

}



