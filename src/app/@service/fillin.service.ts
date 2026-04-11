import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FillinService {
  // 用來儲存確認的資料
  private confirmData: any;

  private quizData: any;

  constructor() { }

  setConfirmData(data: any) {
    this.confirmData = data;
  }

  getConfirmData() {
    return this.confirmData;
  }

  setQuizData(data: any) {
    this.quizData = data;
  }

  getQuizData() {
    return this.quizData;
  }
}
