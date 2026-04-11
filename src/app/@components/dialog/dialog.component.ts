import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { Router } from '@angular/router';


@Component({
  selector: 'app-dialog',
  imports: [FormsModule,MatDialogTitle,MatDialogContent,MatDialogActions,],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.css'
})
export class DialogComponent {
  constructor(private router: Router) {}

  readonly dialogRef = inject(MatDialogRef<DialogComponent>);
  // data是後面的MAT_DIALOG_DATA就是呼叫這個對話框的時候傳入的內容
  readonly data = inject(MAT_DIALOG_DATA);

  account!: string;
  password!: string;
  Data!: string;

  // 確定
  onClick(){
    // 要傳遞資料出去就寫在close後面的()裡面
    // 不限格式 但要注意接收
    if(this.account == 'kaoying' && this.password == '0225'){
    this.dialogRef.close();
    this.router.navigate(['/blist']);
    }else{
      this.Data = '帳號或密碼錯誤';
    }
  }

  // 取消
  onNoClick(){
    // 沒有要傳遞任何資料出去
    this.dialogRef.close();
  }
}
